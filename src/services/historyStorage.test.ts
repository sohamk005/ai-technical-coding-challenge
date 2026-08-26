import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSplitBillHistory,
  saveSplitBillHistoryEntry,
  deleteSplitBillHistoryEntry,
  clearSplitBillHistory,
  SPLIT_BILL_STORAGE_KEY,
} from './historyStorage';
import { SplitBillResult } from '../types/splitBill';

// Simple in-memory localStorage mock for node environment
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

describe('Split Bill localStorage History Service', () => {
  const sampleResult: SplitBillResult = {
    subtotal: 100,
    tipPercentage: 18,
    tipAmount: 18,
    taxPercentage: 8,
    taxAmount: 8,
    grandTotal: 126,
    people: 4,
    perPerson: 31.50,
    notes: 'Dinner with colleagues',
  };

  beforeEach(() => {
    // Attach fresh localStorage mock before each test
    globalThis.localStorage = createLocalStorageMock() as unknown as Storage;
    vi.restoreAllMocks();
  });

  it('returns empty array when no history exists', () => {
    const history = getSplitBillHistory();
    expect(history).toEqual([]);
  });

  it('saves an entry and retrieves it correctly', () => {
    const saved = saveSplitBillHistoryEntry(sampleResult, '2026-08-26T12:00:00.000Z');
    expect(saved.id).toBeDefined();
    expect(saved.timestamp).toBe('2026-08-26T12:00:00.000Z');
    expect(saved.grandTotal).toBe(126);

    const history = getSplitBillHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe(saved.id);
    expect(history[0].perPerson).toBe(31.50);
    expect(history[0].notes).toBe('Dinner with colleagues');
  });

  it('prepends newer entries to the top', () => {
    const entry1 = saveSplitBillHistoryEntry({ ...sampleResult, grandTotal: 50 }, '2026-08-26T10:00:00.000Z');
    const entry2 = saveSplitBillHistoryEntry({ ...sampleResult, grandTotal: 100 }, '2026-08-26T11:00:00.000Z');

    const history = getSplitBillHistory();
    expect(history.length).toBe(2);
    expect(history[0].id).toBe(entry2.id);
    expect(history[1].id).toBe(entry1.id);
  });

  it('deletes an individual history item by ID', () => {
    const entry1 = saveSplitBillHistoryEntry({ ...sampleResult, grandTotal: 50 });
    const entry2 = saveSplitBillHistoryEntry({ ...sampleResult, grandTotal: 100 });

    const remaining = deleteSplitBillHistoryEntry(entry1.id);
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(entry2.id);

    const history = getSplitBillHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe(entry2.id);
  });

  it('clears all history', () => {
    saveSplitBillHistoryEntry(sampleResult);
    saveSplitBillHistoryEntry({ ...sampleResult, grandTotal: 200 });

    expect(getSplitBillHistory().length).toBe(2);

    clearSplitBillHistory();
    expect(getSplitBillHistory()).toEqual([]);
  });

  it('handles corrupted JSON in localStorage gracefully without throwing', () => {
    localStorage.setItem(SPLIT_BILL_STORAGE_KEY, 'invalid json string{{{');

    const history = getSplitBillHistory();
    expect(history).toEqual([]);
  });

  it('handles non-array stored data gracefully', () => {
    localStorage.setItem(SPLIT_BILL_STORAGE_KEY, JSON.stringify({ someKey: 'not an array' }));

    const history = getSplitBillHistory();
    expect(history).toEqual([]);
  });
});
