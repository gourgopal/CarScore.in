import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';

export function BreakevenCalculator() {
  const [icePrice, setIcePrice] = useState(1300000);
  const [iceEfficiency, setIceEfficiency] = useState(15);
  const [fuelPrice, setFuelPrice] = useState(100);

  const [evPrice, setEvPrice] = useState(1500000);
  const [evEfficiency, setEvEfficiency] = useState(150); // Wh/km
  const [electricityTariff, setElectricityTariff] = useState(8);

  const [monthlyKm, setMonthlyKm] = useState(1200);

  const results = useMemo(() => {
    const priceDifference = evPrice - icePrice;
    
    // Cost per km
    const iceCostPerKm = fuelPrice / iceEfficiency;
    const evCostPerKm = (evEfficiency / 1000) * electricityTariff;
    
    const savingsPerKm = iceCostPerKm - evCostPerKm;
    const monthlySavings = savingsPerKm * monthlyKm;
    
    if (savingsPerKm <= 0 || priceDifference <= 0) {
      return null;
    }
    
    const monthsToBreakeven = priceDifference / monthlySavings;
    const kmToBreakeven = priceDifference / savingsPerKm;
    
    return {
      priceDifference,
      iceCostPerKm,
      evCostPerKm,
      monthlySavings,
      monthsToBreakeven,
      kmToBreakeven,
      yearsToBreakeven: monthsToBreakeven / 12
    };
  }, [icePrice, iceEfficiency, fuelPrice, evPrice, evEfficiency, electricityTariff, monthlyKm]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-400">Petrol / Diesel Car</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="On-Road Price (₹)" type="number" value={icePrice} onChange={(e) => setIcePrice(Number(e.target.value))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Efficiency (km/l)" type="number" value={iceEfficiency} onChange={(e) => setIceEfficiency(Number(e.target.value))} />
              <Input label="Fuel Price (₹/l)" type="number" value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-400">Electric Car (EV)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="On-Road Price (₹)" type="number" value={evPrice} onChange={(e) => setEvPrice(Number(e.target.value))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Consumption (Wh/km)" type="number" value={evEfficiency} onChange={(e) => setEvEfficiency(Number(e.target.value))} />
              <Input label="Tariff (₹/kWh)" type="number" value={electricityTariff} onChange={(e) => setElectricityTariff(Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Input label="Monthly Distance (km)" type="number" value={monthlyKm} onChange={(e) => setMonthlyKm(Number(e.target.value))} />
          </CardContent>
        </Card>

      </div>

      <div className="xl:col-span-2 space-y-6">
        {results ? (
          <Card className="h-full flex flex-col justify-center">
            <CardContent className="p-10 text-center space-y-10">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">EV Price Premium</h3>
                  <p className="mt-2 text-2xl font-bold text-slate-300">{formatCurrency(results.priceDifference)}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Monthly Fuel Savings</h3>
                  <p className="mt-2 text-2xl font-bold text-emerald-400">{formatCurrency(results.monthlySavings)}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Breakeven Distance</h3>
                  <p className="mt-2 text-2xl font-bold text-slate-300">{Math.round(results.kmToBreakeven).toLocaleString('en-IN')} km</p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800">
                <h3 className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Time to Breakeven</h3>
                <p className="mt-4 text-6xl sm:text-7xl font-serif font-extrabold tracking-tight text-white">
                  {results.yearsToBreakeven.toFixed(1)} <span className="text-3xl text-slate-500">Years</span>
                </p>
                <p className="text-sm text-slate-400 font-medium mt-4">
                  After {Math.round(results.monthsToBreakeven)} months, the EV starts saving you money overall.
                </p>
              </div>

            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex flex-col items-center justify-center p-10 text-center">
            <h3 className="text-xl font-bold text-white mb-2">No Breakeven Required</h3>
            <p className="text-slate-400 text-sm">
              Either the EV is cheaper upfront, or your settings result in the EV being more expensive to run per km.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
