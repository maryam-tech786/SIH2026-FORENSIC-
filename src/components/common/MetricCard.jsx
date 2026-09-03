import React from 'react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, alertLevel = 'normal' }) => {
  let borderClass = 'border-forensic-border hover:border-forensic-border-light';
  let iconColor = 'text-forensic-cyan bg-forensic-cyan/10 border-forensic-cyan/30';
  let valueColor = 'text-slate-100';

  if (alertLevel === 'critical') {
    borderClass = 'border-red-500/40 bg-red-950/10 hover:border-red-500/60 shadow-glow-crimson';
    iconColor = 'text-red-400 bg-red-500/15 border-red-500/40';
    valueColor = 'text-red-300';
  } else if (alertLevel === 'warning') {
    borderClass = 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50';
    iconColor = 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    valueColor = 'text-amber-300';
  } else if (alertLevel === 'success') {
    borderClass = 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50 shadow-glow-emerald';
    iconColor = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    valueColor = 'text-emerald-300';
  }

  return (
    <div className={`p-4 rounded-lg bg-forensic-900/90 border transition-all duration-200 ${borderClass}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tracking-tight ${valueColor}`}>{value}</span>
            {trend && (
              <span className={`text-xs font-mono font-medium ${trend.positive ? 'text-emerald-400' : 'text-amber-400'}`}>
                {trend.value}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-md border ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 border-t border-forensic-border/60 pt-2 flex items-center justify-between">
          <span>{subtitle}</span>
        </p>
      )}
    </div>
  );
};
