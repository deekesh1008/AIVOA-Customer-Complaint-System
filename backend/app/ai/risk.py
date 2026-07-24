import json

from langchain_core.messages import HumanMessage, SystemMessage

from app.ai.llm import base_llm



RISK_SYSTEM_PROMPT = """
You are a Pharmaceutical Quality Assurance AI.

Analyze the complaint data and generate risk assessment.

Rules:

- Use only the given complaint data.
- Never invent information.
- Return only JSON.
- No markdown.
- No explanation.

Generate:

severity:
Choose one:
Critical
High
Medium
Low


next_action:
Recommend the next QA action.


justification:
Explain why this severity was selected.


complaint_summary:
Summarize the complaint.


root_cause_recommendation:
Suggest possible investigation areas.


capa_recommendation:
Suggest corrective and preventive actions.


completeness_check:
Mention missing important information.


duplicate_complaint_check:
Mention that duplicate check should be performed.

Return exactly this format:

{
  "severity": "",
  "next_action": "",
  "justification": "",
  "complaint_summary": "",
  "root_cause_recommendation": "",
  "capa_recommendation": "",
  "completeness_check": "",
  "duplicate_complaint_check": ""
}
"""



def generate_risk_assessment(complaint: dict):

    prompt = f"""
Complaint Data:

{json.dumps(complaint, indent=2)}

Generate risk assessment.
"""


    response = base_llm.invoke(
        [
            SystemMessage(
                content=RISK_SYSTEM_PROMPT
            ),

            HumanMessage(
                content=prompt
            )
        ]
    )


    content = response.content.strip()


    if content.startswith("```"):

        content = (
            content.replace("```json", "")
            .replace("```", "")
            .strip()
        )


    return json.loads(content)