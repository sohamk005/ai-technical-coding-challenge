import { describe, it, expect } from 'vitest';
import {
  calculateParkingFee,
  calculateDuration,
  calculateTierFeeForCycle,
  calculateContinuousBaseFee,
  formatRupees,
} from './parkingFee';

describe('Parking Fee Calculation Logic', () => {
  describe('Duration & Midnight Handling', () => {
    it('calculates same-day duration correctly (10:00 -> 13:00 = 3h)', () => {
      const duration = calculateDuration('2026-08-26T10:00', '2026-08-26T13:00');
      expect(duration).not.toBeNull();
      expect(duration!.hoursComponent).toBe(3);
      expect(duration!.minutesComponent).toBe(0);
      expect(duration!.billableHours).toBe(3);
      expect(duration!.formattedDuration).toBe('3h 0m');
    });

    it('calculates duration crossing midnight correctly (22:00 -> 02:00 next day = 4h)', () => {
      const duration = calculateDuration('2026-08-26T22:00', '2026-08-27T02:00');
      expect(duration).not.toBeNull();
      expect(duration!.hoursComponent).toBe(4);
      expect(duration!.minutesComponent).toBe(0);
      expect(duration!.billableHours).toBe(4);
      expect(duration!.formattedDuration).toBe('4h 0m');
    });

    it('calculates duration crossing midnight with partial hour (22:00 -> 02:30 next day = 4h 30m, 5 billable hrs)', () => {
      const duration = calculateDuration('2026-08-26T22:00', '2026-08-27T02:30');
      expect(duration).not.toBeNull();
      expect(duration!.hoursComponent).toBe(4);
      expect(duration!.minutesComponent).toBe(30);
      expect(duration!.billableHours).toBe(5);
      expect(duration!.formattedDuration).toBe('4h 30m');
    });

    it('calculates multi-day duration correctly (2026-08-26T10:00 -> 2026-08-28T14:15 = 52h 15m, 53 billable hrs)', () => {
      const duration = calculateDuration('2026-08-26T10:00', '2026-08-28T14:15');
      expect(duration).not.toBeNull();
      expect(duration!.hoursComponent).toBe(52);
      expect(duration!.minutesComponent).toBe(15);
      expect(duration!.billableHours).toBe(53);
    });

    it('returns null for exit before entry', () => {
      const duration = calculateDuration('2026-08-26T14:00', '2026-08-26T10:00');
      expect(duration).toBeNull();
    });

    it('returns null for equal entry and exit', () => {
      const duration = calculateDuration('2026-08-26T10:00', '2026-08-26T10:00');
      expect(duration).toBeNull();
    });

    it('returns null for missing or invalid datetime strings', () => {
      expect(calculateDuration('', '2026-08-26T10:00')).toBeNull();
      expect(calculateDuration('2026-08-26T10:00', '')).toBeNull();
      expect(calculateDuration('invalid', 'dates')).toBeNull();
    });
  });

  describe('Hourly Tier Pricing', () => {
    it('calculates 1st hour as ₹40', () => {
      expect(calculateTierFeeForCycle(1)).toBe(40);
    });

    it('calculates 2 hours as ₹70 (40 + 30)', () => {
      expect(calculateTierFeeForCycle(2)).toBe(70);
    });

    it('calculates 4 hours as ₹130 (40 + 30*3)', () => {
      expect(calculateTierFeeForCycle(4)).toBe(130);
    });

    it('calculates 5 hours as ₹150 (130 + 20)', () => {
      expect(calculateTierFeeForCycle(5)).toBe(150);
    });

    it('calculates 8 hours as ₹210 (130 + 20*4)', () => {
      expect(calculateTierFeeForCycle(8)).toBe(210);
    });

    it('calculates 9 hours as ₹225 (210 + 15)', () => {
      expect(calculateTierFeeForCycle(9)).toBe(225);
    });

    it('calculates 10 hours as ₹240 (210 + 15*2)', () => {
      expect(calculateTierFeeForCycle(10)).toBe(240);
    });
  });

  describe('Partial-Hour Rounding Rules', () => {
    it('rounds 2 hours 00 minutes to exactly 2 billable hours', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T12:00',
        vehicleType: 'car',
        isWeekend: false,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.duration.billableHours).toBe(2);
        expect(result.finalFee).toBe(70);
      }
    });

    it('rounds 2 hours 01 minute up to 3 billable hours', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T12:01',
        vehicleType: 'car',
        isWeekend: false,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.duration.billableHours).toBe(3);
        expect(result.finalFee).toBe(100); // 40 + 30 + 30
      }
    });

    it('rounds 2 hours 59 minutes up to 3 billable hours', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T12:59',
        vehicleType: 'car',
        isWeekend: false,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.duration.billableHours).toBe(3);
        expect(result.finalFee).toBe(100);
      }
    });
  });

  describe('Continuous 24-Hour Daily Cap (₹250)', () => {
    it('does not cap sessions below ₹250', () => {
      const base = calculateContinuousBaseFee(8);
      expect(base.uncappedBaseFee).toBe(210);
      expect(base.cappedBaseFee).toBe(210);
      expect(base.isDailyCapApplied).toBe(false);
      expect(base.capSavings).toBe(0);
    });

    it('caps single-day sessions when uncapped tier fee exceeds ₹250 (11 hours: uncapped ₹255 -> capped ₹250)', () => {
      const base = calculateContinuousBaseFee(11);
      expect(base.uncappedBaseFee).toBe(255);
      expect(base.cappedBaseFee).toBe(250);
      expect(base.isDailyCapApplied).toBe(true);
      expect(base.capSavings).toBe(5);
    });

    it('caps 24-hour continuous session at ₹250 (uncapped ₹450)', () => {
      const base = calculateContinuousBaseFee(24);
      expect(base.uncappedBaseFee).toBe(450);
      expect(base.cappedBaseFee).toBe(250);
      expect(base.isDailyCapApplied).toBe(true);
      expect(base.capSavings).toBe(200);
    });

    it('applies daily cap per 24-hour continuous billing cycle across multiple days (25 hours = 250 + 40 = ₹290)', () => {
      const base = calculateContinuousBaseFee(25);
      expect(base.cappedBaseFee).toBe(290); // 1 full day capped at 250 + 1st hour of next cycle (40)
    });

    it('calculates 48-hour parking as 2 full capped days (2 x ₹250 = ₹500)', () => {
      const base = calculateContinuousBaseFee(48);
      expect(base.cappedBaseFee).toBe(500);
    });

    it('caps multi-day sessions where remaining partial cycle also exceeds ₹250 (35 hours = 250 + 250 = ₹500)', () => {
      const base = calculateContinuousBaseFee(35);
      expect(base.uncappedBaseFee).toBe(705); // 450 + 255
      expect(base.cappedBaseFee).toBe(500); // 250 + 250
      expect(base.capSavings).toBe(205);
    });

    it('calculates exact 24-hour cycle boundary as exactly 1 full capped day (₹250)', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-27T10:00',
        vehicleType: 'car',
        isWeekend: false,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.duration.billableHours).toBe(24);
        expect(result.finalFee).toBe(250);
      }
    });

    it('bills a 1-minute parking session as 1 billable hour', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T10:01',
        vehicleType: 'car',
        isWeekend: false,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.duration.billableHours).toBe(1);
        expect(result.finalFee).toBe(40);
      }
    });

    it('bills a 59-minute parking session as 1 billable hour', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T10:59',
        vehicleType: 'car',
        isWeekend: false,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.duration.billableHours).toBe(1);
        expect(result.finalFee).toBe(40);
      }
    });
  });

  describe('Vehicle Adjustments', () => {
    it('applies no adjustment for Car (0%)', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T15:00', // 5h -> base ₹150
        vehicleType: 'car',
        isWeekend: false,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.cappedBaseFee).toBe(150);
        expect(result.vehicleAdjustmentPercentage).toBe(0);
        expect(result.vehicleAdjustmentAmount).toBe(0);
        expect(result.finalFee).toBe(150);
      }
    });

    it('applies 20% discount for Motorcycle', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T15:00', // 5h -> base ₹150
        vehicleType: 'motorcycle',
        isWeekend: false,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.cappedBaseFee).toBe(150);
        expect(result.vehicleAdjustmentPercentage).toBe(-20);
        expect(result.vehicleAdjustmentAmount).toBe(-30);
        expect(result.finalFee).toBe(120);
      }
    });

    it('applies 20% surcharge for SUV', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T15:00', // 5h -> base ₹150
        vehicleType: 'suv',
        isWeekend: false,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.cappedBaseFee).toBe(150);
        expect(result.vehicleAdjustmentPercentage).toBe(20);
        expect(result.vehicleAdjustmentAmount).toBe(30);
        expect(result.finalFee).toBe(180);
      }
    });
  });

  describe('Weekend Surcharges', () => {
    it('applies 10% surcharge on weekend sessions for Car', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T15:00', // 5h -> base ₹150
        vehicleType: 'car',
        isWeekend: true,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.weekendSurchargePercentage).toBe(10);
        expect(result.weekendSurchargeAmount).toBe(15);
        expect(result.finalFee).toBe(165); // 150 + 15
      }
    });

    it('applies 10% weekend surcharge on post-vehicle adjusted amount for Motorcycle', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T15:00', // 5h -> base ₹150, Motorcycle = ₹120
        vehicleType: 'motorcycle',
        isWeekend: true,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.cappedBaseFee).toBe(150);
        expect(result.vehicleAdjustmentAmount).toBe(-30);
        expect(result.feeAfterVehicle).toBe(120);
        expect(result.weekendSurchargeAmount).toBe(12); // 10% of 120
        expect(result.finalFee).toBe(132); // 120 + 12
      }
    });

    it('applies 10% weekend surcharge on post-vehicle adjusted amount for SUV', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T10:00',
        exitDatetime: '2026-08-26T15:00', // 5h -> base ₹150, SUV = ₹180
        vehicleType: 'suv',
        isWeekend: true,
      });

      expect(result.status).toBe('VALID');
      if (result.status === 'VALID') {
        expect(result.cappedBaseFee).toBe(150);
        expect(result.vehicleAdjustmentAmount).toBe(30);
        expect(result.feeAfterVehicle).toBe(180);
        expect(result.weekendSurchargeAmount).toBe(18); // 10% of 180
        expect(result.finalFee).toBe(198); // 180 + 18
      }
    });
  });

  describe('Invalid State Handling', () => {
    it('returns INVALID state when exit is before entry', () => {
      const result = calculateParkingFee({
        entryDatetime: '2026-08-26T15:00',
        exitDatetime: '2026-08-26T10:00',
        vehicleType: 'car',
        isWeekend: false,
      });

      expect(result.status).toBe('INVALID');
      if (result.status === 'INVALID') {
        expect(result.errorMessage).toBe('Exit time must be later than entry time.');
      }
    });

    it('returns INVALID state when entry or exit is missing', () => {
      const result = calculateParkingFee({
        entryDatetime: '',
        exitDatetime: '2026-08-26T10:00',
        vehicleType: 'car',
        isWeekend: false,
      });

      expect(result.status).toBe('INVALID');
    });
  });

  describe('Rupees Formatter', () => {
    it('formats numbers with ₹ symbol and 2 decimals', () => {
      expect(formatRupees(150)).toBe('₹150.00');
      expect(formatRupees(31.5)).toBe('₹31.50');
      expect(formatRupees(0)).toBe('₹0.00');
      expect(formatRupees(NaN)).toBe('₹0.00');
    });
  });
});
