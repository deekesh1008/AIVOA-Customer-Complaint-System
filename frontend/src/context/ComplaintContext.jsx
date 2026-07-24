import { createContext, useContext, useState } from "react";


const ComplaintContext = createContext(null);



export function ComplaintProvider({ children }) {


  const [complaint, setComplaint] = useState({});



  const updateComplaint = (newComplaint) => {


    setComplaint((previousComplaint) => ({


      ...previousComplaint,


      ...newComplaint,


    }));


  };



  const [messages, setMessages] = useState([]);



  const [loading, setLoading] = useState(false);



  const [processingProgress, setProcessingProgress] = useState(0);





  const value = {


    complaint,

    setComplaint,

    updateComplaint,



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