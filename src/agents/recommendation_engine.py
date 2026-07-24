"""
AI Recommendation Engine for ChainIQ.
Generates decision support recommendations based on shipment delay predictions.
"""

import os
import sys
import json

# Add project root to path for imports
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, BASE_DIR)

from src.models.predict_delay import predict_delay


# -----------------------------
# Constants
# -----------------------------
PRIORITY_MAP = {
    "Low": "Low",
    "Medium": "Medium",
    "High": "High",
    "Critical": "Urgent"
}


# -----------------------------
# Module 1: Root Cause Analyzer
# -----------------------------
def analyze_root_causes(order_data: dict) -> list:
    """
    Analyze order data to identify possible causes of delay.

    Args:
        order_data (dict): Order details.

    Returns:
        list: List of identified root cause strings.
    """
    # TODO: Implement root cause analysis rules
    causes = []
    return causes


# -----------------------------
# Module 2: Recommendation Generator
# -----------------------------
def generate_actions(risk_level: str, causes: list, order_data: dict) -> list:
    """
    Generate actionable recommendations based on risk and causes.

    Args:
        risk_level (str): Predicted risk level.
        causes (list): Identified root causes.
        order_data (dict): Order details.

    Returns:
        list: List of recommendation strings.
    """
    # TODO: Implement recommendation generation rules
    recommendations = []
    return recommendations


# -----------------------------
# Module 3: Priority Assignment
# -----------------------------
def assign_priority(risk_level: str) -> str:
    """
    Assign action priority based on risk level.

    Args:
        risk_level (str): Predicted risk level.

    Returns:
        str: Priority level (Low, Medium, High, Urgent).
    """
    return PRIORITY_MAP.get(risk_level, "Medium")


# -----------------------------
# Module 4: Business Impact Estimator
# -----------------------------
def estimate_business_impact(order_data: dict, risk_level: str) -> dict:
    """
    Estimate the business impact of a potential delay.

    Args:
        order_data (dict): Order details.
        risk_level (str): Predicted risk level.

    Returns:
        dict: Business impact estimates.
    """
    # TODO: Implement business impact estimation
    return {}


# -----------------------------
# Main Function
# -----------------------------
def generate_recommendation(order_data: dict) -> dict:
    """
    Generate AI recommendations for a shipment.

    Args:
        order_data (dict): Order details as key-value pairs.

    Returns:
        dict: Complete recommendation JSON with prediction,
              causes, recommendations, priority, and impact.
    """
    # Step 1: Get delay prediction
    prediction = predict_delay(order_data)

    # Step 2: Analyze root causes
    causes = analyze_root_causes(order_data)

    # Step 3: Generate recommendations
    recommendations = generate_actions(
        prediction["risk_level"], causes, order_data
    )

    # Step 4: Assign priority
    priority = assign_priority(prediction["risk_level"])

    # Step 5: Estimate business impact
    impact = estimate_business_impact(order_data, prediction["risk_level"])

    # Step 6: Return complete recommendation
    return {
        "prediction": prediction,
        "possible_causes": causes,
        "recommendations": recommendations,
        "priority": priority,
        "business_impact": impact
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

    print("\n===== RECOMMENDATION ENGINE TEST =====\n")
    result = generate_recommendation(sample_order)
    print(json.dumps(result, indent=4))
