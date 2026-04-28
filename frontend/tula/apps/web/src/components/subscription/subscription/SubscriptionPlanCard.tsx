import React from 'react';

interface Props {
    isLoading: boolean;
    onSubscribe: () => void;
}

// Карточка с описанием Premium и кнопкой покупки
const SubscriptionPlanCard: React.FC<Props> = ({ isLoading, onSubscribe }) => (
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

            <button className="subscribe-btn" onClick={onSubscribe} disabled={isLoading}>
                {isLoading ? 'Обработка...' : '💳 Оформить подписку'}
            </button>
        </div>
    </div>
);

export default SubscriptionPlanCard;
