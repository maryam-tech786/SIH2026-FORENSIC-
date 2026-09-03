import React from 'react';
import { Camera, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ChannelSelector = ({ channels = [], activeChannelId = 1, onSelectChannel }) => {
  return (
    <div className="bg-forensic-900 border border-forensic-border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-forensic-cyan" />
          DVR Camera Channels ({channels.length})
        </span>
        <span className="text-[10px] font-mono text-slate-500">Demuxed Streams</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {channels.map((ch) => {
          const isActive = ch.id === activeChannelId;
          const hasAnomaly = ch.status === 'Anomalies Detected';

          return (
            <button
              key={ch.id}
              onClick={() => onSelectChannel(ch.id)}
              className={`text-left p-2 rounded-md border text-xs transition-all ${
                isActive
                  ? 'bg-forensic-800 border-forensic-cyan text-slate-100 shadow-glow-cyan'
                  : 'bg-forensic-950/70 border-forensic-border text-slate-400 hover:bg-forensic-850 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-200 font-mono text-[11px] truncate">
                  CH-{ch.id.toString().padStart(2, '0')}
                </span>
                {hasAnomaly ? (
                  <span className="flex items-center gap-0.5 text-[9px] text-red-400 bg-red-950/70 border border-red-500/40 px-1 py-0.2 rounded font-mono">
                    <ShieldAlert className="w-2.5 h-2.5" />
                    FLAGGED
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-[9px] text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1 py-0.2 rounded font-mono">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    CLEAN
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{ch.name.split(':')[1] || ch.name}</div>
              <div className="text-[9px] font-mono text-slate-500 mt-1">{ch.resolution}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
