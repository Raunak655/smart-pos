def user_model(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }
# from pydantic import BaseModel
# from typing import Optional

# class User(BaseModel):
#     name: str
#     email: str
#     password: str
#     role: str = "customer"