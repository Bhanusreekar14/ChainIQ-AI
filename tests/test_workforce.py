"""
Unit and API Integration tests for AI Workforce Intelligence & Talent Replacement Engine (v2.0).
"""

from fastapi.testclient import TestClient
from src.api.app import app
from src.services.workforce_service import (
    get_workforce_dashboard_summary,
    get_ranked_candidates_for_vacancy,
    process_workforce_copilot_query,
)
from src.services.resume_parser import parse_resume_text

client = TestClient(app)


def test_workforce_dashboard_summary_service():
    summary = get_workforce_dashboard_summary()
    assert summary["total_employees"] > 0
    assert summary["vacant_positions"] > 0
    assert "underperforming_alerts" in summary
    assert isinstance(summary["top_vacancies"], list)


def test_candidate_ranking_service():
    ranked = get_ranked_candidates_for_vacancy("VAC-201")
    assert len(ranked) > 0
    top = ranked[0]
    assert top["rank_position"] == 1
    assert "overall_compatibility_score" in top
    assert "ai_explanation" in top
    assert top["match_tier"] in ["Excellent Match", "Good Match", "Average Match", "Not Recommended"]


def test_resume_parser_service():
    sample_text = (
        "Vikram Malhotra\n"
        "Email: vikram@example.com\n"
        "7+ years of experience in Logistics Management, WMS, Supply Chain Optimization, Python, SQL.\n"
        "Certifications: Certified Supply Chain Professional (CSCP)\n"
    )
    parsed = parse_resume_text(sample_text, "vikram_resume.txt")
    assert parsed["name"] == "Vikram Malhotra"
    assert "WMS" in parsed["skills"]
    assert parsed["experience_years"] == 7


def test_workforce_dashboard_endpoint():
    response = client.get("/workforce/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "total_employees" in data
    assert "vacant_positions" in data
    assert "average_match_pct" in data


def test_vacancies_endpoint():
    response = client.get("/vacancies")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "vacancy_id" in data[0]


def test_candidate_rank_endpoint():
    response = client.post("/candidate/rank", json={"vacancy_id": "VAC-201"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["rank_position"] == 1


def test_candidate_report_pdf_endpoint():
    response = client.get("/candidate/report")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert len(response.content) > 100


def test_copilot_workforce_endpoint():
    response = client.post("/copilot/workforce", json={"query": "Who is the best replacement for Warehouse Manager?"})
    assert response.status_code == 200
    data = response.json()
    assert "Vikram Malhotra" in data["reply"]
    assert data["match_score"] > 80.0
