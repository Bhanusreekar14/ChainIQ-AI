"""
Unit tests for AI recommendation engine (recommendation_engine.py).
"""

import pytest
from src.agents.recommendation_engine import (
    analyze_root_causes,
    assign_priority,
    estimate_business_impact,
    generate_actions,
    generate_recommendation,
)


@pytest.fixture
def sample_order():
    return {
        "Shipping Mode": "Standard Class",
        "Market": "LATAM",
        "Order Item Quantity": 6,
        "Sales": 1200.0,
        "profit_margin": 0.05,
        "scheduled_shipping_days": 5,
        "discount_rate": 0.25,
        "order_is_weekend": 1,
    }


def test_analyze_root_causes(sample_order):
    causes = analyze_root_causes(sample_order)
    assert isinstance(causes, list)
    assert "Standard Shipping" in causes
    assert "High Risk Region" in causes
    assert "Large Shipment Volume" in causes
    assert "High Value Shipment" in causes
    assert "Low Profit Margin" in causes


def test_generate_actions():
    causes = ["Standard Shipping", "High Risk Region"]
    prediction = {"risk_level": "High", "delay_probability": 0.75}

    actions = generate_actions(causes, prediction)
    assert isinstance(actions, list)

    action_names = [a["action"] for a in actions]
    assert "Upgrade to Express Shipping" in action_names
    assert "Notify Warehouse Manager" in action_names  # Escalation for High risk


def test_assign_priority():
    assert assign_priority("Low") == "Low"
    assert assign_priority("Medium") == "Medium"
    assert assign_priority("High") == "High"
    assert assign_priority("Critical") == "Urgent"


def test_estimate_business_impact():
    prediction = {"risk_level": "High"}
    recommendations = [
        {"action": "Upgrade to Express Shipping"},
        {"action": "Notify Regional Manager"},
    ]

    impact = estimate_business_impact(prediction, recommendations)

    assert "estimated_delay_reduction_days" in impact
    assert "estimated_cost_saving_usd" in impact
    assert "customer_risk" in impact
    assert "operational_priority" in impact
    assert impact["customer_risk"] == "High"
    assert impact["operational_priority"] == "Urgent"
    assert impact["recommendations_count"] == 2


def test_generate_recommendation_schema(sample_order):
    rec = generate_recommendation(sample_order)

    assert "prediction" in rec
    assert "possible_causes" in rec
    assert "recommendations" in rec
    assert "priority" in rec
    assert "business_impact" in rec

    assert isinstance(rec["possible_causes"], list)
    assert isinstance(rec["recommendations"], list)
    assert isinstance(rec["business_impact"], dict)
