from pydantic import BaseModel


class ComplaintExtractionOutput(BaseModel):
    complaint: dict