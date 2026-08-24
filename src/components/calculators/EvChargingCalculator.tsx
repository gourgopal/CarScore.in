import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { calculateEvChargingCost } from '../../domain/energy';

export function EvChargingCalculator() {
  const [annualKm, setAnnualKm] = useState(15000);
  const [consumptionWhPerKm, setConsumptionWhPerKm] = useState(150);
  
  const [homePercent, setHomePercent] = useState(80);
  const [acPercent, setAcPercent] = useState(10);
  const [dcPercent, setDcPercent] = useState(10);
  
  const [homeTariff, setHomeTariff] = useState(8);
  const [acTariff, setAcTariff] = useState(15);
  const [dcTariff, setDcTariff] = useState(22);

  const results = useMemo(() => {
    try {
      return calculateEvChargingCost({
        annualKm,
        consumptionWhPerKm,
        chargingEfficiency: 0.9,
        homeChargingPercentage: homePercent,
        publicAcPercentage: acPercent,
        publicDcPercentage: dcPercent,
        homeTariff,
        publicAcTariff: acTariff,
        publicDcTariff: dcTariff
      });
    } catch (e) {
      return null;
    }
  }, [annualKm, consumptionWhPerKm, homePercent, acPercent, dcPercent, homeTariff, acTariff, dcTariff]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const isValidRatio = (homePercent + acPercent + dcPercent) === 100;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>EV Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input 
              label="Annual Distance (km)" 
              type="number" 
              value={annualKm} 
              onChange={(e) => setAnnualKm(Number(e.target.value))} 
            />
            <Input 
              label="Real-world Consumption (Wh/km)" 
              type="number" 
              value={consumptionWhPerKm} 
              onChange={(e) => setConsumptionWhPerKm(Number(e.target.value))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Charging Mix & Tariffs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {!isValidRatio && (
              <p className="text-xs text-red-700 font-bold bg-red-50 p-3 rounded-lg border border-red-200">
                Percentages must sum exactly to 100%. Current sum: {homePercent + acPercent + dcPercent}%
              </p>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Home (%)" type="number" 
                value={homePercent} onChange={(e) => setHomePercent(Number(e.target.value))} 
              />
              <Input 
                label="Tariff (₹/kWh)" type="number" 
                value={homeTariff} onChange={(e) => setHomeTariff(Number(e.target.value))} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Public AC (%)" type="number" 
                value={acPercent} onChange={(e) => setAcPercent(Number(e.target.value))} 
              />
              <Input 
                label="Tariff (₹/kWh)" type="number" 
                value={acTariff} onChange={(e) => setAcTariff(Number(e.target.value))} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Fast DC (%)" type="number" 
                value={dcPercent} onChange={(e) => setDcPercent(Number(e.target.value))} 
              />
              <Input 
                label="Tariff (₹/kWh)" type="number" 
                value={dcTariff} onChange={(e) => setDcTariff(Number(e.target.value))} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-2 space-y-6">
        {results ? (
          <Card className="bg-slate-900 border-slate-800 text-white h-full flex flex-col justify-center">
            <CardContent className="p-10 text-center space-y-10">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Annual Charging Cost</h3>
                <p className="mt-4 text-5xl sm:text-6xl font-extrabold tracking-tight">{formatCurrency(results.annualChargingCost)}</p>
                <p className="text-sm text-slate-400 font-medium mt-3">That is {formatCurrency(results.annualChargingCost / 12)} per month</p>
              </div>
              
              <div className="pt-8 border-t border-slate-800/50 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Battery Energy</h3>
                  <p className="mt-2 text-2xl font-bold text-white">{Math.round(results.vehicleEnergyKwh).toLocaleString('en-IN')} kWh</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Grid Energy (10% Loss)</h3>
                  <p className="mt-2 text-2xl font-bold text-slate-300">{Math.round(results.gridEnergyKwh).toLocaleString('en-IN')} kWh</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center bg-slate-50 border-dashed border-2 border-slate-300">
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">Please fix the charging mix percentages</p>
          </Card>
        )}
      </div>
    </div>
  );
}
