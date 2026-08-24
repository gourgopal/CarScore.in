import { z } from 'zod';

/**
 * Data Provenance Enums
 */
export const SourceType = z.enum([
  'OEM_OFFICIAL',
  'GOVERNMENT_OFFICIAL',
  'CERTIFICATION_BODY',
  'PARTNER_VERIFIED',
  'EDITORIALLY_VERIFIED',
  'USER_REPORTED_VERIFIED',
  'USER_REPORTED_UNVERIFIED',
  'DERIVED',
  'ESTIMATED',
  'UNKNOWN'
]);

export const VehicleStatus = z.enum([
  'RUMOURED',
  'ANTICIPATED',
  'MANUFACTURER_CONFIRMED',
  'UNVEILED',
  'BOOKINGS_OPEN',
  'LAUNCHED',
  'ON_SALE',
  'TEMPORARILY_UNAVAILABLE',
  'LIMITED_AVAILABILITY',
  'VARIANT_DISCONTINUED',
  'MODEL_DISCONTINUED',
  'REPLACED',
  'FACELIFTED',
  'EXPORT_ONLY',
  'CANCELLED',
  'UNKNOWN'
]);

export const Powertrain = z.enum([
  'PETROL',
  'DIESEL',
  'CNG',
  'STRONG_HYBRID',
  'ELECTRIC'
]);

/**
 * Reusable Provenance Metadata block
 */
export const ProvenanceMetadata = z.object({
  sourceType: SourceType,
  sourceUrl: z.string().url().optional(),
  sourcePublicationDate: z.string().date().optional(),
  observedDate: z.string().date(),
  verifiedDate: z.string().date(),
  confidence: z.number().min(0).max(100),
  notes: z.string().optional(),
  reviewerId: z.string().optional(),
});

/**
 * Base Entities
 */
export const ManufacturerSchema = z.object({
  id: z.string(), // Slug, e.g. "maruti-suzuki"
  name: z.string(),
  active: z.boolean(),
});

export const NameplateSchema = z.object({
  id: z.string(), // Slug, e.g. "swift"
  manufacturerId: z.string(),
  name: z.string(),
});

export const GenerationSchema = z.object({
  id: z.string(),
  nameplateId: z.string(),
  name: z.string(),
  startYear: z.number(),
  endYear: z.number().optional(),
});

export const VariantSchema = z.object({
  id: z.string(), // Canonical slug, e.g. "maruti-suzuki-swift-zxi-plus-2024"
  brand: z.string(),
  generationId: z.string(),
  name: z.string(),
  imageUrl: z.string().optional(),
  powertrain: Powertrain,
  status: VehicleStatus,
  statusProvenance: ProvenanceMetadata,
  
  // Specs
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'AMT', 'CVT', 'DCT', 'TORQUE_CONVERTER', 'EV_DIRECT']),
  
  // Optional specs, required if EV
  batteryCapacityKwh: z.number().optional(),
  
  // Optional specs, required if ICE/Hybrid/CNG
  engineDisplacementCc: z.number().optional(),
});

export type Manufacturer = z.infer<typeof ManufacturerSchema>;
export type Nameplate = z.infer<typeof NameplateSchema>;
export type Generation = z.infer<typeof GenerationSchema>;
export type Variant = z.infer<typeof VariantSchema>;
