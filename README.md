# ChainIQ AI

ChainIQ AI is an AI-powered supply chain decision intelligence platform that predicts shipment delays, explains operational risk, and recommends mitigation actions through a production-style API and modern analytics dashboard.

## Executive Summary

Global logistics teams often react to delays after SLA impact has already occurred. ChainIQ AI addresses this by combining machine learning inference, KPI analytics, and an assistant-style copilot to shift operations from reactive monitoring to proactive intervention.

## Core Capabilities

- Delay probability prediction using a trained CatBoost model
- Risk classification into Low, Medium, High, and Critical
- Recommendation engine with probable root causes and actionable interventions
- Dashboard KPIs for shipment risk and savings opportunity tracking
- Analytics views for trend monitoring, supplier scorecards, and forecast intelligence
- Report export pipeline for executive PDF and operations CSV outputs
- Copilot-style natural language Q and A for logistics decision support
- Token-based authentication flows for enterprise-style user sessions

## Technology Stack

- Backend: Python, FastAPI, Pydantic
- ML and data: CatBoost, pandas, NumPy, scikit-learn
- Frontend: React, TypeScript, Vite, Recharts
- Tooling: pytest, ESLint

## Repository Structure

```text
ChainIQ-AI/
├── frontend/
├── src/
├── data/
├── models/
├── notebooks/
│   └── ChainIQ_AI_Model_Training.ipynb
├── reports/
│   ├── ChainIQ_Executive_Report.pdf
│   └── ChainIQ_Shipment_Report.csv
├── screenshots/
│   ├── landing-page.png
│   ├── login.png
│   ├── dashboard.png
│   ├── analytics.png
│   ├── reports.png
│   └── copilot.png
├── docs/
│   ├── Project_Report.pdf
│   ├── Review1_PPT.pdf
│   └── Architecture.png
├── README.md
├── LICENSE
├── requirements.txt
├── .gitignore
└── docker-compose.yml (optional)
```

## System Architecture

ChainIQ AI is organized in three logical layers.

- Presentation layer: React dashboard pages for login, operations dashboard, analytics, reports, and copilot interactions
- Application layer: FastAPI endpoints for auth, prediction, recommendation, dashboard analytics, reports, and copilot orchestration
- Intelligence layer: CatBoost model inference, feature engineering, business impact rules, and recommendation logic

Add architecture diagram file to:

- docs/Architecture.png

## API Overview

Base URL (local):

- http://127.0.0.1:8000

Platform endpoints:

- GET / -> service welcome metadata
- GET /health -> health and model availability check
- GET /version -> API and model version metadata

Authentication endpoints:

- POST /auth/login
- POST /auth/logout
- GET /auth/me
- POST /auth/refresh

Prediction endpoints:

- POST /predict -> delay probability, risk level, confidence
- POST /recommend -> prediction + causes + actions + business impact

Dashboard endpoints:

- GET /dashboard/summary
- GET /dashboard/recent-shipments
- GET /dashboard/live-alerts
- GET /dashboard/ai-summary

Analytics endpoints:

- GET /analytics/overview
- GET /analytics/delay-trend
- GET /analytics/risk-distribution
- GET /analytics/market-performance
- GET /analytics/supplier-scorecard
- GET /analytics/forecast

Reports endpoints:

- GET /reports/summary
- GET /reports/monthly
- GET /reports/export/pdf
- GET /reports/export/csv

Copilot endpoints:

- POST /copilot/chat
- GET /copilot/suggestions
- GET /copilot/context

## Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### Backend Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.api.app:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Combined Frontend Dev Shortcut

From repository root:

```bash
npm run dev
```

## Model and Data Assets

- Model artifact: models/delay_risk_model.cbm
- Feature metadata: models/delay_model_features.json
- Model metrics: models/delay_model_metrics.json and models/delay_risk_metrics.json
- Processed data: data/processed/chainiq_processed.csv
- Feature config: data/processed/feature_config.json
- Impact rules: config/impact_rules.json

## Screenshots

Add UI captures in:

- screenshots/landing-page.png
- screenshots/login.png
- screenshots/dashboard.png
- screenshots/analytics.png
- screenshots/reports.png
- screenshots/copilot.png

## Reports, Notebook, and Demo

Required documentation assets:

- docs/Project_Report.pdf
- docs/Review1_PPT.pdf
- notebooks/ChainIQ_AI_Model_Training.ipynb

Optional demo asset:

- demo.gif or demo.mp4 at repository root

## Testing

Run backend tests:

```bash
pytest -q
```

Current test coverage areas include:

- API endpoints and response schemas
- Feature builder consistency for 42-model-feature output
- Prediction risk classification
- Recommendation generation and business impact logic

## Security Note

Current auth and token logic are suitable for demo and academic use. For production hardening, replace static secrets and in-memory user storage with a secure identity provider and signed JWT implementation.

## Authors

- ChainIQ Project Team

## License

This project is licensed under the MIT License. See LICENSE for details.