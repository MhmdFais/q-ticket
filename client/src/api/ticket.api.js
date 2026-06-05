import axiosInstance from "../utils/axiosInstance";

export const createTicketAPI = (data) => axiosInstance.post("/tickets", data);
export const getAllTicketsAPI = (params) =>
  axiosInstance.get("/tickets", { params });
export const getTicketByIdAPI = (id) => axiosInstance.get(`/tickets/${id}`);
export const updateTicketAPI = (id, data) =>
  axiosInstance.put(`/tickets/${id}`, data);
export const updateTicketStatusAPI = (id, data) =>
  axiosInstance.patch(`/tickets/${id}/status`, data);
export const assignTicketAPI = (id, data) =>
  axiosInstance.patch(`/tickets/${id}/assign`, data);
export const addCommentAPI = (id, data) =>
  axiosInstance.post(`/tickets/${id}/comments`, data);
export const deleteTicketAPI = (id) => axiosInstance.delete(`/tickets/${id}`);
