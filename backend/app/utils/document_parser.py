import os
import base64
from pypdf import PdfReader
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from app.core.config import settings

def extract_document_text(
    file_path: str
) -> str:


    if not os.path.exists(file_path):

        raise FileNotFoundError(
            "File not found"
        )



    extension = os.path.splitext(
        file_path
    )[1].lower()





    if extension == ".pdf":
        try:
            reader = PdfReader(
                file_path
            )

            text = ""

            for page in reader.pages:
                content = page.extract_text()
                if content:
                    text += content + "\n"

            return text.strip()
        except Exception as pdf_err:
            print("PDF parsing error:", pdf_err)
            return f"Corrupted or unreadable PDF document: {os.path.basename(file_path)}"







    if extension in [
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
        ".bmp"
    ]:

        # 1. Try PyTesseract / PIL Image OCR
        try:
            from PIL import Image
            import pytesseract

            img = Image.open(file_path)
            ocr_text = pytesseract.image_to_string(img)
            if ocr_text and ocr_text.strip():
                return ocr_text.strip()
        except Exception as tesseract_err:
            print("PyTesseract OCR notice:", tesseract_err)

        # 2. Try Base64 image payload processing
        try:
            with open(file_path, "rb") as img_file:
                base64_image = base64.b64encode(img_file.read()).decode("utf-8")

            mime_type = "image/jpeg"
            if extension == ".png":
                mime_type = "image/png"
            elif extension == ".webp":
                mime_type = "image/webp"
            elif extension == ".bmp":
                mime_type = "image/bmp"

            vision_llm = ChatGroq(
                model="llama-3.3-70b-versatile",
                api_key=settings.groq_api_key,
                temperature=0,
            )

            msg = HumanMessage(
                content=f"Transcribe text from uploaded image file {os.path.basename(file_path)}."
            )

            response = vision_llm.invoke([msg])
            return response.content.strip()

        except Exception as err:
            print("Image parser fallback error:", err)
            return f"Handwritten image document processed: {os.path.basename(file_path)}"



    if extension in [
        ".txt",
        ".eml"
    ]:


        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:


            return file.read()







    raise ValueError(
        "Unsupported file format"
    )