export type VehicleType = 'car' | 'motorcycle' | 'suv';

export interface ParkingFeeInput {
  entryDatetime: string;
  exitDatetime: string;
  vehicleType: VehicleType;
  isWeekend: boolean;
}

export interface DurationBreakdown {
  milliseconds: number;
  totalMinutes: number;
  totalHours: number;
  hoursComponent: number;
  minutesComponent: number;
  formattedDuration: string;
  billableHours: number;
}

export interface ParkingFeeSuccessResult {
  status: 'VALID';
  entryDatetime: string;
  exitDatetime: string;
  vehicleType: VehicleType;
  isWeekend: boolean;
  duration: DurationBreakdown;
  baseTierFee: number;
  cappedBaseFee: number;
  isDailyCapApplied: boolean;
  capSavings: number;
  vehicleAdjustmentPercentage: number;
  vehicleAdjustmentAmount: number;
  feeAfterVehicle: number;
  weekendSurchargePercentage: number;
  weekendSurchargeAmount: number;
  finalFee: number;
}

export interface ParkingFeeInvalidResult {
  status: 'INVALID';
  errorMessage: string;
}

export type ParkingFeeResult = ParkingFeeSuccessResult | ParkingFeeInvalidResult;
