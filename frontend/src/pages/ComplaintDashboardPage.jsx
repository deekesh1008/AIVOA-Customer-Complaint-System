import ComplaintForm from "../components/features/complaint/ComplaintForm";
import AICopilot from "../components/features/complaint/AICopilot";

import { useComplaint } from "../context/ComplaintContext";


function ComplaintDashboardPage() {


  const {
    complaint,
    updateComplaint,
  } = useComplaint();



  console.log(
    "DASHBOARD COMPLAINT DATA:",
    complaint
  );




  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-6">


      <div className="mx-auto max-w-[1600px]">


        <div className="mb-6">


          <h1 className="text-3xl font-bold text-gray-900">

            AIVOA-Pharmaceutical Complaint Management System

          </h1>


          <p className="mt-2 text-gray-600">

            AI powered pharmaceutical complaint intake and quality management platform

          </p>


        </div>





        <div className="grid grid-cols-12 gap-6">



          <div className="col-span-7">


            <div className="rounded-2xl shadow-lg overflow-hidden">


              <ComplaintForm

                complaint={complaint}

              />


            </div>


          </div>





          <div className="col-span-5">


            <div className="sticky top-6 rounded-2xl shadow-lg overflow-hidden">


              <AICopilot

                setComplaint={updateComplaint}

              />


            </div>


          </div>



        </div>


      </div>


    </div>

  );

}


export default ComplaintDashboardPage;