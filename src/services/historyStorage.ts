import { SplitBillHistoryEntry, SplitBillResult } from '../types/splitBill';

export const SPLIT_BILL_STORAGE_KEY = 'split-bill-history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Safely loads split bill calculation history from localStorage.
 * Gracefully handles missing, empty, or corrupted data.
 */
export function getSplitBillHistory(): SplitBillHistoryEntry[] {
  try {
    const rawData = localStorage.getItem(SPLIT_BILL_STORAGE_KEY);
    if (!rawData) {
      return [];
    }

    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      console.warn('Split bill history in localStorage was not an array. Resetting.');
      return [];
    }

    // Sanitize and ensure each item has minimal required shape
    return parsed.filter(
      (item): item is SplitBillHistoryEntry =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.grandTotal === 'number' &&
        typeof item.perPerson === 'number' &&
        typeof item.subtotal === 'number'
    );
  } catch (error) {
    console.error('Failed to read split bill history from localStorage:', error);
    return [];
  }
}

/**
 * Saves a new calculation result to localStorage history.
 */
export function saveSplitBillHistoryEntry(
  result: SplitBillResult,
  customTimestamp?: string
): SplitBillHistoryEntry {
  const newEntry: SplitBillHistoryEntry = {
    ...result,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: customTimestamp || new Date().toISOString(),
  };

  try {
    const currentHistory = getSplitBillHistory();
    // Prepend new entry and cap to MAX_HISTORY_ITEMS
    const updatedHistory = [newEntry, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(SPLIT_BILL_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save split bill calculation to localStorage:', error);
  }

  return newEntry;
}

/**
 * Removes an individual entry by id from localStorage history.
 */
export function deleteSplitBillHistoryEntry(id: string): SplitBillHistoryEntry[] {
  try {
    const currentHistory = getSplitBillHistory();
    const filtered = currentHistory.filter((item) => item.id !== id);
    localStorage.setItem(SPLIT_BILL_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Failed to delete split bill history entry:', error);
    return getSplitBillHistory();
  }
}

/**
 * Clears all split bill history from localStorage.
 */
export function clearSplitBillHistory(): void {
  try {
    localStorage.removeItem(SPLIT_BILL_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear split bill history from localStorage:', error);
  }
}
