"""
Centralized business constants and rule definitions for ChainIQ.
"""

# Risk level classification thresholds (upper_bound, level_name)
RISK_LEVELS = [
    (0.30, "Low"),
    (0.60, "Medium"),
    (0.80, "High"),
    (1.00, "Critical"),
]

# Default values for missing features in inference
DEFAULT_NUMERIC = 0.0
DEFAULT_CATEGORICAL = "Unknown"

# Features to drop from prediction vectors (ID/image/date columns)
REMOVE_FEATURES = [
    "Customer Id",
    "Order Customer Id",
    "Order Id",
    "Order Item Id",
    "Product Card Id",
    "Product Image",
    "order date (DateOrders)",
]

# Priority Mappings
PRIORITY_MAP = {
    "Low": "Low",
    "Medium": "Medium",
    "High": "High",
    "Critical": "Urgent",
}

OPERATIONAL_PRIORITY_MAP = {
    "Low": "Routine",
    "Medium": "Normal",
    "High": "Urgent",
    "Critical": "Immediate",
}

# Root Cause Rule Definitions
ROOT_CAUSE_RULES = [
    {
        "name": "Standard Shipping",
        "condition": lambda o: o.get("Shipping Mode") == "Standard Class",
    },
    {
        "name": "High Risk Region",
        "condition": lambda o: o.get("Market") in ["LATAM", "Africa"],
    },
    {
        "name": "Large Shipment Volume",
        "condition": lambda o: o.get("Order Item Quantity", 0) > 5,
    },
    {
        "name": "Long Delivery Window",
        "condition": lambda o: o.get("Days for shipment (scheduled)", 0) > 4,
    },
    {
        "name": "High Value Shipment",
        "condition": lambda o: o.get("Sales", 0) > 1000,
    },
    {
        "name": "Low Profit Margin",
        "condition": lambda o: o.get("profit_margin", 1) < 0.10,
    },
    {
        "name": "Weekend Order",
        "condition": lambda o: o.get("order_is_weekend", 0) == 1,
    },
    {
        "name": "High Discount Rate",
        "condition": lambda o: o.get("discount_rate", 0) > 0.20,
    },
]

# Action Mappings per Root Cause
ACTION_MAP = {
    "Standard Shipping": [
        {"action": "Upgrade to Express Shipping", "priority": "High"},
        {"action": "Review shipping SLA", "priority": "Medium"},
    ],
    "High Risk Region": [
        {"action": "Notify Regional Manager", "priority": "High"},
        {"action": "Increase shipment monitoring", "priority": "Medium"},
    ],
    "Large Shipment Volume": [
        {"action": "Allocate additional warehouse staff", "priority": "Medium"},
        {"action": "Split shipment into smaller batches", "priority": "Low"},
    ],
    "Long Delivery Window": [
        {"action": "Expedite processing at origin warehouse", "priority": "Medium"},
    ],
    "High Value Shipment": [
        {"action": "Enable priority handling", "priority": "High"},
        {"action": "Assign dedicated logistics coordinator", "priority": "Medium"},
    ],
    "Low Profit Margin": [
        {"action": "Review pricing strategy", "priority": "Medium"},
        {"action": "Reduce operational costs", "priority": "Low"},
    ],
    "Weekend Order": [
        {"action": "Verify warehouse staffing", "priority": "Medium"},
        {"action": "Schedule early dispatch", "priority": "Low"},
    ],
    "High Discount Rate": [
        {"action": "Review order profitability", "priority": "Low"},
    ],
}

# Mapping snake_case API payload keys to exact model column names
API_TO_MODEL_KEY = {
    "Type": "Type",
    "Market": "Market",
    "Shipping_Mode": "Shipping Mode",
    "Order_Item_Quantity": "Order Item Quantity",
    "Sales": "Sales",
    "profit_margin": "profit_margin",
    "scheduled_shipping_days": "scheduled_shipping_days",
    "order_is_weekend": "order_is_weekend",
    "discount_rate": "discount_rate",
}
