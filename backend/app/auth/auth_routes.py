from fastapi import APIRouter, HTTPException
from app.database import user_collection

router = APIRouter()

@router.post("/signup")
async def signup(user: UserSignup):

    existing_user = await user_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    hashed_password = hash_password(user.password)

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": "customer"
    }

    result = await user_collection.insert_one(
        new_user
    )

    token = create_access_token({
        "user_id": str(result.inserted_id),
        "role": "customer"
    })

    return {
        "message": "Signup successful",
        "token": token
    }
@router.post("/login")
async def login(user: UserLogin):

    db_user = await user_collection.find_one(
        {"email": user.email}
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        user.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token({
        "user_id": str(db_user["_id"]),
        "role": db_user["role"]
    })

    return {
        "token": token,
        "role": db_user["role"]
    }
from app.schemas.user_schema import (
    UserSignup,
    UserLogin
)

from app.auth.password_handler import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import (
    create_access_token
)

router = APIRouter()