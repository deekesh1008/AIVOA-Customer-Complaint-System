import os

from pypdf import PdfReader




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


        reader = PdfReader(
            file_path
        )


        text = ""



        for page in reader.pages:


            content = page.extract_text()



            if content:

                text += content + "\n"




        return text.strip()







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