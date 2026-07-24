import os
import json
import sys
import pandas as pd
import numpy as np

def analyze_dataset(file_path: str, output_path: str):
    """
    Loads and analyzes the DataCo Supply Chain dataset, prints statistical summaries,
    and saves a JSON summary of the findings.
    
    Args:
        file_path: Path to the raw CSV dataset.
        output_path: Path where the processed JSON summary should be saved.
    """
    print("=" * 80)
    print("ChainIQ Data Analysis Service Starting...")
    print("=" * 80)
    
    # 1. Path Verification
    if not os.path.exists(file_path):
        print(f"Error: Raw dataset not found at {file_path}", file=sys.stderr)
        sys.exit(1)
        
    # 2. Loading the CSV Safely
    try:
        print(f"Loading dataset from: {file_path} (this might take a few seconds)...")
        # Load the CSV with latin1 encoding as requested
        df = pd.read_csv(file_path, encoding="latin1")
        print("Dataset loaded successfully.")
    except Exception as e:
        print(f"Error loading dataset: {e}", file=sys.stderr)
        sys.exit(1)

    # 3. Shape, Rows, Columns
    shape = df.shape
    total_rows, total_cols = shape
    print(f"\n[1] Dataset Shape:")
    print(f"    - Total Rows: {total_rows}")
    print(f"    - Total Columns: {total_cols}")

    # 4. All Column Names
    all_columns = list(df.columns)
    print(f"\n[2] All Column Names ({len(all_columns)} columns):")
    print("    " + ", ".join(all_columns))

    # 5. Data Types
    dtypes_dict = df.dtypes.astype(str).to_dict()
    print("\n[3] Data Types:")
    for col, dtype in dtypes_dict.items():
        print(f"    - {col}: {dtype}")

    # 6. Missing Value Count and Percentage
    missing_counts = df.isnull().sum()
    missing_percentage = (missing_counts / total_rows) * 100
    missing_info = pd.DataFrame({
        'Missing Count': missing_counts,
        'Percentage (%)': missing_percentage
    })
    # Filter columns with missing values > 0
    missing_cols_df = missing_info[missing_info['Missing Count'] > 0]
    
    print("\n[4] Missing Values (only columns with missing values):")
    if missing_cols_df.empty:
        print("    No missing values found in the dataset.")
    else:
        for col, row in missing_cols_df.iterrows():
            print(f"    - {col}: {int(row['Missing Count'])} missing ({row['Percentage (%)']:.4f}%)")

    # 7. Duplicate Row Count
    duplicate_count = int(df.duplicated().sum())
    print(f"\n[5] Duplicate Rows Count: {duplicate_count}")

    # 8. Target distribution for "Late_delivery_risk"
    target_col = "Late_delivery_risk"
    if target_col in df.columns:
        target_distribution = df[target_col].value_counts().to_dict()
        target_pct = df[target_col].value_counts(normalize=True).to_dict()
        print(f"\n[6] Target Distribution for '{target_col}':")
        for val, count in target_distribution.items():
            pct = target_pct[val] * 100
            print(f"    - Class {val}: {count} rows ({pct:.2f}%)")
    else:
        print(f"\n[6] Warning: Target column '{target_col}' not found in the dataset.", file=sys.stderr)
        target_distribution = {}

    # 9. Unique Values for "Delivery Status", "Shipping Mode", and "Market"
    unique_value_targets = ["Delivery Status", "Shipping Mode", "Market"]
    unique_vals_summary = {}
    print("\n[7] Unique Values for Key Categorical Columns:")
    for col in unique_value_targets:
        if col in df.columns:
            unique_list = df[col].dropna().unique().tolist()
            unique_vals_summary[col] = unique_list
            print(f"    - {col} ({len(unique_list)} unique values):")
            for item in unique_list:
                item_count = df[col].value_counts()[item]
                item_pct = (item_count / total_rows) * 100
                print(f"      * '{item}': {item_count} ({item_pct:.2f}%)")
        else:
            print(f"    - Warning: Column '{col}' not found in the dataset.", file=sys.stderr)

    # 10. Analyze the Important Columns List
    important_columns = [
        "Days for shipping (real)",
        "Days for shipment (scheduled)",
        "Late_delivery_risk",
        "Delivery Status",
        "Shipping Mode",
        "Order Item Quantity",
        "Sales",
        "Order Item Total",
        "Order Profit Per Order",
        "Product Category Id",
        "Order Region",
        "order date (DateOrders)",
        "shipping date (DateOrders)"
    ]
    
    # Check if any important columns are missing
    missing_important_cols = [col for col in important_columns if col not in df.columns]
    if missing_important_cols:
        print(f"\nWarning: The following requested important columns are missing from the dataset: {missing_important_cols}", file=sys.stderr)
    
    existing_important_cols = [col for col in important_columns if col in df.columns]
    
    print("\n[8] Detailed Analysis of Important Columns:")
    
    numerical_summaries = {}
    categorical_summaries = {}
    date_summaries = {}
    
    for col in existing_important_cols:
        # Determine column type (Numerical, Datetime or Categorical)
        if "date" in col.lower() or "dateorders" in col.lower():
            # Try to convert to datetime for analysis
            try:
                temp_date = pd.to_datetime(df[col], errors='coerce')
                min_date = temp_date.min()
                max_date = temp_date.max()
                min_date_str = min_date.strftime('%Y-%m-%d %H:%M:%S') if pd.notnull(min_date) else "None"
                max_date_str = max_date.strftime('%Y-%m-%d %H:%M:%S') if pd.notnull(max_date) else "None"
                
                date_summaries[col] = {
                    "min_date": min_date_str,
                    "max_date": max_date_str,
                    "invalid_dates_count": int(temp_date.isna().sum())
                }
                print(f"    - {col} (Temporal):")
                print(f"      * Min Date: {min_date_str}")
                print(f"      * Max Date: {max_date_str}")
                print(f"      * Invalid Dates: {date_summaries[col]['invalid_dates_count']}")
            except Exception as e:
                print(f"    - {col} (Temporal parsing failed): {e}")
                date_summaries[col] = {"error": str(e)}
                
        elif pd.api.types.is_numeric_dtype(df[col]) and col != "Late_delivery_risk" and col != "Product Category Id":
            # Treat as continuous numerical column
            stats = df[col].describe()
            numerical_summaries[col] = {
                "mean": float(stats["mean"]),
                "std": float(stats["std"]),
                "min": float(stats["min"]),
                "25%": float(stats["25%"]),
                "50%": float(stats["50%"]),
                "75%": float(stats["75%"]),
                "max": float(stats["max"])
            }
            print(f"    - {col} (Numerical):")
            print(f"      * Mean: {stats['mean']:.4f} | Std: {stats['std']:.4f}")
            print(f"      * Min: {stats['min']:.4f} | Max: {stats['max']:.4f}")
            print(f"      * Median (50%): {stats['50%']:.4f}")
            
        else:
            # Treat as categorical/discrete (includes Late_delivery_risk and Product Category Id)
            top_val_counts = df[col].value_counts(dropna=False).head(10).to_dict()
            # Convert keys to string for JSON serialization
            categorical_summaries[col] = {str(k): int(v) for k, v in top_val_counts.items()}
            print(f"    - {col} (Categorical/Discrete - Top Value Counts):")
            for val, val_count in top_val_counts.items():
                val_pct = (val_count / total_rows) * 100
                print(f"      * '{val}': {val_count} ({val_pct:.2f}%)")

    # 11. Compile JSON Summary
    summary_data = {
        "dataset_metadata": {
            "file_path": file_path,
            "total_rows": total_rows,
            "total_columns": total_cols,
            "duplicate_rows": duplicate_count
        },
        "columns": {
            "all_columns": all_columns,
            "dtypes": dtypes_dict
        },
        "missing_values": {
            col: {
                "count": int(row['Missing Count']),
                "percentage": float(row['Percentage (%)'])
            }
            for col, row in missing_cols_df.iterrows()
        },
        "target_distribution": {
            str(k): int(v) for k, v in target_distribution.items()
        },
        "unique_values_key_columns": unique_vals_summary,
        "feature_analyses": {
            "numerical": numerical_summaries,
            "categorical_discrete": categorical_summaries,
            "temporal": date_summaries
        }
    }

    # Ensure processed directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save to file
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(summary_data, f, indent=4)
        print(f"\n[9] Saved JSON Summary successfully to: {output_path}")
    except Exception as e:
        print(f"Error saving JSON Summary: {e}", file=sys.stderr)

    print("\n" + "=" * 80)
    print("Data Analysis Completed Successfully.")
    print("=" * 80)

if __name__ == "__main__":
    raw_dataset = "data/raw/DataCoSupplyChainDataset.csv"
    processed_summary = "data/processed/dataset_summary.json"
    analyze_dataset(raw_dataset, processed_summary)
