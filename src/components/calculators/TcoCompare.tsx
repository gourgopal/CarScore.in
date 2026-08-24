import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfidenceBadge } from '../ui/Badge';
import { Input } from '../ui/Input';
import type { Variant } from '../../data/schemas';
import { calculateEMI } from '../../domain/calculations';

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
    // Real implementation would pull this from DB. For now, mock based on powertrain if undefined
    acquisition: isEv ? 1500000 : 1300000,
    energyCostPerKm: isEv ? 1.2 : 6.5,
    annualMaintenance: isEv ? 5000 : 8000,
    annualInsurance: isEv ? 25000 : 20000,
    resalePercentage: isEv ? 45 : 55,
  };
};

export function TcoCompare() {
  const [configs, setConfigs] = useState<VariantConfig[]>([]);
  const [allVariants, setAllVariants] = useState<Variant[]>([]);
  const [selectedToAdd, setSelectedToAdd] = useState<string>('');
  
  // Global assumptions
  const [annualKm, setAnnualKm] = useState(15000);
  const [years, setYears] = useState(5);
  
  // Finance assumptions
  const [isFinanced, setIsFinanced] = useState(true);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.6);

  useEffect(() => {
    // Fetch the generated variants from the static folder
    fetch('/data/variants.json')
      .then(res => res.json())
      .then((data: Variant[]) => {
        setAllVariants(data);
        if (data.length > 0) {
          // Initialize with first two variants if possible
          setConfigs([
            createDefaultConfig(data[0]),
            ...(data.length > 1 ? [createDefaultConfig(data[1])] : [])
          ]);
          setSelectedToAdd(data[0].id);
        }
      })
      .catch(err => console.error("Failed to load variants:", err));
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const handleAddCar = () => {
    if (configs.length < 4) {
      const variantToAdd = allVariants.find(v => v.id === selectedToAdd);
      if (variantToAdd) {
        setConfigs([...configs, createDefaultConfig(variantToAdd)]);
      }
    }
  };

  const removeCar = (indexToRemove: number) => {
    setConfigs(configs.filter((_, i) => i !== indexToRemove));
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
      <div className="bg-[#111a2a] p-6 rounded-lg border border-slate-700 shadow-sm flex flex-col gap-6">
        
        <div className="flex flex-wrap gap-6 items-end justify-between border-b border-slate-800 pb-6">
          <div className="flex flex-wrap gap-6 items-end">
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
            
            {/* Finance Toggle */}
            <div className="flex items-center h-10 px-3 bg-[#0f1725] border border-slate-700 rounded gap-3">
              <input 
                type="checkbox" 
                id="isFinanced" 
                checked={isFinanced}
                onChange={(e) => setIsFinanced(e.target.checked)}
                className="w-4 h-4 text-primary-500 bg-slate-800 border-slate-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="isFinanced" className="text-xs font-bold text-slate-300 uppercase tracking-widest cursor-pointer">
                Vehicle Financed
              </label>
            </div>
            
            {isFinanced && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Down Payment (%)</label>
                  <input 
                    type="number" 
                    className="w-24 rounded border border-slate-700 bg-[#0f1725] text-white px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary-500 focus:outline-none" 
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Interest Rate (%)</label>
                  <input 
                    type="number" step="0.1"
                    className="w-24 rounded border border-slate-700 bg-[#0f1725] text-white px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary-500 focus:outline-none" 
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Add Car Section */}
        <div className="flex gap-4 items-end">
          <div className="flex-grow max-w-md">
            <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Select Car to Compare</label>
            <select 
              className="w-full rounded border border-slate-700 bg-[#0f1725] text-white px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary-500 focus:outline-none"
              value={selectedToAdd}
              onChange={(e) => setSelectedToAdd(e.target.value)}
            >
              {allVariants.map(v => (
                <option key={v.id} value={v.id} className="bg-[#0f1725] text-white">
                  {v.brand} {v.name} ({v.powertrain})
                </option>
              ))}
            </select>
          </div>
          <Button 
            variant="outline" 
            className="border-dashed" 
            onClick={handleAddCar}
            disabled={configs.length >= 4 || allVariants.length === 0}
          >
            {configs.length >= 4 ? 'Max 4 Cars' : '+ Add Car'}
          </Button>
        </div>

      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {configs.map((config, index) => {
          const { variant, acquisition, energyCostPerKm, annualMaintenance, annualInsurance, resalePercentage } = config;
          
          let financeInterest = 0;
          if (isFinanced) {
            const loanTenure = Math.min(years * 12, 84); 
            const downPayment = acquisition * (downPaymentPercent / 100);
            const loanResults = calculateEMI({
              onRoadPrice: acquisition,
              downPayment: downPayment,
              annualInterestRate: interestRate,
              tenureInMonths: loanTenure,
              processingFee: 0 // Simplification for TCO comparison
            });
            financeInterest = loanResults.totalInterest;
          }

          const totalEnergy = annualKm * energyCostPerKm * years;
          const totalService = annualMaintenance * years;
          const insurance = annualInsurance * years;
          const resale = acquisition * (resalePercentage / 100);
          
          const economicTco = acquisition + financeInterest + totalEnergy + totalService + insurance - resale;

          return (
            <Card key={`${variant.id}-${index}`} className="relative hover:border-primary-500 transition-colors">
              <div className="absolute -top-3 left-4 z-10">
                <ConfidenceBadge score={variant.statusProvenance.confidence} />
              </div>
              
              <button 
                onClick={() => removeCar(index)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"
                title="Remove Car"
              >
                ✕
              </button>

              <CardContent className="pt-8 space-y-6">
                <div className="pr-6">
                  <h3 className="font-serif font-bold text-xl leading-tight text-white mb-2">{variant.name}</h3>
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
                  
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 group">
                    <span className="text-slate-400 font-medium text-[10px] uppercase tracking-widest">Acquisition (₹)</span>
                    <input 
                      type="number" 
                      value={acquisition} 
                      onChange={(e) => updateConfig(index, 'acquisition', Number(e.target.value))}
                      className="w-24 text-right bg-transparent border-b border-transparent group-hover:border-slate-600 focus:border-primary-500 focus:outline-none font-bold text-slate-200 transition-colors"
                    />
                  </div>
                  
                  {isFinanced && (
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-400 font-medium text-[10px] uppercase tracking-widest" title={`${100-downPaymentPercent}% Loan @ ${interestRate}%`}>Finance Interest</span>
                      <span className="font-bold text-slate-200">{formatCurrency(financeInterest)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 group">
                    <span className="text-slate-400 font-medium text-[10px] uppercase tracking-widest">Energy ₹/km</span>
                    <input 
                      type="number" 
                      step="0.1"
                      value={energyCostPerKm} 
                      onChange={(e) => updateConfig(index, 'energyCostPerKm', Number(e.target.value))}
                      className="w-16 text-right bg-transparent border-b border-transparent group-hover:border-slate-600 focus:border-primary-500 focus:outline-none font-bold text-slate-200 transition-colors"
                    />
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 group">
                    <span className="text-slate-400 font-medium text-[10px] uppercase tracking-widest">Service/Yr (₹)</span>
                    <input 
                      type="number" 
                      value={annualMaintenance} 
                      onChange={(e) => updateConfig(index, 'annualMaintenance', Number(e.target.value))}
                      className="w-20 text-right bg-transparent border-b border-transparent group-hover:border-slate-600 focus:border-primary-500 focus:outline-none font-bold text-slate-200 transition-colors"
                    />
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 group">
                    <span className="text-slate-400 font-medium text-[10px] uppercase tracking-widest">Insurance/Yr (₹)</span>
                    <input 
                      type="number" 
                      value={annualInsurance} 
                      onChange={(e) => updateConfig(index, 'annualInsurance', Number(e.target.value))}
                      className="w-20 text-right bg-transparent border-b border-transparent group-hover:border-slate-600 focus:border-primary-500 focus:outline-none font-bold text-slate-200 transition-colors"
                    />
                  </div>

                  <div className="flex justify-between items-center text-primary-400 font-bold pt-1 group">
                    <span className="text-[10px] uppercase tracking-widest">Resale %</span>
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
