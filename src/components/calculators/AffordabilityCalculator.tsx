import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function AffordabilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useLocalStorage('cs_afford_income', 100000);
  const [existingEmis, setExistingEmis] = useLocalStorage('cs_afford_existing', 15000);
  const [emiPercentage, setEmiPercentage] = useLocalStorage('cs_afford_percent', 15);
  
  const [interestRate, setInterestRate] = useLocalStorage('cs_afford_rate', 8.5);
  const [tenureYears, setTenureYears] = useLocalStorage('cs_afford_years', 5);
  const [downPayment, setDownPayment] = useLocalStorage('cs_afford_dp', 200000);

  const results = useMemo(() => {
    // How much of income can go to cars?
    const maxCarEmi = (monthlyIncome * (emiPercentage / 100));
    
    // Total EMIs including new car shouldn't generally exceed 50% of income (Rule of thumb)
    const totalEmiLoad = existingEmis + maxCarEmi;
    const isOverLeveraged = totalEmiLoad > (monthlyIncome * 0.5);

    // Calculate reverse EMI to find Max Loan Amount
    // EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
    // P = EMI * [(1+R)^N-1] / [R x (1+R)^N]
    
    const monthlyRate = (interestRate / 12) / 100;
    const months = tenureYears * 12;
    
    let maxLoan = 0;
    if (monthlyRate > 0 && months > 0) {
      maxLoan = maxCarEmi * (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months));
    } else if (months > 0) {
      maxLoan = maxCarEmi * months;
    }

    const recommendedOnRoadPrice = maxLoan + downPayment;

    return {
      maxCarEmi,
      maxLoan,
      recommendedOnRoadPrice,
      isOverLeveraged
    };
  }, [monthlyIncome, existingEmis, emiPercentage, interestRate, tenureYears, downPayment]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle>Income & Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Monthly Take-Home Pay (₹)" type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} />
            <Input label="Existing Monthly EMIs (₹)" type="number" value={existingEmis} onChange={(e) => setExistingEmis(Number(e.target.value))} />
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest flex justify-between">
                <span>Budget allocated to car</span>
                <span>{emiPercentage}%</span>
              </label>
              <input 
                type="range" min="5" max="30" step="1"
                className="w-full accent-primary-500" 
                value={emiPercentage}
                onChange={(e) => setEmiPercentage(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Assumptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Interest (%)" type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
              <Input label="Tenure (Yrs)" type="number" value={tenureYears} onChange={(e) => setTenureYears(Number(e.target.value))} />
            </div>
            <Input label="Available Cash Down (₹)" type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
          </CardContent>
        </Card>

      </div>

      <div className="xl:col-span-2 space-y-6">
        <Card className="h-full flex flex-col justify-center border-primary-500">
          <CardContent className="p-10 text-center space-y-10">
            
            <div>
              <h3 className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Recommended On-Road Price</h3>
              <p className="mt-4 text-6xl sm:text-7xl font-serif font-extrabold tracking-tight text-white">{formatCurrency(results.recommendedOnRoadPrice)}</p>
              <p className="text-sm text-slate-400 font-medium mt-4">
                Based on a loan of {formatCurrency(results.maxLoan)} and your {formatCurrency(downPayment)} down payment.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Safe EMI Budget</h3>
                <p className="mt-2 text-3xl font-bold text-slate-200">{formatCurrency(results.maxCarEmi)} / mo</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Debt-to-Income Status</h3>
                {results.isOverLeveraged ? (
                  <p className="mt-2 text-sm font-bold text-red-400 bg-red-900/30 border border-red-800 inline-block px-3 py-1 rounded">High Risk (&gt;50%)</p>
                ) : (
                  <p className="mt-2 text-sm font-bold text-emerald-400 bg-emerald-900/30 border border-emerald-800 inline-block px-3 py-1 rounded">Safe &lt;50% DTI</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
