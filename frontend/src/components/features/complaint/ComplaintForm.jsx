import { useState } from "react";

import { saveComplaint } from "../../../services/complaintService";


function ComplaintForm({
  complaint = {},
}) {


  console.log(
    "FORM COMPLAINT DATA:",
    complaint
  );



  const [saving, setSaving] = useState(false);



  const handleSaveComplaint = async () => {

    try {

      setSaving(true);


      const response = await saveComplaint(
        complaint
      );


      alert(
        `Complaint saved successfully. Complaint ID: ${response.complaint_id}`
      );


    } catch (error) {


      console.error(error);


      alert(
        "Failed to save complaint"
      );


    } finally {

      setSaving(false);

    }

  };





  const fields = [

    {
      label: "Complaint Source",
      key: "complaint_source",
    },

    {
      label: "Customer Name",
      key: "customer_name",
    },

    {
      label: "Product Name",
      key: "product_name",
    },

    {
      label: "Product Strength / Grade",
      key: "product_strength_grade",
    },

    {
      label: "Batch / Lot Number",
      key: "batch_lot_number",
    },

    {
      label: "Manufacturing Date",
      key: "manufacturing_date",
    },

    {
      label: "Expiry Date",
      key: "expiry_date",
    },

    {
      label: "Quantity Affected",
      key: "quantity_affected",
    },

    {
      label: "Complaint Type",
      key: "complaint_type",
    },

    {
      label: "Complaint Date",
      key: "complaint_date",
    },

    {
      label: "Initial Severity",
      key: "initial_severity",
    },

    {
      label: "Priority",
      key: "priority",
    },

  ];





  return (

    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">


      <div className="flex items-start justify-between border-b pb-5">


        <div>

          <h1 className="text-3xl font-bold text-gray-900">

            Log Customer Complaint

          </h1>


          <p className="mt-2 text-sm text-gray-500">

            API & FDF Quality Assurance Module

          </p>


        </div>




        <span className="rounded-full border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700">

          Pending Triage

        </span>


      </div>





      <Section title="1. ORIGIN & CUSTOMER DETAILS">

        <div className="grid grid-cols-2 gap-5">

          {fields.slice(0,2).map((field)=>(

            <InputField

              key={field.key}

              label={field.label}

              value={complaint[field.key]}

            />

          ))}

        </div>

      </Section>





      <Section title="2. PRODUCT & BATCH IDENTIFICATION">

        <div className="grid grid-cols-2 gap-5">

          {fields.slice(2,8).map((field)=>(

            <InputField

              key={field.key}

              label={field.label}

              value={complaint[field.key]}

            />

          ))}

        </div>

      </Section>





      <Section title="3. COMPLAINT DETAILS">

        <div className="grid grid-cols-2 gap-5">


          {fields.slice(8,10).map((field)=>(

            <InputField

              key={field.key}

              label={field.label}

              value={complaint[field.key]}

            />

          ))}





          <div className="col-span-2">


            <label className="mb-2 block text-sm font-semibold text-gray-700">

              Detailed Complaint Description

            </label>


            <textarea

              readOnly

              value={
                complaint.detailed_complaint_description || ""
              }

              rows="4"

              placeholder="Awaiting AI extraction..."

              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none"

            />


          </div>


        </div>

      </Section>





      <Section title="4. INITIAL ASSESSMENT & PRIORITY">


        <div className="grid grid-cols-2 gap-5">


          {fields.slice(10,12).map((field)=>(

            <InputField

              key={field.key}

              label={field.label}

              value={complaint[field.key]}

            />

          ))}


        </div>


      </Section>





      <div className="mt-8 flex justify-between border-t pt-6">


        <button

          className="rounded-xl border border-gray-300 px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"

        >

          Reset Form

        </button>




        <button

          onClick={handleSaveComplaint}

          disabled={saving}

          className="rounded-xl bg-blue-600 px-7 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"

        >

          {saving ? "Saving..." : "Save Complaint"}

        </button>


      </div>


    </div>

  );

}





function Section({ title, children }) {


  return (

    <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50/50 p-5">


      <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-blue-700">

        {title}

      </h2>


      {children}


    </div>

  );

}





function InputField({
  label,
  value
}) {


  return (

    <div>


      <label className="mb-2 block text-sm font-semibold text-gray-700">

        {label}

      </label>



      <input

        readOnly

        value={value || ""}

        placeholder="Awaiting AI extraction..."

        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none ${
          value
            ? "border-blue-200 bg-blue-50 text-gray-900"
            : "border-gray-300 bg-gray-50 text-gray-400"
        }`}

      />


    </div>

  );

}



export default ComplaintForm;