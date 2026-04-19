import axios from 'axios';
import type { Receipt, Payment, PaymentPageResponse, PaymentCreateResponse } from '../types/receipt/receipt.types.ts';

// ─── Payments API ────────────────────────────────────────────────

const paymentsApi = axios.create({
  baseURL: '/api/payments',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Список платежей пользователя с пагинацией
export const getPayments = (page = 0, size = 10) =>
  paymentsApi.get<PaymentPageResponse>('', { params: { page, size } });

// Один платёж по ID
export const getPayment = (paymentId: string) =>
  paymentsApi.get<Payment>(`/${paymentId}`);

// Создать платёж (инициирует оплату через ЮКассу)
export const createPayment = () =>
  paymentsApi.post<PaymentCreateResponse>('');

// ─── Receipts API ────────────────────────────────────────────────

const receiptsApi = axios.create({
  baseURL: '/api/receipts',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Получить чек по paymentId
export const getReceipt = (paymentId: string) =>
  receiptsApi.get<Receipt>(`/${paymentId}`);

// Создать чек (вызывается после успешной оплаты)
export const createReceipt = (paymentId: string) =>
  receiptsApi.post<Receipt>(`/${paymentId}`);
