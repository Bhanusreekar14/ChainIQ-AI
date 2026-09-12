"""
API route handlers for ChainIQ.

The model and feature config are loaded once at module import time
(singleton pattern). The first request after server boot pays the load
cost; every request after that is pure inference.
"""

from typing import List, Optional
from fastapi import APIRouter, File, Header, HTTPException, Response, UploadFile, status

from src.agents.recommendation_engine import generate_recommendation
from src.api.schemas import (
    LoginRequest,
    TokenResponse,
    UserProfile,
    PredictionRequest,
    PredictionResponse,
    BatchPredictionResponse,
    SimulateRouteItem,
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
    ReportSummaryResponse,
    MonthlyReportItem,
    CopilotChatRequest,
    CopilotChatResponse,
    CopilotSuggestionsResponse,
    CopilotContextResponse,
    WorkforceDashboardResponse,
    VacancyItem,
    CandidateRankItem,
    ResumeUploadResponse,
    CandidateAnalyzeRequest,
    CandidateRankRequest,
    CopilotWorkforceRequest,
    CopilotWorkforceResponse,
)
from src.core.logging import logger
from src.feature_builder import build_features
from src.models.predict_delay import load_model, predict_delay
from src.services.auth_service import authenticate_user, create_jwt_token, verify_token
from src.services.batch_service import process_batch_csv
from src.services.simulation_service import simulate_routes
from src.services.resume_parser import parse_resume_text
from src.services.jd_parser import parse_job_description
from src.services.workforce_service import (
    get_workforce_dashboard_summary,
    MOCK_VACANCIES,
    get_ranked_candidates_for_vacancy,
    export_candidate_evaluation_pdf,
    process_workforce_copilot_query,
)
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
from src.services.report_service import (
    get_summary_report,
    get_monthly_report,
    export_pdf_report,
    export_csv_report,
)
from src.services.copilot_service import (
    process_query,
    get_quick_suggestions,
    get_dashboard_context,
    get_analytics_context,
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
    feature_builder, and returns the CatBoost delay probability + risk level + SHAP attributions.
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
        shap_attributions=result.get("shap_attributions"),
    )


@router.post(
    "/predict/batch",
    response_model=BatchPredictionResponse,
    summary="Bulk predict delay probability for uploaded CSV shipment orders",
)
async def predict_batch(file: UploadFile = File(...)) -> BatchPredictionResponse:
    """Ingest CSV file, run bulk CatBoost predictions, and return aggregated metrics."""
    logger.info(f"Processing /predict/batch file: {file.filename}")
    content = await file.read()
    batch_result = process_batch_csv(content)
    return BatchPredictionResponse(**batch_result)


@router.post(
    "/simulate/routes",
    response_model=List[SimulateRouteItem],
    summary="Multi-route & carrier what-if simulator (Cost, Transit, SLA Risk, CO2)",
)
def simulate_order_routes(request: PredictionRequest) -> List[SimulateRouteItem]:
    """Run comparative simulation across 4 shipping modes for a single order payload."""
    logger.info("Processing /simulate/routes request")
    results = simulate_routes(request.model_dump())
    return [SimulateRouteItem(**item) for item in results]


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


# -----------------------------
# Reports Endpoints
# -----------------------------
@router.get(
    "/reports/summary",
    response_model=ReportSummaryResponse,
    summary="Get aggregated executive summary report metrics",
)
def reports_summary() -> ReportSummaryResponse:
    """Return aggregated executive report metrics."""
    logger.info("Processing /reports/summary request")
    data = get_summary_report()
    return ReportSummaryResponse(**data)


@router.get(
    "/reports/monthly",
    response_model=List[MonthlyReportItem],
    summary="Get monthly historical logistics performance report",
)
def reports_monthly() -> List[MonthlyReportItem]:
    """Return 6-month historical monthly breakdown."""
    logger.info("Processing /reports/monthly request")
    data = get_monthly_report()
    return [MonthlyReportItem(**item) for item in data]


@router.get(
    "/reports/export/pdf",
    summary="Download Executive Performance Report as PDF file",
)
def reports_export_pdf():
    """Generate and return Executive Performance Report PDF document."""
    logger.info("Processing /reports/export/pdf request")
    pdf_bytes = export_pdf_report()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=ChainIQ_Executive_Report.pdf"
        },
    )


@router.get(
    "/reports/export/csv",
    summary="Download Logistics Performance Report as CSV file",
)
def reports_export_csv():
    """Generate and return Logistics Performance Report CSV file."""
    logger.info("Processing /reports/export/csv request")
    csv_content = export_csv_report()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=ChainIQ_Shipment_Report.csv"
        },
    )


# -----------------------------
# Copilot Endpoints
# -----------------------------
@router.post(
    "/copilot/chat",
    response_model=CopilotChatResponse,
    summary="Process natural language supply chain query with ChainIQ Copilot",
)
def copilot_chat(request: CopilotChatRequest) -> CopilotChatResponse:
    """Process natural language operational query and return text answer + rich UI card payload."""
    logger.info(f"Processing /copilot/chat query: '{request.query}'")
    history_dicts = [item.model_dump() for item in request.history] if request.history else None
    result = process_query(request.query, history_dicts)
    return CopilotChatResponse(**result)


