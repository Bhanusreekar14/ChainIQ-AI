import os
import json
import sys
import pandas as pd
import numpy as np

def load_data(file_path: str) -> pd.DataFrame:
    """Loads the dataset with latin1 encoding."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Raw dataset not found at {file_path}")
    print(f"Loading raw dataset from {file_path}...")
    return pd.read_csv(file_path, encoding="latin1")

def preprocess_and_engineer(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """
    Runs the preprocessing and feature engineering pipeline on the dataset.
    """
    original_shape = df.shape
    print(f"Original dataset shape: {original_shape}")

    # 1. Drop clearly unusable and redundant columns
    unusable_cols = ["Product Description", "Order Zipcode"]
    pii_cols = [
        "Customer Email",
        "Customer Password",
        "Customer Fname",
        "Customer Lname",
        "Customer Street"
    ]
    # Identical / duplicate / constant columns identified during profiling:
    redundant_cols = [
        "Product Status",         # Always 0 (constant)
        "Benefit per order",      # Identical to Order Profit Per Order
        "Order Item Cardprod Id", # Identical to Product Card Id
        "Category Id"             # Identical to Product Category Id
    ]
    
    cols_to_drop = unusable_cols + pii_cols + redundant_cols
    existing_cols_to_drop = [col for col in cols_to_drop if col in df.columns]
    
    df = df.drop(columns=existing_cols_to_drop)
    print(f"Dropped {len(existing_cols_to_drop)} columns: {existing_cols_to_drop}")

    # 2. Convert temporal columns to datetime
    date_cols = ["order date (DateOrders)", "shipping date (DateOrders)"]
    for col in date_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')
            print(f"Converted '{col}' to datetime.")
        else:
            raise KeyError(f"Required date column '{col}' is missing.")

    # 3. Feature Engineering from order date
    print("Engineering temporal features from order date...")
    order_dt = df["order date (DateOrders)"]
    df["order_year"] = order_dt.dt.year.astype(int)
    df["order_month"] = order_dt.dt.month.astype(int)
    df["order_day"] = order_dt.dt.day.astype(int)
    df["order_dayofweek"] = order_dt.dt.dayofweek.astype(int)
    df["order_hour"] = order_dt.dt.hour.astype(int)
    df["order_is_weekend"] = (order_dt.dt.dayofweek >= 5).astype(int)
    df["order_quarter"] = order_dt.dt.quarter.astype(int)

    # 4. Feature Engineering business features
    print("Engineering business features...")
    df["scheduled_shipping_days"] = df["Days for shipment (scheduled)"].astype(float)
    df["order_quantity"] = df["Order Item Quantity"].astype(float)
    df["sales_per_unit"] = df["Sales"] / df["Order Item Quantity"]
    # Replace division by zero/inf with NaN
    df["sales_per_unit"] = df["sales_per_unit"].replace([np.inf, -np.inf], np.nan)
    
    df["discount_rate"] = df["Order Item Discount Rate"].astype(float)
    df["profit_margin"] = df["Order Profit Per Order"] / df["Sales"]
    # Replace division by zero/inf with NaN (e.g. if Sales is 0)
    df["profit_margin"] = df["profit_margin"].replace([np.inf, -np.inf], np.nan)

    engineered_cols = [
        "order_year", "order_month", "order_day", "order_dayofweek",
        "order_hour", "order_is_weekend", "order_quarter",
        "scheduled_shipping_days", "order_quantity", "sales_per_unit",
        "discount_rate", "profit_margin"
    ]

    # 5. Handle missing values
    print("Handling missing values...")
    # Exclude target and date columns from simple imputation to preserve types
    exclude_impute = ["Late_delivery_risk", "order date (DateOrders)", "shipping date (DateOrders)"]
    
    numerical_cols = [
        col for col in df.columns 
        if pd.api.types.is_numeric_dtype(df[col]) and col not in exclude_impute
    ]
    categorical_cols = [
        col for col in df.columns 
        if not pd.api.types.is_numeric_dtype(df[col]) and col not in exclude_impute
    ]

    # Impute numerical columns with median
    for col in numerical_cols:
        median_val = df[col].median()
        # If all values are NaN (like Product Description was before drop), median might be NaN, fall back to 0
        if pd.isna(median_val):
            median_val = 0.0
        df[col] = df[col].fillna(median_val)

    # Impute categorical columns with "Unknown"
    for col in categorical_cols:
        df[col] = df[col].fillna("Unknown").astype(str)

    # Convert date columns back to string or keep as datetime. For CSV storage, pandas converts datetime automatically.
    
    # 6. Validation Checks
    print("Running validation checks...")
    
    # Check for duplicate rows and drop them
    initial_len = len(df)
    df = df.drop_duplicates()
    duplicates_dropped = initial_len - len(df)
    if duplicates_dropped > 0:
        print(f"Validation: Removed {duplicates_dropped} duplicate rows.")
    else:
        print("Validation: No duplicate rows detected.")

    # Target check
    target_col = "Late_delivery_risk"
    if target_col not in df.columns:
        raise KeyError(f"Target column '{target_col}' not found in DataFrame.")
    
    target_vals = set(df[target_col].dropna().unique())
    assert target_vals.issubset({0, 1}), f"Validation Error: Target has invalid classes: {target_vals}"
    print(f"Validation: Target '{target_col}' classes verified to be only 0 and 1: {target_vals}")

    # Infinite values check
    for col in engineered_cols:
        inf_count = np.isinf(df[col]).sum()
        assert inf_count == 0, f"Validation Error: Column '{col}' contains {inf_count} infinite values."
    print("Validation: Checked engineered features, no infinite values found.")

    # Missing values check
    remaining_missing = df.isnull().sum().sum()
    # Note: datetime columns with NaT count as missing, but we verified during profiling they have 0 missing values.
    print(f"Validation: Remaining missing values in dataset: {remaining_missing}")

    # 7. Identify leakage and safe features
    # TARGET
    target_list = [target_col]
    
    # LEAKAGE FEATURES
    leakage_list = [
        "Delivery Status",
        "Days for shipping (real)",
        "shipping date (DateOrders)",
        "Order Status"
    ]
    
    # SAFE FEATURES (All remaining columns excluding target and leakage)
    safe_list = [
        col for col in df.columns 
        if col not in target_list and col not in leakage_list
    ]

    feature_config = {
        "TARGET": target_list,
        "LEAKAGE_FEATURES": leakage_list,
        "SAFE_FEATURES": safe_list
    }

    return df, feature_config

def save_outputs(df: pd.DataFrame, config: dict, processed_csv_path: str, config_json_path: str):
    """Saves the preprocessed dataset to CSV and the feature config to JSON."""
    os.makedirs(os.path.dirname(processed_csv_path), exist_ok=True)
    os.makedirs(os.path.dirname(config_json_path), exist_ok=True)
    
    # Save CSV
    print(f"Saving preprocessed dataset to: {processed_csv_path}...")
    df.to_csv(processed_csv_path, index=False)
    print("Dataset saved successfully.")
    
    # Save JSON
    print(f"Saving feature configuration to: {config_json_path}...")
    with open(config_json_path, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=4)
    print("Feature configuration saved successfully.")

def main():
    raw_path = "data/raw/DataCoSupplyChainDataset.csv"
    processed_path = "data/processed/chainiq_processed.csv"
    config_path = "data/processed/feature_config.json"
    
    try:
        df = load_data(raw_path)
        original_shape = df.shape
        
        processed_df, config = preprocess_and_engineer(df)
        
        save_outputs(processed_df, config, processed_path, config_path)
        
        # Output summary print statements as requested
        print("\n" + "=" * 80)
        print("PREPROCESSING PIPELINE SUMMARY")
        print("=" * 80)
        print(f"Original Shape:            {original_shape}")
        print(f"Processed Shape:           {processed_df.shape}")
        
        # List dropped columns
        dropped = [
            "Product Description", "Order Zipcode", "Customer Email", 
            "Customer Password", "Customer Fname", "Customer Lname", 
            "Customer Street", "Product Status", "Benefit per order", 
            "Order Item Cardprod Id", "Category Id"
        ]
        print(f"Dropped Columns Count:     {len(dropped)}")
        print(f"Dropped Columns List:      {dropped}")
        
        # Engineered features list
        engineered = [
            "order_year", "order_month", "order_day", "order_dayofweek",
            "order_hour", "order_is_weekend", "order_quarter",
            "scheduled_shipping_days", "order_quantity", "sales_per_unit",
            "discount_rate", "profit_margin"
        ]
        print(f"Engineered Features Count: {len(engineered)}")
        print(f"Engineered Features List:  {engineered}")
        
        print(f"Safe Features Count:       {len(config['SAFE_FEATURES'])}")
        print(f"Leakage Features Count:    {len(config['LEAKAGE_FEATURES'])}")
        print(f"Missing Values Remaining:  {processed_df.isnull().sum().sum()}")
        
        # Target distribution
        target_counts = processed_df[config["TARGET"][0]].value_counts()
        target_pcts = processed_df[config["TARGET"][0]].value_counts(normalize=True) * 100
        print("Target Distribution ('Late_delivery_risk'):")
        for val, count in target_counts.items():
            print(f"  - Class {val}: {count} ({target_pcts[val]:.2f}%)")
        print("=" * 80)

    except Exception as e:
        print(f"Pipeline Execution Failed: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
