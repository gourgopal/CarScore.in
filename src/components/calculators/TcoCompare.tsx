import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfidenceBadge } from '../ui/Badge';
import { sampleVariant1, sampleVariant2 } from '../../data/fixtures';
import type { Variant } from '../../data/schemas';

export function TcoCompare() {
  const [selectedVariants, setSelectedVariants] = useState<Variant[]>([sampleVariant1, sampleVariant2]);
  const [annualKm, setAnnualKm] = useState(15000);
  const [years, setYears] = useState(5);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-6 items-center w-full sm:w-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Annual Distance (km)</label>
            <input 
              type="number" 
              className="w-32 rounded-lg border-slate-300 border px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              value={annualKm}
              onChange={(e) => setAnnualKm(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Ownership (Years)</label>
            <select 
              className="w-32 rounded-lg border-slate-300 border px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            >
              {[3,4,5,6,7,8,10].map(y => <option key={y} value={y}>{y} Years</option>)}
            </select>
          </div>
        </div>
        <Button variant="outline" className="border-dashed border-2 border-slate-300">+ Add Car</Button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {selectedVariants.map(variant => {
          
          const isEv = variant.powertrain === 'ELECTRIC';
          const acquisition = isEv ? 1500000 : 1300000;
          const energyCostPerKm = isEv ? 1.2 : 6.5;
          const annualEnergy = annualKm * energyCostPerKm;
          const totalEnergy = annualEnergy * years;
          const totalService = (isEv ? 5000 : 8000) * years;
          const insurance = (isEv ? 25000 : 20000) * years;
          const resale = acquisition * (isEv ? 0.45 : 0.55);
          
          const economicTco = acquisition + totalEnergy + totalService + insurance - resale;

          return (
            <Card key={variant.id} className="relative hover:border-blue-300 transition-colors">
              <div className="absolute -top-3 left-4">
                <ConfidenceBadge score={variant.statusProvenance.confidence} />
              </div>
              <CardContent className="pt-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg leading-tight text-slate-900">{variant.name}</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1.5 uppercase tracking-widest">{variant.powertrain}</p>
                </div>
                
                <div className="bg-slate-900 rounded-xl p-5 text-center text-white">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{years}-Year TCO</p>
                  <p className="text-3xl font-extrabold tracking-tight">{formatCurrency(economicTco)}</p>
                  <p className="text-xs text-slate-400 font-medium mt-2">{formatCurrency(economicTco / (annualKm * years))} / km</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Acquisition</span>
                    <span className="font-bold text-slate-900">{formatCurrency(acquisition)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Energy ({years}Y)</span>
                    <span className="font-bold text-slate-900">{formatCurrency(totalEnergy)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Maintenance ({years}Y)</span>
                    <span className="font-bold text-slate-900">{formatCurrency(totalService)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Insurance ({years}Y)</span>
                    <span className="font-bold text-slate-900">{formatCurrency(insurance)}</span>
                  </div>
                  <div className="flex justify-between text-blue-600 font-bold pt-1">
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
