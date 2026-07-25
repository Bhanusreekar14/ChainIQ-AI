"""
API route handlers for ChainIQ.

The model and feature config are loaded once at module import time
(singleton pattern). The first request after server boot pays the load
cost; every request after that is pure inference.
"""

from typing import List, Optional
from fastapi import APIRouter, Header, HTTPException, status

from src.agents.recommendation_engine import generate_recommendation
from src.api.schemas import (
    LoginRequest,
    TokenResponse,
    UserProfile,
    PredictionRequest,
    PredictionResponse,
    DashboardSummaryResponse,
    RecentShipment,
    LiveAlert,
    AiSummaryResponse,
    AnalyticsOverviewResponse,
    DelayTrendPoint,
    RiskDistributionResponse,
    MarketPerformanceItem,
    SupplierScorecardItem,
    ForecastPoint,
)
from src.core.logging import logger
from src.feature_builder import build_features
from src.models.predict_delay import load_model, predict_delay
from src.services.auth_service import authenticate_user, create_jwt_token, verify_token
from src.services.dashboard_service import (
    get_dashboard_summary,
    get_recent_shipments,
    get_live_alerts,
    get_ai_summary,
)
from src.services.analytics_service import (
    get_analytics_overview,
    get_delay_trend,
    get_risk_distribution,
    get_market_performance,
    get_supplier_scorecard,
    get_forecast,
)

_model = None


def _get_model():
    global _model
    if _model is None:
        _model = load_model()
    return _model


router = APIRouter()


# -----------------------------
# Auth Endpoints
# -----------------------------
@router.post(
    "/auth/login",
    response_model=TokenResponse,
    summary="Authenticate enterprise user and return JWT access token",
)
def login(request: LoginRequest) -> TokenResponse:
    """Validate user credentials and return Bearer JWT token + user profile."""
    logger.info(f"Processing /auth/login request for user: {request.email}")
    user_info = authenticate_user(request.email, request.password)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid corporate email or password credentials.",
        )

    token = create_jwt_token(user_info)
    return TokenResponse(
        access_token=token,
        token_type="Bearer",
        user=UserProfile(**user_info),
    )


@router.post("/auth/logout", summary="Invalidate user session token")
def logout():
    """Logout current user session."""
    return {"message": "Session logged out successfully"}


@router.get("/auth/me", response_model=UserProfile, summary="Get current authenticated user profile")
def me(authorization: Optional[str] = Header(None)) -> UserProfile:
    """Verify Bearer token and return active user profile."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")

    user_info = verify_token(authorization)
    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")

    return UserProfile(**user_info)


@router.post("/auth/refresh", response_model=TokenResponse, summary="Refresh access token")
def refresh_token(authorization: Optional[str] = Header(None)) -> TokenResponse:
    """Refresh active JWT session token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")

    user_info = verify_token(authorization)
    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid token for refresh")

    new_token = create_jwt_token(user_info)
    return TokenResponse(
        access_token=new_token,
        token_type="Bearer",
        user=UserProfile(**user_info),
    )


# -----------------------------
# Prediction & Inference Endpoints
# -----------------------------
@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict shipment delay probability for a single order",
)
def predict(request: PredictionRequest) -> PredictionResponse:
    """
    Takes a clean order payload, builds the 42-feature vector via
    feature_builder, and returns the CatBoost delay probability + risk level.
    """
    logger.info("Processing /predict request")
    _get_model()

    features = build_features(request.model_dump())
    result = predict_delay(features)

    logger.info(
        f"Prediction complete: delay_prob={result['delay_probability']}, "
        f"risk_level={result['risk_level']}"
    )

    return PredictionResponse(
        delay_probability=result["delay_probability"],
        risk_level=result["risk_level"],
        confidence=result["confidence"],
    )


@router.post(
    "/recommend",
    summary="Generate AI recommendations and business impact estimation",
)
def recommend(request: PredictionRequest):
    """
    Generate decision support recommendations and estimated business impact.
    """
    logger.info("Processing /recommend request")
    features = build_features(request.model_dump())
    recommendation = generate_recommendation(features)
    logger.info(
        f"Recommendation generated: causes_count={len(recommendation['possible_causes'])}, "
        f"recommendations_count={len(recommendation['recommendations'])}"
    )
    return recommendation


