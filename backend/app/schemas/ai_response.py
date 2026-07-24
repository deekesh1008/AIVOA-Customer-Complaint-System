from typing import Optional

from pydantic import BaseModel


class ComplaintData(BaseModel):

    complaint_source: Optional[str] = None

    customer_name: Optional[str] = None

    product_name: Optional[str] = None

    product_strength_grade: Optional[str] = None

    batch_lot_number: Optional[str] = None

    manufacturing_date: Optional[str] = None

    expiry_date: Optional[str] = None

    quantity_affected: Optional[str] = None

    complaint_type: Optional[str] = None

    complaint_date: Optional[str] = None

    detailed_complaint_description: Optional[str] = None

    initial_severity: Optional[str] = None

    priority: Optional[str] = None



class AIComplaintResponse(BaseModel):

    complaint: ComplaintData