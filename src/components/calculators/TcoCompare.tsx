import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfidenceBadge } from '../ui/Badge';
import { sampleVariant1, sampleVariant2 } from '../../data/fixtures';
import type { Variant } from '../../data/schemas';
import { calculateEMI } from '../../domain/calculations';

// A mock database of variants just for demonstration of the "Add Car" button
const availableVariants: Variant[] = [
  sampleVariant1,
  sampleVariant2,
  {
    ...sampleVariant1,
    id: 'maruti-fronx-turbo',
    name: 'Maruti Fronx 1.0 Turbo Alpha',
    brand: 'MARUTI',
    powertrain: 'PETROL',
  },
  {
    ...sampleVariant2,
    id: 'mg-zs-ev',
    name: 'MG ZS EV Exclusive Plus',
    brand: 'MG',
    powertrain: 'ELECTRIC',
  }
];

export function TcoCompare() {
  const [selectedVariants, setSelectedVariants] = useState<Variant[]>([sampleVariant1, sampleVariant2]);
  const [annualKm, setAnnualKm] = useState(15000);
  const [years, setYears] = useState(5);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const handleAddCar = () => {
    if (selectedVariants.length < 4) {
      const nextVariant = availableVariants[selectedVariants.length % availableVariants.length];
      setSelectedVariants([...selectedVariants, nextVariant]);
    }
  };

  const getPowertrainFlair = (powertrain: string) => {
    switch (powertrain) {
      case 'ELECTRIC': return <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>;
      case 'PETROL': return <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>;
      case 'DIESEL': return <span className="inline-block w-2 h-2 rounded-full bg-slate-400 mr-2"></span>;
      case 'CNG': return <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-[#111a2a] p-6 rounded-lg border border-slate-700 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-6 items-center w-full sm:w-auto">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Annual Distance (km)</label>
            <input 
              type="number" 
              className="w-32 rounded border border-slate-700 bg-[#0f1725] text-white px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary-500 focus:outline-none" 
              value={annualKm}
              onChange={(e) => setAnnualKm(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Ownership (Years)</label>
            <select 
              className="w-32 rounded border border-slate-700 bg-[#0f1725] text-white px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary-500 focus:outline-none"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            >
              {[3,4,5,6,7,8,10].map(y => <option key={y} value={y} className="bg-[#0f1725] text-white">{y} Years</option>)}
            </select>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="border-dashed" 
          onClick={handleAddCar}
          disabled={selectedVariants.length >= 4}
        >
          {selectedVariants.length >= 4 ? 'Max Cars Reached' : '+ Add Car'}
        </Button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {selectedVariants.map((variant, index) => {
          
          const isEv = variant.powertrain === 'ELECTRIC';
          const acquisition = isEv ? 1500000 : 1300000; // Mock prices for demo
          
          // Loan Assumptions: 80% financed at 8.5% over the full ownership tenure (or max 7 years)
          const loanTenure = Math.min(years * 12, 84); 
          const loanResults = calculateEMI({
            onRoadPrice: acquisition,
            downPayment: acquisition * 0.2, // 20% down
            annualInterestRate: 8.5,
            tenureInMonths: loanTenure,
            processingFee: 5000
          });

          const energyCostPerKm = isEv ? 1.2 : 6.5;
          const annualEnergy = annualKm * energyCostPerKm;
          const totalEnergy = annualEnergy * years;
          const totalService = (isEv ? 5000 : 8000) * years;
          const insurance = (isEv ? 25000 : 20000) * years;
          const resale = acquisition * (isEv ? 0.45 : 0.55);
          
          // Total Cash Outflow + Depreciation - Principal (since principal is in acquisition)
          const economicTco = acquisition + loanResults.totalInterest + loanResults.fees + totalEnergy + totalService + insurance - resale;

          return (
            <Card key={`${variant.id}-${index}`} className="relative hover:border-primary-500 transition-colors">
              <div className="absolute -top-3 left-4">
                <ConfidenceBadge score={variant.statusProvenance.confidence} />
              </div>
              <CardContent className="pt-8 space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-2xl leading-tight text-white mb-2">{variant.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    {getPowertrainFlair(variant.powertrain)}
                    {variant.powertrain} · {variant.brand}
                  </p>
                </div>
                
                <div className="border border-slate-700 rounded p-5 text-center bg-[#0f1725]">
                  <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-2">{years}-Year TCO</p>
                  <p className="text-3xl font-serif font-bold tracking-tight text-white">{formatCurrency(economicTco)}</p>
                  <p className="text-xs text-slate-500 font-medium mt-2">{formatCurrency(economicTco / (annualKm * years))} / km</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-medium">Acquisition</span>
                    <span className="font-bold text-slate-200">{formatCurrency(acquisition)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-medium">Finance Interest</span>
                    <span className="font-bold text-slate-200">{formatCurrency(loanResults.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-medium">Energy ({years}Y)</span>
                    <span className="font-bold text-slate-200">{formatCurrency(totalEnergy)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-medium">Maintenance ({years}Y)</span>
                    <span className="font-bold text-slate-200">{formatCurrency(totalService)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-medium">Insurance ({years}Y)</span>
                    <span className="font-bold text-slate-200">{formatCurrency(insurance)}</span>
                  </div>
                  <div className="flex justify-between text-primary-400 font-bold pt-1">
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
