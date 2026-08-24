import type { Variant } from './schemas';

export const sampleVariant1: Variant = {
  id: 'tata-nexon-ev-empowered-plus-lr',
  generationId: 'nexon-gen-2',
  name: 'Tata Nexon EV Empowered Plus LR',
  powertrain: 'ELECTRIC',
  status: 'ON_SALE',
  transmission: 'EV_DIRECT',
  batteryCapacityKwh: 40.5,
  statusProvenance: {
    sourceType: 'OEM_OFFICIAL',
    observedDate: '2024-03-01',
    verifiedDate: '2024-03-01',
    confidence: 100,
  }
};

export const sampleVariant2: Variant = {
  id: 'tata-nexon-fearless-plus-s-dct',
  generationId: 'nexon-gen-2',
  name: 'Tata Nexon Fearless Plus S DCT',
  powertrain: 'PETROL',
  status: 'ON_SALE',
  transmission: 'DCT',
  engineDisplacementCc: 1199,
  statusProvenance: {
    sourceType: 'OEM_OFFICIAL',
    observedDate: '2024-03-01',
    verifiedDate: '2024-03-01',
    confidence: 100,
  }
};
