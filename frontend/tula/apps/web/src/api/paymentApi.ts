import axios from "axios";

const API_BASE_URL = window.location.origin;

const PAYMENT_API = axios.create({
    baseURL: `${API_BASE_URL}/api/payments`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
PAYMENT_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface PaymentCreateResponse {
    paymentId: string;
    urlPay: string;
}

export interface PaymentResponse {
    id: string;
    value: string;
    description: string;
    status: string;
    createdAt: string;
}

export interface PaymentPageResponse {
    content: PaymentResponse[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface ReceiptResponse {
    id: string;
    type: string;
    paymentId: string;
    status: string;
    amount: string;
    fiscalDocumentNumber: string;
    fiscalStorageNumber: string;
    fiscalAttribute: string;
    registeredAt: string;
    fiscalProviderId: string;
    items: ReceiptItem[];
    settlements: SettlementReceipt[];
    sellerName: string;
}

export interface ReceiptItem {
    description: string;
    quantity: string;
    amountValue: string;
    amountCurrency: string;
    vatCode: number;
}

export interface SettlementReceipt {
    type: string;
    amountValue: string;
    amountCurrency: string;
}

export interface SubscriptionDetailResponse {
    id: number;
    status: string;
    startDate: string;
    endDate: string;
    paymentId: string;
}

export const createPayment = () => {
    return PAYMENT_API.post<PaymentCreateResponse>('');
};

export const getPayments = (page: number = 0, size: number = 10) => {
    return PAYMENT_API.get<PaymentPageResponse>('', { params: { page, size } });
};

export const getPaymentById = (paymentId: string) => {
    return PAYMENT_API.get<PaymentResponse>(`/${paymentId}`);
};

export const createReceipt = (paymentId: string) => {
    return PAYMENT_API.post<ReceiptResponse>(`/${paymentId}/receipt`);
};

export const getReceipt = (paymentId: string) => {
    return PAYMENT_API.get<ReceiptResponse>(`/${paymentId}/receipt`);
};

export const getSubscription = (id: number) => {
    return PAYMENT_API.get<SubscriptionDetailResponse>(`/subscription/${id}`);
};

export default PAYMENT_API;
