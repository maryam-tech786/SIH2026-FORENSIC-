import React from 'react';
import { Database, CheckCircle2, ShieldAlert, Cpu, Hash, Link2 } from 'lucide-react';

export const IngestProgress = ({ progress = 0, stageText = 'Processing...', currentTask = '' }) => {
  return (
    <div className="bg-forensic-900 border border-forensic-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-forensic-cyan animate-pulse" />
          <h4 className="font-bold text-slate-100 text-sm">{stageText}</h4>
        </div>
        <span className="font-mono text-sm font-bold text-cyan-300">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-forensic-950 rounded-full overflow-hidden border border-forensic-border">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-forensic-cyan transition-all duration-300 rounded-full shadow-glow-cyan"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
        <span>Current Task: <strong className="text-slate-200">{currentTask}</strong></span>
        <span>Bitstream Mode: Read-Only Sector Mapped</span>
      </div>

      {/* Forensic Pipeline Steps */}
      <div className="grid grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
        <div className={`p-2 rounded border text-center ${
          progress >= 25 ? 'bg-forensic-800 border-forensic-cyan text-cyan-300' : 'bg-forensic-950 border-forensic-border text-slate-500'
        }`}>
          1. Header Verified
        </div>
        <div className={`p-2 rounded border text-center ${
          progress >= 50 ? 'bg-forensic-800 border-forensic-cyan text-cyan-300' : 'bg-forensic-950 border-forensic-border text-slate-500'
        }`}>
          2. Channels Demuxed
        </div>
        <div className={`p-2 rounded border text-center ${
          progress >= 75 ? 'bg-forensic-800 border-forensic-cyan text-cyan-300' : 'bg-forensic-950 border-forensic-border text-slate-500'
        }`}>
          3. SHA-256 Hashed
        </div>
        <div className={`p-2 rounded border text-center ${
          progress >= 100 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-forensic-950 border-forensic-border text-slate-500'
        }`}>
          4. Block Minted
        </div>
      </div>
    </div>
  );
};
