import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReceipt } from '../../../api/receiptApi';
import { getPayments } from '../../../api/paymentApi';
import { createSubscription } from '../../../api/subscriptionApi';
import type { SubscriptionInfo } from '../subscription/useSubscription';

export type ActivationStatus = 'loading' | 'success' | 'error';

const POLL_INTERVAL = 3000;   // проверяем каждые 3 сек
const POLL_TIMEOUT  = 120000; // максимум 2 минуты

export function useSuccessSubscription() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<ActivationStatus>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        handlePostPayment();
    }, []);

    const handlePostPayment = async () => {
        const paymentId = localStorage.getItem('currentPaymentId');

        if (!paymentId) {
            setErrorMsg('Не найден ID платежа. Возможно вы уже активировали подписку.');
            setStatus('error');
            return;
        }

        try {
            // Ждём пока ЮКасса подтвердит платёж
            const confirmed = await waitForPaymentConfirmation(paymentId);

            if (!confirmed) {
                setErrorMsg('Платёж не подтверждён за отведённое время. Обратитесь в поддержку.');
                setStatus('error');
                return;
            }

            // Создаём чек — POST /api/receipts/{paymentId}
            await createReceipt(paymentId);

            // Активируем подписку
            await createSubscription(paymentId);

            // Сохраняем статус подписки
            const subData: SubscriptionInfo = { status: 'ACTIVE', endDate: '' };
            localStorage.setItem('subscriptionData', JSON.stringify(subData));
            localStorage.removeItem('currentPaymentId');

            setStatus('success');
        } catch (error) {
            console.error('Ошибка после оплаты:', error);
            setErrorMsg('Оплата прошла, но произошла ошибка при активации. Обратитесь в поддержку.');
            setStatus('error');
        }
    };

    // Polling — ждём пока платёж станет succeeded
    const waitForPaymentConfirmation = (paymentId: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const interval = setInterval(async () => {
                try {
                    const res = await getPayments(0, 20);
                    const found = res.data.content.find(p => p.id === paymentId);

                    if (found?.status === 'succeeded') {
                        clearInterval(interval);
                        clearTimeout(timeout);
                        resolve(true);
                    }
                } catch (error) {
                    console.error('Ошибка проверки статуса платежа:', error);
                }
            }, POLL_INTERVAL);

            const timeout = setTimeout(() => {
                clearInterval(interval);
                resolve(false);
            }, POLL_TIMEOUT);
        });
    };

    return { status, errorMsg, navigate };
}
