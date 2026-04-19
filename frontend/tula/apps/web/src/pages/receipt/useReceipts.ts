import { useEffect, useState } from "react";
import axios from "axios";

export function useReceipts(page = 0, size = 10) {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchReceipts = async () => {
        setLoading(true);
        const res = await axios.get("/api/payments", {
            params: { page, size },
        });
        setReceipts(res.data.content); // зависит от PaymentPageResponse
        setLoading(false);
    };

    const fetchReceiptById = async (id: string) => {
        const res = await axios.get(`/api/payments/${id}`);
        setSelectedReceipt(res.data);
    };

    const createPayment = async () => {
        const res = await axios.post("/api/payments");
        return res.data; // PaymentCreateResponse
    };

    useEffect(() => {
        fetchReceipts();
    }, [page, size]);

    return {
        receipts,
        selectedReceipt,
        loading,
        fetchReceiptById,
        createPayment,
        refetch: fetchReceipts,
    };
}