import axios from "axios";
import { API } from "@/config/api";


// DAILY SUMMARY (requires token)
export const getDailySummary = async (date) => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/admin/daily-summary`, {
    params: { date },
    headers: {
      Authorization: `Bearer ${token}`, // REQUIRED
    },
  });
};

// BILLING (does NOT require token)
export const getBilling = async (month, year) => {
  return axios.get(`${API}/billing`, {
    params: { month, year },
  });
};

export const addCustomer = async (payload) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API}/staff/customers`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAreas = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API}/staff/areas`, {                //get areas for customer and changesz endpoint on 23rd jan
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Fetch subareas of a selected area
export const getSubareas = async (areaId) => {
  const token = localStorage.getItem("token");
  return axios.get(`${API}/staff/areas/${areaId}/subareas`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


// CREATE VENDOR
export const addVendor = async (payload) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API}/staff/vendors`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// CREATE AREA
export const addArea = async (payload) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API}/staff/areas`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// SET MILK PRICE
export const setMilkPrice = async (payload) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API}/settings/milk-price`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
