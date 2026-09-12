"""
Unit tests for inference engine (predict_delay.py).
"""

import pytest
from src.models.predict_delay import classify_risk, predict_delay


@pytest.fixture
def sample_order_data():
    return {
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


def test_classify_risk():
    assert classify_risk(0.15) == "Low"
    assert classify_risk(0.30) == "Low"
    assert classify_risk(0.45) == "Medium"
    assert classify_risk(0.60) == "Medium"
    assert classify_risk(0.75) == "High"
    assert classify_risk(0.80) == "High"
    assert classify_risk(0.90) == "Critical"
    assert classify_risk(1.00) == "Critical"


def test_predict_delay_returns_valid_prediction(sample_order_data):
    result = predict_delay(sample_order_data)

    assert "delay_probability" in result
    assert "risk_level" in result
    assert "confidence" in result
    assert "shap_attributions" in result

    prob = result["delay_probability"]
    assert isinstance(prob, float)
    assert 0.0 <= prob <= 1.0

    assert result["risk_level"] in ["Low", "Medium", "High", "Critical"]
    assert result["confidence"] == round(prob * 100, 2)
    assert isinstance(result["shap_attributions"], list)
