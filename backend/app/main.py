# from fastapi import FastAPI
# from app.routes import auth  
# app = FastAPI()

# app.include_router(auth.router, prefix="/auth", tags=["Auth"])
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# #  ADD THIS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # allow frontend
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # your routes
# from app.routes import auth

# app.include_router(auth.router, prefix="/auth")
# from app.routes import products, billing

# app.include_router(products.router, prefix="/products")
# app.include_router(billing.router, prefix="/billing")
# from app.routes import analytics

# app.include_router(
#     analytics.router,
#     prefix="/analytics",
#     tags=["Analytics"]
# )
# from app.routes import ai_suggestions
# app.include_router(
#     ai_suggestions.router,
#     prefix="/ai-suggestions"
# )
# from app.routes import ml_predictions
# app.include_router(
#     ml_predictions.router,
#     prefix="/ml-predictions"
# )
# from app.database import users_collection

# @app.get("/insert-test")
# def insert_test():


#     users_collection.insert_one({
#     "name": "Anuj",
#     "role": "admin"
# })
#     return {"message": "Inserted successfully"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routes

from app.routes import auth, products, billing, analytics, ai_suggestions, ml_predictions

# Create app

app = FastAPI()

# CORS Middleware

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

# Auth Routes

app.include_router(auth.router, prefix="/auth", tags=["Auth"])

# Product Routes

app.include_router(products.router, prefix="/products")

# Billing Routes

app.include_router(billing.router, prefix="/billing")

# Analytics Routes

app.include_router(
analytics.router,
prefix="/analytics",
tags=["Analytics"]
)

# AI Suggestions Routes

app.include_router(
ai_suggestions.router,
prefix="/ai-suggestions"
)

# ML Prediction Routes

app.include_router(
ml_predictions.router,
prefix="/ml-predictions"
)

