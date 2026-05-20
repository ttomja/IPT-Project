import axiosClient from "./axiosClient";

export const recordStockIn = (data) => axiosClient.post("/stock/in", data);
export const recordStockOut = (data) => axiosClient.post("/stock/out", data);
export const getTransactions = (params) => axiosClient.get("/stock/transactions", { params });
