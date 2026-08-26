import { describe, it, expect } from 'vitest';
import {
  calculateSplitBill,
  validateSplitBillInput,
  roundToTwoDecimals,
  formatCurrency,
} from './splitBill';

describe('Split Bill Calculation Logic', () => {
  describe('calculateSplitBill', () => {
    it('calculates the standard challenge example correctly (100 / 18% / 8% / 4 people)', () => {
      const result = calculateSplitBill({
        billAmount: 100,
        tipPercentage: 18,
        taxPercentage: 8,
        people: 4,
      });

      expect(result.subtotal).toBe(100);
      expect(result.tipPercentage).toBe(18);
      expect(result.tipAmount).toBe(18);
      expect(result.taxPercentage).toBe(8);
      expect(result.taxAmount).toBe(8);
      expect(result.grandTotal).toBe(126);
      expect(result.perPerson).toBe(31.50);
      expect(result.people).toBe(4);
    });

    it('calculates correctly with zero tip', () => {
      const result = calculateSplitBill({
        billAmount: 100,
        tipPercentage: 0,
        taxPercentage: 8,
        people: 4,
      });

      expect(result.tipAmount).toBe(0);
      expect(result.taxAmount).toBe(8);
      expect(result.grandTotal).toBe(108);
      expect(result.perPerson).toBe(27);
    });

    it('calculates correctly with zero tax', () => {
      const result = calculateSplitBill({
        billAmount: 100,
        tipPercentage: 18,
        taxPercentage: 0,
        people: 4,
      });

      expect(result.tipAmount).toBe(18);
      expect(result.taxAmount).toBe(0);
      expect(result.grandTotal).toBe(118);
      expect(result.perPerson).toBe(29.50);
    });

    it('calculates correctly when tax percentage is omitted', () => {
      const result = calculateSplitBill({
        billAmount: 100,
        tipPercentage: 15,
        people: 2,
      });

      expect(result.tipAmount).toBe(15);
      expect(result.taxPercentage).toBe(0);
      expect(result.taxAmount).toBe(0);
      expect(result.grandTotal).toBe(115);
      expect(result.perPerson).toBe(57.50);
    });

    it('calculates single-person bill correctly', () => {
      const result = calculateSplitBill({
        billAmount: 45.50,
        tipPercentage: 20,
        taxPercentage: 10,
        people: 1,
      });

      expect(result.subtotal).toBe(45.50);
      expect(result.tipAmount).toBe(9.10);
      expect(result.taxAmount).toBe(4.55);
      expect(result.grandTotal).toBe(59.15);
      expect(result.perPerson).toBe(59.15);
    });

    it('handles rounding edge case with uneven 3-way split', () => {
      const result = calculateSplitBill({
        billAmount: 100,
        tipPercentage: 0,
        taxPercentage: 0,
        people: 3,
      });

      expect(result.grandTotal).toBe(100);
      expect(result.perPerson).toBe(33.33);
    });

    it('preserves optional notes', () => {
      const result = calculateSplitBill({
        billAmount: 80,
        tipPercentage: 15,
        people: 2,
        notes: 'Team lunch at cafe',
      });

      expect(result.notes).toBe('Team lunch at cafe');
    });

    it('throws error for invalid bill amount <= 0', () => {
      expect(() =>
        calculateSplitBill({
          billAmount: 0,
          tipPercentage: 10,
          people: 2,
        })
      ).toThrow();

      expect(() =>
        calculateSplitBill({
          billAmount: -50,
          tipPercentage: 10,
          people: 2,
        })
      ).toThrow();
    });

    it('throws error for invalid party size < 1', () => {
      expect(() =>
        calculateSplitBill({
          billAmount: 100,
          tipPercentage: 10,
          people: 0,
        })
      ).toThrow();
    });
  });

  describe('validateSplitBillInput', () => {
    it('validates a correct set of inputs', () => {
      const { isValid, errors } = validateSplitBillInput(100, 18, 8, 4);
      expect(isValid).toBe(true);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('accepts string representations of valid numbers', () => {
      const { isValid, errors } = validateSplitBillInput('100.50', '15', '8.5', '3');
      expect(isValid).toBe(true);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('accepts omitted or empty tax input', () => {
      const { isValid, errors } = validateSplitBillInput(100, 15, '', 2);
      expect(isValid).toBe(true);
      expect(errors.taxPercentage).toBeUndefined();
    });

    it('rejects empty or zero bill amount', () => {
      const emptyCheck = validateSplitBillInput('', 15, 8, 2);
      expect(emptyCheck.isValid).toBe(false);
      expect(emptyCheck.errors.billAmount).toBeDefined();

      const zeroCheck = validateSplitBillInput(0, 15, 8, 2);
      expect(zeroCheck.isValid).toBe(false);
      expect(zeroCheck.errors.billAmount).toBeDefined();

      const negativeCheck = validateSplitBillInput(-20, 15, 8, 2);
      expect(negativeCheck.isValid).toBe(false);
      expect(negativeCheck.errors.billAmount).toBeDefined();
    });

    it('rejects negative tip percentage', () => {
      const { isValid, errors } = validateSplitBillInput(100, -5, 8, 2);
      expect(isValid).toBe(false);
      expect(errors.tipPercentage).toBeDefined();
    });

    it('rejects negative tax percentage', () => {
      const { isValid, errors } = validateSplitBillInput(100, 15, -2, 2);
      expect(isValid).toBe(false);
      expect(errors.taxPercentage).toBeDefined();
    });

    it('rejects party size less than 1 or non-integer', () => {
      const zeroPeople = validateSplitBillInput(100, 15, 8, 0);
      expect(zeroPeople.isValid).toBe(false);
      expect(zeroPeople.errors.people).toBeDefined();

      const floatPeople = validateSplitBillInput(100, 15, 8, 2.5);
      expect(floatPeople.isValid).toBe(false);
      expect(floatPeople.errors.people).toBeDefined();
    });
  });

  describe('Utility functions', () => {
    it('roundToTwoDecimals correctly rounds to 2 decimal places', () => {
      expect(roundToTwoDecimals(10.1234)).toBe(10.12);
      expect(roundToTwoDecimals(10.125)).toBe(10.13);
      expect(roundToTwoDecimals(10.129)).toBe(10.13);
      expect(roundToTwoDecimals(0)).toBe(0);
      expect(roundToTwoDecimals(NaN)).toBe(0);
    });

    it('formatCurrency formats values with $ symbol and 2 decimals', () => {
      expect(formatCurrency(126)).toBe('$126.00');
      expect(formatCurrency(31.5)).toBe('$31.50');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(NaN)).toBe('$0.00');
    });
  });
});
