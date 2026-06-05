import axiosInstance from "../utils/axiosInstance";

export const getDashboardStatsAPI = () => axiosInstance.get("/dashboard");
