"""
Integration tests for FastAPI endpoints (app.py).
"""

from fastapi.testclient import TestClient
from src.api.app import app

client = TestClient(app)


def test_home_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Welcome to ChainIQ AI"
    assert data["status"] == "running"


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["engine"] == "CatBoost"


def test_version_endpoint():
    response = client.get("/version")
    assert response.status_code == 200
    data = response.json()
    assert data["api_version"] == "1.0.0"
    assert data["features_count"] == 42


def test_predict_endpoint():
    payload = {
        "Type": "DEBIT",
        "Market": "LATAM",
        "Shipping_Mode": "Standard Class",
        "Order_Item_Quantity": 2,
        "Sales": 320.50,
        "profit_margin": 0.22,
        "scheduled_shipping_days": 4,
        "order_is_weekend": 0,
        "discount_rate": 0.04,
    }

    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "delay_probability" in data
    assert "risk_level" in data
    assert "confidence" in data
    assert 0.0 <= data["delay_probability"] <= 1.0


def test_recommend_endpoint():
    payload = {
        "Type": "DEBIT",
        "Market": "LATAM",
        "Shipping_Mode": "Standard Class",
        "Order_Item_Quantity": 6,
        "Sales": 1200.0,
        "profit_margin": 0.05,
        "scheduled_shipping_days": 5,
        "order_is_weekend": 1,
        "discount_rate": 0.25,
    }

    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "prediction" in data
    assert "possible_causes" in data
    assert "recommendations" in data
    assert "priority" in data
    assert "business_impact" in data
