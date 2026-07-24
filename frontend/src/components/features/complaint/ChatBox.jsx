import { useState, useEffect, useRef } from "react";
import { useComplaint } from "../../../context/ComplaintContext";

import {
  processAIRequest,
  processAIFile,
} from "../../../services/aiService";

import {
  Paperclip,
  Send,
  UserRound,
  Bot,
} from "lucide-react";



function ChatBox({
  complaint,
  setComplaint,
}) {


  const [message, setMessage] = useState("");


  const {
    messages,
    setMessages,
    loading,
    setLoading,
  } = useComplaint();



  const messagesEndRef = useRef(null);





  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({

      behavior: "smooth",

    });

  }, [messages]);





  const handleAIResponse = (response) => {


    console.log(
      "AI RESPONSE:",
      response
    );



    const complaintData =
      response?.data?.complaint || {};



    const assistantMessage =
      response?.data?.assistant_response ||
      "Complaint processed successfully.";



    setComplaint(complaintData);



    setMessages((previous) => [

      ...previous,

      {
        role: "assistant",

        content: assistantMessage,

      },

    ]);

  };







  const handleSend = async () => {


    if (!message.trim()) return;



    const userMessage = message;



    setMessages((previous)=>[

      ...previous,

      {

        role:"user",

        content:userMessage,

      },

    ]);



    setMessage("");



    try {


      setLoading(true);



      const response = await processAIRequest({

        message:userMessage,

        complaint:complaint,

      });



      handleAIResponse(response);



    }

    catch(error){


      console.error(
        "AI ERROR:",
        error
      );



      setMessages((previous)=>[

        ...previous,

        {

          role:"assistant",

          content:"Unable to process request.",

        },

      ]);



    }

    finally{


      setLoading(false);


    }


  };







  const handleFileUpload = async(event)=>{


    const file = event.target.files[0];


    if(!file) return;



    try{


      setLoading(true);



      const response = await processAIFile(file);



      console.log(
        "CHAT UPLOAD RESPONSE:",
        response
      );



      const complaintData =
        response?.data?.complaint || {};



      setComplaint(complaintData);



      setMessages((previous)=>[

        ...previous,

        {

          role:"assistant",

          content:

            response?.data?.assistant_response ||

            "Document processed successfully.",

        },

      ]);



    }

    catch(error){


      console.error(
        "CHAT UPLOAD ERROR:",
        error
      );



      setMessages((previous)=>[

        ...previous,

        {

          role:"assistant",

          content:"Failed to process document.",

        },

      ]);



    }

    finally{


      setLoading(false);


    }


  };








  return (


    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden">





      <div className="flex items-center gap-3 border-b bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">


        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">

          <Bot size={24}/>

        </div>



        <div>

          <h3 className="font-semibold">

            AI Complaint Assistant

          </h3>


          <p className="text-xs text-blue-100">

            Ready to analyze complaint documents

          </p>

        </div>


      </div>






      <div className="flex-1 space-y-5 overflow-y-auto bg-gray-50 p-5">



        {messages.length === 0 && (

          <div className="rounded-xl border border-dashed bg-white p-5 text-center text-sm text-gray-500">


            Upload a complaint document or type a message to start AI analysis.


          </div>

        )}






        {messages.map((msg,index)=>(


          <div

            key={index}

            className={`flex gap-3 ${
              msg.role === "user"
              ? "justify-end"
              : "justify-start"
            }`}

          >



            {msg.role === "assistant" && (

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">

                <Bot size={20}/>

              </div>

            )}





            <div

              className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm shadow-sm ${
                
                msg.role === "user"

                ? "bg-blue-600 text-white"

                : "border bg-white text-gray-700"

              }`}

            >

              {msg.content}

            </div>






            {msg.role === "user" && (

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">

                <UserRound size={20}/>

              </div>

            )}



          </div>


        ))}





        {loading && (

          <div className="flex gap-3">


            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">

              <Bot size={20}/>

            </div>



            <div className="rounded-xl border bg-white px-4 py-3 text-sm text-gray-600">

              AI is analyzing complaint...

            </div>


          </div>

        )}





        <div ref={messagesEndRef}/>


      </div>







      <div className="border-t bg-white p-4">


        <div className="flex items-center gap-3">



          <label

            htmlFor="chat-upload"

            className="cursor-pointer rounded-xl border p-3 text-gray-600 hover:bg-gray-100"

          >

            <Paperclip size={21}/>

          </label>



          <input

            id="chat-upload"

            type="file"

            accept=".pdf,.txt,.eml"

            className="hidden"

            onChange={handleFileUpload}

          />






          <input

            value={message}

            onChange={(e)=>setMessage(e.target.value)}

            onKeyDown={(e)=>{

              if(e.key==="Enter"){

                handleSend();

              }

            }}

            placeholder="Ask or update complaint details..."

            className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"

          />





          <button

            onClick={handleSend}

            className="rounded-xl bg-blue-600 p-3 text-white hover:bg-blue-700"

          >

            <Send size={20}/>

          </button>




        </div>


      </div>


    </div>


  );

}



export default ChatBox;