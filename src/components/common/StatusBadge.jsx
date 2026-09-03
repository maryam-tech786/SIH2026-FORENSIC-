import React from 'react';
import { ShieldCheck, AlertTriangle, Clock, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';

export const StatusBadge = ({ status, size = 'sm', showIcon = true }) => {
  const norm = (status || '').toLowerCase();

  let styles = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let Icon = FileText;
  let label = status;

  if (norm.includes('clean') || norm.includes('verified') || norm.includes('closed')) {
    styles = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30 shadow-glow-emerald';
    Icon = ShieldCheck;
  } else if (norm.includes('tamper') || norm.includes('anomal') || norm.includes('flag') || norm.includes('broken')) {
    styles = 'bg-red-950/70 text-red-300 border-red-500/40 shadow-glow-crimson';
    Icon = ShieldAlert;
  } else if (norm.includes('progress') || norm.includes('parsing') || norm.includes('review') || norm.includes('open')) {
    styles = 'bg-amber-950/60 text-amber-300 border-amber-500/30';
    Icon = Clock;
  } else if (norm.includes('high') || norm.includes('critical')) {
    styles = 'bg-red-900/60 text-red-200 border-red-500/40';
    Icon = AlertTriangle;
  } else if (norm.includes('medium')) {
    styles = 'bg-amber-900/60 text-amber-200 border-amber-500/30';
    Icon = AlertTriangle;
  } else if (norm.includes('low')) {
    styles = 'bg-blue-950/60 text-blue-300 border-blue-500/30';
    Icon = CheckCircle2;
  }

  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.5'
    : size === 'lg'
    ? 'text-sm px-3 py-1 font-semibold'
    : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-medium uppercase tracking-wider ${sizeClasses} ${styles}`}>
      {showIcon && <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
};
