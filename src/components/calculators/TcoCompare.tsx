import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfidenceBadge } from '../ui/Badge';
import { sampleVariant1, sampleVariant2 } from '../../data/fixtures';
import type { Variant } from '../../data/schemas';
import { calculateEMI } from '../../domain/calculations';

const availableVariants: Variant[] = [
  sampleVariant1,
  sampleVariant2,
  {
    ...sampleVariant1,
    id: 'maruti-fronx-turbo',
    name: 'Maruti Fronx 1.0 Turbo',
    brand: 'MARUTI',
    powertrain: 'PETROL',
  },
  {
    ...sampleVariant2,
    id: 'mg-zs-ev',
    name: 'MG ZS EV Exclusive',
    brand: 'MG',
    powertrain: 'ELECTRIC',
  }
];

interface VariantConfig {
  variant: Variant;
  acquisition: number;
  energyCostPerKm: number;
  annualMaintenance: number;
  annualInsurance: number;
  resalePercentage: number;
}

const createDefaultConfig = (variant: Variant): VariantConfig => {
  const isEv = variant.powertrain === 'ELECTRIC';
  return {
    variant,
    acquisition: isEv ? 1500000 : 1300000,
    energyCostPerKm: isEv ? 1.2 : 6.5,
    annualMaintenance: isEv ? 5000 : 8000,
    annualInsurance: isEv ? 25000 : 20000,
    resalePercentage: isEv ? 45 : 55,
  };
};

export function TcoCompare() {
  const [configs, setConfigs] = useState<VariantConfig[]>([
    createDefaultConfig(sampleVariant1),
    createDefaultConfig(sampleVariant2)
  ]);
  const [annualKm, setAnnualKm] = useState(15000);
  const [years, setYears] = useState(5);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const handleAddCar = () => {
    if (configs.length < 4) {
      const nextVariant = availableVariants[configs.length % availableVariants.length];
      setConfigs([...configs, createDefaultConfig(nextVariant)]);
    }
  };

  const updateConfig = (index: number, field: keyof VariantConfig, value: number) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setConfigs(newConfigs);
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
          disabled={configs.length >= 4}
        >
          {configs.length >= 4 ? 'Max Cars Reached' : '+ Add Car'}
        </Button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {configs.map((config, index) => {
          const { variant, acquisition, energyCostPerKm, annualMaintenance, annualInsurance, resalePercentage } = config;
          
          const loanTenure = Math.min(years * 12, 84); 
          const loanResults = calculateEMI({
            onRoadPrice: acquisition,
            downPayment: acquisition * 0.2, 
            annualInterestRate: 8.5,
            tenureInMonths: loanTenure,
            processingFee: 5000
          });

          const totalEnergy = annualKm * energyCostPerKm * years;
          const totalService = annualMaintenance * years;
          const insurance = annualInsurance * years;
          const resale = acquisition * (resalePercentage / 100);
          
          const economicTco = acquisition + loanResults.totalInterest + loanResults.fees + totalEnergy + totalService + insurance - resale;

          return (
            <Card key={`${variant.id}-${index}`} className="relative hover:border-primary-500 transition-colors">
              <div className="absolute -top-3 left-4 z-10">
                <ConfidenceBadge score={variant.statusProvenance.confidence} />
              </div>
              <CardContent className="pt-8 space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-xl leading-tight text-white mb-2">{variant.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    {getPowertrainFlair(variant.powertrain)}
                    {variant.powertrain}
                  </p>
                </div>
                
                <div className="border border-slate-700 rounded p-5 text-center bg-[#0f1725]">
                  <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-2">{years}-Year TCO</p>
                  <p className="text-3xl font-serif font-bold tracking-tight text-white">{formatCurrency(economicTco)}</p>
                  <p className="text-xs text-slate-500 font-medium mt-2">{formatCurrency(economicTco / (annualKm * years))} / km</p>
                </div>

                <div className="space-y-3 text-sm">
                  
                  {/* Editable Fields */}
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 group">
                    <span className="text-slate-400 font-medium text-xs uppercase tracking-widest">Acquisition (₹)</span>
                    <input 
                      type="number" 
                      value={acquisition} 
                      onChange={(e) => updateConfig(index, 'acquisition', Number(e.target.value))}
                      className="w-24 text-right bg-transparent border-b border-transparent group-hover:border-slate-600 focus:border-primary-500 focus:outline-none font-bold text-slate-200 transition-colors"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-medium text-xs uppercase tracking-widest" title="80% Loan @ 8.5%">Finance Interest</span>
                    <span className="font-bold text-slate-200">{formatCurrency(loanResults.totalInterest)}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 group">
                    <span className="text-slate-400 font-medium text-xs uppercase tracking-widest">Energy ₹/km</span>
                    <input 
                      type="number" 
                      step="0.1"
                      value={energyCostPerKm} 
                      onChange={(e) => updateConfig(index, 'energyCostPerKm', Number(e.target.value))}
                      className="w-16 text-right bg-transparent border-b border-transparent group-hover:border-slate-600 focus:border-primary-500 focus:outline-none font-bold text-slate-200 transition-colors"
                    />
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 group">
                    <span className="text-slate-400 font-medium text-xs uppercase tracking-widest">Service/Yr (₹)</span>
                    <input 
                      type="number" 
                      value={annualMaintenance} 
                      onChange={(e) => updateConfig(index, 'annualMaintenance', Number(e.target.value))}
                      className="w-20 text-right bg-transparent border-b border-transparent group-hover:border-slate-600 focus:border-primary-500 focus:outline-none font-bold text-slate-200 transition-colors"
                    />
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 group">
                    <span className="text-slate-400 font-medium text-xs uppercase tracking-widest">Insurance/Yr (₹)</span>
                    <input 
                      type="number" 
                      value={annualInsurance} 
                      onChange={(e) => updateConfig(index, 'annualInsurance', Number(e.target.value))}
                      className="w-20 text-right bg-transparent border-b border-transparent group-hover:border-slate-600 focus:border-primary-500 focus:outline-none font-bold text-slate-200 transition-colors"
                    />
                  </div>

                  <div className="flex justify-between items-center text-primary-400 font-bold pt-1 group">
                    <span className="text-xs uppercase tracking-widest">Resale %</span>
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        value={resalePercentage} 
                        onChange={(e) => updateConfig(index, 'resalePercentage', Number(e.target.value))}
                        className="w-12 text-right bg-transparent border-b border-transparent group-hover:border-primary-800 focus:border-primary-500 focus:outline-none font-bold text-primary-400 transition-colors mr-1"
                      />
                      <span>%</span>
                    </div>
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
