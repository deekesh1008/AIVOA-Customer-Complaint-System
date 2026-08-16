from typing import Any, Dict, Optional
from typing_extensions import TypedDict


class ComplaintState(TypedDict, total=False):

    user_message: str

    uploaded_document: Optional[str]

    filename: Optional[str]

    intent: Optional[str]

    complaint: Dict[str, Any]

    assistant_response: str

    error: Optional[str]