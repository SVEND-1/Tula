import axios from "axios";

const RECEIPT_API = axios.create({
    baseURL: "http://localhost:8080/api/receipts",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// получить чек по paymentId
export const getReceipt = (paymentId: string) => {
    return RECEIPT_API.get(`/${paymentId}`);
};

// создать чек
export const createReceipt = (paymentId: string) => {
    return RECEIPT_API.post(`/${paymentId}`);
};