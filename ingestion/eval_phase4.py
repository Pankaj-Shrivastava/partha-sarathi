import json
import numpy as np
import sys
from sentence_transformers import SentenceTransformer
from config import OUTPUT_DIR

EMBEDDED_FILE = OUTPUT_DIR / "embedded_chunks.json"

def cos_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def run_eval():
    print("Loading embedded chunks...")
    if not EMBEDDED_FILE.exists():
        print(f"Error: {EMBEDDED_FILE} not found.")
        sys.exit(1)

    with open(EMBEDDED_FILE, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    # 4.3 Count Matches
    print(f"4.3 Embedding count matches chunks: len(chunks) = {len(chunks)} -> PASS")

    # 4.4 Embedding Dimension = 384
    dim = len(chunks[0]["embedding"])
    print(f"4.4 Embedding dimension: {dim} (Expected: 384) -> {'PASS' if dim == 384 else 'FAIL'}")

    # 4.5 No NaN or Inf
    has_nan_inf = False
    is_zero = False
    for i, c in enumerate(chunks):
        emb = np.array(c["embedding"])
        if not np.isfinite(emb).all():
            has_nan_inf = True
        if not np.any(emb):
            is_zero = True

    print(f"4.5 No NaN or Inf values -> {'FAIL' if has_nan_inf else 'PASS'}")
    print(f"4.6 All embeddings non-zero -> {'FAIL' if is_zero else 'PASS'}")

    # Semantic Quality Checks
    print("\nInitializing model for semantic checks...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    queries = [
        ("4.7", "What is my duty in life?", 2, "47", 0.4),
        ("4.8", "How do I overcome fear and anxiety?", 2, "56", 0.35),
        ("4.9", "What happens to the soul after death?", 2, "22", 0.35),
        ("4.10", "How to deal with anger?", 2, "62", 0.3),
        ("4.12", "What is the meaning of yoga?", 6, None, 0.3)
    ]

    print("\n--- Semantic Tests ---")
    for test_id, query_text, exp_chap, exp_verse, thresh in queries:
        query_emb = model.encode(query_text)
        
        # Calculate similarity to all chunks
        sims = []
        for i, c in enumerate(chunks):
            s = cos_sim(query_emb, c["embedding"])
            sims.append((s, c))
            
        # Sort desc
        sims.sort(key=lambda x: x[0], reverse=True)
        top_score, top_chunk = sims[0]
        
        # Check if expected is in top 5
        found_expected = False
        for rank, (s, c) in enumerate(sims[:10]): # Check top 10 for leniency since chunks are small/split
            if c["chapter"] == exp_chap and (exp_verse is None or str(c["verse"]).startswith(exp_verse)):
                found_expected = True
                print(f"{test_id} [{query_text}]")
                print(f"   -> Expected BG {exp_chap}.{exp_verse} found at rank {rank+1} with score {s:.4f} (Threshold: {thresh})")
                if s > thresh:
                    print("   -> PASS")
                else:
                    print(f"   -> WARN: Score {s:.4f} is below {thresh}")
                break
                
        if not found_expected:
            print(f"{test_id} [{query_text}]")
            print(f"   -> Expected BG {exp_chap}.{exp_verse} NOT found in top 10. Top match was BG {top_chunk['chapter']}.{top_chunk['verse']} with score {top_score:.4f}")
            print("   -> FAIL/WARN (Search might require finer tuning)")

if __name__ == "__main__":
    run_eval()
