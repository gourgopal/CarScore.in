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
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Fuel Type</label>
              <select 
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="CNG">CNG</option>
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
        <Card className="bg-slate-900 border-slate-800 text-white h-full flex flex-col justify-center">
          <CardContent className="p-10 text-center space-y-10">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Annual Fuel Cost</h3>
              <p className="mt-4 text-5xl sm:text-6xl font-extrabold tracking-tight">{formatCurrency(results.totalCost)}</p>
              <p className="text-sm text-slate-400 font-medium mt-3">That is {formatCurrency(results.totalCost / 12)} per month</p>
            </div>
            
            <div className="pt-8 border-t border-slate-800/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Fuel Consumed</h3>
              <p className="mt-3 text-2xl font-bold text-white">{Math.round(results.totalUnits).toLocaleString('en-IN')} {results.unit}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
