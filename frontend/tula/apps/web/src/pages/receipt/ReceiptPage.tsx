import { useReceipts } from "./useReceipts";
import styles from "./ReceiptsPage.module.css";

export function ReceiptsPage() {
    const {
        receipts,
        selectedReceipt,
        //loading,
        fetchReceiptById,
        //createPayment,
        //refetch,
    } = useReceipts();

    return (
        <div className={styles.page}>
            {/* ЛЕВАЯ ЧАСТЬ */}
            <aside className={styles.sidebar}>
                <h2 className={styles.title}>История платежей</h2>

                <div className={styles.list}>
                    {receipts.map((item) => (
                        <div
                            key={item.paymentId}
                            className={`${styles.item} ${
                                selectedReceipt?.paymentId === item.paymentId
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() => fetchReceiptById(item.paymentId)}
                        >
                            <div className={styles.itemTitle}>
                                {item.title}
                            </div>
                            <div className={styles.itemSub}>Успешно</div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* ПРАВАЯ ЧАСТЬ */}
            <main className={styles.main}>
                {!selectedReceipt ? (
                    <div className={styles.empty}>Выберите чек</div>
                ) : (
                    <>
                        <h2 className={styles.header}>Детали платежа</h2>

                        <div className={styles.card}>
                            <p><b>ID:</b> {selectedReceipt.id}</p>
                            <p><b>Описание:</b> {selectedReceipt.type}</p>
                            <p><b>Сумма:</b> {selectedReceipt.amount}</p>
                            <p><b>Статус:</b> {selectedReceipt.status}</p>
                            <p><b>Дата:</b> {selectedReceipt.registeredAt}</p>
                        </div>

                        <h3 className={styles.subheader}>Чек</h3>

                        <div className={styles.card}>
                            <p><b>Продавец:</b> {selectedReceipt.sellerName}</p>
                            <p><b>Фискальный номер:</b> {selectedReceipt.fiscalDocumentNumber}</p>
                            <p><b>ФН:</b> {selectedReceipt.fiscalStorageNumber}</p>
                            <p><b>ФП:</b> {selectedReceipt.fiscalAttribute}</p>
                        </div>

                        <h3 className={styles.subheader}>Позиции</h3>

                        <div className={styles.card}>
                            {selectedReceipt.items.map((i, idx) => (
                                <div key={idx} className={styles.itemRow}>
                                    {i.description} — {i.amountValue} {i.amountCurrency}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}