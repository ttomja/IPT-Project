import axiosClient from "./axiosClient";
export async function getProducts(params = {}) {
  const response = await axiosClient.get("/products", { params });
  return response.data;
}
export async function createProduct(productData) {
  const response = await axiosClient.post("/products", productData);
  return response.data;
}
export async function updateProduct(id, productData) {
  const response = await axiosClient.put(`/products/${id}`, productData);
  return response.data;
}
export async function deactivateProduct(id) {
  const response = await axiosClient.patch(`/products/${id}/deactivate`);
  return response.data;
}
