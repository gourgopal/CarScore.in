import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function DepreciationCalculator() {
  const [purchasePrice, setPurchasePrice] = useLocalStorage('cs_dep_price', 1500000);
  const [years, setYears] = useLocalStorage('cs_dep_years', 5);
  const [vehicleType, setVehicleType] = useLocalStorage('cs_dep_type', 'SUV'); // SUV, HATCHBACK, SEDAN, EV, LUXURY

  const results = useMemo(() => {
    // Standard Indian market depreciation curves (approximate)
    // First year usually sees biggest drop (15-20%)
    // Subsequent years around 10%

    let baseDepreciationFirstYear = 0.15;
    let baseDepreciationSubsequent = 0.10;

    switch (vehicleType) {
      case 'SUV':
        baseDepreciationFirstYear = 0.12; // SUVs hold value better
        baseDepreciationSubsequent = 0.08;
        break;
      case 'EV':
        baseDepreciationFirstYear = 0.25; // EVs drop faster currently
        baseDepreciationSubsequent = 0.15;
        break;
      case 'LUXURY':
        baseDepreciationFirstYear = 0.30;
        baseDepreciationSubsequent = 0.15;
        break;
      case 'HATCHBACK':
        baseDepreciationFirstYear = 0.15;
        baseDepreciationSubsequent = 0.09;
        break;
    }

    const schedule = [];
    let currentValue = purchasePrice;
    let totalLost = 0;

    for (let year = 1; year <= years; year++) {
      const dropRate = year === 1 ? baseDepreciationFirstYear : baseDepreciationSubsequent;
      const valueLost = currentValue * dropRate;
      currentValue -= valueLost;
      totalLost += valueLost;
      
      schedule.push({
        year,
        valueLost,
        currentValue,
        retentionPercent: (currentValue / purchasePrice) * 100
      });
    }

    const finalValue = currentValue;
    const finalRetention = (finalValue / purchasePrice) * 100;

    return {
      schedule,
      finalValue,
      totalLost,
      finalRetention
    };
  }, [purchasePrice, years, vehicleType]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Purchase Price (₹)" type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} />
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Vehicle Segment</label>
              <select 
                value={vehicleType} 
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-[#0b131e] border border-slate-700 rounded px-3 py-2 text-white font-medium focus:outline-none focus:border-primary-500 transition-colors"
              >
                <option value="HATCHBACK" className="bg-[#0b131e] text-white">Hatchback / Compact</option>
                <option value="SEDAN" className="bg-[#0b131e] text-white">Sedan</option>
                <option value="SUV" className="bg-[#0b131e] text-white">SUV / Crossover</option>
                <option value="EV" className="bg-[#0b131e] text-white">Electric Vehicle (EV)</option>
                <option value="LUXURY" className="bg-[#0b131e] text-white">Luxury Segment</option>
              </select>
            </div>

            <Input label="Ownership Years" type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} max={15} />
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-2 space-y-6">
        <Card className="h-full border-primary-500">
          <CardContent className="p-10 text-center flex flex-col justify-center h-full">
            <h3 className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Estimated Resale Value</h3>
            <p className="mt-4 text-6xl sm:text-7xl font-serif font-extrabold tracking-tight text-white">{formatCurrency(results.finalValue)}</p>
            <p className="text-sm text-slate-400 font-medium mt-4">
              Retains <span className="text-white font-bold">{results.finalRetention.toFixed(1)}%</span> of original value after {years} years.
            </p>
            
            <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Value Lost</h3>
                <p className="mt-2 text-2xl font-bold text-red-400">-{formatCurrency(results.totalLost)}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg. Loss Per Year</h3>
                <p className="mt-2 text-2xl font-bold text-slate-200">{formatCurrency(results.totalLost / years)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Table */}
      <div className="xl:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Depreciation Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-4">End of Year</th>
                    <th className="py-4 px-4">Value Lost</th>
                    <th className="py-4 px-4">Residual Value</th>
                    <th className="py-4 px-4 text-right">Retention %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {results.schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-white">Year {row.year}</td>
                      <td className="py-4 px-4 text-red-400">-{formatCurrency(row.valueLost)}</td>
                      <td className="py-4 px-4 font-bold text-white">{formatCurrency(row.currentValue)}</td>
                      <td className="py-4 px-4 text-right">{row.retentionPercent.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
