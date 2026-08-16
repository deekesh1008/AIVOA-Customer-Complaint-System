import { useComplaint } from "../../../context/ComplaintContext";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Layers,
  Sparkles,
} from "lucide-react";

function RiskAssessment() {
  const { riskAssessment, complaint } = useComplaint();

  // Instant local calculation for 0ms UI responsiveness on single field edit
  const essentialFields = [
    { key: "customer_name", label: "Customer Name" },
    { key: "product_name", label: "Product Name" },
    { key: "product_strength_grade", label: "Strength / Grade" },
    { key: "batch_lot_number", label: "Batch / Lot Number" },
    { key: "manufacturing_date", label: "Manufacturing Date" },
    { key: "expiry_date", label: "Expiry Date" },
    { key: "quantity_affected", label: "Quantity Affected" },
    { key: "complaint_type", label: "Complaint Type" },
    { key: "detailed_complaint_description", label: "Detailed Description" },
  ];

  const filledCount = essentialFields.filter(
    (f) => complaint?.[f.key] && String(complaint[f.key]).trim() !== ""
  ).length;

  const instantScoreNum = Math.round((filledCount / essentialFields.length) * 100);
  const missingFields = essentialFields.filter(
    (f) => !complaint?.[f.key] || String(complaint[f.key]).trim() === ""
  );

  const {
    severity = "Low",
    next_action = "",
    justification = "",
    complaint_summary = "",
    root_cause_recommendation = "",
    capa_recommendation = "",
    duplicate_complaint_check = "",
  } = riskAssessment || {};

  const getSeverityBadge = (level) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-olive-600 animate-pulse" size={22} />
          <h2 className="text-lg font-bold text-gray-900">
            AI Quality Intelligence & Risk Assessment
          </h2>
        </div>
        <span className="rounded-full bg-olive-50 px-3 py-1 text-xs font-semibold text-olive-700 border border-olive-200">
          Live Auto-Sync
        </span>
      </div>

      {/* 1. Completeness Score Gauge (Instant 0ms sync) */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-olive-600" />
            Form Completeness Gauge
          </span>
          <span className="text-sm font-extrabold text-olive-700">
            {instantScoreNum}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-300 ${
              instantScoreNum === 100
                ? "bg-emerald-500"
                : instantScoreNum > 50
                ? "bg-olive-600"
                : "bg-amber-500"
            }`}
            style={{ width: `${instantScoreNum}%` }}
          />
        </div>

        <p className="mt-2.5 text-xs text-gray-600 leading-relaxed">
          {instantScoreNum === 100 ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 size={14} /> Form is 100% complete! All essential complaint attributes are filled.
            </span>
          ) : (
            <span>
              Form is <strong className="text-gray-900">{instantScoreNum}%</strong> complete. Missing {missingFields.length} essential attributes:{" "}
              <strong className="text-olive-800">
                {missingFields.map((f) => f.label).join(", ")}
              </strong>.
            </span>
          )}
        </p>
      </div>

      {/* 2. AI Risk Classification & Severity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 p-3.5 bg-white shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
            Severity Rating
          </span>
          <span
            className={`inline-block rounded-md border px-3 py-1 text-xs font-extrabold ${getSeverityBadge(
              severity
            )}`}
          >
            {severity} Severity
          </span>
        </div>

        <div className="rounded-xl border border-gray-200 p-3.5 bg-white shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
            Recommended QA Action
          </span>
          <p className="text-xs font-semibold text-gray-800 line-clamp-2">
            {next_action || "Awaiting AI recommendation..."}
          </p>
        </div>
      </div>

      {/* 3. Executive Complaint Summary */}
      {complaint_summary && (
        <div className="rounded-xl border border-olive-100 bg-olive-50/40 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-olive-900 mb-1">
            <FileText size={15} />
            Executive Summary
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            {complaint_summary}
          </p>
        </div>
      )}

      {/* 4. Risk Justification */}
      {justification && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
            <ShieldAlert size={15} className="text-olive-700" />
            Risk & Severity Rationale
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {justification}
          </p>
        </div>
      )}

      {/* 5. Root Cause & CAPA Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {root_cause_recommendation && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
              <Search size={15} className="text-olive-700" />
              Root Cause Recommendation
            </div>
            <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
              {root_cause_recommendation}
            </p>
          </div>
        )}

        {capa_recommendation && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
              <CheckCircle2 size={15} className="text-emerald-600" />
              CAPA Action Plan
            </div>
            <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
              {capa_recommendation}
            </p>
          </div>
        )}
      </div>

      {/* 6. Duplicate Complaint Detector */}
      {duplicate_complaint_check && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue-900 mb-1">
            <Layers size={15} className="text-blue-700" />
            Duplicate & Batch History Check
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            {duplicate_complaint_check}
          </p>
        </div>
      )}
    </div>
  );
}

export default RiskAssessment;
