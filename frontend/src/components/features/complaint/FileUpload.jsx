import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";

import { processAIFile } from "../../../services/aiService";
import { useComplaint } from "../../../context/ComplaintContext";


function FileUpload({
  setComplaint,
  setMessages,
}) {

  const { setRiskAssessment } = useComplaint();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const processFile = async (file) => {
    if (!file) return;

    setFileName(file.name);

    try {
      setUploading(true);

      const response = await processAIFile(file);

      console.log("DOCUMENT/PHOTO RESPONSE:", response);

      const resultData = response?.data || response;
      const complaintData = resultData?.complaint || {};

      setComplaint(complaintData);

      if (resultData?.risk_assessment) {
        setRiskAssessment(resultData.risk_assessment);
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            resultData?.assistant_response ||
            "Document / Photo processed successfully.",
        },
      ]);
    } catch (error) {
      console.error("Upload error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: "Failed to process document or photo.",
        },
      ]);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };


  return (
    <div className="rounded-2xl border-2 border-dashed border-olive-300 bg-white p-6 text-center transition hover:border-olive-500 shadow-sm">
      <input
        id="complaint-upload"
        type="file"
        accept=".pdf,.txt,.eml,.jpg,.jpeg,.png,.webp,.bmp"
        className="hidden"
        onChange={handleFileChange}
      />

      <label
        htmlFor="complaint-upload"
        className="flex cursor-pointer flex-col items-center justify-center gap-3"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-olive-100 text-olive-800 shadow-sm hover:bg-olive-200 transition">
          <UploadCloud size={28} />
        </div>

        <div>
          <p className="font-bold text-gray-900 text-base">
            {uploading ? "AI is processing document / handwriting..." : "Upload Complaint Document or Photo"}
          </p>

          <p className="mt-1 text-xs font-semibold text-gray-600">
            Supports PDF, EML, TXT, Printed & Handwritten Photos (PNG/JPG)
          </p>
        </div>

        <div className="mt-1 rounded-xl bg-olive-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-olive-800 transition">
          Choose File / Photo from Device
        </div>

        {fileName && (
          <div className="mt-2 rounded-lg bg-olive-50 px-4 py-1.5 text-xs font-bold text-olive-800 border border-olive-200 inline-flex items-center gap-1.5">
            <FileText size={14} /> {fileName}
          </div>
        )}
      </label>
    </div>
  );
}


export default FileUpload;