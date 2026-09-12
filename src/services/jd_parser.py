"""
Job Description parser service for ChainIQ AI Workforce Engine.
Converts raw Job Description text into structured AI Job Profiles.
"""

import re
from typing import Dict, Any


def parse_job_description(jd_text: str, role_title: str = "Logistics Operations Manager") -> Dict[str, Any]:
    """Parse raw JD text and construct an AI Job Profile."""
    clean_text = jd_text.replace("\r", "\n")

    # Required Skills
    req_skills = ["Supply Chain Optimization", "WMS", "Logistics Management", "SQL"]
    if "Python" in clean_text or "Analytics" in clean_text:
        req_skills.append("Python")

    # Preferred Skills
    pref_skills = ["SAP S/4HANA", "Demand Forecasting", "PostgreSQL", "Lean Manufacturing"]

    # Min Experience
    exp_match = re.search(r"(\d+)\+?\s*(?:years?|yrs?)", clean_text, re.IGNORECASE)
    min_exp = int(exp_match.group(1)) if exp_match else 4

    return {
        "role_title": role_title,
        "department": "Logistics & Fulfillment",
        "required_skills": req_skills,
        "preferred_skills": pref_skills,
        "min_experience_years": min_exp,
        "required_education": "B.S. Supply Chain, Industrial Engineering or related field",
        "required_certifications": ["Certified Supply Chain Professional (CSCP)"],
        "location": "Dallas, TX",
        "salary_grade": "L5 ($110,000 - $135,000)",
    }
