"""
ChainIQ AI - FastAPI Backend Application.
Enterprise-grade REST API for shipment delay prediction and decision intelligence.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import router
from src.core.logging import logger

app = FastAPI(
    title="ChainIQ AI",
    description="AI-Powered Supply Chain Decision Intelligence Platform",
    version="1.0.0",
)

# Register routes
app.include_router(router)

# CORS middleware for React dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    logger.info("ChainIQ AI Backend Server Starting Up...")


@app.get("/")
def home():
    """Welcome endpoint."""
    return {
        "message": "Welcome to ChainIQ AI",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model": "delay_risk_model.cbm",
        "engine": "CatBoost",
    }


@app.get("/version")
def version():
    """Model version endpoint."""
    return {
        "api_version": "1.0.0",
        "model_version": "baseline_v1",
        "framework": "CatBoost",
        "features_count": 42,
    }
