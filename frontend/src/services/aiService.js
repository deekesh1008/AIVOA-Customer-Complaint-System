import api from "./api";


export const processAIRequest = async (data) => {
  const response = await api.post("/ai/process", data);

  return response.data;
};


export const processAIFile = async (file) => {
  const formData = new FormData();

  formData.append("file", file);


  const response = await api.post(
    "/ai/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );


  return response.data;
};