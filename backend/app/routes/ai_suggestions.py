from fastapi import APIRouter
from app.database import db

router = APIRouter()

sales_collection = db["sales"]
products_collection = db["products"]


@router.get("/")
def get_ai_suggestions():

    sales = list(sales_collection.find())
    products = list(products_collection.find())

    suggestions = []

    # ---------------- PRODUCT SALES ---------------- #

    product_sales = {}

    for sale in sales:

        for item in sale.get("items", []):

            name = item["name"]
            qty = item["quantity"]

            if name in product_sales:
                product_sales[name] += qty
            else:
                product_sales[name] = qty

    # ---------------- LOW STOCK ---------------- #

    for product in products:

        stock = product.get("stock", 0)

        if stock < 5:

            suggestions.append({
                "type": "warning",
                "title": "Low Stock Alert",
                "message":
                    f"{product['name']} stock is below 5 units."
            })

    # ---------------- FAST SELLING ---------------- #

    for name, qty in product_sales.items():

        if qty > 20:

            suggestions.append({
                "type": "success",
                "title": "High Demand Product",
                "message":
                    f"{name} sales increased rapidly this week."
            })

    # ---------------- SLOW MOVING ---------------- #

    for product in products:

        name = product["name"]

        sold = product_sales.get(name, 0)

        if sold < 3:

            suggestions.append({
                "type": "info",
                "title": "Slow Moving Product",
                "message":
                    f"{name} has very low sales."
            })

    # ---------------- RESTOCK SUGGESTION ---------------- #

    for product in products:

        name = product["name"]

        stock = product.get("stock", 0)

        sold = product_sales.get(name, 0)

        if sold > stock:

            suggestions.append({
                "type": "warning",
                "title": "Restock Recommended",
                "message":
                    f"Restock {name} inventory soon."
            })

    return suggestions