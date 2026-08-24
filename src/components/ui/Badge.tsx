import React from 'react';

export function ConfidenceBadge({ score }: { score: number }) {
  let label = 'LOW CONFIDENCE';
  let color = 'bg-slate-800 text-slate-400 border-slate-700';
  
  if (score >= 90) {
    label = 'OEM VERIFIED';
    color = 'bg-primary-500 text-[#0b131e] border-primary-500';
  } else if (score >= 70) {
    label = 'HIGH CONFIDENCE';
    color = 'bg-[#1e293b] text-white border-slate-600';
  } else if (score >= 40) {
    label = 'ESTIMATE';
    color = 'bg-slate-800 text-primary-400 border-primary-900';
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${color}`}>
      {label}
    </span>
  );
}
