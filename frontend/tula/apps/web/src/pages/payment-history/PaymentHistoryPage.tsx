import React from 'react';
import { usePaymentHistory } from './usePaymentHistory';
import PaymentList from '../../components/payment-history/PaymentList';
import PaymentDetails from '../../components/payment-history/paymentDetails/PaymentDetails.tsx';
import Pagination from '../../components/payment-history/pagination/Pagination.tsx';
import CloseButton from '../../components/subscription/CloseButton';
import '../../style/payment-history/PaymentHistoryPage.scss';

const PaymentHistoryPage: React.FC = () => {
    const {
        payments,
        selectedPayment,
        receipt,
        currentPage,
        totalPages,
        isLoading,
        isCreatingPayment,
        handlePageChange,
        handleSelectPayment,
        handleCreatePayment,
        handleCreateReceipt,
        handleManualActivateSubscription,
        handleClose,
    } = usePaymentHistory();

    return (
        <div className="payment-history-page">
            <CloseButton onClose={handleClose} />

            {/* Левая панель — список платежей */}
            <div className="payment-history-page__sidebar">
                <div className="payment-history-page__create-section">
                    <button
                        className="create-payment-btn"
                        onClick={handleCreatePayment}
                        disabled={isCreatingPayment}
                    >
                        {isCreatingPayment ? 'Создание...' : '💳 Сделать пожертвование'}
                    </button>
                </div>

                {isLoading && payments.length === 0 ? (
                    <div className="payment-list__loading">Загрузка платежей...</div>
                ) : (
                    <>
                        <PaymentList
                            payments={payments}
                            selectedId={selectedPayment?.id ?? null}
                            onSelect={handleSelectPayment}
                        />
                        {isLoading && payments.length > 0 && (
                            <div className="payment-list__loading-more">Загрузка...</div>
                        )}
                    </>
                )}

                <div className="payment-history-page__pagination">
                    <Pagination
                        currentPage={currentPage + 1}
                        totalPages={totalPages}
                        onPageChange={(page) => handlePageChange(page - 1)}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Правая панель — детали платежа и чек */}
            <div className="payment-history-page__content">
                {selectedPayment ? (
                    <div className="payment-history-page__content-inner">
                        <PaymentDetails
                            payment={selectedPayment}
                            receipt={receipt}
                            onCreateReceipt={handleCreateReceipt}
                        />
                    </div>
                ) : (
                    <div className="payment-history-page__placeholder">
                        Выберите платеж из списка
                    </div>
                )}
            </div>

            {/* TODO: убрать после отладки */}
            <button
                onClick={handleManualActivateSubscription}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 9999,
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #ffcdb0, #ffb88c)',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: '"Playpen Sans", cursive',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
            >
                🔧 Активировать подписку вручную
            </button>
        </div>
    );
};

export default PaymentHistoryPage;
