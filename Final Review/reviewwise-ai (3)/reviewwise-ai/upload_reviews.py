import csv
import random
import os
import json
from collections import Counter
from pathlib import Path
from dataclasses import dataclass, asdict
import data_store

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
CSV_PATH = Path("data") / "top_500_important_reviews.csv"

# ---------------------------------------------------------------------------
# Categorization Logic
# ---------------------------------------------------------------------------
import re

CATEGORY_MAPPING = {
    "product": ["mamaearth", "amazon", "electronics", "cosmetics", "dettol", "savlon", "gadget", "watch", "security", "solutions", "himalaya", "godrej", "lotion"],
    "travel": ["travel", "hotel", "flight", "trip", "destination", "kyoto", "santorini", "stayed", "vacation", "tour", "airline"],
    "food": ["food", "snack", "cuisine", "amul", "tata", "society", "maggi", "noodles", "ghee", "paneer", "chocolate", "cacao", "butter"],
    "fashion": ["clothing", "fashion", "shirt", "jeans", "dress", "outfit", "style", "wear", "shirt", "shoes", "streax", "hair"],
    "electronics": ["laptop", "phone", "camera", "tablet", "monitor", "headphone", "earbud", "smartwatch", "iphone", "samsung", "logitech", "mouse", "keyboard", "macbook", "bose", "sony"],
    "restaurants": ["restaurant", "cafe", "bistro", "diner", "eatery", "buffet", "starbucks", "subway", "kfc", "mcdonald", "pizza hut", "domino"],
    "books": ["book", "novel", "author", "fiction", "non-fiction", "read", "ebook", "kindle", "paperback", "biography", "memoir", "thriller", "mystery"],
}

def get_category(item_name, content):
    item_name_lower = item_name.lower()
    content_lower = content.lower()
    
    # 1. Check item_name first (high priority)
    for cat, keywords in CATEGORY_MAPPING.items():
        for word in keywords:
            if word in item_name_lower:
                return cat
                
    # 2. Check content with word boundaries (lower priority)
    for cat, keywords in CATEGORY_MAPPING.items():
        for word in keywords:
            # Using \b for word boundaries to avoid "stays" matching "stay"
            if re.search(rf"\b{re.escape(word)}\b", content_lower):
                return cat
    
    return "others"

# ---------------------------------------------------------------------------
# Random Username Generation
# ---------------------------------------------------------------------------
USERNAMES = ["user", "rahul", "priya", "ankit", "sara", "neha", "amit", "deepa", "rohan", "sneha", "vikram", "tanvi"]
SUFFIXES = ["k", "91", "4821", "dev", "ai", "explorer", "v", "j", "s", "m"]

def generate_username():
    base = random.choice(USERNAMES)
    suffix = random.choice(SUFFIXES)
    if random.choice([True, False]):
        return f"{base}_{suffix}"
    else:
        return f"{base}_{random.randint(1000, 9999)}"

# ---------------------------------------------------------------------------
# Core Logic
# ---------------------------------------------------------------------------
def upload_reviews():
    csv_files = list(Path("data").glob("*.csv"))
    if not csv_files:
        print("Error: No CSV files found in data/")
        return

    # Load existing reviews for deduplication
    existing_reviews = data_store.get_all_reviews()
    # Key for deduplication: (review_text, date)
    seen_keys = {(r["review_text"].strip(), r["date"]) for r in existing_reviews}

    added_counts = Counter()
    total_processed = 0
    duplicates_skipped = 0

    for csv_path in csv_files:
        print(f"Processing {csv_path}...")
        with open(csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                total_processed += 1
                
                # Fields: item_id,item_name,category,rating,review_text,quality_score,source,date
                item_name = row.get("item_name", "")
                review_text = row.get("review_text", "")
                rating = row.get("rating", "0")
                date = row.get("date", "")
                source = row.get("source", "N/A")

                # 1. Deduplication check
                key = (review_text.strip(), date)
                if key in seen_keys:
                    duplicates_skipped += 1
                    continue

                # 2. Categorization
                category = get_category(item_name, review_text)

                # 3. Username generation
                username = generate_username()

                # 4. Prepare review data
                review_data = {
                    "username": username,
                    "rating": float(rating),
                    "review_text": review_text,
                    "date": date,
                    "source": source,
                    "category": category,
                    "item_name": item_name
                }

                # 5. Insert into data store
                data_store.insert_review(review_data)
                
                # Update state for next iteration
                seen_keys.add(key)
                added_counts[category] += 1

    # 6. Logging
    print(f"\nUpload summary:")
    print(f"Total reviews processed: {total_processed}")
    print(f"Duplicates skipped: {duplicates_skipped}")
    print(f"Unique reviews added:")
    for cat in sorted(added_counts.keys()):
        print(f"  - {cat.capitalize()}: {added_counts[cat]}")

if __name__ == "__main__":
    upload_reviews()
