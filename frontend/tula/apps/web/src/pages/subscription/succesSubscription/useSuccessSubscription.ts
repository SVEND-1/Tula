import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReceipt } from '../../../api/paymentApi';
import { createSubscription } from '../../../api/subscriptionApi';

export type ActivationStatus = 'loading' | 'success' | 'error';

export function useSuccessSubscription() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<ActivationStatus>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        handlePostPayment();
    }, []);

    // Вызывается автоматически после редиректа с ЮКассы
    const handlePostPayment = async () => {
        const paymentId = localStorage.getItem('currentPaymentId');

        if (!paymentId) {
            setErrorMsg('Не найден ID платежа. Возможно вы уже активировали подписку.');
            setStatus('error');
            return;
        }

        try {
            // Создаём чек и активируем подписку последовательно
            await createReceipt(paymentId);
            const subRes = await createSubscription(paymentId);
            localStorage.setItem('subscriptionId', subRes.data);
            localStorage.removeItem('currentPaymentId');
            setStatus('success');
        } catch (error) {
            console.error('Ошибка после оплаты:', error);
            setErrorMsg('Оплата прошла, но произошла ошибка при активации. Обратитесь в поддержку.');
            setStatus('error');
        }
    };

    return { status, errorMsg, navigate };
}
