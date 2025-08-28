import axiosInstance from "./axios";

export const getStreamToken = async (): Promise<{ token: string }> => {
  const response = await axiosInstance.get("/chat/token");
  return response.data;

};
