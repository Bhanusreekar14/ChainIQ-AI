# ChainIQ

An AI-powered supply chain analysis and optimization system.

## Project Structure

- **`data/`**: Project data directory.
  - `raw/`: Raw, unmodified source data (e.g., DataCo Supply Chain dataset).
  - `processed/`: Cleaned and preprocessed data ready for modeling.
  - `synthetic/`: Generated synthetic data for testing and simulation.
- **`notebooks/`**: Jupyter notebooks for exploratory data analysis (EDA) and prototyping.
- **`src/`**: Source code of the application.
  - `preprocessing/`: Scripts for data cleaning, transformation, and ingestion.
  - `models/`: Machine learning models and inference logic.
  - `graph/`: Graph-based supply chain representations and network analysis.
  - `agents/`: AI agents for automated decision-making and planning.
  - `api/`: API endpoints for exposing system capabilities.
- **`frontend/`**: Frontend application code.
- **`models/`**: Serialized model checkpoints and artifacts.
- **`tests/`**: Unit and integration tests.
