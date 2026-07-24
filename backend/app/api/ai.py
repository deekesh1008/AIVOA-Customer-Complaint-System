import os
from typing import Any

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.ai.graph import graph
from app.utils.document_parser import extract_document_text



router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)





class AIProcessRequest(BaseModel):

    message: str

    uploaded_document: str | None = None

    complaint: dict[str, Any] | None = None







def remove_empty_values(data: dict):

    return {

        key: value

        for key, value in data.items()

        if value is not None

    }








@router.post("/process")
async def process_ai(
    request: AIProcessRequest
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




        return {


            "success": True,


            "data": {


                "complaint": remove_empty_values(
                    result.get(
                        "complaint",
                        {}
                    )
                ),


                "assistant_response": result.get(
                    "assistant_response",
                    ""
                ),


                "intent": result.get(
                    "intent",
                    ""
                ),


            }


        }





    except Exception as e:


        raise HTTPException(

            status_code=500,

            detail=str(e)

        )









@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
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
            "Extract complaint details from uploaded document",


            "uploaded_document":
            document_text,


            "intent":
            "document_extraction",


            "complaint": {},


            "assistant_response": "",


            "error": None,


        }





        result = graph.invoke(state)




        return {


            "success": True,


            "data": {


                "complaint": remove_empty_values(
                    result.get(
                        "complaint",
                        {}
                    )
                ),


                "assistant_response": result.get(
                    "assistant_response",
                    ""
                ),


                "intent": result.get(
                    "intent",
                    ""
                ),


            }


        }





    except Exception as e:


        raise HTTPException(

            status_code=500,

            detail=str(e)

        )