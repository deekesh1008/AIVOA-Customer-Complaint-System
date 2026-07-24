import { useState } from "react";

import { processAIFile } from "../../../services/aiService";


function FileUpload({
  setComplaint,
  setMessages,
}) {


  const [uploading, setUploading] = useState(false);

  const [fileName, setFileName] = useState("");



  const handleFileChange = async (event) => {


    const file = event.target.files[0];


    if (!file) return;



    setFileName(file.name);



    try {


      setUploading(true);



      const response = await processAIFile(file);



      console.log(
        "FULL PDF RESPONSE:",
        response
      );



      const complaintData =
        response?.data?.complaint || {};



      if (
        Object.keys(complaintData).length === 0
      ) {

        console.log(
          "No complaint data received"
        );

        return;

      }



      setComplaint(
        complaintData
      );



      console.log(
        "SETTING COMPLAINT DATA:",
        complaintData
      );



      setMessages((previous) => [

        ...previous,

        {

          role: "assistant",

          content:

            response?.data?.assistant_response ||

            "Document processed successfully.",

        },

      ]);



    } catch (error) {


      console.error(
        "PDF upload error:",
        error
      );


      setMessages((previous) => [

        ...previous,

        {

          role: "assistant",

          content:
            "Failed to process document.",

        },

      ]);


    } finally {


      setUploading(false);


    }


  };




  return (


    <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-white p-6 text-center transition hover:border-blue-500">


      <input

        id="complaint-upload"

        type="file"

        accept=".pdf,.txt,.eml"

        className="hidden"

        onChange={handleFileChange}

      />





      <label

        htmlFor="complaint-upload"

        className="flex cursor-pointer flex-col items-center justify-center gap-3"

      >


        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">

          <svg

            xmlns="http://www.w3.org/2000/svg"

            width="28"

            height="28"

            viewBox="0 0 24 24"

            fill="none"

            stroke="currentColor"

            strokeWidth="2"

          >

            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>

            <polyline points="17 8 12 3 7 8"/>

            <line x1="12" y1="3" x2="12" y2="15"/>

          </svg>


        </div>




        <div>


          <p className="font-semibold text-gray-800">

            {uploading

              ? "AI is analyzing document..."

              : "Upload Complaint Document"

            }

          </p>



          <p className="mt-1 text-sm text-gray-500">

            Supports PDF, TXT and Email files

          </p>


        </div>





        {fileName && (

          <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">

            {fileName}

          </div>

        )}



      </label>




    </div>


  );

}


export default FileUpload;