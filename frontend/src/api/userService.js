import axiosClient from "./axiosClient";
export async function getUsers() {
  const response = await axiosClient.get("/users");
  return response.data;
}
export async function createUser(data) {
  const response = await axiosClient.post("/users", data);
  return response.data;
}
export async function updateUser(id, data) {
  const response = await axiosClient.put(`/users/${id}`, data);
  return response.data;
}
export async function deactivateUser(id) {
  const response = await axiosClient.patch(`/users/${id}/deactivate`);
  return response.data;
}
