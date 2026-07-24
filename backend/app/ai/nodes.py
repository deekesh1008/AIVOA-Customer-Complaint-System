import json

from langchain_core.messages import HumanMessage, SystemMessage

from app.ai.llm import base_llm

from app.ai.prompts import (
    DOCUMENT_EXTRACTION_SYSTEM_PROMPT,
    INTENT_CLASSIFIER_SYSTEM_PROMPT,
    LOG_COMPLAINT_SYSTEM_PROMPT,
    EDIT_COMPLAINT_SYSTEM_PROMPT,
)

from app.ai.state import ComplaintState

from app.schemas.ai_response import AIComplaintResponse





def clean_json(content: str):

    content = content.strip()

    if content.startswith("```"):

        content = (
            content
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

    return content


def normalize_quantity(data):

    quantity = data.get("quantity_affected")

    if quantity is None:
        return data

    if isinstance(quantity, (int, float)):
        return data

    numbers = []

    for word in str(quantity).split():
        try:
            numbers.append(float(word))
        except:
            pass

    if numbers:
        data["quantity_affected"] = numbers[0]

    else:
        data["quantity_affected"] = None

    return data




def generate_assistant_response(
    complaint,
    action
):

    fields = []

    display_fields = [
        ("complaint_source", "Source"),
        ("customer_name", "Customer"),
        ("product_name", "Product"),
        ("product_strength_grade", "Strength/Grade"),
        ("batch_lot_number", "Batch Number"),
        ("quantity_affected", "Quantity Affected"),
        ("complaint_type", "Complaint Type"),
        ("initial_severity", "Severity"),
        ("priority", "Priority"),
    ]


    for key, label in display_fields:

        value = complaint.get(key)

        if value is not None:

            fields.append(
                f"{label}: {value}"
            )


    extracted_data = "\n".join(fields)


    return f"""
I have {action} the complaint details successfully.

The complaint form has been updated with:

{extracted_data}

Please review the form. You can ask me to modify any details.
"""





def detect_intent_node(
    state: ComplaintState
):


    response = base_llm.invoke(

        [

            SystemMessage(
                content=INTENT_CLASSIFIER_SYSTEM_PROMPT
            ),

            HumanMessage(
                content=state["user_message"]
            ),

        ]

    )


    state["intent"] = response.content.strip().lower()


    return state







def log_complaint_node(
    state: ComplaintState
):


    response = base_llm.invoke(

        [

            SystemMessage(
                content=LOG_COMPLAINT_SYSTEM_PROMPT
            ),

            HumanMessage(
                content=state["user_message"]
            ),

        ]

    )


    content = clean_json(
        response.content
    )


    data = json.loads(content)


    validated = AIComplaintResponse.model_validate(
        data
    )


    state["complaint"] = (
        validated.complaint.model_dump()
    )


    
    state["assistant_response"] = generate_assistant_response(
    state["complaint"],
    "extracted"
)

    return state







def edit_complaint_node(
    state: ComplaintState
):


    current_complaint = state.get(
        "complaint",
        {}
    )


    prompt = f"""

Current complaint:

{json.dumps(current_complaint, indent=2)}


User update:

{state["user_message"]}


Update only mentioned fields.

Do not remove existing values.

Return only JSON.

Example:

{{
"batch_lot_number":"ABC123"
}}

"""



    response = base_llm.invoke(

        [

            SystemMessage(
                content=EDIT_COMPLAINT_SYSTEM_PROMPT
            ),

            HumanMessage(
                content=prompt
            ),

        ]

    )


    updated_fields = json.loads(

        clean_json(
            response.content
        )

    )



    current_complaint.update(
        updated_fields
    )


    state["complaint"] = current_complaint

    state["assistant_response"] = generate_assistant_response(
    state["complaint"],
    "updated"
)


    return state





def document_extraction_node(
    state: ComplaintState
):


    prompt = f"""

Extract complaint details from this document:

{state["uploaded_document"]}

Return only JSON.

"""



    response = base_llm.invoke(

        [

            SystemMessage(
                content=LOG_COMPLAINT_SYSTEM_PROMPT
            ),

            HumanMessage(
                content=prompt
            ),

        ]

    )


    data = json.loads(

        clean_json(
            response.content
        )

    )



    validated = AIComplaintResponse.model_validate(
        data
    )



    state["complaint"] = (
        validated.complaint.model_dump()
    )

    state["assistant_response"] = generate_assistant_response(
    state["complaint"],
    "processed from the uploaded document"
)


    return state