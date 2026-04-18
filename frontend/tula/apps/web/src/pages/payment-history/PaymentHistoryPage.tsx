import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentList from '../../components/payment-history/PaymentList';
import PaymentDetails from '../../components/payment-history/PaymentDetails';
import Pagination from '../../components/payment-history/Pagination';
import CloseButton from '../../components/subscription/CloseButton';
import { createPayment, getPayments, getReceipt, createReceipt } from '../../api/paymentApi';
import { createSubscription } from '../../api/subscriptionApi';
import type { PaymentResponse, ReceiptResponse } from '../../api/paymentApi';
import '../../style/payment-history/PaymentHistoryPage.scss';

const PaymentHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [receipt, setReceipt] = useState<ReceiptResponse | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [isCreatingPayment, setIsCreatingPayment] = useState(false);

    const itemsPerPage = 10;

    useEffect(() => {
        loadPayments(currentPage);
    }, [currentPage]);

    const loadPayments = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await getPayments(page, itemsPerPage);
            setPayments(response.data.content);
            setTotalPages(response.data.totalPages);
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

    const handleSelectPayment = async (payment: PaymentResponse) => {
        setSelectedPayment(payment);
        setReceipt(null);

        try {
            const response = await getReceipt(payment.id);
            setReceipt(response.data);
        } catch (error) {
            setReceipt(null);
        }
    };

    const handleCreatePayment = async () => {
        setIsCreatingPayment(true);
        try {
            const response = await createPayment();
            const { paymentId, urlPay } = response.data;

            localStorage.setItem('currentPaymentId', paymentId);
            window.open(urlPay, '_blank');
            checkPaymentStatus(paymentId);
        } catch (error) {
            console.error('Ошибка создания платежа:', error);
            alert('Ошибка при создании платежа. Попробуйте позже.');
        } finally {
            setIsCreatingPayment(false);
        }
    };

    const checkPaymentStatus = async (paymentId: string) => {
        const interval = setInterval(async () => {
            try {
                const response = await getPayments(0, itemsPerPage);
                const updatedPayments = response.data.content;
                const foundPayment = updatedPayments.find(p => p.id === paymentId);

                console.log('Проверка платежа:', { paymentId, foundPayment });

                if (foundPayment && foundPayment.status === 'succeeded') {
                    clearInterval(interval);
                    localStorage.removeItem('currentPaymentId');

                    try {
                        console.log('Оформляем подписку для paymentId:', paymentId);
                        const subscriptionResponse = await createSubscription(paymentId);
                        console.log('Ответ подписки:', subscriptionResponse.data);
                        alert('✅ Подписка успешно оформлена!');
                    } catch (subError: any) {
                        console.error('Ошибка оформления подписки:', subError.response?.data || subError.message);
                        alert(`❌ Ошибка оформления подписки: ${subError.response?.data?.message || 'Неизвестная ошибка'}`);
                    }

                    alert('✅ Оплата прошла успешно!');
                    loadPayments(currentPage);
                }
            } catch (error) {
                console.error('Ошибка проверки статуса:', error);
            }
        }, 3000);

        setTimeout(() => clearInterval(interval), 300000);
    };

    const handleCreateReceipt = async () => {
        if (!selectedPayment) return;

        try {
            const response = await createReceipt(selectedPayment.id);
            setReceipt(response.data);
            alert('✅ Чек успешно создан!');
        } catch (error) {
            console.error('Ошибка создания чека:', error);
            alert('❌ Ошибка при создании чека');
        }
    };

    const handleClose = () => {
        navigate('/profile');
    };

    const handleManualActivateSubscription = async () => {
        const paymentId = localStorage.getItem('currentPaymentId');
        if (!paymentId) {
            alert('Нет paymentId. Сначала создайте платеж.');
            return;
        }
        try {
            const response = await createSubscription(paymentId);
            console.log('Активация:', response.data);
            alert('✅ Подписка активирована!');
            localStorage.removeItem('currentPaymentId');
        } catch (err: any) {
            console.error('Ошибка:', err.response?.data);
            alert(`Ошибка: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="payment-history-page">
            <CloseButton onClose={handleClose} />

            <div className="payment-history-page__sidebar">
                <div className="payment-history-page__create-section">
                    <button
                        className="create-payment-btn"
                        onClick={handleCreatePayment}
                        disabled={isCreatingPayment}
                    >
                        {isCreatingPayment ? 'Создание...' : '💳 Сделать пожертвование'}
                    </button>
                </div>

                {isLoading && payments.length === 0 ? (
                    <div className="payment-list__loading">Загрузка платежей...</div>
                ) : (
                    <>
                        <PaymentList
                            payments={payments}
                            selectedId={selectedPayment?.id || null}
                            onSelect={handleSelectPayment}
                        />
                        {isLoading && payments.length > 0 && (
                            <div className="payment-list__loading-more">Загрузка...</div>
                        )}
                    </>
                )}

                <div className="payment-history-page__pagination">
                    <Pagination
                        currentPage={currentPage + 1}
                        totalPages={totalPages}
                        onPageChange={(page) => handlePageChange(page - 1)}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            <div className="payment-history-page__content">
                {selectedPayment ? (
                    <div className="payment-history-page__content-inner">
                        <PaymentDetails
                            payment={selectedPayment}
                            receipt={receipt}
                            onCreateReceipt={handleCreateReceipt}
                        />
                    </div>
                ) : (
                    <div className="payment-history-page__placeholder">
                        Выберите платеж из списка
                    </div>
                )}
            </div>

            {/* Кнопка ручной активации подписки */}
            <button
                onClick={handleManualActivateSubscription}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 9999,
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #ffcdb0, #ffb88c)',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: '"Playpen Sans", cursive',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
            >
                🔧 Активировать подписку вручную
            </button>
        </div>
    );
};

export default PaymentHistoryPage;