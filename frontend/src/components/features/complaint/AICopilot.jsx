import { useState } from "react";

import FileUpload from "./FileUpload";
import ChatBox from "./ChatBox";

import { processAIRequest } from "../../../services/aiService";
import { useComplaint } from "../../../context/ComplaintContext";


function AICopilot() {


  const [showTextModal, setShowTextModal] = useState(false);

  const [textInput, setTextInput] = useState("");



  const {
    complaint,
    updateComplaint,
    setRiskAssessment,
    setMessages,
    setLoading,
  } = useComplaint();





  const handleTextSubmit = async () => {


    if (!textInput.trim()) return;



    try {


      setLoading(true);



      const response = await processAIRequest({

        message: textInput,

        complaint: complaint,

      });



      console.log(
        "TEXT AI RESPONSE:",
        response
      );



      updateComplaint(

        response.data?.complaint || {}

      );

      if (response.data?.risk_assessment) {
        setRiskAssessment(response.data.risk_assessment);
      }



      setMessages((previous) => [

        ...previous,

        {

          role: "assistant",

          content:

            response.data?.assistant_response ||

            "Complaint processed successfully.",

        },

      ]);



      setShowTextModal(false);

      setTextInput("");



    } catch (error) {


      console.error(
        "TEXT PROCESS ERROR:",
        error
      );



      setMessages((previous) => [

        ...previous,

        {

          role: "assistant",

          content:
            "Unable to process complaint text.",

        },

      ]);



    } finally {


      setLoading(false);


    }


  };





  return (


    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl min-h-[850px] flex flex-col overflow-hidden">



      <div className="bg-gradient-to-r from-olive-700 to-olive-900 px-6 py-5 text-white">


        <h2 className="text-2xl font-bold">

          AI Complaint Copilot

        </h2>


        <p className="mt-2 text-sm text-olive-100">

          Extract, analyze and update pharmaceutical complaints using AI

        </p>


      </div>





      <div className="flex-1 p-6">



        <div className="rounded-xl border border-dashed border-olive-300 bg-olive-50/60 p-5">


          <FileUpload

            setComplaint={updateComplaint}

            setMessages={setMessages}

          />


        </div>





        <div className="my-5 flex items-center gap-3">


          <div className="h-px flex-1 bg-gray-200"></div>


          <span className="text-xs font-semibold text-gray-400">

            OR

          </span>


          <div className="h-px flex-1 bg-gray-200"></div>


        </div>





        <button

          onClick={() => setShowTextModal(true)}

          className="w-full rounded-xl border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition hover:bg-olive-50 hover:border-olive-400 hover:text-olive-800"

        >

          Paste Complaint Text / Email

        </button>





        <div className="mt-6 h-[500px]">


          <ChatBox

            complaint={complaint}

            setComplaint={updateComplaint}

          />


        </div>



      </div>







      {showTextModal && (


        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">


          <div className="w-[600px] rounded-2xl bg-white p-6 shadow-2xl">


            <h3 className="text-xl font-bold text-gray-900">

              Paste Complaint Text / Email

            </h3>



            <p className="mt-1 text-sm text-gray-500">

              Enter customer complaint details and let AI populate the form.

            </p>





            <textarea


              value={textInput}


              onChange={(e) =>
                setTextInput(e.target.value)
              }


              placeholder="Paste complaint email or text here..."


              rows={10}


              className="mt-5 w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500"


            />





            <div className="mt-5 flex justify-end gap-3">



              <button

                onClick={() => {

                  setShowTextModal(false);

                  setTextInput("");

                }}

                className="rounded-xl border px-5 py-2 text-gray-600 hover:bg-gray-50"

              >

                Close

              </button>





              <button

                onClick={handleTextSubmit}

                className="rounded-xl bg-olive-600 px-6 py-2 text-white hover:bg-olive-700 transition-colors"

              >

                Process Complaint

              </button>



            </div>



          </div>


        </div>


      )}



    </div>

  );

}


export default AICopilot;