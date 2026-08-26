import React from 'react';
import { ParkingFeeSuccessResult } from '../../types/parkingFee';
import { formatRupees } from '../../logic/parkingFee';

interface ParkingBreakdownProps {
  result: ParkingFeeSuccessResult;
}

export const ParkingBreakdown: React.FC<ParkingBreakdownProps> = ({ result }) => {
  const getVehicleLabel = () => {
    switch (result.vehicleType) {
      case 'motorcycle':
        return 'Motorcycle (20% discount)';
      case 'suv':
        return 'SUV (20% surcharge)';
      case 'car':
      default:
        return 'Car (Standard)';
    }
  };

  return (
    <div className="breakdown-card parking-breakdown-card">
      <div className="results-hero parking-hero">
        <div className="hero-stat final-fee-stat">
          <span className="stat-label">Total Parking Fee</span>
          <span className="stat-value final-fee-value">
            {formatRupees(result.finalFee)}
          </span>
          <span className="stat-subtext">all surcharges &amp; taxes included</span>
        </div>

        <div className="hero-divider" />

        <div className="hero-stat duration-stat">
          <span className="stat-label">Duration &amp; Billing</span>
          <span className="stat-value duration-value">
            {result.duration.formattedDuration}
          </span>
          <span className="stat-subtext">
            billed as <strong>{result.duration.billableHours} hr{result.duration.billableHours === 1 ? '' : 's'}</strong>
          </span>
        </div>
      </div>

      <div className="breakdown-section">
        <h3 className="section-title">Itemized Fee Breakdown</h3>
        <div className="breakdown-table">
          <div className="breakdown-row">
            <span className="row-label">
              Base Parking ({result.duration.billableHours} billable hr{result.duration.billableHours === 1 ? '' : 's'})
            </span>
            <span className="row-value">{formatRupees(result.baseTierFee)}</span>
          </div>

          {result.isDailyCapApplied && (
            <div className="breakdown-row cap-discount-row">
              <span className="row-label">
                🛡️ Continuous 24h Daily Cap (₹250 max/day)
              </span>
              <span className="row-value discount-text">
                -{formatRupees(result.capSavings)}
              </span>
            </div>
          )}

          <div className="breakdown-row subtotal-row">
            <span className="row-label">Capped Base Fee</span>
            <span className="row-value">{formatRupees(result.cappedBaseFee)}</span>
          </div>

          <div className="breakdown-row">
            <span className="row-label">Vehicle: {getVehicleLabel()}</span>
            <span className={`row-value ${result.vehicleAdjustmentAmount < 0 ? 'discount-text' : ''}`}>
              {result.vehicleAdjustmentAmount === 0
                ? '₹0.00'
                : result.vehicleAdjustmentAmount > 0
                ? `+${formatRupees(result.vehicleAdjustmentAmount)}`
                : `-${formatRupees(Math.abs(result.vehicleAdjustmentAmount))}`}
            </span>
          </div>

          <div className="breakdown-row">
            <span className="row-label">
              Weekend Surcharge {result.isWeekend ? '(+10%)' : '(Weekday)'}
            </span>
            <span className="row-value">
              {result.weekendSurchargeAmount > 0
                ? `+${formatRupees(result.weekendSurchargeAmount)}`
                : '₹0.00'}
            </span>
          </div>

          <div className="breakdown-row total-row">
            <span className="row-label">Final Parking Fee</span>
            <span className="row-value">{formatRupees(result.finalFee)}</span>
          </div>
        </div>

        <div className="formula-box parking-formula-box">
          <code>
            {result.duration.formattedDuration} elapsed &rarr; {result.duration.billableHours} billable hrs
            {result.isDailyCapApplied && ' (Daily cap applied)'}
            {result.vehicleAdjustmentPercentage !== 0 && ` (${result.vehicleType.toUpperCase()} ${result.vehicleAdjustmentPercentage > 0 ? '+' : ''}${result.vehicleAdjustmentPercentage}%)`}
            {result.isWeekend && ' (+10% Weekend)'} = <strong>{formatRupees(result.finalFee)}</strong>
          </code>
        </div>
      </div>

      <div className="rounding-explanation">
        <h4>ℹ️ Pricing &amp; Billing Rules Applied</h4>
        <ul className="parking-rules-list">
          <li><strong>Hourly Tiers:</strong> 1st hr: ₹40 | Hrs 2–4: ₹30/hr | Hrs 5–8: ₹20/hr | Hrs 9+: ₹15/hr</li>
          <li><strong>Daily Cap:</strong> ₹250 per continuous 24-hour cycle (does not prematurely reset at midnight).</li>
          <li><strong>Partial Hours:</strong> Rounded upward to the next whole hour.</li>
          <li><strong>Vehicle Adjustments:</strong> Car (0%) | Motorcycle (-20%) | SUV (+20%).</li>
          <li><strong>Weekend Surcharge:</strong> +10% on post-adjustment fee.</li>
        </ul>
      </div>
    </div>
  );
};
