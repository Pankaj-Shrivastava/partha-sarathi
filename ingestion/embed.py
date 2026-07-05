import json
import time
import os
from pathlib import Path
from sentence_transformers import SentenceTransformer
from config import OUTPUT_DIR

CHUNKS_FILE = OUTPUT_DIR / "chunks.json"
EMBEDDED_CHUNKS_FILE = OUTPUT_DIR / "embedded_chunks.json"
MODEL_NAME = "all-MiniLM-L6-v2"

def generate_embeddings():
    print(f"Loading chunks from {CHUNKS_FILE}")
    if not CHUNKS_FILE.exists():
        print(f"Error: {CHUNKS_FILE} not found. Run chunk.py first.")
        return

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    if not chunks:
        print("Error: No chunks found in the file.")
        return

    print(f"Loaded {len(chunks)} chunks.")
    print(f"Initializing embedding model: {MODEL_NAME}")
    
    start_time = time.time()
    
    # Load model
    model = SentenceTransformer(MODEL_NAME)
    
    # Extract contents
    contents = [chunk["content"] for chunk in chunks]
    
    print("Generating embeddings (this may take a minute)...")
    # Generate embeddings
    embeddings = model.encode(contents, batch_size=64, show_progress_bar=True)
    
    # Attach embeddings to chunks
    for i, chunk in enumerate(chunks):
        # Convert numpy array to list for JSON serialization
        chunk["embedding"] = embeddings[i].tolist()
        
    with open(EMBEDDED_CHUNKS_FILE, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False)
        
    elapsed_time = time.time() - start_time
    dim = len(chunks[0]["embedding"])
    
    print("\n--- Embedding Complete ---")
    print(f"Total chunks embedded: {len(chunks)}")
    print(f"Embedding dimensions:  {dim}")
    print(f"Time taken:            {elapsed_time:.2f} seconds")
    print(f"Output saved to:       {EMBEDDED_CHUNKS_FILE}")
    print(f"File size:             {os.path.getsize(EMBEDDED_CHUNKS_FILE) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    generate_embeddings()
