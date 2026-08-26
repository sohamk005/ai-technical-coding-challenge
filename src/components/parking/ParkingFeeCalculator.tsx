import React, { useState, useMemo } from 'react';
import { VehicleType, ParkingFeeResult } from '../../types/parkingFee';
import { calculateParkingFee } from '../../logic/parkingFee';
import { ParkingBreakdown } from './ParkingBreakdown';
import './parking.css';

export const ParkingFeeCalculator: React.FC = () => {
  // Initialize with the primary challenge midnight test case
  const [entryDatetime, setEntryDatetime] = useState<string>('2026-08-26T22:00');
  const [exitDatetime, setExitDatetime] = useState<string>('2026-08-27T02:30');
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [isWeekend, setIsWeekend] = useState<boolean>(false);

  // Immediate reactive calculation
  const calculationResult: ParkingFeeResult = useMemo(() => {
    return calculateParkingFee({
      entryDatetime,
      exitDatetime,
      vehicleType,
      isWeekend,
    });
  }, [entryDatetime, exitDatetime, vehicleType, isWeekend]);

  // Quick challenge test scenario presets
  const applyPreset = (
    entry: string,
    exit: string,
    vehicle: VehicleType = 'car',
    weekend: boolean = false
  ) => {
    setEntryDatetime(entry);
    setExitDatetime(exit);
    setVehicleType(vehicle);
    setIsWeekend(weekend);
  };

  return (
    <div className="parking-calculator-container">
      <div className="calculator-header">
        <h2>Parking Fee Calculator</h2>
        <p>Accurate hourly tier pricing, continuous 24-hour daily cap, midnight crossing, and vehicle adjustments.</p>
      </div>

      <div className="calculator-layout">
        {/* Left Column: Input Form Controls */}
        <section className="calculator-form-card" aria-label="Parking Inputs">
          <h3 className="section-title">Parking Session Details</h3>

          {/* Quick Preset Buttons */}
          <div className="form-group presets-group">
            <span className="form-label">Test Scenarios:</span>
            <div className="preset-scenario-buttons">
              <button
                type="button"
                className="scenario-btn"
                onClick={() => applyPreset('2026-08-26T22:00', '2026-08-27T02:30', 'car', false)}
              >
                🌙 Midnight (4.5h &rarr; 5h)
              </button>
              <button
                type="button"
                className="scenario-btn"
                onClick={() => applyPreset('2026-08-26T10:00', '2026-08-26T13:00', 'car', false)}
              >
                ☀️ Same Day (3h)
              </button>
              <button
                type="button"
                className="scenario-btn"
                onClick={() => applyPreset('2026-08-26T08:00', '2026-08-26T20:00', 'car', false)}
              >
                🛡️ Daily Cap (12h)
              </button>
              <button
                type="button"
                className="scenario-btn"
                onClick={() => applyPreset('2026-08-26T10:00', '2026-08-27T14:00', 'suv', true)}
              >
                🗓️ Multi-Day (28h, SUV, Wkd)
              </button>
            </div>
          </div>

          {/* Entry Datetime */}
          <div className="form-group">
            <label htmlFor="entry-datetime" className="form-label">
              Entry Date &amp; Time <span className="required-star">*</span>
            </label>
            <input
              id="entry-datetime"
              type="datetime-local"
              value={entryDatetime}
              onChange={(e) => setEntryDatetime(e.target.value)}
              className="form-input datetime-input"
            />
          </div>

          {/* Exit Datetime */}
          <div className="form-group">
            <label htmlFor="exit-datetime" className="form-label">
              Exit Date &amp; Time <span className="required-star">*</span>
            </label>
            <input
              id="exit-datetime"
              type="datetime-local"
              value={exitDatetime}
              onChange={(e) => setExitDatetime(e.target.value)}
              className={`form-input datetime-input ${
                calculationResult.status === 'INVALID' ? 'input-error' : ''
              }`}
            />
            {calculationResult.status === 'INVALID' && (
              <span className="error-message" role="alert">
                {calculationResult.errorMessage}
              </span>
            )}
          </div>

          {/* Vehicle Type */}
          <div className="form-group">
            <label className="form-label">
              Vehicle Type <span className="required-star">*</span>
            </label>
            <div className="vehicle-selector-grid">
              <button
                type="button"
                className={`vehicle-btn ${vehicleType === 'car' ? 'active' : ''}`}
                onClick={() => setVehicleType('car')}
              >
                <span className="vehicle-icon">🚗</span>
                <span className="vehicle-name">Car</span>
                <span className="vehicle-adj">Standard</span>
              </button>

              <button
                type="button"
                className={`vehicle-btn ${vehicleType === 'motorcycle' ? 'active' : ''}`}
                onClick={() => setVehicleType('motorcycle')}
              >
                <span className="vehicle-icon">🏍️</span>
                <span className="vehicle-name">Motorcycle</span>
                <span className="vehicle-adj discount">-20% Discount</span>
              </button>

              <button
                type="button"
                className={`vehicle-btn ${vehicleType === 'suv' ? 'active' : ''}`}
                onClick={() => setVehicleType('suv')}
              >
                <span className="vehicle-icon">🚙</span>
                <span className="vehicle-name">SUV</span>
                <span className="vehicle-adj surcharge">+20% Surcharge</span>
              </button>
            </div>
          </div>

          {/* Weekend Surcharge */}
          <div className="form-group weekend-checkbox-group">
            <label className="checkbox-label" htmlFor="weekend-toggle">
              <input
                id="weekend-toggle"
                type="checkbox"
                checked={isWeekend}
                onChange={(e) => setIsWeekend(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-custom" />
              <div className="checkbox-text-group">
                <span className="checkbox-title">Weekend Parking (+10% Surcharge)</span>
                <span className="checkbox-subtitle">Applies 10% weekend rate adjustment</span>
              </div>
            </label>
          </div>
        </section>

        {/* Right Column: Calculation Result / Breakdown */}
        <section className="calculator-breakdown-panel" aria-label="Parking Calculation Results">
          {calculationResult.status === 'VALID' ? (
            <ParkingBreakdown result={calculationResult} />
          ) : (
            <div className="invalid-state-card parking-invalid-card" role="alert">
              <span className="invalid-icon">🚫</span>
              <h4 className="invalid-heading">INVALID CALCULATION RANGE</h4>
              <p className="invalid-description">{calculationResult.errorMessage}</p>
              <div className="invalid-hint-box">
                <p>
                  <strong>Requirement:</strong> Exit date &amp; time must be strictly later than entry date &amp; time.
                  Sessions crossing midnight are fully supported when the exit date is set to the subsequent day.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
