import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { calculateIceFuelCost, calculateCngFuelCost } from '../../domain/energy';

export function FuelCalculator() {
  const [fuelType, setFuelType] = useState<'PETROL' | 'DIESEL' | 'CNG'>('PETROL');
  const [annualKm, setAnnualKm] = useState(15000);
  const [efficiency, setEfficiency] = useState(15);
  const [price, setPrice] = useState(100);

  const results = useMemo(() => {
    if (fuelType === 'CNG') {
      const res = calculateCngFuelCost({
        annualKm,
        efficiencyKmPerKg: efficiency,
        cngPricePerKg: price
      });
      return { totalUnits: res.annualCngKg, totalCost: res.annualCngCost, unit: 'kg' };
    } else {
      const res = calculateIceFuelCost({
        annualKm,
        efficiencyKmPerLitre: efficiency,
        fuelPricePerLitre: price
      });
      return { totalUnits: res.annualLitres, totalCost: res.annualFuelCost, unit: 'L' };
    }
  }, [fuelType, annualKm, efficiency, price]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Usage & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Fuel Type</label>
              <select 
                className="flex h-10 w-full rounded border border-slate-700 bg-[#0f1725] text-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
              >
                <option value="PETROL" className="bg-[#0f1725] text-white">Petrol</option>
                <option value="DIESEL" className="bg-[#0f1725] text-white">Diesel</option>
                <option value="CNG" className="bg-[#0f1725] text-white">CNG</option>
              </select>
            </div>
            <Input 
              label="Annual Distance (km)" 
              type="number" 
              value={annualKm} 
              onChange={(e) => setAnnualKm(Number(e.target.value))} 
            />
            <Input 
              label={`Real-World Efficiency (km/${fuelType === 'CNG' ? 'kg' : 'l'})`} 
              type="number" 
              value={efficiency} 
              onChange={(e) => setEfficiency(Number(e.target.value))}
            />
            <Input 
              label={`Fuel Price (₹/${fuelType === 'CNG' ? 'kg' : 'l'})`} 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(Number(e.target.value))} 
            />
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-2 space-y-6">
        <Card className="h-full flex flex-col justify-center">
          <CardContent className="p-10 text-center space-y-10">
            <div>
              <h3 className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Annual Fuel Cost</h3>
              <p className="mt-4 text-5xl sm:text-7xl font-serif font-extrabold tracking-tight text-white">{formatCurrency(results.totalCost)}</p>
              <p className="text-sm text-slate-400 font-medium mt-3">That is {formatCurrency(results.totalCost / 12)} per month</p>
            </div>
            
            <div className="pt-8 border-t border-slate-800 grid grid-cols-1 justify-center">
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Fuel Consumed</h3>
                <p className="mt-3 text-2xl font-serif font-bold text-white">{Math.round(results.totalUnits).toLocaleString('en-IN')} {results.unit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
