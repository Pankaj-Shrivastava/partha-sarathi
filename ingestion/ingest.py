import os
import json
import time
from pathlib import Path
from dotenv import load_dotenv
import chromadb
from chromadb.config import Settings
import requests

from config import OUTPUT_DIR

load_dotenv(Path(__file__).parent.parent / ".env")

CHROMA_URL = os.environ.get("CHROMA_URL", "").strip('"').strip("'")
CHROMA_TOKEN = os.environ.get("CHROMA_TOKEN", "").strip('"').strip("'")

EMBEDDED_CHUNKS_FILE = OUTPUT_DIR / "embedded_chunks.json"
COLLECTION_NAME = "gita_verses"
BATCH_SIZE = 100

def wait_for_server(url, token, max_retries=10, delay=5):
    print(f"Checking connection to {url}...")
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    for i in range(max_retries):
        try:
            client = chromadb.HttpClient(host=url, headers=headers)
            client.heartbeat()
            print("Server is up and responding!")
            return True
        except Exception as e:
            print(f"Connection failed. Retrying in {delay}s...")
            
        time.sleep(delay)
        
    print("Could not connect to the server. Is the HF Space fully built and running?")
    return False

def ingest_data():
    if not CHROMA_URL:
        print("Error: CHROMA_URL is missing in .env")
        return
        
    if not EMBEDDED_CHUNKS_FILE.exists():
        print(f"Error: {EMBEDDED_CHUNKS_FILE} not found.")
        return

    # 1. Wait for Space to wake up
    if not wait_for_server(CHROMA_URL, CHROMA_TOKEN):
        return

    # 2. Connect to ChromaDB
    print(f"\nConnecting to ChromaDB at {CHROMA_URL}...")
    client = chromadb.HttpClient(
        host=CHROMA_URL,
        headers={"Authorization": f"Bearer {CHROMA_TOKEN}"} if CHROMA_TOKEN else {}
    )
    
    # 3. Create or get collection
    print(f"Initializing collection '{COLLECTION_NAME}'...")
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"} # Use cosine similarity
    )
    
    # 4. Load data
    print("Loading chunks from disk...")
    with open(EMBEDDED_CHUNKS_FILE, "r", encoding="utf-8") as f:
        chunks = json.load(f)
        
    total_chunks = len(chunks)
    print(f"Found {total_chunks} chunks to ingest.")
    
    # 5. Prepare lists
    ids = []
    embeddings = []
    documents = []
    metadatas = []
    
    for i, c in enumerate(chunks):
        ids.append(f"ch{c['chapter']}_v{c['verse']}_{i}")
        embeddings.append(c["embedding"])
        documents.append(c["content"])
        
        # Meta dictionary
        meta = {
            "chapter": c["chapter"],
            "verse": str(c["verse"]),
            "citation": c["citation"],
            "source_page": c["source_page"]
        }
        # Safely add optional fields
        if "devanagari" in c: meta["devanagari"] = c["devanagari"]
        if "sanskrit_roman" in c: meta["sanskrit_roman"] = c["sanskrit_roman"]
        if "synonyms" in c: meta["synonyms"] = c["synonyms"]
        if "translation" in c: meta["translation"] = c["translation"]
        
        metadatas.append(meta)

    # 6. Upsert in batches
    print(f"Upserting to cloud in batches of {BATCH_SIZE}...")
    
    start_time = time.time()
    
    for i in range(0, total_chunks, BATCH_SIZE):
        end_idx = min(i + BATCH_SIZE, total_chunks)
        print(f"  -> Upserting {i} to {end_idx}...")
        
        collection.upsert(
            ids=ids[i:end_idx],
            embeddings=embeddings[i:end_idx],
            documents=documents[i:end_idx],
            metadatas=metadatas[i:end_idx]
        )
        
    elapsed = time.time() - start_time
    
    # 7. Verify
    count = collection.count()
    print("\n--- Ingestion Complete ---")
    print(f"Total chunks upserted: {total_chunks}")
    print(f"Total chunks in cloud DB: {count}")
    print(f"Time taken: {elapsed:.2f} seconds")

if __name__ == "__main__":
    ingest_data()
