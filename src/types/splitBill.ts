export interface SplitBillInput {
  billAmount: number;
  tipPercentage: number;
  taxPercentage?: number;
  people: number;
  notes?: string;
}

export interface SplitBillResult {
  subtotal: number;
  tipPercentage: number;
  tipAmount: number;
  taxPercentage: number;
  taxAmount: number;
  grandTotal: number;
  people: number;
  perPerson: number;
  notes?: string;
}

export interface SplitBillHistoryEntry extends SplitBillResult {
  id: string;
  timestamp: string;
}

export interface SplitBillValidationErrors {
  billAmount?: string;
  tipPercentage?: string;
  taxPercentage?: string;
  people?: string;
}

export interface SplitBillValidationResult {
  isValid: boolean;
  errors: SplitBillValidationErrors;
}
