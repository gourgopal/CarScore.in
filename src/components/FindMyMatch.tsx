import React, { useState, useEffect } from 'react';

type Step = 'BUDGET' | 'BODY_TYPE' | 'POWERTRAIN' | 'RESULTS';

export function FindMyMatch() {
  const [step, setStep] = useState<Step>('BUDGET');
  const [budget, setBudget] = useState<number | null>(null);
  const [bodyType, setBodyType] = useState<string | null>(null);
  const [powertrain, setPowertrain] = useState<string | null>(null);
  const [variants, setVariants] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/variants.json')
      .then(res => res.json())
      .then(data => setVariants(data))
      .catch(console.error);
  }, []);

  const handleNext = (nextStep: Step) => setStep(nextStep);

  const getResults = () => {
    return variants.filter(v => {
      // Very basic filtering since we lack precise pricing and body type in schema right now.
      // We will match powertrain exactly if selected.
      if (powertrain && powertrain !== 'ANY' && v.powertrain !== powertrain) return false;
      return true;
    });
  };

  if (step === 'BUDGET') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-2">What is your estimated budget?</h2>
          <p className="text-slate-400">Select an on-road price range to narrow down your options.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{ label: 'Under ₹10 Lakh', value: 1000000 }, { label: '₹10L - ₹20 Lakh', value: 2000000 }, { label: '₹20L - ₹30 Lakh', value: 3000000 }, { label: 'Above ₹30 Lakh', value: 99999999 }].map(opt => (
            <button 
              key={opt.value}
              onClick={() => { setBudget(opt.value); handleNext('BODY_TYPE'); }}
              className="p-6 bg-[#111a2a] border border-slate-700 hover:border-primary-500 rounded-lg text-white font-bold text-lg transition-colors hover:bg-slate-800"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'BODY_TYPE') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Preferred Body Type?</h2>
          <p className="text-slate-400">What kind of car fits your lifestyle?</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['Hatchback', 'Sedan', 'SUV', 'MUV', 'Any'].map(opt => (
            <button 
              key={opt}
              onClick={() => { setBodyType(opt); handleNext('POWERTRAIN'); }}
              className="p-6 bg-[#111a2a] border border-slate-700 hover:border-primary-500 rounded-lg text-white font-bold text-lg transition-colors hover:bg-slate-800"
            >
              {opt}
            </button>
          ))}
        </div>
        <button onClick={() => setStep('BUDGET')} className="text-slate-500 hover:text-white text-sm font-bold uppercase tracking-widest">&larr; Back</button>
      </div>
    );
  }

  if (step === 'POWERTRAIN') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Preferred Powertrain?</h2>
          <p className="text-slate-400">Choose your fuel type or go electric.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Petrol', value: 'PETROL' },
            { label: 'Diesel', value: 'DIESEL' },
            { label: 'Electric (EV)', value: 'ELECTRIC' },
            { label: 'CNG', value: 'CNG' },
            { label: 'Strong Hybrid', value: 'STRONG_HYBRID' },
            { label: 'Any', value: 'ANY' }
          ].map(opt => (
            <button 
              key={opt.value}
              onClick={() => { setPowertrain(opt.value); handleNext('RESULTS'); }}
              className="p-6 bg-[#111a2a] border border-slate-700 hover:border-primary-500 rounded-lg text-white font-bold text-lg transition-colors hover:bg-slate-800"
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button onClick={() => setStep('BODY_TYPE')} className="text-slate-500 hover:text-white text-sm font-bold uppercase tracking-widest">&larr; Back</button>
      </div>
    );
  }

  if (step === 'RESULTS') {
    const results = getResults();
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-white mb-4">Your Matches</h2>
          <p className="text-slate-400">Based on your selections, here are the best fits for you.</p>
          <div className="flex justify-center gap-2 mt-6">
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs font-bold uppercase tracking-widest border border-slate-700">Budget: {budget === 1000000 ? '< 10L' : budget === 2000000 ? '10-20L' : budget === 3000000 ? '20-30L' : '> 30L'}</span>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs font-bold uppercase tracking-widest border border-slate-700">{bodyType}</span>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs font-bold uppercase tracking-widest border border-slate-700">{powertrain}</span>
          </div>
          <button onClick={() => setStep('BUDGET')} className="mt-8 text-primary-500 hover:text-primary-400 text-xs font-bold uppercase tracking-widest underline">Start Over</button>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((variant) => (
              <a key={variant.id} href={`/cars/${variant.id}`} className="group bg-[#111a2a] rounded-lg border border-slate-700 hover:border-primary-500 transition-colors flex flex-col justify-between overflow-hidden">
                
                {variant.imageUrl && (
                  <div className="h-48 w-full bg-slate-900 border-b border-slate-800">
                    <img 
                      src={variant.imageUrl} 
                      alt={`${variant.brand} ${variant.name}`} 
                      onError={(e) => { e.currentTarget.src = '/images/placeholder-car.jpg'; }}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                )}

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{variant.brand}</p>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">{variant.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border text-slate-400 bg-slate-800 border-slate-700">
                        {variant.powertrain.replace('_', ' ')}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border text-slate-400 bg-slate-800 border-slate-700">
                        {variant.transmission.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>View Details</span>
                    <span className="group-hover:text-primary-400 transition-colors">&rarr;</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#111a2a] border border-slate-700 rounded-lg">
            <p className="text-slate-400 mb-4">No exact matches found for these specific criteria.</p>
            <button onClick={() => setStep('BUDGET')} className="text-primary-500 hover:text-primary-400 font-bold">Try different filters</button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
