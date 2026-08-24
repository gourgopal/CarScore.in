import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VariantSchema, type Variant } from '../src/data/schemas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawDataDir = path.join(__dirname, '../src/data/raw');
const outDir = path.join(__dirname, '../public/data'); // Static JSON bundles for the client

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
if (!fs.existsSync(rawDataDir)) {
  fs.mkdirSync(rawDataDir, { recursive: true });
}

console.log('Scanning src/data/raw for JSON vehicle definitions...');

const incomingData: any[] = [];

// Read all JSON files from the raw directory
const files = fs.readdirSync(rawDataDir);
for (const file of files) {
  if (file.endsWith('.json')) {
    try {
      const content = fs.readFileSync(path.join(rawDataDir, file), 'utf-8');
      const parsed = JSON.parse(content);
      // Support both single objects and arrays of objects
      if (Array.isArray(parsed)) {
        incomingData.push(...parsed);
      } else {
        incomingData.push(parsed);
      }
    } catch (e) {
      console.error(`Error reading or parsing ${file}:`, e);
    }
  }
}

// If no files are present, inject our two default mock cars just so the site works
if (incomingData.length === 0) {
  console.log('No raw JSON files found. Using default mock variants.');
  incomingData.push(
    {
      id: 'tata-nexon-ev-empowered-plus-lr',
      generationId: 'nexon-gen-2',
      name: 'Tata Nexon EV Empowered Plus LR',
      brand: 'TATA',
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
      brand: 'TATA',
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
  );
}

const validVariants: Variant[] = [];
let errors = 0;

for (const raw of incomingData) {
  const result = VariantSchema.safeParse(raw);
  if (result.success) {
    validVariants.push(result.data);
  } else {
    console.error(`Validation failed for ${raw.id || 'Unknown ID'}:`);
    result.error.errors.forEach(err => console.error(`  - ${err.path.join('.')}: ${err.message}`));
    errors++;
  }
}

if (errors > 0) {
  console.error(`\nImport failed with ${errors} schema validation errors. Fix the JSON data and run "npm run import-data" again.`);
  process.exit(1);
}

// Write to static JSON bundle for client consumption
fs.writeFileSync(
  path.join(outDir, 'variants.json'), 
  JSON.stringify(validVariants, null, 2)
);

console.log(`Import successful. ${validVariants.length} variants validated and published to /public/data/variants.json`);
