from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ai import router as ai_router
from app.api.complaints import router as complaint_router

from app.db.database import Base, engine
from app.models.complaint import Complaint



Base.metadata.create_all(
    bind=engine
)



app = FastAPI(

    title="AIVOA Complaint Management System",

    version="1.0.0"

)



app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)



@app.get("/")
def root():

    return {

        "message":
        "AIVOA Complaint Management System API"

    }



app.include_router(
    ai_router,
    prefix="/api"
)


app.include_router(
    complaint_router,
    prefix="/api"
)