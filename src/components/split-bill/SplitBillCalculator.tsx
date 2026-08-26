import React, { useState, useEffect, useMemo } from 'react';
import {
  calculateSplitBill,
  validateSplitBillInput,
} from '../../logic/splitBill';
import {
  getSplitBillHistory,
  saveSplitBillHistoryEntry,
  deleteSplitBillHistoryEntry,
  clearSplitBillHistory,
} from '../../services/historyStorage';
import { SplitBillHistoryEntry, SplitBillResult } from '../../types/splitBill';
import { SplitBillBreakdown } from './SplitBillBreakdown';
import { SplitBillHistory } from './SplitBillHistory';
import './splitBill.css';

export const SplitBillCalculator: React.FC = () => {
  // Input states initialized to the standard challenge values ($100, 18% tip, 8% tax, 4 people)
  const [billAmount, setBillAmount] = useState<string>('100');
  const [tipPercentage, setTipPercentage] = useState<string>('18');
  const [taxPercentage, setTaxPercentage] = useState<string>('8');
  const [people, setPeople] = useState<string>('4');
  const [notes, setNotes] = useState<string>('');

  const [history, setHistory] = useState<SplitBillHistoryEntry[]>([]);
  const [isSavedJustNow, setIsSavedJustNow] = useState<boolean>(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    setHistory(getSplitBillHistory());
  }, []);

  // Immediate validation
  const validation = useMemo(() => {
    return validateSplitBillInput(billAmount, tipPercentage, taxPercentage, people);
  }, [billAmount, tipPercentage, taxPercentage, people]);

  // Immediate calculation when valid
  const calculationResult: SplitBillResult | null = useMemo(() => {
    if (!validation.isValid) return null;

    try {
      return calculateSplitBill({
        billAmount: parseFloat(billAmount),
        tipPercentage: parseFloat(tipPercentage),
        taxPercentage: taxPercentage.trim() !== '' ? parseFloat(taxPercentage) : 0,
        people: parseInt(people, 10),
        notes: notes.trim(),
      });
    } catch {
      return null;
    }
  }, [billAmount, tipPercentage, taxPercentage, people, notes, validation.isValid]);

  const handleSaveCalculation = () => {
    if (!calculationResult) return;
    const newEntry = saveSplitBillHistoryEntry(calculationResult);
    setHistory([newEntry, ...history.filter((h) => h.id !== newEntry.id)]);
    setIsSavedJustNow(true);
    setTimeout(() => setIsSavedJustNow(false), 2000);
  };

  const handleClearHistory = () => {
    clearSplitBillHistory();
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteSplitBillHistoryEntry(id);
    setHistory(updated);
  };

  const handleRestoreHistoryItem = (entry: SplitBillHistoryEntry) => {
    setBillAmount(entry.subtotal.toString());
    setTipPercentage(entry.tipPercentage.toString());
    setTaxPercentage(entry.taxPercentage.toString());
    setPeople(entry.people.toString());
    setNotes(entry.notes || '');
  };

  const tipPresets = [0, 10, 15, 18, 20];

  return (
    <div className="split-bill-container">
      <div className="calculator-header">
        <h2>Split Bill Calculator</h2>
        <p>Easily calculate tips, optional taxes, and divide the total fairly with transparent itemization.</p>
      </div>

      <div className="calculator-layout">
        {/* Left Column: Form Controls */}
        <section className="calculator-form-card" aria-label="Split Bill Inputs">
          <h3 className="section-title">Bill Details</h3>

          {/* Bill Amount */}
          <div className="form-group">
            <label htmlFor="bill-amount" className="form-label">
              Bill Total ($) <span className="required-star">*</span>
            </label>
            <div className="input-prefix-wrapper">
              <span className="input-prefix">$</span>
              <input
                id="bill-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className={`form-input has-prefix ${validation.errors.billAmount ? 'input-error' : ''}`}
              />
            </div>
            {validation.errors.billAmount && (
              <span className="error-message" role="alert">
                {validation.errors.billAmount}
              </span>
            )}
          </div>

          {/* Tip Percentage & Presets */}
          <div className="form-group">
            <label htmlFor="tip-percentage" className="form-label">
              Tip Percentage (%) <span className="required-star">*</span>
            </label>
            <div className="input-suffix-wrapper">
              <input
                id="tip-percentage"
                type="number"
                step="1"
                min="0"
                placeholder="18"
                value={tipPercentage}
                onChange={(e) => setTipPercentage(e.target.value)}
                className={`form-input has-suffix ${validation.errors.tipPercentage ? 'input-error' : ''}`}
              />
              <span className="input-suffix">%</span>
            </div>
            <div className="preset-buttons">
              {tipPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`preset-btn ${parseFloat(tipPercentage) === preset ? 'active' : ''}`}
                  onClick={() => setTipPercentage(preset.toString())}
                >
                  {preset}%
                </button>
              ))}
            </div>
            {validation.errors.tipPercentage && (
              <span className="error-message" role="alert">
                {validation.errors.tipPercentage}
              </span>
            )}
          </div>

          {/* Tax Percentage (Optional) */}
          <div className="form-group">
            <label htmlFor="tax-percentage" className="form-label">
              Tax Percentage (%) <span className="optional-tag">(Optional)</span>
            </label>
            <div className="input-suffix-wrapper">
              <input
                id="tax-percentage"
                type="number"
                step="0.1"
                min="0"
                placeholder="0"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                className={`form-input has-suffix ${validation.errors.taxPercentage ? 'input-error' : ''}`}
              />
              <span className="input-suffix">%</span>
            </div>
            {validation.errors.taxPercentage && (
              <span className="error-message" role="alert">
                {validation.errors.taxPercentage}
              </span>
            )}
          </div>

          {/* Number of People */}
          <div className="form-group">
            <label htmlFor="party-size" className="form-label">
              Number of People <span className="required-star">*</span>
            </label>
            <div className="people-stepper">
              <button
                type="button"
                className="stepper-btn"
                onClick={() => {
                  const current = parseInt(people, 10) || 1;
                  if (current > 1) setPeople((current - 1).toString());
                }}
                disabled={parseInt(people, 10) <= 1}
                aria-label="Decrease number of people"
              >
                −
              </button>
              <input
                id="party-size"
                type="number"
                step="1"
                min="1"
                placeholder="1"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className={`form-input text-center ${validation.errors.people ? 'input-error' : ''}`}
              />
              <button
                type="button"
                className="stepper-btn"
                onClick={() => {
                  const current = parseInt(people, 10) || 1;
                  setPeople((current + 1).toString());
                }}
                aria-label="Increase number of people"
              >
                +
              </button>
            </div>
            {validation.errors.people && (
              <span className="error-message" role="alert">
                {validation.errors.people}
              </span>
            )}
          </div>

          {/* Optional Item / Bill Notes */}
          <div className="form-group">
            <label htmlFor="bill-notes" className="form-label">
              Notes <span className="optional-tag">(Optional)</span>
            </label>
            <input
              id="bill-notes"
              type="text"
              placeholder="e.g. Lunch with team, Birthday dinner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input"
              maxLength={100}
            />
          </div>
        </section>

        {/* Right Column: Breakdown & Results */}
        <section className="calculator-breakdown-panel" aria-label="Split Bill Calculation Results">
          {calculationResult ? (
            <SplitBillBreakdown
              result={calculationResult}
              onSave={handleSaveCalculation}
              isSavedJustNow={isSavedJustNow}
            />
          ) : (
            <div className="invalid-state-card">
              <span className="invalid-icon">⚠️</span>
              <h4>Invalid or Incomplete Input</h4>
              <p>Please provide a valid bill amount and party size to see calculation results.</p>
            </div>
          )}
        </section>
      </div>

      {/* History Section */}
      <section className="calculator-history-section" aria-label="Calculation History">
        <SplitBillHistory
          history={history}
          onClear={handleClearHistory}
          onDelete={handleDeleteHistoryItem}
          onRestore={handleRestoreHistoryItem}
        />
      </section>
    </div>
  );
};
