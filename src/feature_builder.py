"""
Feature Builder for ChainIQ.

The API exposes ~9 user-facing fields; the CatBoost model expects 42.
This module is the single place that knows the mapping. It fills
unspecified columns with safe defaults ("Unknown" for categoricals, 0.0 for
numerics) and derives secondary features (e.g. sales_per_unit).

Keeping this here means:
  - The Pydantic schema stays small and stable.
  - The ML pipeline can evolve (more features, fewer features) without
    touching the API contract.
  - The 42-feature shape is the only thing predict_delay() ever sees,
    so the inference code stays clean.
"""

import json
from typing import Any

from src.core.config import FEATURE_LIST_PATH
from src.core.constants import API_TO_MODEL_KEY, DEFAULT_CATEGORICAL, DEFAULT_NUMERIC
from src.core.logging import logger

_CATEGORICAL_FEATURES: set[str] = set()
_NUMERICAL_FEATURES: set[str] = set()


def _load_feature_lists() -> None:
    """Load the canonical feature list from disk (one-time, cached on the module)."""
    global _CATEGORICAL_FEATURES, _NUMERICAL_FEATURES
    if _CATEGORICAL_FEATURES or _NUMERICAL_FEATURES:
        return  # already loaded
    logger.info(f"Loading feature schema from {FEATURE_LIST_PATH}")
    with open(FEATURE_LIST_PATH, "r") as f:
        config = json.load(f)
    _CATEGORICAL_FEATURES = set(config.get("categorical_features", []))
    _NUMERICAL_FEATURES = set(config.get("numerical_features", []))
    logger.info(
        f"Feature schema loaded: {len(_CATEGORICAL_FEATURES)} categorical, "
        f"{len(_NUMERICAL_FEATURES)} numerical features."
    )


def build_features(api_input: dict[str, Any]) -> dict[str, Any]:
    """
    Translate a clean API payload into the 42-feature dict the model expects.

    Args:
        api_input: User-facing fields from PredictionRequest.model_dump().

    Returns:
        Dict with exactly the 42 keys the CatBoost model was trained on.
    """
    _load_feature_lists()

    # Step 1: Start with safe defaults for every model feature.
    features: dict[str, Any] = {}
    for col in _CATEGORICAL_FEATURES | _NUMERICAL_FEATURES:
        if col in _CATEGORICAL_FEATURES:
            features[col] = DEFAULT_CATEGORICAL
        else:
            features[col] = DEFAULT_NUMERIC

    # Step 2: Overlay caller's values, remapping API field names to model column names.
    for api_key, value in api_input.items():
        model_key = API_TO_MODEL_KEY.get(api_key, api_key)
        if model_key in features:
            features[model_key] = value

    # Step 3: Derive secondary features.
    qty = features.get("Order Item Quantity") or 0
    sales = features.get("Sales") or 0.0
    if qty and sales:
        features["sales_per_unit"] = round(float(sales) / float(qty), 2)
    if features.get("Order Item Quantity"):
        features["order_quantity"] = features["Order Item Quantity"]
    if features.get("Days for shipment (scheduled)") in (None, 0) and features.get("scheduled_shipping_days"):
        features["Days for shipment (scheduled)"] = features["scheduled_shipping_days"]

    return features
