import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
PDF_PATH = BASE_DIR / "pdf" / "Bhagavad-gita-As-It-Is.pdf"
OUTPUT_DIR = BASE_DIR / "ingestion" / "output"
RAW_TEXT_FILE = OUTPUT_DIR / "raw_text.txt"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)
