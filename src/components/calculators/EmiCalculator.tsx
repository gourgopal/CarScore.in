import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inputs */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <Input 
              label="Interest Rate (%)" 
              type="number" 
              step="0.1"
              value={interestRate} 
              onChange={(e) => setInterestRate(Number(e.target.value))} 
              min={0}
            />
            <Input 
              label="Tenure (Months)" 
              type="number" 
              value={tenureMonths} 
              onChange={(e) => setTenureMonths(Number(e.target.value))} 
              min={1}
            />
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
      <div className="lg:col-span-2 space-y-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-8 text-center">
            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Estimated Monthly EMI</h3>
            <p className="mt-2 text-5xl font-extrabold text-blue-900">{formatCurrency(results.emi)}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-500 font-medium">Principal Amount</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(results.principal)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-500 font-medium">Total Interest</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(results.totalInterest)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-500 font-medium">Total Payment</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(results.totalRepayments + results.fees)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
