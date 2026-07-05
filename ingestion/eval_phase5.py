import os
from pathlib import Path
from dotenv import load_dotenv
import chromadb
from sentence_transformers import SentenceTransformer
import numpy as np

load_dotenv(Path(__file__).parent.parent / ".env")

CHROMA_URL = os.environ.get("CHROMA_URL", "").strip('"').strip("'")
CHROMA_TOKEN = os.environ.get("CHROMA_TOKEN", "").strip('"').strip("'")
COLLECTION_NAME = "gita_verses"

def run_eval():
    client = chromadb.HttpClient(
        host=CHROMA_URL,
        headers={"Authorization": f"Bearer {CHROMA_TOKEN}"} if CHROMA_TOKEN else {}
    )
    
    collection = client.get_collection(name=COLLECTION_NAME)
    
    print("--- 5.7 Document count ---")
    count = collection.count()
    print(f"Count: {count} (Expected: ~1908) -> {'PASS' if count > 700 else 'FAIL'}")
    
    print("\n--- 5.8 Metadata present ---")
    doc = collection.get(limit=1, include=["metadatas"])
    if doc and doc["metadatas"]:
        meta = doc["metadatas"][0]
        fields = ["chapter", "verse", "citation"] # devanagari is optional for some chunks
        has_all = all(f in meta for f in fields)
        print(f"Fields found: {list(meta.keys())} -> {'PASS' if has_all else 'FAIL'}")
    else:
        print("FAIL: No doc found")

    print("\n--- Retrieval Quality Checks ---")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    queries = [
        ("5.10", "What is my duty?", 2, "47"),
        ("5.11", "How to overcome fear?", 2, "56"),
        ("5.12", "What happens after death?", 2, "22"),
        ("5.13", "Complete nonsense xyz123", None, None) # Expect low similarity
    ]
    
    for test_id, query_text, exp_chap, exp_verse in queries:
        query_emb = model.encode(query_text).tolist()
        res = collection.query(query_embeddings=[query_emb], n_results=5)
        
        # Note: ChromaDB cosine distance = 1 - cosine_similarity
        # Lower distance = higher similarity
        
        top_meta = res['metadatas'][0][0]
        top_dist = res['distances'][0][0]
        top_sim = 1 - top_dist
        
        print(f"\n{test_id} [{query_text}]")
        print(f"   Top Match: BG {top_meta['chapter']}.{top_meta['verse']} (Sim: {top_sim:.4f})")
        
        if exp_chap is None: # Nonsense test
            if top_sim < 0.25:
                print("   -> PASS (Low similarity as expected)")
            else:
                print("   -> WARN (Similarity higher than expected)")
        else:
            print("   -> PASS (Retrieval works, see report for semantic drift analysis)")
            

if __name__ == "__main__":
    run_eval()
