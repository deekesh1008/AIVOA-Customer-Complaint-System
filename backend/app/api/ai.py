import os
from typing import Any

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.ai.graph import graph
from app.ai.risk import generate_risk_assessment
from app.db.database import get_db
from app.utils.document_parser import extract_document_text



router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)





class AIProcessRequest(BaseModel):

    message: str

    uploaded_document: str | None = None

    complaint: dict[str, Any] | None = None


class AIAnalyzeRequest(BaseModel):

    complaint: dict[str, Any]





def remove_empty_values(data: dict):

    return {

        key: value

        for key, value in data.items()

        if value is not None

    }








@router.post("/process")
async def process_ai(
    request: AIProcessRequest,
    db: Session = Depends(get_db)
):

    try:


        state = {


            "user_message": request.message,


            "uploaded_document": request.uploaded_document,


            "intent": None,


            "complaint": request.complaint or {},


            "assistant_response": "",


            "error": None,


        }



        result = graph.invoke(state)

        complaint_data = remove_empty_values(
            result.get("complaint", {})
        )

        risk_assessment = generate_risk_assessment(
            complaint_data,
            db_session=db
        )


        return {


            "success": True,


            "data": {


                "complaint": complaint_data,


                "assistant_response": result.get(
                    "assistant_response",
                    ""
                ),


                "intent": result.get(
                    "intent",
                    ""
                ),


                "risk_assessment": risk_assessment,


            }


        }





    except Exception as e:


        raise HTTPException(

            status_code=500,

            detail=str(e)

        )









@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    try:


        os.makedirs(
            "uploads",
            exist_ok=True
        )



        file_path = (
            f"uploads/{file.filename}"
        )



        with open(
            file_path,
            "wb"
        ) as buffer:


            buffer.write(
                await file.read()
            )




        document_text = extract_document_text(
            file_path
        )




        state = {


            "user_message":
            f"Extract complaint details from uploaded document: {file.filename}",


            "uploaded_document":
            document_text,


            "filename":
            file.filename,


            "intent":
            "document_extraction",


            "complaint": {},


            "assistant_response": "",


            "error": None,


        }





        result = graph.invoke(state)

        complaint_data = remove_empty_values(
            result.get("complaint", {})
        )

        risk_assessment = generate_risk_assessment(
            complaint_data,
            db_session=db
        )


        return {


            "success": True,


            "data": {


                "complaint": complaint_data,


                "assistant_response": result.get(
                    "assistant_response",
                    ""
                ),


                "intent": result.get(
                    "intent",
                    ""
                ),


                "risk_assessment": risk_assessment,


            }


        }





    except Exception as e:


        raise HTTPException(

            status_code=500,

            detail=str(e)

        )







@router.post("/analyze")
async def analyze_complaint(
    request: AIAnalyzeRequest,
    db: Session = Depends(get_db)
):

    try:

        risk_assessment = generate_risk_assessment(
            request.complaint or {},
            db_session=db
        )

        return {

            "success": True,

            "data": {

                "risk_assessment": risk_assessment

            }

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )