import React from 'react';
import { SplitBillResult } from '../../types/splitBill';
import { formatCurrency } from '../../logic/splitBill';

interface SplitBillBreakdownProps {
  result: SplitBillResult;
  onSave: () => void;
  isSavedJustNow: boolean;
}

export const SplitBillBreakdown: React.FC<SplitBillBreakdownProps> = ({
  result,
  onSave,
  isSavedJustNow,
}) => {
  return (
    <div className="breakdown-card">
      <div className="results-hero">
        <div className="hero-stat per-person-stat">
          <span className="stat-label">Per Person</span>
          <span className="stat-value per-person-value">
            {formatCurrency(result.perPerson)}
          </span>
          <span className="stat-subtext">
            for {result.people} {result.people === 1 ? 'person' : 'people'}
          </span>
        </div>

        <div className="hero-divider" />

        <div className="hero-stat grand-total-stat">
          <span className="stat-label">Grand Total</span>
          <span className="stat-value grand-total-value">
            {formatCurrency(result.grandTotal)}
          </span>
          <span className="stat-subtext">all inclusive</span>
        </div>
      </div>

      <div className="breakdown-section">
        <h3 className="section-title">Transparent Breakdown</h3>
        <div className="breakdown-table">
          <div className="breakdown-row">
            <span className="row-label">Subtotal</span>
            <span className="row-value">{formatCurrency(result.subtotal)}</span>
          </div>

          <div className="breakdown-row">
            <span className="row-label">Tip ({result.tipPercentage}%)</span>
            <span className="row-value">+{formatCurrency(result.tipAmount)}</span>
          </div>

          <div className="breakdown-row">
            <span className="row-label">Tax ({result.taxPercentage}%)</span>
            <span className="row-value">+{formatCurrency(result.taxAmount)}</span>
          </div>

          <div className="breakdown-row total-row">
            <span className="row-label">Grand Total</span>
            <span className="row-value">{formatCurrency(result.grandTotal)}</span>
          </div>
        </div>

        <div className="formula-box">
          <code>
            {formatCurrency(result.grandTotal)} ÷ {result.people}{' '}
            {result.people === 1 ? 'person' : 'people'} ={' '}
            <strong>{formatCurrency(result.perPerson)}</strong> per person
          </code>
        </div>
      </div>

      {result.notes && (
        <div className="breakdown-notes">
          <span className="notes-badge">Note:</span> {result.notes}
        </div>
      )}

      <div className="rounding-explanation">
        <h4>ℹ️ Rounding & Remainder Policy</h4>
        <p>
          <strong>Equal Split:</strong> The grand total is divided evenly across all{' '}
          {result.people} {result.people === 1 ? 'person' : 'people'} and rounded to two
          decimal places for currency presentation.
        </p>
        <p className="remainder-note">
          <em>Remainder Strategy Note:</em> In situations where division produces a fractional
          remainder (e.g. 100 ÷ 3 = $33.33 each, leaving $0.01), a remainder-cent distribution
          system can allocate the leftover cents to the first member(s) to guarantee payments sum
          exactly to the grand total.
        </p>
      </div>

      <button
        type="button"
        className={`btn-save-calculation ${isSavedJustNow ? 'saved' : ''}`}
        onClick={onSave}
      >
        {isSavedJustNow ? '✓ Saved to History' : '💾 Save to History'}
      </button>
    </div>
  );
};
