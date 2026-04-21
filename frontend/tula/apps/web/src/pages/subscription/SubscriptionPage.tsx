import React from 'react';
import { useSubscription } from './useSubscription';
import '../../style/subscription/SubscriptionPage.scss';

const SubscriptionPage: React.FC = () => {
    const {
        subscription,
        isSubscribed,
        isLoading,
        navigate,
        handleSubscribe,
        formatDate,
    } = useSubscription();

    return (
        <div className="subscription-page">
            <div className="subscription-container">
                <div className="subscription-header">
                    <button onClick={() => navigate('/main')} className="back-btn">
                        ← Назад
                    </button>
                    <h1>Подписка Adoptly</h1>
                </div>

                {/* Активная подписка */}
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

                    /* Карточка покупки */
                    <div className="subscription-plans">
                        <div className="plan-card recommended">
                            <div className="plan-badge">Рекомендуемый</div>
                            <h3>Премиум подписка</h3>

                            <div className="plan-price">
                                499 ₽<span>/месяц</span>
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
                                {isLoading ? 'Обработка...' : '💳 Оформить подписку'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionPage;
