from app.database import db

products_collection = db["products"]

# Clear existing products
products_collection.delete_many({})

# Sample products with different prices
sample_products = [
    {"id": 1, "name": "Premium Coffee Beans", "category": "Beverages", "price": 24.99, "stock": 45, "image": "☕"},
    {"id": 2, "name": "Organic Green Tea", "category": "Beverages", "price": 14.99, "stock": 8, "image": "🍵"},
    {"id": 3, "name": "Artisan Sourdough Bread", "category": "Bakery", "price": 8.99, "stock": 0, "image": "🍞"},
    {"id": 4, "name": "Dark Chocolate Bar", "category": "Confectionery", "price": 6.49, "stock": 120, "image": "🍫"},
    {"id": 5, "name": "Almond Granola Mix", "category": "Snacks", "price": 11.99, "stock": 34, "image": "🥜"},
    {"id": 6, "name": "Cold Brew Kit", "category": "Beverages", "price": 32.99, "stock": 5, "image": "🧊"},
    {"id": 7, "name": "Vanilla Extract", "category": "Condiments", "price": 9.49, "stock": 67, "image": "🫙"},
    {"id": 8, "name": "Honey Jar 500g", "category": "Condiments", "price": 13.99, "stock": 22, "image": "🍯"},
    {"id": 9, "name": "Mixed Nuts Bag", "category": "Snacks", "price": 18.99, "stock": 3, "image": "🥜"},
    {"id": 10, "name": "Blueberry Muffins (6pk)", "category": "Bakery", "price": 12.49, "stock": 15, "image": "🫐"},
    {"id": 11, "name": "Sparkling Water 1L", "category": "Beverages", "price": 3.99, "stock": 200, "image": "💧"},
    {"id": 12, "name": "Protein Bar", "category": "Snacks", "price": 4.49, "stock": 88, "image": "💪"},
]

products_collection.insert_many(sample_products)
print(f"Seeded {len(sample_products)} products successfully!")
