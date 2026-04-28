import React from 'react';
import { useSubscription } from './useSubscription.ts';
import ActiveSubscription from '../../../components/subscription/subscription/ActiveSubscription.tsx';
import SubscriptionPlanCard from '../../../components/subscription/subscription/SubscriptionPlanCard.tsx';
import '../../../style/subscription/SubscriptionPage.scss'

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
                    <button onClick={() => navigate('/main')} className="back-btn">← Назад</button>
                    <h1>Подписка Adoptly</h1>
                </div>

                {isSubscribed && subscription ? (
                    <ActiveSubscription
                        subscription={subscription}
                        isLoading={isLoading}
                        formatDate={formatDate}
                        onExtend={handleSubscribe}
                    />
                ) : (
                    <SubscriptionPlanCard
                        isLoading={isLoading}
                        onSubscribe={handleSubscribe}
                    />
                )}
            </div>
        </div>
    );
};

export default SubscriptionPage;
