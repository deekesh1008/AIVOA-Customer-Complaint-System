from typing import Any
from datetime import datetime, date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.complaint import Complaint


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"],
)



def convert_date(value):

    if not value:
        return None


    if isinstance(value, date):
        return value


    formats = [

        "%Y-%m-%d",

        "%d %B %Y",

        "%d %b %Y",

        "%d/%m/%Y",

    ]


    for fmt in formats:

        try:

            return datetime.strptime(
                value,
                fmt
            ).date()

        except ValueError:

            continue



    return None





@router.post("/save")
def save_complaint(
    complaint_data: dict[str, Any],
    db: Session = Depends(get_db),
):

    try:


        complaint_data["manufacturing_date"] = convert_date(
            complaint_data.get("manufacturing_date")
        )


        complaint_data["expiry_date"] = convert_date(
            complaint_data.get("expiry_date")
        )


        complaint_data["complaint_date"] = convert_date(
            complaint_data.get("complaint_date")
        )



        complaint = Complaint(
            **complaint_data
        )


        db.add(complaint)

        db.commit()

        db.refresh(complaint)



        return {

            "success": True,

            "complaint_id": complaint.id,

            "message": "Complaint saved successfully"

        }


    except Exception as e:


        db.rollback()


        raise HTTPException(

            status_code=500,

            detail=str(e)

        )