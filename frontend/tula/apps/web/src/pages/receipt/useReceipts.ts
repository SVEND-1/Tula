import { useEffect, useState } from 'react';
import type { Payment, Receipt } from '../../types/receipt/receipt.types.ts';

// TODO: убрать моки и раскомментировать когда бекенд заработает
// import { getPayments, getReceipt, createPayment } from '../../api/paymentApi';

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    value: '499',
    description: 'Подписка Adoptly Premium',
    status: 'succeeded',
    createdAt: '2026-04-19T09:00:00.000Z',
  },
  {
    id: 'pay-002',
    value: '499',
    description: 'Подписка Adoptly Premium',
    status: 'succeeded',
    createdAt: '2026-03-19T10:30:00.000Z',
  },
];

const MOCK_RECEIPTS: Record<string, Receipt> = {
  'pay-001': {
    id: 'receipt-001',
    type: 'payment',
    paymentId: 'pay-001',
    status: 'succeeded',
    amount: '499.00',
    fiscalDocumentNumber: '12345',
    fiscalStorageNumber: '9999078900007487',
    fiscalAttribute: '3825910032',
    registeredAt: '2026-04-19T09:01:00.000Z',
    fiscalProviderId: 'yandex-ofd',
    sellerName: 'ООО «Adoptly»',
    items: [
      {
        description: 'Подписка Adoptly Premium (1 месяц)',
        quantity: '1',
        amountValue: '499.00',
        amountCurrency: 'RUB',
        vatCode: 1,
      },
    ],
    settlements: [
      {
        type: 'cashless',
        amountValue: '499.00',
        amountCurrency: 'RUB',
      },
    ],
  },
  'pay-002': {
    id: 'receipt-002',
    type: 'payment',
    paymentId: 'pay-002',
    status: 'succeeded',
    amount: '499.00',
    fiscalDocumentNumber: '12201',
    fiscalStorageNumber: '9999078900007487',
    fiscalAttribute: '2741830011',
    registeredAt: '2026-03-19T10:31:00.000Z',
    fiscalProviderId: 'yandex-ofd',
    sellerName: 'ООО «Adoptly»',
    items: [
      {
        description: 'Подписка Adoptly Premium (1 месяц)',
        quantity: '1',
        amountValue: '499.00',
        amountCurrency: 'RUB',
        vatCode: 1,
      },
    ],
    settlements: [
      {
        type: 'cashless',
        amountValue: '499.00',
        amountCurrency: 'RUB',
      },
    ],
  },
};

export function useReceipts(page = 0, size = 10) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загружаем моковый список платежей
  const fetchPayments = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400)); // имитация задержки сети
    setPayments(MOCK_PAYMENTS);
    setLoading(false);
  };

  // Загружаем моковый чек по paymentId
  const fetchReceiptById = async (paymentId: string) => {
    setReceiptLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 300));
    const receipt = MOCK_RECEIPTS[paymentId] ?? null;
    if (!receipt) setError('Чек не найден');
    setSelectedReceipt(receipt);
    setReceiptLoading(false);
  };

  // Заглушка — в реальности редиректит на ЮКассу
  const handleCreatePayment = async () => {
    alert('Mock: здесь будет редирект на ЮКассу');
  };

  useEffect(() => {
    fetchPayments();
  }, [page, size]);

  return {
    payments,
    selectedReceipt,
    loading,
    receiptLoading,
    error,
    fetchReceiptById,
    createPayment: handleCreatePayment,
    refetch: fetchPayments,
  };
}
