from pydantic import BaseModel
from typing import Optional


class ComplaintOutput(BaseModel):

    complaint: dict


class RiskAssessmentOutput(BaseModel):

    severity: Optional[str] = None

    next_action: Optional[str] = None

    justification: Optional[str] = None

    complaint_summary: Optional[str] = None

    root_cause_recommendation: Optional[str] = None

    capa_recommendation: Optional[str] = None

    completeness_check: Optional[str] = None

    duplicate_complaint_check: Optional[str] = None