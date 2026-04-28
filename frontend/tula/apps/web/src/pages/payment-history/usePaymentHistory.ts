import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment, getPayments, getReceipt, createReceipt } from '../../api/paymentApi';
import { createSubscription } from '../../api/subscriptionApi';
import type { PaymentResponse, ReceiptResponse } from '../../api/paymentApi';

const ITEMS_PER_PAGE = 10;
const PAYMENT_CHECK_INTERVAL = 3000;  // каждые 3 сек
const PAYMENT_CHECK_TIMEOUT = 300000; // максимум 5 минут

export function usePaymentHistory() {
    const navigate = useNavigate();

    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);
    const [receipt, setReceipt] = useState<ReceiptResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingPayment, setIsCreatingPayment] = useState(false);

    useEffect(() => {
        loadPayments(currentPage);
    }, [currentPage]);

    const loadPayments = async (page: number) => {
        setIsLoading(true);
        try {
            const res = await getPayments(page, ITEMS_PER_PAGE);
            setPayments(res.data.content ?? []);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Ошибка загрузки платежей:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedPayment(null);
        setReceipt(null);
    };

    // Выбор платежа — сразу пытаемся подгрузить чек
    const handleSelectPayment = async (payment: PaymentResponse) => {
        setSelectedPayment(payment);
        setReceipt(null);
        try {
            const res = await getReceipt(payment.id);
            setReceipt(res.data);
        } catch {
            setReceipt(null);
        }
    };

    // Создание платежа → открываем ЮКассу → начинаем polling статуса
    const handleCreatePayment = async () => {
        setIsCreatingPayment(true);
        try {
            const res = await createPayment();
            const { paymentId, urlPay } = res.data;

            localStorage.setItem('currentPaymentId', paymentId);
            window.open(urlPay, '_blank');
            startPaymentStatusPolling(paymentId);
        } catch (error) {
            console.error('Ошибка создания платежа:', error);
            alert('Ошибка при создании платежа. Попробуйте позже.');
        } finally {
            setIsCreatingPayment(false);
        }
    };

    // Polling — проверяем каждые 3 сек пока платёж не станет succeeded
    const startPaymentStatusPolling = (paymentId: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await getPayments(0, ITEMS_PER_PAGE);
                const found = res.data.content.find(p => p.id === paymentId);

                if (found?.status === 'succeeded') {
                    clearInterval(interval);
                    localStorage.removeItem('currentPaymentId');
                    await activateSubscription(paymentId);
                    loadPayments(currentPage);
                }
            } catch (error) {
                console.error('Ошибка проверки статуса платежа:', error);
            }
        }, PAYMENT_CHECK_INTERVAL);

        // Останавливаем polling через 5 минут если не дождались
        setTimeout(() => clearInterval(interval), PAYMENT_CHECK_TIMEOUT);
    };

    const activateSubscription = async (paymentId: string) => {
        try {
            await createSubscription(paymentId);
            alert('✅ Подписка успешно оформлена!');
        } catch (error: any) {
            console.error('Ошибка оформления подписки:', error.response?.data || error.message);
            alert(`❌ Ошибка оформления подписки: ${error.response?.data?.message || 'Неизвестная ошибка'}`);
        }
    };

    // Создание чека вручную для выбранного платежа
    const handleCreateReceipt = async () => {
        if (!selectedPayment) return;
        try {
            const res = await createReceipt(selectedPayment.id);
            setReceipt(res.data);
            alert('✅ Чек успешно создан!');
        } catch (error) {
            console.error('Ошибка создания чека:', error);
            alert('❌ Ошибка при создании чека');
        }
    };

    // Ручная активация подписки — временная кнопка для отладки
    const handleManualActivateSubscription = async () => {
        const paymentId = localStorage.getItem('currentPaymentId');
        if (!paymentId) {
            alert('Нет paymentId. Сначала создайте платеж.');
            return;
        }
        try {
            await createSubscription(paymentId);
            alert('✅ Подписка активирована!');
            localStorage.removeItem('currentPaymentId');
        } catch (err: any) {
            console.error('Ошибка:', err.response?.data);
            alert(`Ошибка: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleClose = () => navigate('/liked');

    return {
        payments,
        selectedPayment,
        receipt,
        currentPage,
        totalPages,
        isLoading,
        isCreatingPayment,
        handlePageChange,
        handleSelectPayment,
        handleCreatePayment,
        handleCreateReceipt,
        handleManualActivateSubscription,
        handleClose,
    };
}
