import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment, getPayments, getSubscription } from '../../../api/paymentApi.ts';
import { createSubscription } from '../../../api/subscriptionApi.ts';
import type { SubscriptionDetailResponse } from '../../../api/paymentApi.ts';

const PAYMENT_CHECK_INTERVAL = 3000;
const PAYMENT_CHECK_TIMEOUT = 300000;

export function useSubscription() {
    const navigate = useNavigate();

    const [subscription, setSubscription] = useState<SubscriptionDetailResponse | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkSubscription();
    }, []);

    // Проверяем есть ли активная подписка в localStorage
    const checkSubscription = async () => {
        try {
            const subscriptionId = localStorage.getItem('subscriptionId');
            if (!subscriptionId) return;

            const res = await getSubscription(Number(subscriptionId));
            setSubscription(res.data);
            if (res.data.status === 'ACTIVE') setIsSubscribed(true);
        } catch (error) {
            console.error('Ошибка проверки подписки:', error);
        }
    };

    // Создаём платёж → открываем ЮКассу → начинаем polling
    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const res = await createPayment();
            const { paymentId, urlPay } = res.data;

            localStorage.setItem('currentPaymentId', paymentId);
            window.open(urlPay, '_blank');
            startPaymentStatusPolling(paymentId);
        } catch (error) {
            console.error('Ошибка создания подписки:', error);
            alert('Ошибка при создании подписки');
        } finally {
            setIsLoading(false);
        }
    };

    // Polling — ждём succeeded и активируем подписку
    const startPaymentStatusPolling = (paymentId: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await getPayments(0, 10);
                const found = res.data.content.find(p => p.id === paymentId);

                if (found?.status === 'succeeded') {
                    clearInterval(interval);

                    const subRes = await createSubscription(paymentId);
                    localStorage.removeItem('currentPaymentId');
                    localStorage.setItem('subscriptionId', subRes.data);

                    alert('✅ Подписка успешно оформлена!');
                    setIsSubscribed(true);
                    checkSubscription();
                }
            } catch (error) {
                console.error('Ошибка проверки статуса:', error);
            }
        }, PAYMENT_CHECK_INTERVAL);

        setTimeout(() => clearInterval(interval), PAYMENT_CHECK_TIMEOUT);
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return 'Не указано';
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
    };

    return {
        subscription,
        isSubscribed,
        isLoading,
        navigate,
        handleSubscribe,
        formatDate,
    };
}
