from fastapi import FastAPI
from app.routes import auth  
app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ ADD THIS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# your routes
from app.routes import auth

app.include_router(auth.router, prefix="/auth")
from app.routes import products, billing

app.include_router(products.router, prefix="/products")
app.include_router(billing.router, prefix="/billing")
from app.routes import analytics

app.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)
from app.routes import ai_suggestions
app.include_router(
    ai_suggestions.router,
    prefix="/ai-suggestions"
)
from app.routes import ml_predictions
app.include_router(
    ml_predictions.router,
    prefix="/ml-predictions"
)