import {
  ParkingFeeInput,
  ParkingFeeResult,
  DurationBreakdown,
} from '../types/parkingFee';
import { roundToTwoDecimals } from './splitBill';

export const DAILY_CAP_AMOUNT = 250;

/**
 * Formats a currency value in Indian Rupees (₹) with 2 decimals.
 */
export function formatRupees(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0.00';
  const rounded = roundToTwoDecimals(amount);
  return `₹${rounded.toFixed(2)}`;
}

/**
 * Calculates elapsed duration between entry and exit datetimes.
 * Returns null if timestamps are invalid or exit <= entry.
 */
export function calculateDuration(
  entryStr: string,
  exitStr: string
): DurationBreakdown | null {
  if (!entryStr || !exitStr) return null;

  const entryDate = new Date(entryStr);
  const exitDate = new Date(exitStr);

  const entryMs = entryDate.getTime();
  const exitMs = exitDate.getTime();

  if (Number.isNaN(entryMs) || Number.isNaN(exitMs)) return null;
  if (exitMs <= entryMs) return null;

  const diffMs = exitMs - entryMs;
  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = diffMs / 3600000;
  const hoursComponent = Math.floor(totalMinutes / 60);
  const minutesComponent = totalMinutes % 60;

  // Partial hours rounded UP to next integer billable hour
  const billableHours = Math.ceil(diffMs / 3600000);

  return {
    milliseconds: diffMs,
    totalMinutes,
    totalHours,
    hoursComponent,
    minutesComponent,
    formattedDuration: `${hoursComponent}h ${minutesComponent}m`,
    billableHours,
  };
}

/**
 * Calculates the standard tiered base rate for a specific number of hours within a 24-hour cycle.
 * First hour: ₹40
 * Hours 2–4: ₹30/hr
 * Hours 5–8: ₹20/hr
 * Hours 9+: ₹15/hr
 */
export function calculateTierFeeForCycle(hours: number): number {
  if (hours <= 0) return 0;
  if (hours === 1) return 40;
  if (hours <= 4) return 40 + (hours - 1) * 30;
  if (hours <= 8) return 40 + 3 * 30 + (hours - 4) * 20; // 130 + (hours - 4) * 20
  return 40 + 3 * 30 + 4 * 20 + (hours - 8) * 15; // 210 + (hours - 8) * 15
}

/**
 * Calculates continuous 24-hour period base parking fees, applying the ₹250 daily cap per period.
 */
export function calculateContinuousBaseFee(billableHours: number): {
  uncappedBaseFee: number;
  cappedBaseFee: number;
  isDailyCapApplied: boolean;
  capSavings: number;
} {
  const fullCycles = Math.floor(billableHours / 24);
  const remainingHours = billableHours % 24;

  const uncappedFullCyclesFee = fullCycles * calculateTierFeeForCycle(24);
  const uncappedRemainingFee = calculateTierFeeForCycle(remainingHours);
  const uncappedBaseFee = uncappedFullCyclesFee + uncappedRemainingFee;

  const cappedFullCyclesFee = fullCycles * DAILY_CAP_AMOUNT;
  const cappedRemainingFee = Math.min(uncappedRemainingFee, DAILY_CAP_AMOUNT);
  const cappedBaseFee = cappedFullCyclesFee + cappedRemainingFee;

  const isDailyCapApplied = cappedBaseFee < uncappedBaseFee;
  const capSavings = Math.max(0, uncappedBaseFee - cappedBaseFee);

  return {
    uncappedBaseFee: roundToTwoDecimals(uncappedBaseFee),
    cappedBaseFee: roundToTwoDecimals(cappedBaseFee),
    isDailyCapApplied,
    capSavings: roundToTwoDecimals(capSavings),
  };
}

/**
 * Pure calculation engine for the Parking Fee Calculator.
 * Executes calculation in strict order:
 * 1. Validate input & datetimes
 * 2. Calculate exact elapsed duration
 * 3. Round partial hours upward
 * 4. Calculate tiered base fee
 * 5. Apply continuous 24-hour daily cap (₹250)
 * 6. Apply vehicle adjustment (Car: 0%, Motorcycle: -20%, SUV: +20%)
 * 7. Apply weekend surcharge (+10%)
 * 8. Round final fee to 2 decimals
 */
export function calculateParkingFee(input: ParkingFeeInput): ParkingFeeResult {
  if (!input.entryDatetime || !input.exitDatetime) {
    return {
      status: 'INVALID',
      errorMessage: 'Please provide both entry and exit date and time.',
    };
  }

  const duration = calculateDuration(input.entryDatetime, input.exitDatetime);
  if (!duration) {
    return {
      status: 'INVALID',
      errorMessage: 'Exit time must be later than entry time.',
    };
  }

  const base = calculateContinuousBaseFee(duration.billableHours);

  // Vehicle adjustment (Car: 0%, Motorcycle: -20%, SUV: +20%)
  let vehicleAdjustmentPercentage = 0;
  if (input.vehicleType === 'motorcycle') {
    vehicleAdjustmentPercentage = -20;
  } else if (input.vehicleType === 'suv') {
    vehicleAdjustmentPercentage = 20;
  }

  const vehicleAdjustmentAmount = roundToTwoDecimals(
    (base.cappedBaseFee * vehicleAdjustmentPercentage) / 100
  );
  const feeAfterVehicle = roundToTwoDecimals(base.cappedBaseFee + vehicleAdjustmentAmount);

  // Weekend surcharge (+10% on applicable base/vehicle fee)
  const weekendSurchargePercentage = input.isWeekend ? 10 : 0;
  const weekendSurchargeAmount = input.isWeekend
    ? roundToTwoDecimals((feeAfterVehicle * weekendSurchargePercentage) / 100)
    : 0;

  const finalFee = roundToTwoDecimals(feeAfterVehicle + weekendSurchargeAmount);

  return {
    status: 'VALID',
    entryDatetime: input.entryDatetime,
    exitDatetime: input.exitDatetime,
    vehicleType: input.vehicleType,
    isWeekend: input.isWeekend,
    duration,
    baseTierFee: base.uncappedBaseFee,
    cappedBaseFee: base.cappedBaseFee,
    isDailyCapApplied: base.isDailyCapApplied,
    capSavings: base.capSavings,
    vehicleAdjustmentPercentage,
    vehicleAdjustmentAmount,
    feeAfterVehicle,
    weekendSurchargePercentage,
    weekendSurchargeAmount,
    finalFee,
  };
}
