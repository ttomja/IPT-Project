// src/api/authApi.js
import axiosClient from "./axiosClient";

export const loginUser = async (loginData) => {
  const response = await axiosClient.post("/auth/login", loginData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosClient.get("/auth/me");
  return response.data;
};
