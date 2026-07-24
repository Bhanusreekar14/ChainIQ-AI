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
# Config Paths
# -----------------------------
IMPACT_RULES_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "config",
    "impact_rules.json"
)


# -----------------------------
# Constants
# -----------------------------
PRIORITY_MAP = {
    "Low": "Low",
    "Medium": "Medium",
    "High": "High",
    "Critical": "Urgent"
}

ROOT_CAUSE_RULES = [
    {
        "name": "Standard Shipping",
        "condition": lambda o: o.get("Shipping Mode") == "Standard Class"
    },
    {
        "name": "High Risk Region",
        "condition": lambda o: o.get("Market") in ["LATAM", "Africa"]
    },
    {
        "name": "Large Shipment Volume",
        "condition": lambda o: o.get("Order Item Quantity", 0) > 5
    },
    {
        "name": "Long Delivery Window",
        "condition": lambda o: o.get("Days for shipment (scheduled)", 0) > 4
    },
    {
        "name": "High Value Shipment",
        "condition": lambda o: o.get("Sales", 0) > 1000
    },
    {
        "name": "Low Profit Margin",
        "condition": lambda o: o.get("profit_margin", 1) < 0.10
    },
    {
        "name": "Weekend Order",
        "condition": lambda o: o.get("order_is_weekend", 0) == 1
    },
    {
        "name": "High Discount Rate",
        "condition": lambda o: o.get("discount_rate", 0) > 0.20
    }
]

ACTION_MAP = {
    "Standard Shipping": [
        {"action": "Upgrade to Express Shipping", "priority": "High"},
        {"action": "Review shipping SLA", "priority": "Medium"}
    ],
    "High Risk Region": [
        {"action": "Notify Regional Manager", "priority": "High"},
        {"action": "Increase shipment monitoring", "priority": "Medium"}
    ],
    "Large Shipment Volume": [
        {"action": "Allocate additional warehouse staff", "priority": "Medium"},
        {"action": "Split shipment into smaller batches", "priority": "Low"}
    ],
    "Long Delivery Window": [
        {"action": "Expedite processing at origin warehouse", "priority": "Medium"}
    ],
    "High Value Shipment": [
        {"action": "Enable priority handling", "priority": "High"},
        {"action": "Assign dedicated logistics coordinator", "priority": "Medium"}
    ],
    "Low Profit Margin": [
        {"action": "Review pricing strategy", "priority": "Medium"},
        {"action": "Reduce operational costs", "priority": "Low"}
    ],
    "Weekend Order": [
        {"action": "Verify warehouse staffing", "priority": "Medium"},
        {"action": "Schedule early dispatch", "priority": "Low"}
    ],
    "High Discount Rate": [
        {"action": "Review order profitability", "priority": "Low"}
    ]
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
    causes = []

    for rule in ROOT_CAUSE_RULES:
        try:
            if rule["condition"](order_data):
                causes.append(rule["name"])
        except (KeyError, TypeError):
            continue

    return causes


# -----------------------------
# Module 2: Recommendation Generator
# -----------------------------
def generate_actions(causes: list, prediction: dict) -> list:
    """
    Generate actionable recommendations based on detected
    root causes and prediction results.

    Args:
        causes (list): Identified root causes.
        prediction (dict): Prediction result from predict_delay().

    Returns:
        list: List of recommendation dicts with action and priority.
    """
    recommendations = []
    seen_actions = set()

    # Step 1: Map root causes to recommendations
    for cause in causes:
        if cause in ACTION_MAP:
            for rec in ACTION_MAP[cause]:
                if rec["action"] not in seen_actions:
                    recommendations.append(rec)
                    seen_actions.add(rec["action"])

    # Step 2: Escalation rules based on risk level
    risk_level = prediction.get("risk_level", "Low")

    if risk_level == "Critical":
        escalations = [
            {"action": "Notify Supply Chain Head", "priority": "Urgent"},
            {"action": "Prepare customer communication", "priority": "High"}
        ]
        for esc in escalations:
            if esc["action"] not in seen_actions:
                recommendations.append(esc)
                seen_actions.add(esc["action"])

    elif risk_level == "High":
        esc = {"action": "Notify Warehouse Manager", "priority": "High"}
        if esc["action"] not in seen_actions:
            recommendations.append(esc)
            seen_actions.add(esc["action"])

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
OPERATIONAL_PRIORITY_MAP = {
    "Low": "Routine",
    "Medium": "Normal",
    "High": "Urgent",
    "Critical": "Immediate"
}


def load_impact_rules() -> dict:
    """Load impact estimation rules from config file."""
    with open(IMPACT_RULES_PATH, "r") as f:
        return json.load(f)


def estimate_business_impact(
    prediction: dict,
    recommendations: list
) -> dict:
    """
    Estimate the business impact of applying the recommendations.

    Args:
        prediction (dict): Prediction result from predict_delay().
        recommendations (list): List of recommendation dicts.

    Returns:
        dict: Business impact estimates.
    """
    impact_rules = load_impact_rules()
    risk_level = prediction.get("risk_level", "Low")

    total_delay_reduction = 0.0
    total_cost_saving = 0

    for rec in recommendations:
        action_name = rec.get("action", "")
        if action_name in impact_rules:
            rule = impact_rules[action_name]
            total_delay_reduction += rule.get("delay_reduction_days", 0)
            total_cost_saving += rule.get("cost_saving_usd", 0)

    return {
        "estimated_delay_reduction_days": round(total_delay_reduction, 1),
        "estimated_cost_saving_usd": total_cost_saving,
        "customer_risk": risk_level,
        "operational_priority": OPERATIONAL_PRIORITY_MAP.get(risk_level, "Normal"),
        "recommendations_count": len(recommendations)
    }


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
    recommendations = generate_actions(causes, prediction)

    # Step 4: Assign priority
    priority = assign_priority(prediction["risk_level"])

    # Step 5: Estimate business impact
    impact = estimate_business_impact(prediction, recommendations)

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
