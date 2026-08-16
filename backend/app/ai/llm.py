from langchain_groq import ChatGroq

from app.core.config import settings


base_llm = ChatGroq(

    model="llama-3.1-8b-instant",

    api_key=settings.groq_api_key,

    temperature=0,

)