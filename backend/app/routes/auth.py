from fastapi import APIRouter, HTTPException, Depends, status
from app.database import users_collection
from app.schemas.user_schema import UserSignup, UserLogin
from app.utils.hash import hash_password, verify_password
from app.utils.jwt import create_token
from app.dependencies.auth_guard import get_current_user

router = APIRouter()

# Signup
@router.post("/signup", status_code=201)
def signup(user: UserSignup):
    print("Signup API called")
    
    # Check if user already exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Validate password strength (min 6 chars)
    if len(user.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "role": user.role

    })

    return {
        "message": "User created successfully. Please login.",
        "success": True
    }

# Login
@router.post("/login")
def login(user: UserLogin):
    print("Login API called")
    
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_token({"email": user.email, "role": db_user["role"]})

    return {
        "token": token,
        "user": {
            "email": db_user["email"],
            "name": db_user["name"],
            "role": db_user["role"]

        },
        "success": True
    }

# Validate token / Get current user
@router.get("/me")
def get_user(user=Depends(get_current_user)):
    """Get current authenticated user"""
    db_user = users_collection.find_one({"email": user["email"]})
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "email": db_user["email"],
        "name": db_user["name"],
        "role": db_user["role"],
        "success": True
    }