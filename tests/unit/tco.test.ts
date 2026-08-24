import { describe, it, expect } from 'vitest';
import { calculateTco } from '../../src/domain/tco';

describe('TCO Calculations', () => {
  it('should calculate Cash Outflow and Economic TCO without double-counting principal', () => {
    const res = calculateTco({
      downPayment: 200000,
      totalRepayments: 1216584, // Principal (10L) + Interest (216584)
      financeFees: 5000,
      insuranceTotal: 150000,
      fuelOrChargingTotal: 500000,
      scheduledServiceTotal: 40000,
      repairsTotal: 10000,
      consumablesTotal: 10000,
      tyresBatteryTotal: 30000,
      parkingTotal: 0,
      tollsTotal: 0,
      otherRecurringTotal: 0,
      
      acquisitionPrice: 1200000, // Down payment + Principal
      totalInterest: 216584,
      expectedResaleValue: 600000,
      approvedIncentivesNotDeducted: 0,
      
      totalOwnershipMonths: 60, // 5 years
      totalOwnershipKm: 75000
    });

    const expectedCashOutflow = 200000 + 1216584 + 5000 + 150000 + 500000 + 40000 + 10000 + 10000 + 30000;
    expect(res.totalCashOutflow).toBe(expectedCashOutflow);

    // Economic TCO = acquisition + interest + fees + running costs - resale
    // 1200000 + 216584 + 5000 + 150000 + 500000 + 40000 + 10000 + 10000 + 30000 - 600000
    // = 1200000 + 961584 - 600000 = 1561584
    const expectedEconomicTco = 1200000 + 216584 + 5000 + 150000 + 500000 + 40000 + 10000 + 10000 + 30000 - 600000;
    expect(res.economicTco).toBe(expectedEconomicTco);
    expect(res.monthlyTco).toBe(expectedEconomicTco / 60);
    expect(res.annualTco).toBe((expectedEconomicTco / 60) * 12);
    expect(res.costPerKm).toBe(expectedEconomicTco / 75000);
    expect(res.economicDepreciation).toBe(1200000 - 600000);
  });
});
