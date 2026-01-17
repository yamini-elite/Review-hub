import csv
import random

CATEGORIES = {
    "Travel": ["The hotel was amazing!", "Great flight experience.", "Loved this trip!", "Fantastic destination.", "The tour guide was great.", "Highly recommend this airline.", "Magical stay at the resort."],
    "Electronics": ["Best laptop I've owned.", "The camera quality is superb.", "Great battery life on this phone.", "Excellent monitor for work.", "Noise cancelling is top notch.", "Very responsive mouse.", "Stylish smartwatch."],
    "Fashion": ["Love this shirt!", "Best jeans ever.", "Beautiful dress for the party.", "Cool outfit.", "Great style and fit.", "Comfortable shoes.", "The watch looks premium."],
    "Restaurants": ["The food was delicious!", "Best cafe in town.", "Great bistro atmosphere.", "Love this diner.", "Excellent buffet variety.", "Starbucks coffee is always good.", "Subway sandwiches are fresh."],
    "Books": ["Great book, couldn't put it down.", "Amazing novel.", "The author's best work.", "Captivating fiction.", "Informative non-fiction.", "Loved reading this on my Kindle.", "Must read biography."]
}

ITEMS = {
    "Travel": ["Grand Hotel", "Sky Airlines", "Beach Resort", "Kyoto Tour", "Mountain Hut"],
    "Electronics": ["MacBook Pro", "Sony Camera", "iPhone 15", "Samsung Tablet", "Logitech Mouse", "Bose Headphones"],
    "Fashion": ["Levis Jeans", "Nike Shoes", "Stellar Shirt", "Fashionista Dress", "Titan Watch"],
    "Restaurants": ["Starbucks", "Pizza Hut", "The Local Bistro", "Subway", "Golden Diner", "KFC"],
    "Books": ["Mystery Novel", "Life Memoir", "Science Fiction Book", "Business Guide", "History Book"]
}

def generate():
    data = []
    for cat, items in ITEMS.items():
        for i in range(20):
            item = random.choice(items)
            review_text = random.choice(CATEGORIES[cat]) + " " + random.choice(["Highly recommend.", "Will buy again.", "Good value.", "Five stars!"])
            data.append({
                "item_id": f"S-{cat[:2]}-{i}",
                "item_name": item,
                "category": cat.lower(),
                "rating": random.choice([4, 5]),
                "review_text": review_text,
                "quality_score": round(random.uniform(0.7, 0.9), 2),
                "source": "Synthetic",
                "date": f"2024-0{random.randint(1, 5)}-0{random.randint(1, 9)}"
            })
    
    with open("data/additional_reviews.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["item_id", "item_name", "category", "rating", "review_text", "quality_score", "source", "date"])
        writer.writeheader()
        writer.writerows(data)
    print("Generated 100 synthetic reviews in data/additional_reviews.csv")

if __name__ == "__main__":
    generate()
