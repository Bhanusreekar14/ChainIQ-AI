"""
Unit tests for feature builder (feature_builder.py).
"""

from src.feature_builder import build_features


def test_build_features_always_produces_42_features():
    api_payload = {
        "Type": "DEBIT",
        "Market": "LATAM",
        "Shipping_Mode": "Standard Class",
        "Order_Item_Quantity": 2,
        "Sales": 500.0,
        "profit_margin": 0.20,
        "scheduled_shipping_days": 4,
        "order_is_weekend": 0,
        "discount_rate": 0.05,
    }

    features = build_features(api_payload)

    assert isinstance(features, dict)
    assert len(features) == 42


def test_build_features_remapping_and_defaults():
    api_payload = {
        "Shipping_Mode": "First Class",
        "Order_Item_Quantity": 4,
        "Sales": 400.0,
    }

    features = build_features(api_payload)

    # Remapped key checks
    assert features["Shipping Mode"] == "First Class"
    assert features["Order Item Quantity"] == 4

    # Derived feature check
    assert features["sales_per_unit"] == 100.0

    # Categorical default check
    assert features["Customer City"] == "Unknown"

    # Numeric default check
    assert features["Order Item Discount"] == 0.0
