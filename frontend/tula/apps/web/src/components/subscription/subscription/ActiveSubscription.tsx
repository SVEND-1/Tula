import React from 'react';
import type { SubscriptionInfo } from '../../../pages/subscription/subscription/useSubscription.ts';


interface Props {
    subscription: SubscriptionInfo;
    isLoading: boolean;
    formatDate: (date: string) => string;
    onExtend: () => void;
}

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
