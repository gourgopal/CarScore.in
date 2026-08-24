import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VariantSchema } from '../src/data/schemas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple mocked import pipeline
const rawDataDir = path.join(__dirname, '../src/data/raw');
const outDir = path.join(__dirname, '../public/data'); // Static JSON bundles for the client

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// In a real scenario, this reads from CSV/JSONs in rawDataDir. 
// For Month 1-2, we simulate importing a known payload.
const incomingData = [
  {
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
  },
  {
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
  }
];

console.log('Starting data import and validation...');

const validVariants = [];
let errors = 0;

for (const raw of incomingData) {
  const result = VariantSchema.safeParse(raw);
  if (result.success) {
    validVariants.push(result.data);
  } else {
    console.error(`Validation failed for ${raw.id}:`, result.error.errors);
    errors++;
  }
}

if (errors > 0) {
  console.error(`Import failed with ${errors} errors. No data published.`);
  process.exit(1);
}

// Write to static JSON bundle for client consumption (e.g., /data/variants.json)
fs.writeFileSync(
  path.join(outDir, 'variants.json'), 
  JSON.stringify(validVariants, null, 2)
);

console.log(`Import successful. ${validVariants.length} variants published to /public/data/variants.json`);
