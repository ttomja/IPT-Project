import axiosClient from "./axiosClient";
export async function recordStockIn(data) {
  const response = await axiosClient.post("/stock/in", data);
  return response.data;
}
export async function recordStockOut(data) {
  const response = await axiosClient.post("/stock/out", data);
  return response.data;
}
export async function getTransactions() {
  const response = await axiosClient.get("/stock/transactions");
  return response.data;
}
