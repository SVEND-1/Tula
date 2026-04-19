// Зеркало ReceiptItem.java
export interface ReceiptItem {
  description: string;
  quantity: string;
  amountValue: string;
  amountCurrency: string;
  vatCode: number;
}

// Зеркало SettlementReceipt.java
export interface SettlementReceipt {
  type: string;
  amountValue: string;
  amountCurrency: string;
}

// Зеркало ReceiptResponse.java
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

// Зеркало PaymentResponse.java
export interface Payment {
  id: string;
  value: string;
  description: string;
  status: string;
  createdAt: string;
}

// Зеркало PaymentPageResponse.java
export interface PaymentPageResponse {
  content: Payment[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Зеркало PaymentCreateResponse.java
export interface PaymentCreateResponse {
  paymentId: string;
  urlPay: string;
}
