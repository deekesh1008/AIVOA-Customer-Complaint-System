function RiskAssessment({
  riskAssessment,
}) {


  return (

    <div className="rounded-xl border bg-white p-4 shadow-sm">


      <div className="flex items-center justify-between">

        <h2 className="text-lg font-bold text-gray-900">
          AI Risk Assessment
        </h2>


        <span className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600">
          AI Generated
        </span>

      </div>





      <div className="mt-4 grid grid-cols-2 gap-3">


        <div>

          <label className="mb-1 block text-xs font-medium text-gray-600">
            Severity
          </label>


          <input

            readOnly

            value={riskAssessment?.severity || ""}

            className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"

          />

        </div>





        <div>

          <label className="mb-1 block text-xs font-medium text-gray-600">
            Next Action
          </label>


          <input

            readOnly

            value={riskAssessment?.next_action || ""}

            className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"

          />

        </div>


      </div>






      <div className="mt-3">


        <label className="mb-1 block text-xs font-medium text-gray-600">
          Risk Summary
        </label>


        <textarea

          readOnly

          value={riskAssessment?.justification || ""}

          rows={3}

          className="w-full resize-none rounded-lg border bg-gray-50 px-3 py-2 text-sm"

        />


      </div>







      <div className="mt-3 grid grid-cols-2 gap-3">


        <div>

          <label className="mb-1 block text-xs font-medium text-gray-600">
            Root Cause
          </label>


          <textarea

            readOnly

            value={
              riskAssessment?.root_cause_recommendation || ""
            }

            rows={2}

            className="w-full resize-none rounded-lg border bg-gray-50 px-3 py-2 text-sm"

          />

        </div>







        <div>

          <label className="mb-1 block text-xs font-medium text-gray-600">
            CAPA
          </label>


          <textarea

            readOnly

            value={
              riskAssessment?.capa_recommendation || ""
            }

            rows={2}

            className="w-full resize-none rounded-lg border bg-gray-50 px-3 py-2 text-sm"

          />

        </div>


      </div>


    </div>

  );

}


export default RiskAssessment;