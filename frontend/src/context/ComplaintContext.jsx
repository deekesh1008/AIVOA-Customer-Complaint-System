import { createContext, useContext, useState, useEffect, useRef } from "react";
import { analyzeComplaintData } from "../services/aiService";


const ComplaintContext = createContext(null);



export function ComplaintProvider({ children }) {


  const [complaint, setComplaint] = useState({});

  const [riskAssessment, setRiskAssessment] = useState(null);

  const prevComplaintRef = useRef("{}");

  const updateComplaint = (newComplaint) => {

    setComplaint((previousComplaint) => ({

      ...previousComplaint,

      ...newComplaint,

    }));

  };

  useEffect(() => {
    const currentStr = JSON.stringify(complaint);
    if (currentStr === prevComplaintRef.current) return;
    prevComplaintRef.current = currentStr;

    if (!complaint || Object.keys(complaint).length === 0 || !Object.values(complaint).some(v => v && String(v).trim() !== "")) {
      setRiskAssessment(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await analyzeComplaintData(complaint);
        if (response?.data?.risk_assessment) {
          setRiskAssessment(response.data.risk_assessment);
        }
      } catch (err) {
        console.error("Auto AI risk analysis error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [complaint]);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [processingProgress, setProcessingProgress] = useState(0);


  const value = {

    complaint,

    setComplaint,

    updateComplaint,

    riskAssessment,

    setRiskAssessment,

    messages,

    setMessages,

    loading,

    setLoading,

    processingProgress,

    setProcessingProgress,

  };





  return (

    <ComplaintContext.Provider value={value}>

      {children}

    </ComplaintContext.Provider>

  );


}





export function useComplaint() {


  const context = useContext(ComplaintContext);



  if (!context) {


    throw new Error(
      "useComplaint must be used inside ComplaintProvider"
    );


  }



  return context;


}