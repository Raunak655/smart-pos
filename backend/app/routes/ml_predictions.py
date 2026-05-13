from fastapi import APIRouter
from app.database import db

import pandas as pd
import numpy as np

from sklearn.linear_model import LinearRegression


router = APIRouter()

sales_collection = db["sales"]


@router.get("/")
def predict_sales():

    sales = list(sales_collection.find())

    # No data
    if len(sales) < 2:

        return {
            "predictions": []
        }

    # ---------------- PREPARE DATA ---------------- #

    daily_sales = []

    for i, sale in enumerate(sales):

        total = sale.get("total", 0)

        daily_sales.append({
            "day": i + 1,
            "sales": total
        })

    df = pd.DataFrame(daily_sales)

    # ---------------- TRAIN MODEL ---------------- #

    X = df[["day"]]

    y = df["sales"]

    model = LinearRegression()

    model.fit(X, y)

    # ---------------- PREDICT NEXT 7 DAYS ---------------- #

    future_days = np.array(
        range(len(df) + 1, len(df) + 8)
    ).reshape(-1, 1)

    predictions = model.predict(future_days)

    result = []

    for i, pred in enumerate(predictions):

        result.append({

            "day":
                f"Day {len(df) + i + 1}",

            "predicted_sales":
                round(float(pred), 2)
        })

    return {
        "predictions": result
    }