import api from "./api";


export const saveComplaint = async (complaintData) => {

  const response = await api.post(
    "/complaints/save",
    complaintData
  );

  return response.data;
};