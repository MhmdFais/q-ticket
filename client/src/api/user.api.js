import axiosInstance from "../utils/axiosInstance";

export const getAllUsersAPI = (params) =>
  axiosInstance.get("/users", { params });
export const getUserByIdAPI = (id) => axiosInstance.get(`/users/${id}`);
export const updateUserStatusAPI = (id, data) =>
  axiosInstance.patch(`/users/${id}/status`, data);
export const updateUserRoleAPI = (id, data) =>
  axiosInstance.patch(`/users/${id}/role`, data);
