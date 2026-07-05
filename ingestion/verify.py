import os
from pathlib import Path
from dotenv import load_dotenv
import chromadb
from sentence_transformers import SentenceTransformer

load_dotenv(Path(__file__).parent.parent / ".env")

CHROMA_URL = os.environ.get("CHROMA_URL", "").strip('"').strip("'")
CHROMA_TOKEN = os.environ.get("CHROMA_TOKEN", "").strip('"').strip("'")
COLLECTION_NAME = "gita_verses"

def verify():
    if not CHROMA_URL:
        print("Error: CHROMA_URL not set in .env")
        return
        
    print(f"Connecting to ChromaDB at {CHROMA_URL}...")
    client = chromadb.HttpClient(
        host=CHROMA_URL,
        headers={"Authorization": f"Bearer {CHROMA_TOKEN}"} if CHROMA_TOKEN else {}
    )
    
    try:
        collection = client.get_collection(name=COLLECTION_NAME)
    except Exception as e:
        print(f"Error fetching collection: {e}")
        return
        
    count = collection.count()
    print(f"\nSUCCESS: Collection '{COLLECTION_NAME}' exists with {count} documents.")
    
    # Run a quick semantic query
    print("\nInitializing embedding model for a test query...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    query = "What is the nature of the soul?"
    print(f"\nQuerying: '{query}'")
    query_emb = model.encode(query).tolist()
    
    results = collection.query(
        query_embeddings=[query_emb],
        n_results=3
    )
    
    print("\nTop 3 Matches:")
    for i in range(len(results['ids'][0])):
        match_id = results['ids'][0][i]
        distance = results['distances'][0][i]
        meta = results['metadatas'][0][i]
        doc = results['documents'][0][i]
        
        print(f"\n{i+1}. BG {meta['chapter']}.{meta['verse']} (Distance: {distance:.4f})")
        print(f"   Excerpt: {doc[:100]}...")

if __name__ == "__main__":
    verify()
