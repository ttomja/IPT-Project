import axiosClient from "./axiosClient";
export async function getCurrentInventoryReport() {
  const response = await axiosClient.get("/reports/inventory");
  return response.data;
}
export async function getLowStockReport() {
  const response = await axiosClient.get("/reports/low-stock");
  return response.data;
}
export async function getStockInReport() {
  const response = await axiosClient.get("/reports/stock-in");
  return response.data;
}
export async function getStockOutReport() {
  const response = await axiosClient.get("/reports/stock-out");
  return response.data;
}
