"""
Batch CSV Prediction Service for ChainIQ.

Ingests uploaded CSV shipment files, executes bulk CatBoost delay predictions,
and generates batch intelligence summaries + annotated CSV exports.
"""

import io
from typing import Any, Dict, List
import pandas as pd

from src.agents.recommendation_engine import analyze_root_causes
from src.feature_builder import build_features
from src.models.predict_delay import predict_delay


def process_batch_csv(file_bytes: bytes) -> Dict[str, Any]:
    """
    Parse uploaded CSV file, run CatBoost inference on every row,
    and return batch metrics summary and annotated order list.
    """
    df = pd.read_csv(io.BytesIO(file_bytes))

    processed_orders: List[Dict[str, Any]] = []
    high_risk_count = 0
    total_delay_prob = 0.0

    for idx, row in df.iterrows():
        raw_dict = row.to_dict()

        # Build feature vector
        features = build_features(raw_dict)
        pred = predict_delay(features)

        delay_prob = pred["delay_probability"]
        risk_lvl = pred["risk_level"]
        total_delay_prob += delay_prob

        if risk_lvl in ["High", "Critical"]:
            high_risk_count += 1

        root_causes = analyze_root_causes(features)

        order_item = {
            "row_index": idx + 1,
            "order_id": str(raw_dict.get("Order Id", raw_dict.get("order_id", f"ORD-BATCH-{idx+1}"))),
            "type": str(raw_dict.get("Type", "DEBIT")),
            "market": str(raw_dict.get("Market", "LATAM")),
            "shipping_mode": str(raw_dict.get("Shipping Mode", raw_dict.get("Shipping_Mode", "Standard Class"))),
            "sales_usd": float(raw_dict.get("Sales", 320.0)),
            "delay_probability": delay_prob,
            "risk_level": risk_lvl,
            "confidence": pred["confidence"],
            "top_root_cause": root_causes[0] if root_causes else "None",
            "shap_attributions": pred.get("shap_attributions", []),
        }
        processed_orders.append(order_item)

    total_orders = len(processed_orders)
    avg_delay_prob = round(total_delay_prob / total_orders, 4) if total_orders > 0 else 0.0

    return {
        "total_orders": total_orders,
        "high_risk_orders": high_risk_count,
        "average_delay_probability": avg_delay_prob,
        "orders": processed_orders,
    }


def generate_annotated_batch_csv(processed_orders: List[Dict[str, Any]]) -> str:
    """
    Generate CSV string output for processed batch predictions.
    """
    export_df = pd.DataFrame(processed_orders)
    if "shap_attributions" in export_df.columns:
        export_df.drop(columns=["shap_attributions"], inplace=True)
    return export_df.to_csv(index=False)
