import { describe, it, expect } from 'vitest';
import { calculateIceFuelCost, calculateCngFuelCost, calculateEvChargingCost } from '../../src/domain/energy';

describe('Energy Calculations', () => {
  it('should calculate ICE fuel cost correctly', () => {
    const res = calculateIceFuelCost({
      annualKm: 15000,
      efficiencyKmPerLitre: 15,
      fuelPricePerLitre: 100
    });
    expect(res.annualLitres).toBe(1000);
    expect(res.annualFuelCost).toBe(100000);
  });

  it('should calculate CNG fuel cost correctly', () => {
    const res = calculateCngFuelCost({
      annualKm: 15000,
      efficiencyKmPerKg: 20,
      cngPricePerKg: 80
    });
    expect(res.annualCngKg).toBe(750);
    expect(res.annualCngCost).toBe(60000);
  });

  it('should calculate EV charging cost correctly', () => {
    const res = calculateEvChargingCost({
      annualKm: 15000,
      consumptionWhPerKm: 150,
      chargingEfficiency: 0.9,
      homeChargingPercentage: 80,
      publicAcPercentage: 10,
      publicDcPercentage: 10,
      homeTariff: 8,
      publicAcTariff: 15,
      publicDcTariff: 22
    });

    // 15000 * 150 / 1000 = 2250 kWh
    expect(res.vehicleEnergyKwh).toBe(2250);
    
    // grid energy = 2250 / 0.9 = 2500 kWh
    expect(res.gridEnergyKwh).toBe(2500);

    const homeCost = 2500 * 0.8 * 8; // 2000 * 8 = 16000
    const acCost = 2500 * 0.1 * 15;  // 250 * 15 = 3750
    const dcCost = 2500 * 0.1 * 22;  // 250 * 22 = 5500
    
    expect(res.annualChargingCost).toBe(16000 + 3750 + 5500); // 25250
  });

  it('should throw error if EV charging percentages do not sum to 100', () => {
    expect(() => {
      calculateEvChargingCost({
        annualKm: 15000,
        consumptionWhPerKm: 150,
        chargingEfficiency: 0.9,
        homeChargingPercentage: 50,
        publicAcPercentage: 10,
        publicDcPercentage: 10,
        homeTariff: 8,
        publicAcTariff: 15,
        publicDcTariff: 22
      });
    }).toThrow('Charging percentages must sum to 100');
  });
});
