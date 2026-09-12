"""
In-memory data structures and schemas for AI Workforce Intelligence & Talent Replacement Engine.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime


class EmployeeModel:
    def __init__(
        self,
        employee_id: str,
        name: str,
        role: str,
        department: str,
        status: str,  # Active, Resigned, Retired, Terminated, Long Leave, Internal Transfer
        attendance_pct: float,
        productivity_score: float,
        kpi_score: float,
        delivery_performance_pct: float,
        error_rate_pct: float,
        location: str = "Dallas, TX",
        salary_grade: str = "L5",
    ):
        self.employee_id = employee_id
        self.name = name
        self.role = role
        self.department = department
        self.status = status
        self.attendance_pct = attendance_pct
        self.productivity_score = productivity_score
        self.kpi_score = kpi_score
        self.delivery_performance_pct = delivery_performance_pct
        self.error_rate_pct = error_rate_pct
        self.location = location
        self.salary_grade = salary_grade

    def to_dict(self) -> Dict[str, Any]:
        return {
            "employee_id": self.employee_id,
            "name": self.name,
            "role": self.role,
            "department": self.department,
            "status": self.status,
            "attendance_pct": self.attendance_pct,
            "productivity_score": self.productivity_score,
            "kpi_score": self.kpi_score,
            "delivery_performance_pct": self.delivery_performance_pct,
            "error_rate_pct": self.error_rate_pct,
            "location": self.location,
            "salary_grade": self.salary_grade,
            "is_underperforming": self.kpi_score < 70.0 or self.error_rate_pct > 8.0,
        }


class VacancyModel:
    def __init__(
        self,
        vacancy_id: str,
        role_id: str,
        role_title: str,
        department: str,
        cause: str,  # Resignation, Retirement, Termination, Long Leave, Internal Transfer, Underperformance
        previous_employee_name: str,
        required_skills: List[str],
        preferred_skills: List[str],
        min_experience_years: int,
        location: str,
        salary_grade: str,
        created_at: Optional[str] = None,
    ):
        self.vacancy_id = vacancy_id
        self.role_id = role_id
        self.role_title = role_title
        self.department = department
        self.cause = cause
        self.previous_employee_name = previous_employee_name
        self.required_skills = required_skills
        self.preferred_skills = preferred_skills
        self.min_experience_years = min_experience_years
        self.location = location
        self.salary_grade = salary_grade
        self.created_at = created_at or datetime.now().strftime("%Y-%m-%d")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "vacancy_id": self.vacancy_id,
            "role_id": self.role_id,
            "role_title": self.role_title,
            "department": self.department,
            "cause": self.cause,
            "previous_employee_name": self.previous_employee_name,
            "required_skills": self.required_skills,
            "preferred_skills": self.preferred_skills,
            "min_experience_years": self.min_experience_years,
            "location": self.location,
            "salary_grade": self.salary_grade,
            "created_at": self.created_at,
        }


class CandidateModel:
    def __init__(
        self,
        candidate_id: str,
        name: str,
        email: str,
        skills: List[str],
        experience_years: int,
        education: str,
        certifications: List[str],
        projects: List[str],
        previous_companies: List[str],
        languages: List[str],
        current_location: str,
    ):
        self.candidate_id = candidate_id
        self.name = name
        self.email = email
        self.skills = skills
        self.experience_years = experience_years
        self.education = education
        self.certifications = certifications
        self.projects = projects
        self.previous_companies = previous_companies
        self.languages = languages
        self.current_location = current_location

    def to_dict(self) -> Dict[str, Any]:
        return {
            "candidate_id": self.candidate_id,
            "name": self.name,
            "email": self.email,
            "skills": self.skills,
            "experience_years": self.experience_years,
            "education": self.education,
            "certifications": self.certifications,
            "projects": self.projects,
            "previous_companies": self.previous_companies,
            "languages": self.languages,
            "current_location": self.current_location,
        }
