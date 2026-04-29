import React from 'react';
import { useReceipts } from './useReceipts';
import PaymentList from '../../components/receipt/paymentList/PaymentList.tsx';
import ReceiptDetails from '../../components/receipt/receiptDetails/ReceiptDetails.tsx';
import EmptyReceipt from '../../components/receipt/emptyReceipt/EmptyReceipt.tsx';
import styles from './ReceiptsPage.module.css';

export const ReceiptsPage: React.FC = () => {
  const {
    payments,
    selectedReceipt,
    loading,
    receiptLoading,
    error,
    navigate,
    fetchReceiptById,
    createPayment,
  } = useReceipts();

  return (
      <>
          <header className="adopt-header"
                  style={{borderBottom: "1.5px solid rgba(255, 184, 140, 0.4)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      background: "rgba(255, 235, 220, 0.9)"}}>

              <div className="logo">Adoptly</div>
              <div className="profile" onClick={() => navigate('/liked')}>Профиль</div>
          </header>
    <div className={styles.page}>
      {/* Глобальная ошибка */}
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Левая часть — список платежей */}
      <PaymentList
        payments={payments}
        selectedPaymentId={selectedReceipt?.paymentId ?? null}
        loading={loading}
        onSelect={fetchReceiptById}
        onBuyPremium={createPayment}
      />

      {/* Правая часть — чек или заглушка */}
      <main className={styles.main}>
        {selectedReceipt ? (
          <ReceiptDetails receipt={selectedReceipt} loading={receiptLoading} />
        ) : (
          <EmptyReceipt />
        )}
      </main>
    </div>
      </>
  );
};
