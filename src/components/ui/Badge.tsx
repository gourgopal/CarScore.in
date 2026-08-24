import React from 'react';

export function ConfidenceBadge({ score }: { score: number }) {
  let label = 'LOW CONFIDENCE';
  let color = 'bg-slate-800 text-slate-400 border-slate-700';
  
  if (score >= 90) {
    label = 'OEM VERIFIED';
    color = 'bg-primary-900/50 text-primary-400 border-primary-800';
  } else if (score >= 70) {
    label = 'HIGH CONFIDENCE';
    color = 'bg-emerald-900/50 text-emerald-400 border-emerald-800';
  } else if (score >= 40) {
    label = 'ESTIMATE';
    color = 'bg-amber-900/50 text-amber-400 border-amber-800';
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${color}`}>
      {label}
    </span>
  );
}
