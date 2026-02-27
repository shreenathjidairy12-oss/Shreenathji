// customerApi.js
import axios from "axios";
import { API } from "../../../config/api";

const apiClient = axios.create({
  baseURL: API,
});

// Attach token automatically if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * GET /customers/:customerId/summary?year=YYYY&month=M
 * Returns the same shape you posted (msg, month, year, totalLitres, totalAmount, daily[])
 */
export const getCustomerMonthlySummary = (customerId, year, month) =>
  apiClient.get(`/customers/${customerId}/summary`, {
    params: { year, month },
  });
