# # from pymongo import MongoClient

# # client = MongoClient("mongodb://localhost:27017/")
# # db = client["smartpos"]

# # users_collection = db["users"]
# from pymongo import MongoClient
# from dotenv import load_dotenv
# import os

# # Load environment variables

# load_dotenv()

# # Get MongoDB Atlas URI

# MONGO_URI = os.getenv("MONGO_URI")
# print("Loaded Mongo URI:", MONGO_URI)

# try:
#     client.admin.command("ping")
#     print("MongoDB Atlas Connected Successfully!")
# except Exception as e:
#     print("MongoDB Connection Error:", e)


# # Connect to MongoDB Atlas

# client = MongoClient(MONGO_URI)

# # Database

# db = client["smartpos"]

# # Collections

# users_collection = db["users"]
# products_collection = db["products"]
# sales_collection = db["sales"]
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables

load_dotenv()

# Read Mongo URI

MONGO_URI = os.getenv("MONGO_URI")

print("Loaded Mongo URI:", MONGO_URI)

# Connect MongoDB

client = MongoClient(MONGO_URI)

# Test connection

try:
    client.admin.command("ping")
    print("MongoDB Atlas Connected Successfully!")
except Exception as e:
    print("MongoDB Connection Error:", e)

# Database

db = client["smartpos"]

# Collections

users_collection = db["users"]
products_collection = db["products"]
sales_collection = db["sales"]
