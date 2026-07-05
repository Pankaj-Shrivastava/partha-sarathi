import re
import json
import os
from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter
from config import OUTPUT_DIR, RAW_TEXT_FILE

CHUNKS_FILE = OUTPUT_DIR / "chunks.json"

CHAPTER_MAP = {
    "ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5, "SIX": 6, 
    "SEVEN": 7, "EIGHT": 8, "NINE": 9, "TEN": 10, "ELEVEN": 11, 
    "TWELVE": 12, "THIRTEEN": 13, "FOURTEEN": 14, "FIFTEEN": 15, 
    "SIXTEEN": 16, "SEVENTEEN": 17, "EIGHTEEN": 18
}

def parse_raw_text():
    print(f"Reading from {RAW_TEXT_FILE}")
    with open(RAW_TEXT_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()

    verses = []
    
    current_chapter = 0
    current_page = 1
    
    # State tracking
    in_text = False
    in_translation = False
    in_purport = False
    
    # Verse buffers
    v_num = ""
    v_devanagari = []
    v_roman = []
    v_synonyms = []
    v_translation = []
    v_purport = []
    
    # Sub-states for TEXT
    seen_devanagari_end = False
    seen_synonyms_start = False
    
    def save_verse():
        nonlocal v_num, v_devanagari, v_roman, v_synonyms, v_translation, v_purport
        if v_num and (v_translation or v_purport):
            verses.append({
                "chapter": current_chapter,
                "verse": v_num,
                "citation": f"Chapter {current_chapter}, Verse {v_num}",
                "devanagari": "\n".join(v_devanagari).strip(),
                "sanskrit_roman": "\n".join(v_roman).strip(),
                "synonyms": "\n".join(v_synonyms).strip(),
                "translation": "\n".join(v_translation).strip(),
                "purport": "\n".join(v_purport).strip(),
                "source_page": current_page
            })
        
        # Reset buffers
        v_num = ""
        v_devanagari = []
        v_roman = []
        v_synonyms = []
        v_translation = []
        v_purport = []

    chapter_pattern = re.compile(r"^CHAPTER\s+([A-Z]+)$")
    page_pattern = re.compile(r"^--- PAGE (\d+) ---$")
    text_pattern = re.compile(r"^TEXTS?\s+(.+)$")  # Handle any hyphen type

    for raw_line in lines:
        line = raw_line.strip()
        
        # Skip empty lines unless in purport
        if not line and not in_purport:
            continue
            
        # Page tracking
        page_match = page_pattern.match(line)
        if page_match:
            current_page = int(page_match.group(1))
            continue
            
        # Chapter tracking
        chapter_match = chapter_pattern.match(line)
        if chapter_match:
            save_verse()
            c_str = chapter_match.group(1)
            current_chapter = CHAPTER_MAP.get(c_str, 0)
            in_text = in_translation = in_purport = False
            continue
            
        # Text boundaries
        text_match = text_pattern.match(line)
        if text_match:
            save_verse()
            v_num = re.sub(r'[^\d]+', '-', text_match.group(1))
            in_text = True
            in_translation = False
            in_purport = False
            seen_devanagari_end = False
            seen_synonyms_start = False
            continue
            
        if line == "TRANSLATION":
            in_text = False
            in_translation = True
            in_purport = False
            continue
            
        if line == "PURPORT":
            in_text = False
            in_translation = False
            in_purport = True
            continue
            
        # Content gathering
        if in_text:
            if not seen_devanagari_end:
                v_devanagari.append(line)
                if "))" in line:
                    seen_devanagari_end = True
            else:
                if not seen_synonyms_start and "—" in line:
                    seen_synonyms_start = True
                    
                if seen_synonyms_start:
                    v_synonyms.append(line)
                else:
                    v_roman.append(line)
                    
        elif in_translation:
            v_translation.append(line)
            
        elif in_purport:
            v_purport.append(line)

    # Save the last verse
    save_verse()
    
    print(f"Parsed {len(verses)} verses from the text.")
    return verses

def chunk_verses(verses):
    chunks = []
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    
    for v in verses:
        # We want to embed the translation + purport. Devanagari/Roman goes in metadata.
        base_content = f"Translation: {v['translation']}\n\n"
        
        purport_text = v['purport']
        if not purport_text:
            # If no purport, just one chunk
            v_copy = v.copy()
            v_copy["content"] = base_content
            chunks.append(v_copy)
            continue
            
        # If purport exists, split it
        purport_chunks = splitter.split_text(purport_text)
        
        for i, p_chunk in enumerate(purport_chunks):
            v_copy = v.copy()
            v_copy["content"] = base_content + f"Purport (Part {i+1}): {p_chunk}"
            chunks.append(v_copy)
            
    print(f"Generated {len(chunks)} text chunks.")
    return chunks

if __name__ == "__main__":
    verses = parse_raw_text()
    chunks = chunk_verses(verses)
    
    with open(CHUNKS_FILE, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)
        
    print(f"Saved chunks to {CHUNKS_FILE}")
