import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {createPayment, getPayments, getSubscription} from '../../api/paymentApi';
import '../../style/subscription/SubscriptionPage.scss';
import { createSubscription } from '../../api/subscriptionApi';

const SubscriptionPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        checkSubscription();
    }, []);

    const checkSubscription = async () => {
        try {
            const subscriptionId = localStorage.getItem('subscriptionId');
            if (subscriptionId) {
                const response = await getSubscription(Number(subscriptionId));
                setSubscription(response.data);
                if (response.data.status === 'ACTIVE') {
                    setIsSubscribed(true);
                }
            }
        } catch (error) {
            console.error('Ошибка проверки подписки:', error);
        }
    };

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const paymentResponse = await createPayment();
            const { paymentId, urlPay } = paymentResponse.data;

            localStorage.setItem('currentPaymentId', paymentId);

            // Открываем окно оплаты (без сохранения в переменную)
            window.open(urlPay, '_blank');

            checkPaymentStatus(paymentId);

        } catch (error) {
            console.error('Ошибка создания подписки:', error);
            alert('Ошибка при создании подписки');
        } finally {
            setIsLoading(false);
        }
    };

    const checkPaymentStatus = async (paymentId: string) => {
        const interval = setInterval(async () => {
            try {
                // Проверяем статус платежа через получение списка платежей
                const response = await getPayments(0, 10);
                const payments = response.data.content;
                const foundPayment = payments.find(p => p.id === paymentId);

                if (foundPayment && foundPayment.status === 'succeeded') {
                    clearInterval(interval);

                    // Активируем подписку
                    const subscriptionResponse = await createSubscription(paymentId);
                    console.log('Подписка оформлена:', subscriptionResponse.data);

                    localStorage.removeItem('currentPaymentId');
                    localStorage.setItem('subscriptionId', subscriptionResponse.data);

                    alert('✅ Подписка успешно оформлена!');
                    setIsSubscribed(true);
                    checkSubscription();
                }
            } catch (error) {
                console.error('Ошибка проверки статуса:', error);
            }
        }, 3000);

        setTimeout(() => clearInterval(interval), 300000);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Не указано';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="subscription-page">
            <div className="subscription-container">
                <div className="subscription-header">
                    <button onClick={() => navigate('/liked')} className="back-btn">
                        ← Назад
                    </button>
                    <h1>Подписка Adoptly</h1>
                </div>

                {isSubscribed && subscription ? (
                    <div className="subscription-active">
                        <div className="active-icon">✅</div>
                        <h2>Подписка активна!</h2>
                        <div className="subscription-info">
                            <div className="info-row">
                                <span>Статус:</span>
                                <span className="status-active">Активна</span>
                            </div>
                            <div className="info-row">
                                <span>Дата начала:</span>
                                <span>{formatDate(subscription.startDate)}</span>
                            </div>
                            <div className="info-row">
                                <span>Дата окончания:</span>
                                <span>{formatDate(subscription.endDate)}</span>
                            </div>
                        </div>
                        <button className="extend-btn" onClick={handleSubscribe} disabled={isLoading}>
                            {isLoading ? 'Обработка...' : 'Продлить подписку'}
                        </button>
                    </div>
                ) : (
                    <div className="subscription-plans">
                        <div className="plan-card recommended">
                            <div className="plan-badge">Рекомендуемый</div>
                            <h3>Премиум подписка</h3>
                            <div className="plan-price">
                                499 ₽
                                <span>/месяц</span>
                            </div>
                            <ul className="plan-features">
                                <li>✓ Неограниченные лайки</li>
                                <li>✓ Приоритетная поддержка</li>
                                <li>✓ Ранний доступ к новым функциям</li>
                                <li>✓ Без рекламы</li>
                            </ul>
                            <button
                                className="subscribe-btn"
                                onClick={handleSubscribe}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Обработка...' : 'Оформить подписку'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionPage;