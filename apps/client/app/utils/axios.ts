import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_SERVER_ENDPOINT,
  withCredentials: true,
});
