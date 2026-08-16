import { useState } from "react";
import { CheckCircle2, RefreshCw, Save, Sparkles, ShieldCheck } from "lucide-react";

import { saveComplaint } from "../../../services/complaintService";
import { useComplaint } from "../../../context/ComplaintContext";


function ComplaintForm({
  complaint = {},
}) {

  const { setComplaint, setRiskAssessment, setMessages } = useComplaint();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const handleResetForm = () => {
    setComplaint({});
    setRiskAssessment(null);
    if (setMessages) setMessages([]);
    setSaveSuccess(null);
  };

  const handleSaveComplaint = async () => {

    try {

      setSaving(true);


      const response = await saveComplaint(
        complaint
      );


      setSaveSuccess({
        complaint_id: response.complaint_id,
        timestamp: new Date().toLocaleTimeString(),
      });

      handleResetForm();

    } catch (error) {


      console.error(error);


      alert(
        "Failed to save complaint. Please try again."
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

    <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-xl">

      {/* SUCCESS MESSAGE BANNER */}
      {saveSuccess && (
        <div className="mb-6 rounded-2xl border-2 border-emerald-400 bg-emerald-50/90 p-5 shadow-lg flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-emerald-950">
                Your Complaint Has Been Successfully Sent & Saved!
              </h3>
              <p className="text-xs font-semibold text-emerald-800 mt-1 leading-relaxed">
                Complaint Reference ID: <span className="rounded bg-emerald-200/80 px-2 py-0.5 font-black text-emerald-950 border border-emerald-300">#{saveSuccess.complaint_id}</span> • Form reset for new intake.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetForm}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-emerald-800 transition"
          >
            <RefreshCw size={14} /> Make Another Complaint
          </button>
        </div>
      )}


      <div className="flex items-start justify-between border-b pb-5">


        <div>

          <h1 className="text-3xl font-black text-gray-900 tracking-tight">

            Log Customer Complaint

          </h1>


          <p className="mt-1.5 text-sm font-semibold text-gray-600">

            API & FDF Quality Assurance Module • AI Form Population

          </p>


        </div>




        <span className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-extrabold text-amber-800 shadow-sm">

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


            <label className="mb-2 block text-sm font-extrabold text-gray-900">

              Detailed Complaint Description

            </label>


            <textarea

              readOnly

              value={
                complaint.detailed_complaint_description || ""
              }

              rows="4"

              placeholder="Awaiting AI extraction from document, handwriting photo, or chat..."

              className="w-full rounded-xl border-2 border-gray-300 bg-stone-50 px-4 py-3 text-base font-bold text-gray-900 outline-none cursor-default shadow-inner placeholder:font-normal placeholder:text-gray-400"

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

          type="button"

          onClick={handleResetForm}

          className="flex items-center gap-2 rounded-xl border border-gray-400 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition shadow-sm"

        >

          <RefreshCw size={16} /> Reset Form

        </button>




        <button

          onClick={handleSaveComplaint}

          disabled={saving}

          className="flex items-center gap-2 rounded-xl bg-olive-700 px-8 py-3 text-sm font-black text-white shadow-lg transition hover:bg-olive-800 disabled:opacity-50"

        >

          {saving ? (
            "Saving..."
          ) : (
            <>
              <Save size={18} /> Save & Submit Complaint
            </>
          )}

        </button>


      </div>


    </div>

  );

}





function Section({ title, children }) {


  return (

    <div className="mt-8 rounded-xl border border-gray-200 bg-stone-50/60 p-5 shadow-sm">


      <h2 className="mb-5 text-sm font-black uppercase tracking-wider text-olive-950 border-l-4 border-olive-700 pl-3">

        {title}

      </h2>


      {children}


    </div>

  );

}





function InputField({
  label,
  value,
}) {


  return (

    <div>


      <label className="mb-2 block text-sm font-extrabold text-gray-900">

        {label}

      </label>



      <input

        readOnly

        type="text"

        value={value || ""}

        placeholder="Awaiting AI extraction..."

        className={`w-full rounded-xl border-2 px-4 py-3 text-base outline-none cursor-default font-bold transition-all shadow-sm ${
          value
            ? "border-olive-500 bg-white text-gray-950"
            : "border-gray-300 bg-stone-50 text-gray-400 font-normal"
        }`}

      />


    </div>

  );

}



export default ComplaintForm;