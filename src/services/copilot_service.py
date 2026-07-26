"""
Enterprise Supply Chain AI Copilot Service Layer for ChainIQ.

Provides natural language query processing, supply chain context aggregation,
rich card payload generation, executive synthesis, and action recommendations.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
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


def get_dashboard_context() -> Dict[str, Any]:
    """Gather complete operational dashboard context."""
    return {
        "summary": get_dashboard_summary(),
        "recent_shipments": get_recent_shipments(),
        "live_alerts": get_live_alerts(),
        "ai_summary": get_ai_summary(),
    }


def get_analytics_context() -> Dict[str, Any]:
    """Gather complete executive analytics context."""
    return {
        "overview": get_analytics_overview(),
        "delay_trend": get_delay_trend(),
        "risk_distribution": get_risk_distribution(),
        "market_performance": get_market_performance(),
        "supplier_scorecard": get_supplier_scorecard(),
        "forecast": get_forecast(),
    }


def generate_executive_summary() -> Dict[str, Any]:
    """Synthesize high-level executive supply chain performance brief."""
    summary = get_dashboard_summary()
    overview = get_analytics_overview()
    ai_brief = get_ai_summary()

    return {
        "title": "ChainIQ Q2 2026 Executive Intelligence Brief",
        "total_shipments": summary["total_shipments"],
        "on_time_fulfillment_pct": overview["sla_fulfillment_pct"],
        "delay_reduction_pct": overview["overall_delay_reduction_pct"],
        "total_savings_usd": overview["projected_savings_usd"],
        "headline_risk": ai_brief["headline"],
        "prescribed_action": ai_brief["prescribed_action"],
        "model_confidence": ai_brief["confidence"],
    }


def recommend_actions() -> List[Dict[str, Any]]:
    """Return prescribed strategic interventions ordered by ROI."""
    return [
        {
            "id": "ACT-01",
            "action": "Automate Express Freight upgrades for LATAM orders > $1,000 Sales",
            "impact": "+$245,000 Net Savings",
            "delay_reduction_days": 2.5,
            "priority": "Urgent",
        },
        {
            "id": "ACT-02",
            "action": "Enable Sunday Dispatch Shift at Rotterdam & Singapore origin hubs",
            "impact": "+$112,500 Net Savings",
            "delay_reduction_days": 1.4,
            "priority": "High",
        },
        {
            "id": "ACT-03",
            "action": "Enforce Carrier OTIF Penalty Clause for non-compliant suppliers",
            "impact": "+$55,350 Net Savings",
            "delay_reduction_days": 0.8,
            "priority": "Medium",
        },
    ]


def get_quick_suggestions() -> List[str]:
    """Return top dynamic prompt suggestion chips for frontend UI."""
    return [
        "Show today's high-risk shipments.",
        "Which region has the highest delay probability?",
        "Summarize logistics performance.",
        "How many delayed shipments are there?",
        "Generate an executive summary.",
        "Suggest actions to reduce delivery delays.",
    ]


def process_query(query: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    """
    Parse user operational query, perform intent matching, aggregate telemetry context,
    and return natural language answer along with structured rich UI card payloads.
    """
    q_lower = query.lower().strip()
    timestamp = datetime.now().strftime("%I:%M %p")

    # 1. Intent: High risk shipments
    if any(k in q_lower for k in ["high-risk", "high risk", "today's shipment", "watchlist", "recent shipment"]):
        recent = get_recent_shipments()
        return {
            "answer": "Here are today's high-risk watchlist shipments identified by CatBoost ML inference. LATAM and Africa Standard Class orders exhibit the highest delay probabilities.",
            "card_type": "high_risk_table",
            "card_data": recent,
            "confidence": 0.96,
            "sources": ["CatBoost ML Watchlist", "Real-Time Order Ingestion"],
            "timestamp": timestamp,
        }

    # 2. Intent: Region delay risk
    if any(k in q_lower for k in ["region", "highest delay", "market", "latam", "africa", "vulnerability"]):
        markets = get_market_performance()
        return {
            "answer": "LATAM region currently exhibits the highest delay probability at 62.4%, followed by Africa at 51.2%. Standard Class transit windows and hub clearance backlogs dominate regional risk.",
            "card_type": "region_risk",
            "card_data": markets,
            "confidence": 0.95,
            "sources": ["Regional Telemetry", "CatBoost Feature Attribution"],
            "timestamp": timestamp,
        }

    # 3. Intent: Summarize logistics performance / KPIs
    if any(k in q_lower for k in ["summarize", "kpi", "performance", "total shipment", "overview"]):
        dash = get_dashboard_summary()
        return {
            "answer": "ChainIQ Decision Engine has processed 180,519 orders with an on-time fulfillment rate of 96.2%. Active CatBoost modeling has saved an estimated $412,850 in SLA delay penalties.",
            "card_type": "kpi_summary",
            "card_data": dash,
            "confidence": 0.98,
            "sources": ["ChainIQ Core Telemetry Engine"],
            "timestamp": timestamp,
        }

    # 4. Intent: Delay count / risk distribution
    if any(k in q_lower for k in ["how many delayed", "delayed shipments", "risk count", "critical risk", "breakdown"]):
        risk = get_risk_distribution()
        return {
            "answer": "Currently, 21,662 orders (12.0%) are classified as High Risk and 9,027 orders (5.0%) are in Critical Risk status across active transit corridors.",
            "card_type": "risk_distribution",
            "card_data": risk,
            "confidence": 0.94,
            "sources": ["CatBoost Risk Classifier"],
            "timestamp": timestamp,
        }

    # 5. Intent: Generate executive summary
    if any(k in q_lower for k in ["executive summary", "executive brief", "c-suite", "c suite"]):
        exec_brief = generate_executive_summary()
        return {
            "answer": "Executive Summary: ChainIQ ML Decision Engine processed 180,519 order vectors in Q2 2026. Prescribed express routing interventions reduced overall delay probability by 18.4%, yielding $412,850 in net SLA savings.",
            "card_type": "executive_summary",
            "card_data": exec_brief,
            "confidence": 0.97,
            "sources": ["Executive Intelligence Brief Engine"],
            "timestamp": timestamp,
        }

    # 6. Intent: Action recommendations / reduce delays
    if any(k in q_lower for k in ["action", "suggest", "reduce delay", "intervention", "mitigate"]):
        actions = recommend_actions()
        return {
            "answer": "Recommended Actions to mitigate delivery delays: 1) Automate Express Freight upgrades for LATAM orders > $1,000 Sales ($245k savings), 2) Enable Sunday origin warehouse shifts ($112.5k savings), 3) Enforce supplier OTIF penalty clauses ($55.3k savings).",
            "card_type": "action_recommendations",
            "card_data": actions,
            "confidence": 0.95,
            "sources": ["Prescribed AI Recommendation Engine"],
            "timestamp": timestamp,
        }

    # Default fallback
    return {
        "answer": f"ChainIQ AI Decision Engine evaluated: '{query}'. Based on 180,000+ logistics order records, CatBoost model feature importance ranks Shipping Mode (+38% weight) and Market Region (+24% weight) as top delay drivers.",
        "card_type": None,
        "card_data": None,
        "confidence": 0.92,
        "sources": ["CatBoost Classifier v1.5"],
        "timestamp": timestamp,
    }
