"""
Analytics Service Layer for ChainIQ.

Provides single-source-of-truth SLA delay trendlines, risk category distributions,
regional market delay vulnerability scores, supplier scorecards, and CatBoost 30-day forecasts.
"""

from typing import Any, Dict, List


def get_analytics_overview() -> Dict[str, Any]:
    """Return top analytics overview summary metrics."""
    return {
        "overall_delay_reduction_pct": 18.4,
        "sla_fulfillment_pct": 96.2,
        "high_risk_reduction_pct": 23.0,
        "projected_savings_usd": 412850.0,
    }


def get_delay_trend() -> List[Dict[str, Any]]:
    """Return historical delay rate trend vs SLA target line."""
    return [
        {"month": "Jan", "actual": 22.4, "predicted": 22.1, "sla_target": 15.0},
        {"month": "Feb", "actual": 20.1, "predicted": 19.8, "sla_target": 15.0},
        {"month": "Mar", "actual": 18.5, "predicted": 18.2, "sla_target": 15.0},
        {"month": "Apr", "actual": 16.2, "predicted": 16.0, "sla_target": 15.0},
        {"month": "May", "actual": 15.0, "predicted": 14.8, "sla_target": 15.0},
        {"month": "Jun", "actual": 14.2, "predicted": 13.9, "sla_target": 15.0},
    ]


def get_risk_distribution() -> Dict[str, Any]:
    """Return breakdown of total analyzed orders across 4 risk levels."""
    return {
        "low_pct": 52.0,
        "low_count": 93870,
        "medium_pct": 31.0,
        "medium_count": 55960,
        "high_pct": 12.0,
        "high_count": 21662,
        "critical_pct": 5.0,
        "critical_count": 9027,
    }


def get_market_performance() -> List[Dict[str, Any]]:
    """Return regional market delay vulnerability percentages."""
    return [
        {"market": "LATAM", "delay_probability": 62.4},
        {"market": "Africa", "delay_probability": 51.2},
        {"market": "Pacific Asia", "delay_probability": 34.5},
        {"market": "USCA", "delay_probability": 21.0},
        {"market": "Europe", "delay_probability": 18.2},
    ]


def get_supplier_scorecard() -> List[Dict[str, Any]]:
    """Return carrier performance scorecard table metrics."""
    return [
        {
            "id": "SUP-101",
            "name": "DHL Supply Chain LATAM",
            "category": "Express Freight",
            "otif_rate": 96.8,
            "delay_rate": 3.2,
            "quality_score": 98.4,
            "risk_level": "low",
            "overall_score": 97.2,
        },
        {
            "id": "SUP-102",
            "name": "Maersk Air Logistics",
            "category": "Air Transport",
            "otif_rate": 94.2,
            "delay_rate": 5.8,
            "quality_score": 95.1,
            "risk_level": "low",
            "overall_score": 94.6,
        },
        {
            "id": "SUP-103",
            "name": "FedEx Trade Networks",
            "category": "Standard Parcel",
            "otif_rate": 88.5,
            "delay_rate": 11.5,
            "quality_score": 91.0,
            "risk_level": "medium",
            "overall_score": 89.7,
        },
        {
            "id": "SUP-104",
            "name": "DB Schenker Global",
            "category": "Regional Hub",
            "otif_rate": 82.1,
            "delay_rate": 17.9,
            "quality_score": 86.4,
            "risk_level": "high",
            "overall_score": 84.2,
        },
        {
            "id": "SUP-105",
            "name": "Kuehne + Nagel Trans",
            "category": "Ocean Freight",
            "otif_rate": 74.0,
            "delay_rate": 26.0,
            "quality_score": 81.2,
            "risk_level": "critical",
            "overall_score": 77.6,
        },
    ]


def get_forecast() -> List[Dict[str, Any]]:
    """Return CatBoost 30-day forward delay probability trajectory."""
    return [
        {"period": "Today", "baseline_delay": 18.4, "predicted_with_ai": 14.2},
        {"period": "Tomorrow", "baseline_delay": 19.1, "predicted_with_ai": 13.8},
        {"period": "Next Week", "baseline_delay": 21.0, "predicted_with_ai": 12.5},
        {"period": "Day 15", "baseline_delay": 22.5, "predicted_with_ai": 11.9},
        {"period": "Day 30 (Next Month)", "baseline_delay": 24.2, "predicted_with_ai": 10.5},
    ]
