import json
import re

from langchain_core.messages import HumanMessage, SystemMessage

from app.ai.llm import base_llm


RISK_SYSTEM_PROMPT = """
You are a Senior Pharmaceutical Quality Assurance (QA) AI Specialist.

Analyze the provided customer complaint data and generate a RE-CALCULATED, SPECIFIC Quality Intelligence & Risk Assessment report.

CRITICAL INSTRUCTIONS:
1. SEVERITY RE-EVALUATION:
   - Re-evaluate severity based strictly on product safety and quality impact:
     - Foreign particle contamination / API contamination / sterility failure = Critical or High.
     - Chemical composition / potency / dosage defect = High or Critical.
     - Packaging / labeling / physical damage = Medium or Low.
2. CONCISE & PRODUCT-SPECIFIC OUTPUT:
   - Tailor ALL recommendations directly to the SPECIFIC product, batch, and defect described.
   - Do NOT use generic placeholder sentences like "Investigate batch manufacturing records and retain samples".
   - root_cause_recommendation: 2-3 brief, specific bullet points tailored to this exact defect (max 12 words per bullet).
   - capa_recommendation: 2-3 brief, specific bullet points tailored to this exact defect (max 12 words per bullet).
   - next_action: 1 direct, actionable QA sentence.
   - justification: 1-2 short sentences explaining safety & quality risk.
   - complaint_summary: 1-2 short sentences summarizing the issue.
   - duplicate_complaint_check: 1 short sentence analyzing batch/product recurrence.

Return ONLY JSON matching this format:
{
  "severity": "Critical | High | Medium | Low",
  "completeness_score": "85%",
  "completeness_check": "Short summary of filled vs missing fields.",
  "next_action": "1 short sentence immediate QA action.",
  "justification": "1-2 short sentences risk rationale.",
  "complaint_summary": "1-2 short sentences summary.",
  "root_cause_recommendation": "• Point 1\n• Point 2",
  "capa_recommendation": "• Point 1\n• Point 2",
  "duplicate_complaint_check": "1 short sentence duplicate status."
}
"""


def clean_and_parse_json(text: str):

    text = text.strip()

    # Match JSON object between { and }
    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:

        json_str = match.group(0)

        return json.loads(json_str, strict=False)


    return json.loads(text, strict=False)




def calculate_completeness(complaint: dict):

    essential_fields = [
        "customer_name",
        "product_name",
        "product_strength_grade",
        "batch_lot_number",
        "manufacturing_date",
        "expiry_date",
        "quantity_affected",
        "complaint_type",
        "detailed_complaint_description",
    ]

    if not complaint:
        return "0%", "Complaint form is currently empty."

    filled_count = 0
    missing = []

    for field in essential_fields:
        val = complaint.get(field)
        if val is not None and str(val).strip() != "":
            filled_count += 1
        else:
            missing.append(field.replace("_", " ").title())

    percentage = int((filled_count / len(essential_fields)) * 100)
    score_str = f"{percentage}%"

    if missing:
        check_str = f"Form is {percentage}% complete. Missing {len(missing)} fields: {', '.join(missing)}."
    else:
        check_str = "Form is 100% complete! All key complaint details are populated."

    return score_str, check_str




def generate_risk_assessment(complaint: dict, db_session=None):

    if not complaint or not any(str(v).strip() for v in complaint.values() if v is not None):
        return {
            "severity": "Low",
            "completeness_score": "0%",
            "completeness_check": "Complaint form is currently empty.",
            "next_action": "Awaiting complaint input or document upload.",
            "justification": "No complaint data available for evaluation.",
            "complaint_summary": "No complaint data available.",
            "root_cause_recommendation": "Awaiting complaint details.",
            "capa_recommendation": "Awaiting complaint details.",
            "duplicate_complaint_check": "No complaint data to search."
        }

    score_str, completeness_check_text = calculate_completeness(complaint)

    duplicate_info = ""
    if db_session:
        try:
            from app.models.complaint import Complaint
            batch = complaint.get("batch_lot_number")
            product = complaint.get("product_name")

            query = db_session.query(Complaint)
            if batch:
                matches = query.filter(Complaint.batch_lot_number == batch).all()
                if matches:
                    duplicate_info = f"ALERT: Found {len(matches)} existing complaint(s) logged for Batch {batch}."
            elif product:
                matches = query.filter(Complaint.product_name.ilike(f"%{product}%")).all()
                if matches:
                    duplicate_info = f"Found {len(matches)} historical complaint(s) for Product '{product}'."
        except Exception as e:
            print("DB duplicate check error:", e)

    product_name = complaint.get("product_name") or "Product"
    complaint_type = complaint.get("complaint_type") or "Quality defect"
    batch_num = complaint.get("batch_lot_number") or "affected lot"
    desc = complaint.get("detailed_complaint_description") or ""

    prompt = f"""
Current Complaint Record:
- Product Name: {product_name}
- Product Strength/Grade: {complaint.get('product_strength_grade') or 'N/A'}
- Customer Name: {complaint.get('customer_name') or 'N/A'}
- Batch/Lot Number: {batch_num}
- Complaint Type: {complaint_type}
- Detailed Description: {desc}
- Initial Severity: {complaint.get('initial_severity') or 'N/A'}

Calculated Form Completeness: {score_str} ({completeness_check_text})
Database Duplicate Context: {duplicate_info or 'No matching batch/product records found in database.'}

Generate specific, product-tailored Quality Intelligence & Risk Assessment JSON for this complaint.
"""

    try:

        response = base_llm.invoke(
            [
                SystemMessage(content=RISK_SYSTEM_PROMPT),
                HumanMessage(content=prompt)
            ]
        )

        data = clean_and_parse_json(response.content)

    except Exception as err:

        print("Risk assessment parse fallback error:", err)

        data = {
            "severity": complaint.get("initial_severity") or ("High" if "foreign" in desc.lower() or "contamination" in desc.lower() else "Medium"),
            "completeness_score": score_str,
            "completeness_check": completeness_check_text,
            "next_action": f"Quarantine lot {batch_num} and initiate QA investigation for {product_name}.",
            "justification": f"Reported {complaint_type.lower()} in {product_name} requires quality and safety evaluation.",
            "complaint_summary": desc if desc else f"Complaint logged for {product_name} regarding {complaint_type}.",
            "root_cause_recommendation": f"• Inspect {product_name} batch record & raw materials\n• Check packaging & filling line integrity for lot {batch_num}\n• Perform retain sample analysis",
            "capa_recommendation": f"• Quarantine affected lot {batch_num}\n• Re-evaluate packaging/filling SOPs for {product_name}\n• Issue QA holding notice",
            "duplicate_complaint_check": duplicate_info or f"No duplicate complaints detected for {product_name} batch {batch_num}."
        }

    # Ensure deterministic completeness score & duplicate context
    data["completeness_score"] = score_str

    if duplicate_info and duplicate_info not in data.get("duplicate_complaint_check", ""):

        data["duplicate_complaint_check"] = f"{duplicate_info} {data.get('duplicate_complaint_check', '')}"

    return data
