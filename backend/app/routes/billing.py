# # from fastapi import APIRouter, Depends
# # from app.database import db
# # from app.dependencies.auth_guard import get_current_user

# # router = APIRouter()
# # sales_collection = db["sales"]

# # @router.post("/")
# # def create_bill(data: dict, user=Depends(get_current_user)):
# #     sales_collection.insert_one(data)
# #     return {"msg": "Bill stored"}
# from fastapi import APIRouter, Depends
# from app.database import db
# from app.dependencies.auth_guard import get_current_user
# from datetime import datetime

# router = APIRouter()

# sales_collection = db["sales"]


# # Save Bill
# @router.post("/")
# def create_bill(data: dict, user=Depends(get_current_user)):

#     bill = {
#         "customer_name": data.get("customer_name"),
#         "items": data.get("items"),
#         "total": data.get("total"),
#         "created_at": datetime.now(),
#         "created_by": user["email"]
#     }

#     sales_collection.insert_one(bill)

#     return {
#         "msg": "Bill stored successfully"
#     }


# # Get All Bills
# @router.get("/")
# def get_bills(user=Depends(get_current_user)):

#     bills = list(
#         sales_collection.find(
#             {"created_by": user["email"]},
#             {"_id": 0}
#         )
#     )

from fastapi import APIRouter, Depends
from app.database import db
from app.dependencies.auth_guard import get_current_user
from datetime import datetime

router = APIRouter()

sales_collection = db["sales"]
products_collection = db["products"]


# Save Bill
@router.post("/")
def create_bill(data: dict, user=Depends(get_current_user)):

    bill = {
        "customer_name": data.get("customer_name"),
        "items": data.get("items"),
        "total": data.get("total"),
        "created_at": datetime.now(),
        "created_by": user["email"]
    }

    # ---------------- SAVE BILL ---------------- #

    sales_collection.insert_one(bill)

    # ---------------- UPDATE INVENTORY ---------------- #

    for item in data.get("items", []):

        product = products_collection.find_one({
            "name": item["name"]
        })

        # Prevent negative stock
        if product and product.get("stock", 0) >= item["quantity"]:

            products_collection.update_one(

                {
                    "name": item["name"]
                },

                {
                    "$inc": {
                        "stock": -item["quantity"]
                    }
                }

            )

    return {
        "msg": "Bill stored successfully"
    }


# Get All Bills
@router.get("/")
def get_bills(user=Depends(get_current_user)):

    # bills = list(
    #     sales_collection.find(
    #         {"created_by": user["email"]},
    #         {"_id": 0}
    #     )
    # )
    bills = list(
sales_collection.find({}, {"_id": 0})
)


    return bills
#     return bills