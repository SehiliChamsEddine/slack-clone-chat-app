import axiosInstance from "./axios";

export const getStreamToken = async (): Promise<{ token: string }> => {
  const response = await axiosInstance.get("/api/chat/");
  return response.data;

};
