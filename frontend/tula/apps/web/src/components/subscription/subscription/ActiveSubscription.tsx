import React from 'react';
import type { SubscriptionDetailResponse } from '../../../api/paymentApi.ts';

interface Props {
    subscription: SubscriptionDetailResponse;
    isLoading: boolean;
    formatDate: (date: string) => string;
    onExtend: () => void;
}

// Показывается когда у пользователя уже есть активная подписка
const ActiveSubscription: React.FC<Props> = ({ subscription, isLoading, formatDate, onExtend }) => (
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

        <button className="extend-btn" onClick={onExtend} disabled={isLoading}>
            {isLoading ? 'Обработка...' : 'Продлить подписку'}
        </button>
    </div>
);

export default ActiveSubscription;
