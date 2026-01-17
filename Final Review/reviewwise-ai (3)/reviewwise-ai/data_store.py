import json
import os
from pathlib import Path

DATA_DIR = Path("data")
DB_FILE = DATA_DIR / "reviews.json"

def init_db():
    if not DATA_DIR.exists():
        DATA_DIR.mkdir(parents=True)
    if not DB_FILE.exists():
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)

def get_all_reviews():
    init_db()
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def insert_review(review_dict):
    init_db()
    reviews = get_all_reviews()
    reviews.append(review_dict)
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(reviews, f, indent=2)
