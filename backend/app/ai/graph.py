from langgraph.graph import END, START, StateGraph


from app.ai.nodes import (
    detect_intent_node,
    log_complaint_node,
    edit_complaint_node,
    document_extraction_node,
)


from app.ai.state import ComplaintState





graph_builder = StateGraph(
    ComplaintState
)





graph_builder.add_node(
    "detect_intent",
    detect_intent_node
)



graph_builder.add_node(
    "log_complaint",
    log_complaint_node
)



graph_builder.add_node(
    "edit_complaint",
    edit_complaint_node
)



graph_builder.add_node(
    "document_extraction",
    document_extraction_node
)







def route_intent(
    state: ComplaintState
):


    intent = state.get(
        "intent",
        ""
    ).strip().lower()



    if intent == "edit_complaint":

        return "edit_complaint"



    if intent == "document_extraction":

        return "document_extraction"



    return "log_complaint"









graph_builder.add_edge(

    START,

    "detect_intent"

)







graph_builder.add_conditional_edges(

    "detect_intent",

    route_intent,

    {

        "log_complaint": "log_complaint",

        "edit_complaint": "edit_complaint",

        "document_extraction": "document_extraction",

    }

)







graph_builder.add_edge(

    "log_complaint",

    END

)



graph_builder.add_edge(

    "edit_complaint",

    END

)



graph_builder.add_edge(

    "document_extraction",

    END

)







graph = graph_builder.compile()