import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { calculateEMI } from '../../domain/calculations';

export function EmiCalculator() {
  const [onRoadPrice, setOnRoadPrice] = useState<number>(1000000);
  const [downPayment, setDownPayment] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureMonths, setTenureMonths] = useState<number>(60);
  const [processingFee, setProcessingFee] = useState<number>(5000);

  const results = useMemo(() => {
    return calculateEMI({
      onRoadPrice,
      downPayment,
      annualInterestRate: interestRate,
      tenureInMonths: tenureMonths,
      processingFee
    });
  }, [onRoadPrice, downPayment, interestRate, tenureMonths, processingFee]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Inputs */}
      <div className="xl:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loan Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input 
              label="On-Road Price (₹)" 
              type="number" 
              value={onRoadPrice} 
              onChange={(e) => setOnRoadPrice(Number(e.target.value))} 
              min={0}
            />
            <Input 
              label="Down Payment (₹)" 
              type="number" 
              value={downPayment} 
              onChange={(e) => setDownPayment(Number(e.target.value))}
              min={0}
              max={onRoadPrice}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Interest (%)" 
                type="number" 
                step="0.1"
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))} 
                min={0}
              />
              <Input 
                label="Months" 
                type="number" 
                value={tenureMonths} 
                onChange={(e) => setTenureMonths(Number(e.target.value))} 
                min={1}
              />
            </div>
            <Input 
              label="Processing Fee (₹)" 
              type="number" 
              value={processingFee} 
              onChange={(e) => setProcessingFee(Number(e.target.value))} 
              min={0}
            />
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="xl:col-span-2 space-y-6">
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center h-full">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly EMI</h3>
            <p className="mt-4 text-5xl sm:text-6xl font-extrabold tracking-tight text-white">{formatCurrency(results.emi)}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Principal</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(results.principal)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Interest</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(results.totalInterest)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-blue-200 shadow-sm ring-1 ring-blue-50">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Outflow</p>
              <p className="mt-2 text-2xl font-bold text-blue-900">{formatCurrency(results.totalRepayments + results.fees)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
