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





def generate_assistant_response(
    complaint: dict,
    action: str = "logged",
    is_valid_complaint: bool = True,
    invalid_reason: str = None,
    ambiguous_details: str = None
) -> str:

    if not is_valid_complaint:

        reason = (
            invalid_reason or
            "The uploaded file or text does not contain valid customer complaint or product quality information."
        )

        return f"""⚠️ Wrong or Invalid Document Uploaded

{reason}

Please upload a valid pharmaceutical complaint document (PDF, Image, or Email) or type the complaint details directly in the chat."""

    important_field_keys = {
        "customer_name": "Customer Name",
        "product_name": "Product Name",
        "batch_lot_number": "Batch / Lot Number",
        "quantity_affected": "Quantity Affected",
        "expiry_date": "Expiry Date",
        "complaint_type": "Complaint Type",
        "detailed_complaint_description": "Detailed Description"
    }

    extracted_lines = []

    for key, label in important_field_keys.items():

        val = complaint.get(key)

        if val is not None and str(val).strip() != "":

            extracted_lines.append(
                f"• **{label}**: {val}"
            )

    extracted_data_text = "\n".join(extracted_lines) if extracted_lines else "• No specific fields extracted yet."

    missing_lines = []

    for key, label in important_field_keys.items():

        val = complaint.get(key)

        if val is None or str(val).strip() == "":

            missing_lines.append(
                f"• {label}"
            )

    response_text = f"""I have {action} the complaint details successfully.

Extracted Complaint Details:
{extracted_data_text}"""

    if ambiguous_details:
        response_text += f"""

🔍 **Unclear / Ambiguous Handwriting or Text Detected:**
{ambiguous_details}

👉 Could you please clarify or confirm these details directly in the chat?"""

    if missing_lines:

        missing_data_text = "\n".join(missing_lines)

        response_text += f"""

⚠️ Missing Information in Document/Form:
The following important details are currently missing:
{missing_data_text}

👉 Would you like to add any of this missing information? You can reply directly with the missing details (for example: "Batch number is B-4029, expiry is 2027-05")."""

    else:

        response_text += """

✅ All key complaint details are complete! Please review the form."""

    return response_text





def detect_intent_node(
    state: ComplaintState
):
    user_text = (state.get("user_message") or "")[:3000]

    response = base_llm.invoke(

        [

            SystemMessage(
                content=INTENT_CLASSIFIER_SYSTEM_PROMPT
            ),

            HumanMessage(
                content=user_text
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

    try:
        data = json.loads(content)
    except Exception:
        state["assistant_response"] = generate_assistant_response(
            {},
            "processed",
            is_valid_complaint=False,
            invalid_reason="Unable to parse complaint text into valid data."
        )
        return state

    try:
        validated = AIComplaintResponse.model_validate(
            data
        )
    except Exception:
        validated = None

    if validated and not validated.is_valid_complaint:

        state["assistant_response"] = generate_assistant_response(
            {},
            "extracted",
            is_valid_complaint=False,
            invalid_reason=validated.invalid_reason
        )

        return state


    complaint_dict = (
        validated.complaint.model_dump()
        if validated
        else data.get("complaint", {})
    )

    # Determine complaint source: Email vs Chatbot
    user_msg_lower = state.get("user_message", "").lower()
    if any(header in user_msg_lower for header in ["from:", "subject:", "dear support", "complaint email", "email content"]):
        complaint_dict["complaint_source"] = "Email"
    else:
        complaint_dict["complaint_source"] = "Chatbot"

    state["complaint"] = complaint_dict

    state["assistant_response"] = generate_assistant_response(
        state["complaint"],
        "extracted",
        is_valid_complaint=True
    )

    return state







def edit_complaint_node(
    state: ComplaintState
):

    user_msg_lower = state.get("user_message", "").lower()

    # Edge Case 17: Check for delete/remove complaint requests
    if any(phrase in user_msg_lower for phrase in ["delete this complaint", "delete complaint", "remove complaint", "delete from database", "drop complaint"]):
        state["assistant_response"] = (
            "⚠️ Delete Request Notice: Deleting complaint records from the system/database is an administrative action and is not supported via chat commands.\n\n"
            "• To clear the current form for a new entry, click the **Reset Form** button below.\n"
            "• Database deletions require QA Administrative privileges."
        )
        return state

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


    try:
        updated_fields = json.loads(

            clean_json(
                response.content
            )

        )

        current_complaint.update(
            updated_fields
        )

    except Exception as e:
        print("Edit complaint JSON parse error:", e)


    # Retain existing complaint_source or default to Chatbot
    current_complaint["complaint_source"] = current_complaint.get("complaint_source") or "Chatbot"

    state["complaint"] = current_complaint

    state["assistant_response"] = generate_assistant_response(
        state["complaint"],
        "updated",
        is_valid_complaint=True
    )


    return state







def document_extraction_node(
    state: ComplaintState
):


    doc_text = str(state.get("uploaded_document") or "")

    if not doc_text or not doc_text.strip() or "[INVALID_IMAGE:" in doc_text or "Image text extraction error:" in doc_text or "Corrupted or unreadable PDF document:" in doc_text:

        reason = (
            "The uploaded photo does not contain valid pharmaceutical product complaint information."
            if "[INVALID_IMAGE:" in doc_text
            else "The uploaded document or PDF file is corrupted, unreadable, or contains no readable text."
        )

        state["assistant_response"] = generate_assistant_response(
            {},
            "processed",
            is_valid_complaint=False,
            invalid_reason=reason
        )

        return state


    prompt = f"""

Extract complaint details from this document:

{doc_text}

Return only JSON.

"""



    response = base_llm.invoke(

        [

            SystemMessage(
                content=DOCUMENT_EXTRACTION_SYSTEM_PROMPT
            ),

            HumanMessage(
                content=prompt
            ),

        ]

    )


    try:
        data = json.loads(

            clean_json(
                response.content
            )

        )
    except Exception:
        state["assistant_response"] = generate_assistant_response(
            {},
            "processed",
            is_valid_complaint=False,
            invalid_reason="Failed to extract structured data from document."
        )
        return state


    try:
        validated = AIComplaintResponse.model_validate(
            data
        )
    except Exception:
        validated = None


    if validated and not validated.is_valid_complaint:

        state["assistant_response"] = generate_assistant_response(
            {},
            "processed",
            is_valid_complaint=False,
            invalid_reason=validated.invalid_reason
        )

        return state


    complaint_dict = (
        validated.complaint.model_dump()
        if validated
        else data.get("complaint", {})
    )

    # Determine complaint source: Email vs PDF
    filename = (state.get("filename") or "").lower()
    doc_text_lower = doc_text.lower()

    if filename.endswith(".eml") or filename.endswith(".msg") or any(h in doc_text_lower for h in ["from:", "subject:", "sent:", "to:"]):
        complaint_dict["complaint_source"] = "Email"
    else:
        complaint_dict["complaint_source"] = "PDF"

    state["complaint"] = complaint_dict

    ambiguous_details = (
        getattr(validated, "ambiguous_details", None)
        if validated
        else data.get("ambiguous_details")
    )

    state["assistant_response"] = generate_assistant_response(
        state["complaint"],
        "processed from the uploaded document / photo",
        is_valid_complaint=True,
        ambiguous_details=ambiguous_details
    )


    return state