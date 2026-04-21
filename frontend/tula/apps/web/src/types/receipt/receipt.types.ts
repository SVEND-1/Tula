export interface ReceiptItem {
    description: string;
    quantity: string;
    amountValue: string;
    amountCurrency: string;
    vatCode: number;
}

export interface SettlementReceipt {
    type: string;
    amountValue: string;
    amountCurrency: string;
}

export interface Receipt {
    id: string;
    type: string;
    paymentId: string;
    status: string;
    amount: string;

    fiscalDocumentNumber: string;
    fiscalStorageNumber: string;
    fiscalAttribute: string;
    registeredAt: string;
    fiscalProviderId: string;

    items: ReceiptItem[];
    settlements: SettlementReceipt[];

    sellerName: string;
}