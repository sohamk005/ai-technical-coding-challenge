import React from 'react';
import { SplitBillHistoryEntry } from '../../types/splitBill';
import { formatCurrency } from '../../logic/splitBill';

interface SplitBillHistoryProps {
  history: SplitBillHistoryEntry[];
  onClear: () => void;
  onDelete: (id: string) => void;
  onRestore?: (entry: SplitBillHistoryEntry) => void;
}

export const SplitBillHistory: React.FC<SplitBillHistoryProps> = ({
  history,
  onClear,
  onDelete,
  onRestore,
}) => {
  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="history-title-group">
          <h3>Calculation History</h3>
          <span className="history-count-badge">{history.length}</span>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            className="btn-clear-history"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all calculation history?')) {
                onClear();
              }
            }}
          >
            🗑️ Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty-state">
          <span className="empty-icon">📋</span>
          <p className="empty-title">No saved calculations yet</p>
          <p className="empty-subtitle">
            Enter bill details and click <strong>"Save to History"</strong> to keep a record of your calculations.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item-card">
              <div className="history-item-main">
                <div className="history-item-header">
                  <span className="history-timestamp">{formatTimestamp(item.timestamp)}</span>
                  {item.notes && <span className="history-notes-pill">📝 {item.notes}</span>}
                </div>

                <div className="history-item-metrics">
                  <div className="metric">
                    <span className="metric-label">Per Person:</span>
                    <span className="metric-value highlight">{formatCurrency(item.perPerson)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Grand Total:</span>
                    <span className="metric-value">{formatCurrency(item.grandTotal)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Party:</span>
                    <span className="metric-value">{item.people} people</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Subtotal:</span>
                    <span className="metric-value">{formatCurrency(item.subtotal)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Tip / Tax:</span>
                    <span className="metric-value">{item.tipPercentage}% / {item.taxPercentage}%</span>
                  </div>
                </div>
              </div>

              <div className="history-item-actions">
                {onRestore && (
                  <button
                    type="button"
                    className="btn-history-restore"
                    title="Load these values into calculator"
                    onClick={() => onRestore(item)}
                  >
                    Load
                  </button>
                )}
                <button
                  type="button"
                  className="btn-history-delete"
                  title="Delete this record"
                  onClick={() => onDelete(item.id)}
                  aria-label="Delete entry"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
