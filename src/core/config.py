"""
Central configuration module for ChainIQ.
Uses pathlib.Path for clean, cross-platform path resolution.
"""

from pathlib import Path

# Project Root Directory (d:\ChainIQ)
BASE_DIR = Path(__file__).resolve().parents[2]

# Major Directories
MODEL_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"
CONFIG_DIR = BASE_DIR / "config"

# Specific File Paths
MODEL_PATH = MODEL_DIR / "delay_risk_model.cbm"
FEATURE_CONFIG_PATH = DATA_DIR / "processed" / "feature_config.json"
FEATURE_LIST_PATH = MODEL_DIR / "delay_model_features.json"
IMPACT_RULES_PATH = CONFIG_DIR / "impact_rules.json"
PROCESSED_DATA_PATH = DATA_DIR / "processed" / "chainiq_processed.csv"
