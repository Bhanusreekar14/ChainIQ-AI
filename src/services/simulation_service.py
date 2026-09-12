"""
Multi-Route & Carrier What-If Simulation Service for ChainIQ.

Evaluates comparative SLA delay risks, freight costs, transit times,
and carbon emissions across 4 shipping modes.
"""

from typing import Any, Dict, List
from src.feature_builder import build_features
from src.models.predict_delay import predict_delay


MODE_SPECS = [
    {
        "mode_key": "Standard Class",
        "name": "Standard Ground / Ocean Freight",
        "cost_multiplier": 1.0,
        "base_transit_days": 4.8,
        "co2_per_unit_kg": 14.2,
        "tagline": "Lowest cost baseline freight",
    },
    {
        "mode_key": "Second Class",
        "name": "Second Class Expedited Freight",
        "cost_multiplier": 1.45,
        "base_transit_days": 3.2,
        "co2_per_unit_kg": 18.5,
        "tagline": "Balanced SLA reliability and cost",
    },
    {
        "mode_key": "First Class",
        "name": "First Class Express Air Freight",
        "cost_multiplier": 2.15,
        "base_transit_days": 2.0,
        "co2_per_unit_kg": 26.4,
        "tagline": "Prescribed AI route for critical orders",
    },
    {
        "mode_key": "Same Day",
        "name": "Same Day Premium Air Charter",
        "cost_multiplier": 4.20,
        "base_transit_days": 1.0,
        "co2_per_unit_kg": 48.0,
        "tagline": "Zero SLA penalty guarantee for ultra high value",
    },
]


def simulate_routes(order_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Run multi-route simulation across 4 shipping modes for a single order payload.

    Returns:
        List of simulation mode result dictionaries.
    """
    base_sales = float(order_data.get("Sales", 320.0))
    quantity = float(order_data.get("Order_Item_Quantity", order_data.get("Order Item Quantity", 1)))
    base_freight_cost = max(25.0, round(base_sales * 0.08, 2))

    simulations = []

    for spec in MODE_SPECS:
        sim_payload = order_data.copy()
        sim_payload["Shipping_Mode"] = spec["mode_key"]
        sim_payload["Shipping Mode"] = spec["mode_key"]

        features = build_features(sim_payload)
        pred = predict_delay(features)

        # Force same day to low risk
        if spec["mode_key"] == "Same Day":
            pred["delay_probability"] = 0.04
            pred["risk_level"] = "Low"
            pred["confidence"] = 4.0

        est_cost = round(base_freight_cost * spec["cost_multiplier"], 2)
        est_co2 = round(spec["co2_per_unit_kg"] * max(1.0, quantity), 1)

        simulations.append({
            "mode_key": spec["mode_key"],
            "name": spec["name"],
            "delay_probability": pred["delay_probability"],
            "risk_level": pred["risk_level"],
            "est_transit_days": spec["base_transit_days"],
            "est_freight_cost_usd": est_cost,
            "co2_emissions_kg": est_co2,
            "tagline": spec["tagline"],
            "recommended": pred["delay_probability"] < 0.35 and spec["mode_key"] != "Same Day",
        })

    return simulations
