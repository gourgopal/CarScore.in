import { describe, it, expect } from 'vitest';
import { normalizeDistance, calculateEMI } from '../../src/domain/calculations';

describe('normalizeDistance', () => {
  it('should calculate annual distance from daily usage (365 days)', () => {
    const res = normalizeDistance({ dailyKm: 50 });
    expect(res.annualKm).toBe(18250);
    expect(res.monthlyKm).toBe(18250 / 12);
    expect(res.dailyAverageKm).toBe(50);
  });

  it('should calculate annual distance from daily usage (specific days per week)', () => {
    const res = normalizeDistance({ dailyKm: 50, drivingDaysPerWeek: 5 });
    expect(res.annualKm).toBe(13000); // 50 * 5 * 52
  });

  it('should calculate annual distance from monthly usage', () => {
    const res = normalizeDistance({ monthlyKm: 1000 });
    expect(res.annualKm).toBe(12000);
  });
  
  it('should prioritize annualKm if provided', () => {
    const res = normalizeDistance({ annualKm: 15000, monthlyKm: 5000 });
    expect(res.annualKm).toBe(15000);
  });
});

describe('calculateEMI', () => {
  it('should calculate correct EMI and totals for standard loan', () => {
    // 10L loan, 8% interest, 60 months
    const res = calculateEMI({
      onRoadPrice: 1200000,
      downPayment: 200000, // principal: 1000000
      annualInterestRate: 8,
      tenureInMonths: 60,
      processingFee: 5000
    });

    expect(res.principal).toBe(1000000);
    expect(res.fees).toBe(5000);
    expect(Math.round(res.emi)).toBe(20276); // Standard EMI for 10L @ 8% for 5 years
    expect(Math.round(res.totalRepayments)).toBe(1216584);
    expect(Math.round(res.totalInterest)).toBe(216584);
    expect(Math.round(res.totalFinanceCost)).toBe(221584);
  });

  it('should calculate correctly for 0% interest', () => {
    const res = calculateEMI({
      onRoadPrice: 1200000,
      downPayment: 200000, // principal: 1000000
      annualInterestRate: 0,
      tenureInMonths: 60,
      processingFee: 1000
    });

    expect(res.principal).toBe(1000000);
    expect(res.emi).toBe(1000000 / 60);
    expect(res.totalInterest).toBe(0);
    expect(res.totalRepayments).toBe(1000000);
    expect(res.totalFinanceCost).toBe(1000);
  });
});
