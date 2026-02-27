import axios from "axios";
import { API } from "@/config/api";

const apiClient = axios.create({
  baseURL: API,
});

apiClient.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getAreas = () => apiClient.get("/staff/areas");

export const getSubareas = (areaId) =>
  apiClient.get(`/staff/areas/${areaId}/subareas`);

export const getVendorCustomers = (areaId, subarea) =>
  apiClient.get("/staff/customers", {
    params: {
      area: areaId,
      subarea: subarea,
    },
  });

export const getCustomerCalendar = (customerId, month, year) =>
  apiClient.get(
    `/staff/customers/${customerId}/calendar?month=${month}&year=${year}`
  );

export const saveMilkEntry = (data) =>
  apiClient.post("/staff/milk-entry", data);
