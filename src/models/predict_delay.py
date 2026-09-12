"""
Inference Engine for ChainIQ.
Loads the trained CatBoost model and predicts shipment delay probabilities.

Model and feature config are loaded once via src.models.registry and reused
on every call. This module's public API (predict_delay, classify_risk,
RISK_LEVELS) is stable; downstream code does not need to change.
"""

import json
import pandas as pd

from src.core.config import BASE_DIR, FEATURE_CONFIG_PATH, MODEL_PATH
from src.core.constants import REMOVE_FEATURES, RISK_LEVELS
from src.core.logging import logger
from src.models.registry import get_feature_config, get_model


# -----------------------------
# Helper Functions
# -----------------------------
def load_model():
    """
    Load the trained CatBoost model. Thin wrapper around the registry
    kept for back-compat with callers that still import this name.
    """
    logger.info("Loading trained model via registry...")
    model = get_model()
    logger.info("Model loaded successfully.")
    return model


def load_feature_config():
    """
    Load feature configuration and return cleaned safe features list.
    Thin wrapper around the registry kept for back-compat.
    """
    logger.info("Loading feature configuration via registry...")
    feature_config = get_feature_config()
    safe_features = feature_config["SAFE_FEATURES"]
    safe_features = [col for col in safe_features if col not in REMOVE_FEATURES]
    logger.info(f"Loaded {len(safe_features)} safe features (after cleanup).")
    return safe_features


def classify_risk(probability: float) -> str:
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
def predict_delay(order_data: dict) -> dict:
    """
    Predict shipment delay probability for a single order.

    Args:
        order_data (dict): Order details as key-value pairs. Should contain
            the model's expected feature names; missing columns will be
            filled with None (acceptable for CatBoost categoricals but
            brittle for numerics — prefer the API path through
            feature_builder for production callers).

    Returns:
        dict: Prediction result with delay_probability, risk_level, confidence.
    """
    model = get_model()
    safe_features = load_feature_config()

    # Convert input to DataFrame
    input_df = pd.DataFrame([order_data])

    # Part 1: Fill any missing model features with None
    for feature in safe_features:
        if feature not in input_df.columns:
            input_df[feature] = None

    # Part 2: Keep only model features, drop extras
    input_df = input_df[safe_features]

    # Part 3: Predict probability
    probability = model.predict_proba(input_df)[0][1]

    # Part 4: Classify risk
    risk_level = classify_risk(probability)

    # Part 5: Compute SHAP feature attributions
    shap_attributions = []
    try:
        raw_shap = model.get_feature_importance(data=input_df, type="ShapValues")[0][:-1]
        for feat, val in zip(safe_features, raw_shap):
            impact_val = round(float(val), 4)
            if abs(impact_val) >= 0.001:
                shap_attributions.append({
                    "feature": feat,
                    "impact": impact_val,
                    "direction": "increases_risk" if impact_val > 0 else "reduces_risk",
                })
        shap_attributions.sort(key=lambda x: abs(x["impact"]), reverse=True)
        shap_attributions = shap_attributions[:6]
    except Exception as e:
        logger.warning(f"Failed to calculate SHAP feature importance: {e}")

    # Part 6: Return result
    return {
        "delay_probability": round(float(probability), 4),
        "risk_level": risk_level,
        "confidence": round(float(probability) * 100, 2),
        "shap_attributions": shap_attributions,
    }


# -----------------------------
# Entry Point
# -----------------------------
if __name__ == "__main__":
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
        "profit_margin": 0.22,
    }

    logger.info("Running Inference Engine Standalone Test...")
    result = predict_delay(sample_order)

    logger.info(f"Delay Probability : {result['delay_probability']}")
    logger.info(f"Risk Level        : {result['risk_level']}")
    logger.info(f"Confidence        : {result['confidence']}%")
    logger.info(f"Full Result JSON  :\n{json.dumps(result, indent=4)}")