@router.get(
    "/copilot/suggestions",
    response_model=CopilotSuggestionsResponse,
    summary="Get quick prompt suggestion chips for Copilot UI",
)
def copilot_suggestions() -> CopilotSuggestionsResponse:
    """Return top dynamic prompt suggestion chips."""
    logger.info("Processing /copilot/suggestions request")
    suggestions = get_quick_suggestions()
    return CopilotSuggestionsResponse(suggestions=suggestions)


@router.get(
    "/copilot/context",
    response_model=CopilotContextResponse,
    summary="Get full supply chain operational telemetry context",
)
def copilot_context() -> CopilotContextResponse:
    """Return aggregated dashboard and analytics context."""
    logger.info("Processing /copilot/context request")
    dash = get_dashboard_context()
    analytics = get_analytics_context()
    return CopilotContextResponse(dashboard=dash, analytics=analytics)


# -----------------------------
# Workforce Intelligence & Talent Replacement Routes (v2.0)
# -----------------------------
@router.get(
    "/workforce/dashboard",
    response_model=WorkforceDashboardResponse,
    summary="Get executive workforce KPIs, active vacancies, and performance threshold alerts",
)
def get_workforce_dashboard() -> WorkforceDashboardResponse:
    """Returns total employees, vacancies, screened candidates, avg match %, and alerts."""
    logger.info("Processing /workforce/dashboard request")
    summary = get_workforce_dashboard_summary()
    return WorkforceDashboardResponse(**summary)


@router.get(
    "/vacancies",
    response_model=List[VacancyItem],
    summary="List all active job role vacancies created by resignation, retirement, or termination",
)
def get_vacancies() -> List[VacancyItem]:
    """Returns list of open positions requiring AI candidate matching."""
    logger.info("Processing /vacancies request")
    return [VacancyItem(**v.to_dict()) for v in MOCK_VACANCIES]


@router.post(
    "/resume/upload",
    response_model=ResumeUploadResponse,
    summary="Upload PDF, DOCX, or TXT candidate resume for NLP skill extraction",
)
async def upload_resume(file: UploadFile = File(...)) -> ResumeUploadResponse:
    """Ingests resume file and extracts structured skills, experience, and certifications."""
    logger.info(f"Processing /resume/upload file: {file.filename}")
    content_bytes = await file.read()
    raw_text = content_bytes.decode("utf-8", errors="ignore")
    parsed = parse_resume_text(raw_text, filename=file.filename or "resume.pdf")
    return ResumeUploadResponse(
        message="Resume successfully parsed and indexed into candidate database",
        parsed_candidate=parsed,
    )


@router.post(
    "/candidate/analyze",
    summary="Parse Job Description text and create AI Job Profile",
)
def analyze_job_profile(request: CandidateAnalyzeRequest):
    """Converts raw Job Description text into structured AI skill profile."""
    logger.info(f"Processing /candidate/analyze for role: {request.role_title}")
    profile = parse_job_description(request.jd_text, request.role_title)
    return profile


@router.post(
    "/candidate/rank",
    response_model=List[CandidateRankItem],
    summary="Execute multi-dimensional AI semantic matching and candidate ranking",
)
def rank_candidates(request: CandidateRankRequest) -> List[CandidateRankItem]:
    """Calculates Skill, Experience, Education, and Certification match scores + AI explanation."""
    logger.info(f"Processing /candidate/rank for vacancy: {request.vacancy_id}")
    ranked = get_ranked_candidates_for_vacancy(request.vacancy_id)
    return [CandidateRankItem(**item) for item in ranked]


@router.get(
    "/candidate/top",
    response_model=List[CandidateRankItem],
    summary="Get top ranked candidates across all open supply chain vacancies",
)
def get_top_candidates(vacancy_id: Optional[str] = "VAC-201") -> List[CandidateRankItem]:
    """Returns candidates matching or exceeding 75% compatibility threshold."""
    logger.info(f"Processing /candidate/top request for vacancy_id={vacancy_id}")
    ranked = get_ranked_candidates_for_vacancy(vacancy_id or "VAC-201")
    return [CandidateRankItem(**item) for item in ranked]


@router.get(
    "/candidate/report",
    summary="Generate downloadable Candidate Evaluation & Talent Replacement PDF Report",
)
def get_candidate_report():
    """Returns binary PDF document evaluating top candidates and prescribed HR steps."""
    logger.info("Processing /candidate/report PDF download")
    pdf_bytes = export_candidate_evaluation_pdf()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=ChainIQ_Talent_Evaluation_Report_{Date_Now_Str()}.pdf"
        },
    )


def Date_Now_Str():
    from datetime import datetime
    return datetime.now().strftime("%Y%m%d_%H%M%S")


@router.post(
    "/copilot/workforce",
    response_model=CopilotWorkforceResponse,
    summary="AI Copilot natural language queries for Workforce Intelligence",
)
def copilot_workforce(request: CopilotWorkforceRequest) -> CopilotWorkforceResponse:
    """Answers HR workforce questions like 'Who is the best replacement for Warehouse Manager?'."""
    logger.info(f"Processing /copilot/workforce query: {request.query}")
    res = process_workforce_copilot_query(request.query)
    return CopilotWorkforceResponse(**res)



