export interface TcoInputs {
  // Cash outflow items
  downPayment: number;
  totalRepayments: number; // Includes principal + interest, or just enter loan components directly
  financeFees: number;
  insuranceTotal: number;
  fuelOrChargingTotal: number;
  scheduledServiceTotal: number;
  repairsTotal: number;
  consumablesTotal: number;
  tyresBatteryTotal: number;
  parkingTotal: number;
  tollsTotal: number;
  otherRecurringTotal: number;
  
  // Economic TCO specific items
  acquisitionPrice: number; // e.g. On-road price
  totalInterest: number; // From loan
  expectedResaleValue: number;
  approvedIncentivesNotDeducted: number;
  
  // Usage
  totalOwnershipMonths: number;
  totalOwnershipKm: number;
}

/**
 * 15 & 16. Total cash outflow and Economic TCO.
 */
export function calculateTco(inputs: TcoInputs) {
  const totalCashOutflow = 
    inputs.downPayment +
    inputs.totalRepayments +
    inputs.financeFees +
    inputs.insuranceTotal +
    inputs.fuelOrChargingTotal +
    inputs.scheduledServiceTotal +
    inputs.repairsTotal +
    inputs.consumablesTotal +
    inputs.tyresBatteryTotal +
    inputs.parkingTotal +
    inputs.tollsTotal +
    inputs.otherRecurringTotal;

  const economicTco = 
    inputs.acquisitionPrice +
    inputs.totalInterest +
    inputs.financeFees +
    inputs.insuranceTotal +
    inputs.fuelOrChargingTotal +
    inputs.scheduledServiceTotal +
    inputs.repairsTotal +
    inputs.consumablesTotal +
    inputs.tyresBatteryTotal +
    inputs.parkingTotal +
    inputs.tollsTotal +
    inputs.otherRecurringTotal -
    inputs.expectedResaleValue -
    inputs.approvedIncentivesNotDeducted;

  const monthlyTco = economicTco / (inputs.totalOwnershipMonths || 1);
  const annualTco = monthlyTco * 12;
  const costPerKm = economicTco / (inputs.totalOwnershipKm || 1);
  
  const economicDepreciation = inputs.acquisitionPrice - inputs.expectedResaleValue;

  return {
    totalCashOutflow,
    economicTco,
    monthlyTco,
    annualTco,
    costPerKm,
    economicDepreciation
  };
}
