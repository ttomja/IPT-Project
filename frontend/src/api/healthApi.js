// src/api/healthApi.js
import axiosClient from "./axiosClient";

export const checkBackendHealth = async () => {
  const response = await axiosClient.get("/health");
  return response.data;
};
