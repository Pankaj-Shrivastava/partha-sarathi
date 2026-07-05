import fitz  # PyMuPDF
import time
from config import PDF_PATH, RAW_TEXT_FILE

def fix_balaram_unicode(text):
    # Mapping ISKCON Balaram/ScaGoudy extended ASCII to standard IAST Unicode
    replacements = {
        'ä': 'ā', 'Ä': 'Ā',
        'é': 'ī', 'É': 'Ī',
        'ü': 'ū', 'Ü': 'Ū',
        'å': 'ṛ', 'Å': 'Ṛ',
        'ë': 'ṇ', 'Ë': 'Ṇ',
        'ç': 'ś', 'Ç': 'Ś',
        'ñ': 'ṣ', 'Ñ': 'Ṣ',
        'ö': 'ṭ', 'Ö': 'Ṭ',
        'ò': 'ḍ', 'Ò': 'Ḍ',
        'ï': 'ñ', 'Ï': 'Ñ',
        'ì': 'ṅ', 'Ì': 'Ṅ',
        'à': 'ṁ', 'À': 'Ṁ',
        'ù': 'ḥ', 'Ù': 'Ḥ',
        '—': '—', # Em dash
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def extract_text_from_pdf():
    print(f"Starting extraction from: {PDF_PATH}")
    start_time = time.time()
    
    if not PDF_PATH.exists():
        print(f"Error: PDF file not found at {PDF_PATH}")
        return

    try:
        doc = fitz.open(PDF_PATH)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    total_pages = len(doc)
    extracted_text_blocks = []
    blank_pages_skipped = 0
    total_characters = 0

    for page_num in range(total_pages):
        page = doc[page_num]
        # "text" mode extracts text only, stripping images
        text = page.get_text("text").strip()
        text = fix_balaram_unicode(text)
        
        if not text:
            blank_pages_skipped += 1
            continue
            
        total_characters += len(text)
        
        # Add page marker (using 1-based indexing for display)
        page_marker = f"\n\n--- PAGE {page_num + 1} ---\n\n"
        extracted_text_blocks.append(page_marker + text)

    # Join and save
    final_text = "".join(extracted_text_blocks)
    
    with open(RAW_TEXT_FILE, "w", encoding="utf-8") as f:
        f.write(final_text)

    elapsed_time = time.time() - start_time
    
    print("\n--- Extraction Complete ---")
    print(f"Total pages processed: {total_pages}")
    print(f"Blank pages skipped:   {blank_pages_skipped}")
    print(f"Total characters:      {total_characters:,}")
    print(f"Time taken:            {elapsed_time:.2f} seconds")
    print(f"Output saved to:       {RAW_TEXT_FILE}")

if __name__ == "__main__":
    extract_text_from_pdf()
