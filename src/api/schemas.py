from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# -----------------------------
# /auth Schemas
# -----------------------------
class LoginRequest(BaseModel):
    """Schema for POST /auth/login."""
    email: str = Field(example="bhanu.sreekar@chainiq.ai")
    password: str = Field(example="password123")


class UserProfile(BaseModel):
    """Schema for user profile details."""
    email: str
    name: str
    role: str
    department: Optional[str] = "Global Supply Chain Operations"
    avatar_url: Optional[str] = None


class TokenResponse(BaseModel):
    """Schema for authentication token response."""
    access_token: str
    token_type: str = "Bearer"
    user: UserProfile


class PredictionRequest(BaseModel):
    """Schema for incoming delay prediction request."""
    Type: str
    Market: str
    Shipping_Mode: str = Field(default="Standard Class")
    Order_Item_Quantity: int
    Sales: float
    scheduled_shipping_days: int
    profit_margin: float
    order_is_weekend: int = 0
    discount_rate: float = 0.0

    class Config:
        json_schema_extra = {
            "example": {
                "Type": "DEBIT",
                "Market": "LATAM",
                "Shipping_Mode": "Standard Class",
                "Order_Item_Quantity": 2,
                "Sales": 320.5,
                "scheduled_shipping_days": 4,
                "profit_margin": 0.22,
                "order_is_weekend": 0,
                "discount_rate": 0.04
            }
        }


class PredictionResponse(BaseModel):
    """Schema for outgoing delay prediction response."""
    delay_probability: float
    risk_level: str
    confidence: float


# -----------------------------
# /recommend Schemas
# -----------------------------
class Recommendation(BaseModel):
    """A single recommended action and its priority."""
    action: str
    priority: str


class BusinessImpact(BaseModel):
    """Estimated business impact of applying the recommendations."""
    estimated_delay_reduction_days: float
    estimated_cost_saving_usd: float
    customer_risk: str
    operational_priority: str
    recommendations_count: int


class RecommendResponse(BaseModel):
    """Full decision-support report from POST /recommend."""
    prediction: PredictionResponse
    possible_causes: list[str]
    recommendations: list[Recommendation]
    priority: str
    business_impact: BusinessImpact


# -----------------------------
# /dashboard Schemas
# -----------------------------
class DashboardSummaryResponse(BaseModel):
    """Schema for GET /dashboard/summary."""
    total_shipments: int
    high_risk_shipments: int
    average_delay_probability: float
    estimated_cost_savings: float
    ai_recommendations: int
    prediction_accuracy: float


class RecentShipment(BaseModel):
    """Schema for single recent shipment entry."""
    order_id: str
    market: str
    shipping_mode: str
    risk: str
    delay_probability: float
    sales_usd: float


class LiveAlert(BaseModel):
    """Schema for live environmental/route alert."""
    id: str
    type: str
    severity: str
    message: str
    timestamp: str


class AiSummaryResponse(BaseModel):
    """Schema for GET /dashboard/ai-summary."""
    headline: str
    confidence: float
    top_causes: List[str]
    estimated_savings: float
    prescribed_action: str


# -----------------------------
# /analytics Schemas
# -----------------------------
class AnalyticsOverviewResponse(BaseModel):
    """Schema for GET /analytics/overview."""
    overall_delay_reduction_pct: float
    sla_fulfillment_pct: float
    high_risk_reduction_pct: float
    projected_savings_usd: float


class DelayTrendPoint(BaseModel):
    """Schema for single point in GET /analytics/delay-trend."""
    month: str
    actual: float
    predicted: float
    sla_target: float


class RiskDistributionResponse(BaseModel):
    """Schema for GET /analytics/risk-distribution."""
    low_pct: float
    low_count: int
    medium_pct: float
    medium_count: int
    high_pct: float
    high_count: int
    critical_pct: float
    critical_count: int


class MarketPerformanceItem(BaseModel):
    """Schema for single item in GET /analytics/market-performance."""
    market: str
    delay_probability: float


class SupplierScorecardItem(BaseModel):
    """Schema for single carrier in GET /analytics/supplier-scorecard."""
    id: str
    name: str
    category: str
    otif_rate: float
    delay_rate: float
    quality_score: float
    risk_level: str
    overall_score: float


class ForecastPoint(BaseModel):
    """Schema for single point in GET /analytics/forecast."""
    period: str
    baseline_delay: float
    predicted_with_ai: float


# -----------------------------
# /reports Schemas
# -----------------------------
class ReportSummaryResponse(BaseModel):
    """Schema for GET /reports/summary."""
    total_shipments: int
    high_risk_shipments: int
    on_time_delivery_pct: float
    delay_trend_avg: float
    revenue_summary_usd: float
    period: str = "Q2 2026"
    confidence_score: float = 94.0
    generated_at: str


class MonthlyReportItem(BaseModel):
    """Schema for single month entry in GET /reports/monthly."""
    month: str
    total_shipments: int
    delayed_shipments: int
    on_time_pct: float
    revenue_usd: float


# -----------------------------
# /copilot Schemas
# -----------------------------
class CopilotChatMessageItem(BaseModel):
    sender: str
    text: str


class CopilotChatRequest(BaseModel):
    """Schema for POST /copilot/chat."""
    query: str
    history: Optional[List[CopilotChatMessageItem]] = None


class CopilotChatResponse(BaseModel):
    """Schema for response from POST /copilot/chat."""
    answer: str
    card_type: Optional[str] = None  # e.g., 'high_risk_table', 'region_risk', 'kpi_summary', 'action_recommendations', 'executive_summary'
    card_data: Optional[Any] = None
    confidence: float = 0.94
    sources: List[str] = ["CatBoost Model v1.5", "ChainIQ Telemetry Engine"]
    timestamp: str


class CopilotSuggestionsResponse(BaseModel):
    """Schema for GET /copilot/suggestions."""
    suggestions: List[str]


class CopilotContextResponse(BaseModel):
    """Schema for GET /copilot/context."""
    dashboard: Dict[str, Any]
    analytics: Dict[str, Any]


