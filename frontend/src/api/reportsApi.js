import axiosClient from "./axiosClient";

export const getInventoryReport = () => axiosClient.get("/reports/inventory");
export const getLowStockReport = () => axiosClient.get("/reports/low-stock");
export const getStockInReport = () => axiosClient.get("/reports/stock-in");
export const getStockOutReport = () => axiosClient.get("/reports/stock-out");
