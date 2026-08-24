export interface IceEnergyInputs {
  annualKm: number;
  efficiencyKmPerLitre: number;
  fuelPricePerLitre: number;
}

export interface CngEnergyInputs {
  annualKm: number;
  efficiencyKmPerKg: number;
  cngPricePerKg: number;
}

export interface EvEnergyInputs {
  annualKm: number;
  consumptionWhPerKm: number;
  chargingEfficiency: number; // e.g. 0.9 for 90%
  homeChargingPercentage: number; // 0 to 100
  publicAcPercentage: number;
  publicDcPercentage: number;
  homeTariff: number; // per kWh
  publicAcTariff: number;
  publicDcTariff: number;
}

/**
 * 4. ICE fuel cost.
 */
export function calculateIceFuelCost(inputs: IceEnergyInputs) {
  const annualLitres = inputs.annualKm / inputs.efficiencyKmPerLitre;
  const annualFuelCost = annualLitres * inputs.fuelPricePerLitre;

  return {
    annualLitres,
    annualFuelCost
  };
}

/**
 * 5. CNG fuel cost.
 */
export function calculateCngFuelCost(inputs: CngEnergyInputs) {
  const annualCngKg = inputs.annualKm / inputs.efficiencyKmPerKg;
  const annualCngCost = annualCngKg * inputs.cngPricePerKg;

  return {
    annualCngKg,
    annualCngCost
  };
}

/**
 * 6. EV charging cost.
 */
export function calculateEvChargingCost(inputs: EvEnergyInputs) {
  const totalPercentage = inputs.homeChargingPercentage + inputs.publicAcPercentage + inputs.publicDcPercentage;
  if (Math.abs(totalPercentage - 100) > 0.1) {
    throw new Error('Charging percentages must sum to 100');
  }

  const vehicleEnergyKwh = (inputs.annualKm * inputs.consumptionWhPerKm) / 1000;
  const gridEnergyKwh = vehicleEnergyKwh / inputs.chargingEfficiency;

  const homeGridKwh = gridEnergyKwh * (inputs.homeChargingPercentage / 100);
  const publicAcGridKwh = gridEnergyKwh * (inputs.publicAcPercentage / 100);
  const publicDcGridKwh = gridEnergyKwh * (inputs.publicDcPercentage / 100);

  const annualChargingCost = 
    (homeGridKwh * inputs.homeTariff) + 
    (publicAcGridKwh * inputs.publicAcTariff) + 
    (publicDcGridKwh * inputs.publicDcTariff);

  return {
    vehicleEnergyKwh,
    gridEnergyKwh,
    chargingLossKwh: gridEnergyKwh - vehicleEnergyKwh,
    annualChargingCost
  };
}
