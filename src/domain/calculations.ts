/**
 * Framework-independent calculation domain module.
 * Does not import UI components, browser APIs, or Cloudflare-specific code.
 */

export interface DistanceInputs {
  dailyKm?: number;
  monthlyKm?: number;
  annualKm?: number;
  drivingDaysPerWeek?: number;
  drivingDaysPerMonth?: number;
}

export interface DistanceResult {
  annualKm: number;
  monthlyKm: number;
  dailyAverageKm: number;
  totalOwnershipKm: (years: number) => number;
}

/**
 * 1. Annual-distance normalization.
 */
export function normalizeDistance(inputs: DistanceInputs): DistanceResult {
  let annualKm = 0;

  if (inputs.annualKm !== undefined) {
    annualKm = inputs.annualKm;
  } else if (inputs.monthlyKm !== undefined) {
    annualKm = inputs.monthlyKm * 12;
  } else if (inputs.dailyKm !== undefined) {
    const daysPerYear = inputs.drivingDaysPerWeek 
      ? inputs.drivingDaysPerWeek * 52 
      : inputs.drivingDaysPerMonth 
        ? inputs.drivingDaysPerMonth * 12 
        : 365;
    annualKm = inputs.dailyKm * daysPerYear;
  } else {
    throw new Error('Must provide one of annualKm, monthlyKm, or dailyKm.');
  }

  return {
    annualKm,
    monthlyKm: annualKm / 12,
    dailyAverageKm: annualKm / 365,
    totalOwnershipKm: (years: number) => annualKm * years
  };
}

export interface LoanInputs {
  onRoadPrice: number;
  downPayment: number;
  annualInterestRate: number; // e.g. 8.5 for 8.5%
  tenureInMonths: number;
  processingFee: number;
  additionalFinanceCharges?: number;
}

export interface LoanResult {
  principal: number;
  emi: number;
  totalRepayments: number;
  totalInterest: number;
  fees: number;
  totalFinanceCost: number;
}

/**
 * 3. EMI and finance cost.
 */
export function calculateEMI(inputs: LoanInputs): LoanResult {
  const principal = inputs.onRoadPrice - inputs.downPayment;
  const fees = inputs.processingFee + (inputs.additionalFinanceCharges || 0);

  let emi = 0;
  let totalRepayments = 0;
  let totalInterest = 0;

  if (principal > 0) {
    if (inputs.annualInterestRate > 0) {
      const monthlyRate = (inputs.annualInterestRate / 100) / 12;
      const months = inputs.tenureInMonths;
      
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      totalRepayments = emi * months;
      totalInterest = totalRepayments - principal;
    } else {
      // Zero-interest loan
      emi = principal / inputs.tenureInMonths;
      totalRepayments = principal;
      totalInterest = 0;
    }
  }

  return {
    principal,
    emi,
    totalRepayments,
    totalInterest,
    fees,
    totalFinanceCost: totalInterest + fees
  };
}
