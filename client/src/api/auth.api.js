import axiosInstance from "../utils/axiosInstance";

export const registerAPI = (data) => axiosInstance.post("/auth/register", data);
export const loginAPI = (data) => axiosInstance.post("/auth/login", data);