# -----------------------------
# Dashboard Endpoints
# -----------------------------
@router.get(
    "/dashboard/summary",
    response_model=DashboardSummaryResponse,
    summary="Get operational KPI summary for Dashboard Grid",
)
def dashboard_summary() -> DashboardSummaryResponse:
    """Return aggregated operational metrics feeding KPI cards."""
    logger.info("Processing /dashboard/summary request")
    data = get_dashboard_summary()
    return DashboardSummaryResponse(**data)


@router.get(
    "/dashboard/recent-shipments",
    response_model=List[RecentShipment],
    summary="Get high-risk recent shipments watchlist",
)
def recent_shipments() -> List[RecentShipment]:
    """Return recent orders flagged for delay risk monitoring."""
    logger.info("Processing /dashboard/recent-shipments request")
    data = get_recent_shipments()
    return [RecentShipment(**item) for item in data]


@router.get(
    "/dashboard/live-alerts",
    response_model=List[LiveAlert],
    summary="Get active route and environmental alerts",
)
def live_alerts() -> List[LiveAlert]:
    """Return active real-time weather and delay alerts."""
    logger.info("Processing /dashboard/live-alerts request")
    data = get_live_alerts()
    return [LiveAlert(**item) for item in data]


@router.get(
    "/dashboard/ai-summary",
    response_model=AiSummaryResponse,
    summary="Get executive CatBoost AI intelligence brief",
)
def ai_summary() -> AiSummaryResponse:
    """Return top AI decision synthesis and recommended interventions."""
    logger.info("Processing /dashboard/ai-summary request")
    data = get_ai_summary()
    return AiSummaryResponse(**data)


# -----------------------------
# Analytics Endpoints
# -----------------------------
@router.get(
    "/analytics/overview",
    response_model=AnalyticsOverviewResponse,
    summary="Get top executive analytics overview summary",
)
def analytics_overview() -> AnalyticsOverviewResponse:
    """Return overall delay reduction and SLA fulfillment metrics."""
    logger.info("Processing /analytics/overview request")
    data = get_analytics_overview()
    return AnalyticsOverviewResponse(**data)


@router.get(
    "/analytics/delay-trend",
    response_model=List[DelayTrendPoint],
    summary="Get historical delay rate trend vs SLA target line",
)
def analytics_delay_trend() -> List[DelayTrendPoint]:
    """Return monthly delay rates vs SLA target."""
    logger.info("Processing /analytics/delay-trend request")
    data = get_delay_trend()
    return [DelayTrendPoint(**item) for item in data]


@router.get(
    "/analytics/risk-distribution",
    response_model=RiskDistributionResponse,
    summary="Get breakdown of order counts across 4 risk levels",
)
def analytics_risk_distribution() -> RiskDistributionResponse:
    """Return risk level proportions (Low, Medium, High, Critical)."""
    logger.info("Processing /analytics/risk-distribution request")
    data = get_risk_distribution()
    return RiskDistributionResponse(**data)


@router.get(
    "/analytics/market-performance",
    response_model=List[MarketPerformanceItem],
    summary="Get regional market delay vulnerability percentage",
)
def analytics_market_performance() -> List[MarketPerformanceItem]:
    """Return regional market delay probability percentages."""
    logger.info("Processing /analytics/market-performance request")
    data = get_market_performance()
    return [MarketPerformanceItem(**item) for item in data]


@router.get(
    "/analytics/supplier-scorecard",
    response_model=List[SupplierScorecardItem],
    summary="Get enterprise supplier performance scorecard table",
)
def analytics_supplier_scorecard() -> List[SupplierScorecardItem]:
    """Return carrier performance metrics (OTIF, Delay Rate, Quality, Overall Score)."""
    logger.info("Processing /analytics/supplier-scorecard request")
    data = get_supplier_scorecard()
    return [SupplierScorecardItem(**item) for item in data]


@router.get(
    "/analytics/forecast",
    response_model=List[ForecastPoint],
    summary="Get CatBoost 30-day forward delay probability trajectory",
)
def analytics_forecast() -> List[ForecastPoint]:
    """Return 30-day predictive trajectory (Unmitigated Baseline vs Prescribed AI Pathway)."""
    logger.info("Processing /analytics/forecast request")
    data = get_forecast()
    return [ForecastPoint(**item) for item in data]
