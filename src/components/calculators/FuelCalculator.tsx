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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Fuel Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
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
              label={`Efficiency (km/${fuelType === 'CNG' ? 'kg' : 'l'})`} 
              type="number" 
              value={efficiency} 
              onChange={(e) => setEfficiency(Number(e.target.value))}
            />
            <Input 
              label={`Price (₹/${fuelType === 'CNG' ? 'kg' : 'l'})`} 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(Number(e.target.value))} 
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <Card className="bg-blue-50 border-blue-100 h-full flex flex-col justify-center">
          <CardContent className="p-8 text-center space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Annual Fuel Cost</h3>
              <p className="mt-2 text-5xl font-extrabold text-blue-900">{formatCurrency(results.totalCost)}</p>
              <p className="text-sm text-blue-700 mt-2">({formatCurrency(results.totalCost / 12)} per month)</p>
            </div>
            
            <div className="pt-6 border-t border-blue-200">
              <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Fuel Consumed</h3>
              <p className="mt-2 text-2xl font-bold text-blue-900">{Math.round(results.totalUnits).toLocaleString('en-IN')} {results.unit}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
