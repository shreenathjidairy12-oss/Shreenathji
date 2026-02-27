import axios from "axios";
import { API } from "@/config/api";

const BASE_URL = `${API}/pos`;

// Get auth token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

// Item APIs
export const getItems = async () => {
    const response = await axios.get(`${BASE_URL}/items`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const addItem = async (itemData) => {
    const response = await axios.post(`${BASE_URL}/items`, itemData, {
        headers: getAuthHeader(),
    });
    return response.data;
};


export const updateItemPrice = async (itemId, newPrice) => {
    const response = await axios.patch(
        `${BASE_URL}/items/${itemId}/price`,
        { price: newPrice },
        { headers: getAuthHeader() }
    );
    return response.data;
};

// Bill APIs
export const generateBill = async (billData) => {
    const response = await axios.post(`${BASE_URL}/bills`, billData, {
        headers: getAuthHeader(),
    });
    return response.data;
};
