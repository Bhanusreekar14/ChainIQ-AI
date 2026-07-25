"""
Model Registry for ChainIQ.

Single source of truth for the trained CatBoost model and the feature
configuration it expects. Both are loaded lazily on first access and
cached on the module — every subsequent caller reuses the same
instance instead of re-reading the .cbm from disk.
"""

import json
from threading import Lock
from typing import Any

from catboost import CatBoostClassifier

from src.core.config import FEATURE_CONFIG_PATH, MODEL_PATH
from src.core.logging import logger

# -----------------------------
# Internal state
# -----------------------------
_model: CatBoostClassifier | None = None
_feature_config: dict[str, Any] | None = None
_lock = Lock()


# -----------------------------
# Public API
# -----------------------------
def get_model() -> CatBoostClassifier:
    """Return the loaded CatBoost model, loading it on first call."""
    global _model
    if _model is None:
        with _lock:
            if _model is None:  # double-checked locking
                logger.info(f"Loading CatBoost model from {MODEL_PATH}")
                _model = CatBoostClassifier()
                _model.load_model(str(MODEL_PATH))
                logger.info("CatBoost model loaded successfully.")
    return _model


def get_feature_config() -> dict[str, Any]:
    """Return the loaded feature configuration JSON."""
    global _feature_config
    if _feature_config is None:
        with _lock:
            if _feature_config is None:
                logger.info(f"Loading feature configuration from {FEATURE_CONFIG_PATH}")
                with open(FEATURE_CONFIG_PATH, "r") as f:
                    _feature_config = json.load(f)
                logger.info("Feature configuration loaded successfully.")
    return _feature_config


def get_safe_features() -> list[str]:
    """Return the list of feature names the model was trained on."""
    return get_feature_config()["SAFE_FEATURES"]


def reset_for_tests() -> None:
    """Drop the cached singletons. Used by tests; do not call in prod."""
    global _model, _feature_config
    with _lock:
        _model = None
        _feature_config = None
