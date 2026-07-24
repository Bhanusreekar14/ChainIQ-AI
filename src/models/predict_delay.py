"""
Inference Engine for ChainIQ.
Loads the trained CatBoost model and predicts shipment delay probabilities.
"""

import os
import json
import pandas as pd
from catboost import CatBoostClassifier

# -----------------------------
# Constants
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "delay_risk_model.cbm")

FEATURE_CONFIG_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "feature_config.json"
)

REMOVE_FEATURES = [
    "Customer Id",
    "Order Customer Id",
    "Order Id",
    "Order Item Id",
    "Product Card Id",
    "Product Image",
    "order date (DateOrders)"
]

RISK_LEVELS = [
    (0.30, "Low"),
    (0.60, "Medium"),
    (0.80, "High"),
    (1.00, "Critical")
]


# -----------------------------
# Helper Functions
# -----------------------------
def load_model():
    """Load the trained CatBoost model from disk."""
    print("Loading trained model...")
    model = CatBoostClassifier()
    model.load_model(MODEL_PATH)
    print("Model loaded successfully.")
    return model


def load_feature_config():
    """Load feature configuration and return cleaned safe features list."""
    print("Loading feature configuration...")
    with open(FEATURE_CONFIG_PATH, "r") as f:
        feature_config = json.load(f)

    safe_features = feature_config["SAFE_FEATURES"]

    # Remove ID columns, Product Image, and raw datetime
    safe_features = [
        col for col in safe_features
        if col not in REMOVE_FEATURES
    ]

    print(f"Loaded {len(safe_features)} safe features (after cleanup).")
    return safe_features


def classify_risk(probability):
    """
    Classify delay probability into risk levels.

    Args:
        probability (float): Delay probability between 0.0 and 1.0.

    Returns:
        str: Risk level - Low, Medium, High, or Critical.
    """
    for threshold, level in RISK_LEVELS:
        if probability <= threshold:
            return level
    return "Critical"


# -----------------------------
# Main Functions
# -----------------------------
def predict_delay(order_data: dict):
    """
    Predict shipment delay probability for a single order.

    Args:
        order_data (dict): Order details as key-value pairs.

    Returns:
        dict: Prediction result with delay_probability, risk_level, confidence.
    """
    # Load model and features
    model = load_model()
    safe_features = load_feature_config()

    # Convert input to DataFrame
    input_df = pd.DataFrame([order_data])

    # Part 1: Keep only safe features that exist in input
    for feature in safe_features:
        if feature not in input_df.columns:
            input_df[feature] = None

    # Part 2: Keep only model features, drop extras
    input_df = input_df[safe_features]

    # Part 3: Predict probability
    # CatBoost handles categorical features internally (saved in model)
    probability = model.predict_proba(input_df)[0][1]

    # Part 4: Classify risk
    risk_level = classify_risk(probability)

    # Part 5: Return result
    return {
        "delay_probability": round(float(probability), 4),
        "risk_level": risk_level,
        "confidence": round(float(probability) * 100, 2)
    }


# -----------------------------
# Entry Point
# -----------------------------
if __name__ == "__main__":
    # Test with a sample order
    sample_order = {
        "Type": "DEBIT",
        "Category Name": "Fishing",
        "Customer City": "Caguas",
        "Customer Country": "Puerto Rico",
        "Customer Segment": "Consumer",
        "Customer State": "Puerto Rico",
        "Customer Zipcode": 725,
        "Department Id": 2,
        "Department Name": "Fitness",
        "Market": "LATAM",
        "Order City": "Caguas",
        "Order Country": "Puerto Rico",
        "Order Item Discount": 10.0,
        "Order Item Discount Rate": 0.04,
        "Order Item Product Price": 250.0,
        "Order Item Profit Ratio": 0.22,
        "Order Item Quantity": 2,
        "Sales": 320.50,
        "Order Item Total": 480.0,
        "Order Profit Per Order": 105.0,
        "Order Region": "Caribbean",
        "Order State": "Puerto Rico",
        "Order Status": "COMPLETE",
        "Product Category Id": 17,
        "Product Name": "Pelican Sunstream Fishing Rod",
        "Product Price": 250.0,
        "Shipping Mode": "Standard Class",
        "Latitude": 18.23,
        "Longitude": -66.04,
        "Days for shipping (real)": 5,
        "Days for shipment (scheduled)": 4,
        "Sales per customer": 320.50,
        "Delivery Status": "Late delivery",
        "order_year": 2017,
        "order_month": 9,
        "order_day": 15,
        "order_dayofweek": 4,
        "order_hour": 10,
        "order_is_weekend": 0,
        "order_quarter": 3,
        "scheduled_shipping_days": 4,
        "order_quantity": 2,
        "sales_per_unit": 160.25,
        "discount_rate": 0.04,
        "profit_margin": 0.22
    }

    print("\n===== INFERENCE ENGINE TEST =====\n")
    result = predict_delay(sample_order)

    print(f"  Delay Probability : {result['delay_probability']}")
    print(f"  Risk Level        : {result['risk_level']}")
    print(f"  Confidence        : {result['confidence']}%")
    print("\nFull Result JSON:")
    print(json.dumps(result, indent=4))

