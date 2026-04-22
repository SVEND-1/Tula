import React from 'react';
import { useSuccessSubscription } from './useSuccessSubscription.ts';
import ActivationLoading from '../../../components/subscription/succesSubscription/ActivationLoading';
import ActivationError from '../../../components/subscription/succesSubscription/ActivationError';
import ActivationSuccess from '../../../components/subscription/succesSubscription/ActivationSuccess.tsx';

const SuccessSubscriptionPage: React.FC = () => {
    const { status, errorMsg, navigate } = useSuccessSubscription();

    if (status === 'loading') return <ActivationLoading />;

    if (status === 'error') return (
        <ActivationError
            message={errorMsg}
            onGoToReceipts={() => navigate('/receipts')}
            onGoToMain={() => navigate('/main')}
        />
    );

    return (
        <ActivationSuccess
            onGoToReceipts={() => navigate('/receipts')}
            onGoToMain={() => navigate('/main')}
        />
    );
};

export default SuccessSubscriptionPage;
