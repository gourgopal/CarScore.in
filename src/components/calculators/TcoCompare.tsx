import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfidenceBadge } from '../ui/Badge';
import { sampleVariant1, sampleVariant2 } from '../../data/fixtures';
import type { Variant } from '../../data/schemas';

// Mock TCO logic for the UI demonstration
// In the full implementation, we'd use the `calculateTco` from `src/domain/tco.ts` 
// combined with `calculateIceFuelCost` etc.

export function TcoCompare() {
  const [selectedVariants, setSelectedVariants] = useState<Variant[]>([sampleVariant1, sampleVariant2]);
  const [annualKm, setAnnualKm] = useState(15000);
  const [years, setYears] = useState(5);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="flex gap-4 items-center w-full sm:w-auto">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Annual Distance (km)</label>
            <input 
              type="number" 
              className="w-32 rounded-md border-gray-300 border px-3 py-1.5 text-sm" 
              value={annualKm}
              onChange={(e) => setAnnualKm(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ownership (Years)</label>
            <select 
              className="w-32 rounded-md border-gray-300 border px-3 py-1.5 text-sm bg-white"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            >
              {[3,4,5,6,7,8,10].map(y => <option key={y} value={y}>{y} Years</option>)}
            </select>
          </div>
        </div>
        <Button variant="outline">+ Add Car</Button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {selectedVariants.map(variant => {
          
          // Fake calculation for visual proof of concept based on powertrain
          const isEv = variant.powertrain === 'ELECTRIC';
          const acquisition = isEv ? 1500000 : 1300000;
          const energyCostPerKm = isEv ? 1.2 : 6.5;
          const annualEnergy = annualKm * energyCostPerKm;
          const totalEnergy = annualEnergy * years;
          const totalService = (isEv ? 5000 : 8000) * years;
          const insurance = (isEv ? 25000 : 20000) * years;
          const resale = acquisition * (isEv ? 0.45 : 0.55); // Fake depreciation
          
          const economicTco = acquisition + totalEnergy + totalService + insurance - resale;

          return (
            <Card key={variant.id} className="relative">
              <div className="absolute -top-3 left-4">
                <ConfidenceBadge score={variant.statusProvenance.confidence} />
              </div>
              <CardContent className="pt-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg leading-tight text-gray-900">{variant.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{variant.powertrain}</p>
                </div>
                
                <div className="bg-gray-50 rounded-md p-4 text-center">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">5-Year TCO</p>
                  <p className="text-3xl font-extrabold text-gray-900">{formatCurrency(economicTco)}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatCurrency(economicTco / (annualKm * years))} / km</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Acquisition</span>
                    <span className="font-medium">{formatCurrency(acquisition)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Energy (Total)</span>
                    <span className="font-medium">{formatCurrency(totalEnergy)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Maintenance</span>
                    <span className="font-medium">{formatCurrency(totalService)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Insurance</span>
                    <span className="font-medium">{formatCurrency(insurance)}</span>
                  </div>
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Est. Resale</span>
                    <span>- {formatCurrency(resale)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
