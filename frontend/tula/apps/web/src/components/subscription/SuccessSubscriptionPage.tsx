import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReceipt } from '../../api/paymentApi';
import { createSubscription } from '../../api/subscriptionApi';
import styles from './SuccessSubscriptionPage.module.css';

// ЮКасса редиректит сюда после успешной оплаты.
// Наша задача: создать чек и активировать подписку.
const SuccessSubscriptionPage: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        handlePostPayment();
    }, []);

    const handlePostPayment = async () => {
        // paymentId сохранили в localStorage в момент создания платежа (в SubscriptionPage)
        const paymentId = localStorage.getItem('currentPaymentId');

        if (!paymentId) {
            setErrorMsg('Не найден ID платежа. Возможно вы уже активировали подписку.');
            setStatus('error');
            return;
        }

        try {
            // 1. Создаём чек — POST /api/payments/{paymentId}/receipt
            await createReceipt(paymentId);

            // 2. Создаём/активируем подписку
            const subResponse = await createSubscription(paymentId);
            localStorage.setItem('subscriptionId', subResponse.data);

            // Чистим временный paymentId
            localStorage.removeItem('currentPaymentId');

            setStatus('success');
        } catch (error) {
            console.error('Ошибка после оплаты:', error);
            setErrorMsg('Оплата прошла, но произошла ошибка при активации. Обратитесь в поддержку.');
            setStatus('error');
        }
    };

    if (status === 'loading') {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <div className={styles.spinner} />
                    <p className={styles.text}>Активируем подписку...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <div className={styles.icon}>⚠️</div>
                    <h2 className={styles.title}>Что-то пошло не так</h2>
                    <p className={styles.text}>{errorMsg}</p>
                    <button className={styles.btn} onClick={() => navigate('/receipts')}>
                        Посмотреть чеки
                    </button>
                    <button className={styles.btnSecondary} onClick={() => navigate('/main')}>
                        На главную
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.icon}>🎉</div>
                <h2 className={styles.title}>Подписка активирована!</h2>
                <p className={styles.text}>
                    Добро пожаловать в Premium. Чек сохранён и доступен в истории платежей.
                </p>
                <button className={styles.btn} onClick={() => navigate('/receipts')}>
                    Посмотреть чек
                </button>
                <button className={styles.btnSecondary} onClick={() => navigate('/main')}>
                    На главную
                </button>
            </div>
        </div>
    );
};

export default SuccessSubscriptionPage;
