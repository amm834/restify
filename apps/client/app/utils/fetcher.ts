import { axiosInstance } from "./axios";

export const fetcher = async<T>(url: string) => {
  const response = await axiosInstance.get<T>(url);
  return response.data;
};
