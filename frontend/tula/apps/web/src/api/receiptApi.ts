import axios from "axios";

const RECEIPT_API = axios.create({
    // Относительный путь — работает через Vite прокси
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

// Получить чек по paymentId — GET /api/receipts/{paymentId}
export const getReceipt = (paymentId: string) => {
    return RECEIPT_API.get(`/${paymentId}`);
};

// Создать чек — POST /api/receipts/{paymentId}
export const createReceipt = (paymentId: string) => {
    return RECEIPT_API.post(`/${paymentId}`);
};
