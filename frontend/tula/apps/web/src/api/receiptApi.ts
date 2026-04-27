import axios from "axios";

const RECEIPT_API = axios.create({
    baseURL: "/api/receipts",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

RECEIPT_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getReceipt = (paymentId: string) => {
    return RECEIPT_API.get(`/${paymentId}`);
};

export const createReceipt = (paymentId: string) => {
    return RECEIPT_API.post(`/${paymentId}`);
};
