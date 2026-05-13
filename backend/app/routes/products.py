from fastapi import APIRouter, Depends, HTTPException, status
from app.database import db
from app.dependencies.auth_guard import get_current_user

router = APIRouter()

products_collection = db["products"]

# Add product
# @router.post("/")
# def add_product(product: dict, user=Depends(get_current_user)):
#     # Generate next ID
#     last_product = products_collection.find_one(sort=[("id", -1)])
#     next_id = (last_product.get("id", 0) + 1) if last_product else 1
    
#     product["id"] = next_id
#     result = products_collection.insert_one(product)
#     return product
@router.post("/")
def add_product(data: dict, user=Depends(get_current_user)):
    last_product = products_collection.find_one(sort=[("id", -1)])
    next_id = (last_product.get("id", 0) + 1) if last_product else 1

    product = {
        "id": next_id,
        "name": data.get("name"),
        "price": data.get("price"),
        "stock": data.get("stock"),
        "category": data.get("category"),
        "image": data.get("image", "🛍️"),
        "created_by": user["email"]
    }

    products_collection.insert_one(product)
    product.pop("_id", None)

    return product

# Get all products
@router.get("/")
def get_products(user=Depends(get_current_user)):
    products = list(products_collection.find({}, {"_id": 0, "created_by": 0}))
    return products
# Update product
@router.put("/{product_id}")
def update_product(product_id: int, data: dict, user=Depends(get_current_user)):
    product = {
        "name": data.get("name"),
        "price": data.get("price"),
        "stock": data.get("stock"),
        "category": data.get("category")
    }

    result = products_collection.update_one(
        {"id": product_id},
        {"$set": product}
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

# Delete product
@router.delete("/{product_id}")
def delete_product(product_id: int, user=Depends(get_current_user)):
    result = products_collection.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return {"msg": "Product deleted successfully"}