import {
  SplitBillInput,
  SplitBillResult,
  SplitBillValidationErrors,
  SplitBillValidationResult,
} from '../types/splitBill';

/**
 * Rounds a number to exactly two decimal places using standard mathematical rounding.
 */
export function roundToTwoDecimals(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Formats a numeric currency value to two decimal places (e.g. 126 -> "$126.00").
 */
export function formatCurrency(value: number, currencySymbol: string = '$'): string {
  if (!Number.isFinite(value)) return `${currencySymbol}0.00`;
  const rounded = roundToTwoDecimals(value);
  return `${currencySymbol}${rounded.toFixed(2)}`;
}

/**
 * Validates raw Split Bill input values before calculation.
 */
export function validateSplitBillInput(
  billAmount: number | string,
  tipPercentage: number | string,
  taxPercentage: number | string | undefined,
  people: number | string
): SplitBillValidationResult {
  const errors: SplitBillValidationErrors = {};

  // Bill amount validation
  const numBill = typeof billAmount === 'string' ? parseFloat(billAmount) : billAmount;
  if (billAmount === '' || Number.isNaN(numBill) || !Number.isFinite(numBill) || numBill <= 0) {
    errors.billAmount = 'Please enter a valid bill amount greater than 0.';
  }

  // Tip percentage validation
  const numTip = typeof tipPercentage === 'string' ? parseFloat(tipPercentage) : tipPercentage;
  if (tipPercentage === '' || Number.isNaN(numTip) || !Number.isFinite(numTip) || numTip < 0) {
    errors.tipPercentage = 'Tip percentage must be 0% or greater.';
  }

  // Tax percentage validation (optional, defaults to 0)
  if (taxPercentage !== undefined && taxPercentage !== '') {
    const numTax = typeof taxPercentage === 'string' ? parseFloat(taxPercentage) : taxPercentage;
    if (Number.isNaN(numTax) || !Number.isFinite(numTax) || numTax < 0) {
      errors.taxPercentage = 'Tax percentage cannot be negative.';
    }
  }

  // Number of people validation
  const numPeople = typeof people === 'string' ? parseFloat(people) : people;
  if (
    people === '' ||
    Number.isNaN(numPeople) ||
    !Number.isFinite(numPeople) ||
    numPeople < 1 ||
    !Number.isInteger(numPeople)
  ) {
    errors.people = 'Number of people must be a whole number of at least 1.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Pure calculation engine for the Split Bill feature.
 * Calculates tip amount, tax amount, grand total, and per-person split.
 */
export function calculateSplitBill(input: SplitBillInput): SplitBillResult {
  if (input.people < 1 || !Number.isFinite(input.billAmount) || input.billAmount <= 0) {
    throw new Error('Invalid input: billAmount must be > 0 and people must be >= 1.');
  }

  const subtotal = roundToTwoDecimals(input.billAmount);
  const tipPercentage = Math.max(0, input.tipPercentage || 0);
  const taxPercentage = Math.max(0, input.taxPercentage || 0);

  const tipAmount = roundToTwoDecimals((subtotal * tipPercentage) / 100);
  const taxAmount = roundToTwoDecimals((subtotal * taxPercentage) / 100);

  const grandTotal = roundToTwoDecimals(subtotal + tipAmount + taxAmount);
  const perPerson = roundToTwoDecimals(grandTotal / input.people);

  return {
    subtotal,
    tipPercentage,
    tipAmount,
    taxPercentage,
    taxAmount,
    grandTotal,
    people: input.people,
    perPerson,
    notes: input.notes?.trim() || undefined,
  };
}
