from pydantic import BaseModel


class RiskAssessment(BaseModel):
    severity: str | None = None
    next_action: str | None = None
    justification: str | None = None