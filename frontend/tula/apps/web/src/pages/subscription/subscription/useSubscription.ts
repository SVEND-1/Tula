import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment } from '../../../api/paymentApi'

export interface SubscriptionInfo {
    status: string;
    endDate: string;
}

export function useSubscription() {
    const navigate = useNavigate();

    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkSubscriptionFromStorage();
    }, []);

    const checkSubscriptionFromStorage = () => {
        const stored = localStorage.getItem('subscriptionData');
        if (!stored) return;
        try {
            const data: SubscriptionInfo = JSON.parse(stored);
            if (data.status === 'ACTIVE') {
                setSubscription(data);
                setIsSubscribed(true);
            }
        } catch {
            localStorage.removeItem('subscriptionData');
        }
    };

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const res = await createPayment();
            const { paymentId, urlPay } = res.data;

            // Сохраняем paymentId — /succeeded-payment прочитает его после редиректа
            localStorage.setItem('currentPaymentId', paymentId);

            // Редиректим в ту же вкладку чтобы ЮКасса вернула нас на /succeeded-payment
            window.location.href = urlPay;
        } catch (error) {
            console.error('Ошибка создания подписки:', error);
            alert('Ошибка при создании подписки');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return 'Не указано';
        return dateString;
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