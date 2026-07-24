import os
import json
import joblib
import pandas as pd

from catboost import CatBoostClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)
# Project Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "chainiq_processed.csv"
)

CONFIG_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "feature_config.json"
)

MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)
# -----------------------------
# Load Dataset
# -----------------------------
print("Loading processed dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset Loaded Successfully")
print(f"Shape: {df.shape}")

# -----------------------------
# Load Feature Configuration
# -----------------------------
print("\nLoading feature configuration...")

with open(CONFIG_PATH, "r") as f:
    feature_config = json.load(f)

safe_features = feature_config["SAFE_FEATURES"]
target = feature_config["TARGET"][0]
leakage_features = feature_config["LEAKAGE_FEATURES"]

print(f"Safe Features : {len(safe_features)}")
print(f"Leakage Features : {len(leakage_features)}")
print(f"Target : {target}")

# -----------------------------
# Prepare Features & Target
# -----------------------------
print("\nPreparing training data...")

# Keep only safe features that exist in the dataset
safe_features = [col for col in safe_features if col in df.columns]

REMOVE_FEATURES = [
    "Customer Id",
    "Order Customer Id",
    "Order Id",
    "Order Item Id",
    "Product Card Id",
    "Product Image",
    "order date (DateOrders)"
]

safe_features = [
    col for col in safe_features
    if col not in REMOVE_FEATURES
]

X = df[safe_features]
y = df[target]

print(f"Feature Matrix Shape : {X.shape}")
print(f"Target Shape         : {y.shape}")

# Find categorical columns for CatBoost
categorical_features = X.select_dtypes(include=["object"]).columns.tolist()

print(f"Categorical Features : {len(categorical_features)}")
print("Sample Categorical Columns:")
print(categorical_features[:10])

# -----------------------------
# Time-Based Train/Test Split
# -----------------------------
print("\nCreating time-based train/test split...")

# Sort by order date
df = df.sort_values(by="order date (DateOrders)")

# Recreate X and y after sorting
X = df[safe_features]
y = df[target]

split_index = int(len(df) * 0.80)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

print(f"Training Samples : {len(X_train)}")
print(f"Testing Samples  : {len(X_test)}")

# -----------------------------
# Train CatBoost Model
# -----------------------------
print("\nTraining CatBoost Model...")

cat_feature_indices = [
    X_train.columns.get_loc(col)
    for col in categorical_features
    if col in X_train.columns
]

model = CatBoostClassifier(
    iterations=500,
    learning_rate=0.05,
    depth=7,
    loss_function="Logloss",
    eval_metric="AUC",
    random_seed=42,
    verbose=100,
    early_stopping_rounds=50
)

model.fit(
    X_train,
    y_train,
    cat_features=cat_feature_indices,
    eval_set=(X_test, y_test),
    use_best_model=True
)

print("Model Training Completed!")

# -----------------------------
# Model Evaluation
# -----------------------------
# Predictions
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("\n===== MODEL EVALUATION =====")

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_prob)

print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")
print(f"ROC AUC  : {roc_auc:.4f}")

print("\nConfusion Matrix")
print(confusion_matrix(y_test, y_pred))

# -----------------------------
# Save Model & Metrics
# -----------------------------
# Save model
model_path = os.path.join(MODEL_DIR, "delay_risk_model.cbm")
model.save_model(model_path)
print(f"\nModel saved successfully to {model_path}")

# Save metrics JSON
metrics = {
    "accuracy": accuracy,
    "precision": precision,
    "recall": recall,
    "f1_score": f1,
    "roc_auc": roc_auc
}

metrics_path = os.path.join(MODEL_DIR, "delay_risk_metrics.json")
with open(metrics_path, "w") as f:
    json.dump(metrics, f, indent=4)
print(f"Metrics saved successfully to {metrics_path}")