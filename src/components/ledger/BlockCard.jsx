import React, { useState } from 'react';
import {
  Link2,
  ShieldCheck,
  ShieldAlert,
  Clock,
  User,
  Hash,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  FileCheck,
  AlertOctagon
} from 'lucide-react';
import { HashDisplay } from '../common/HashDisplay';

export const BlockCard = ({
  block,
  isBrokenWithNext = false,
  isBrokenWithPrev = false,
  onTamperToggle,
}) => {
  const [expanded, setExpanded] = useState(false);

  const isGenesis = block.index === 0;
  const isTampered = block.isTampered;
  const hasError = isTampered || isBrokenWithPrev;

  let actionBadgeColor = 'bg-blue-950/70 text-blue-300 border-blue-500/30';
  if (block.action.includes('GENESIS')) {
    actionBadgeColor = 'bg-purple-950/70 text-purple-300 border-purple-500/40';
  } else if (block.action.includes('INGESTION')) {
    actionBadgeColor = 'bg-cyan-950/70 text-forensic-cyan border-forensic-cyan/40';
  } else if (block.action.includes('SCAN') || block.action.includes('TAMPER')) {
    actionBadgeColor = 'bg-amber-950/70 text-amber-300 border-amber-500/40';
  } else if (block.action.includes('REPORT') || block.action.includes('CERT')) {
    actionBadgeColor = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
  }

  return (
    <div className={`relative rounded-xl border transition-all ${
      hasError
        ? 'bg-red-950/20 border-red-500/60 shadow-glow-crimson'
        : 'bg-forensic-900 border-forensic-border hover:border-forensic-border-light'
    }`}>
      {/* Top Block Header */}
      <div className="p-4 border-b border-forensic-border flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Block Number Pill */}
          <div className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs border ${
            hasError
              ? 'bg-red-900/60 text-red-200 border-red-500/50'
              : 'bg-forensic-850 text-cyan-300 border-forensic-cyan/30'
          }`}>
            BLOCK #{block.index.toString().padStart(3, '0')}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${actionBadgeColor}`}>
                {block.action.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-bold text-slate-100">{block.actionLabel}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-xs mt-1">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" />
                <strong className="text-slate-300">{block.actor}</strong>
                <span className="text-slate-500 font-mono text-[11px]">({block.actorRole})</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" />
                {new Date(block.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Status Badges & Demo Tamper button */}
        <div className="flex items-center gap-2">
          {hasError ? (
            <div className="flex items-center gap-1 text-xs text-red-400 bg-red-950/80 border border-red-500/60 px-2.5 py-1 rounded-md font-mono font-bold">
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span>CRYPTOGRAPHIC LINK CORRUPTED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-md font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>VERIFIED IMMUTABLE</span>
            </div>
          )}

          {/* Demonstration Tamper Button */}
          {onTamperToggle && !isGenesis && (
            <button
              onClick={() => onTamperToggle(block.index)}
              className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
                isTampered
                  ? 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border-emerald-500/50'
                  : 'bg-red-950/50 hover:bg-red-900/70 text-red-300 border-red-500/40'
              }`}
              title="Deliberately tamper this block's hash to test fraud detection"
            >
              {isTampered ? 'Restore Valid Hash' : 'Simulate Tamper'}
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-forensic-800"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Cryptographic Link Hashes (The Core Blockchain Proof) */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-forensic-950/70 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            Previous Block Hash (Parent):
          </span>
          <HashDisplay
            hash={block.previousHash}
            label="PREV"
            truncate={true}
          />
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            Current Block Hash (Merkle Leaf):
          </span>
          <HashDisplay
            hash={block.currentHash}
            label="BLOCK"
            truncate={true}
          />
        </div>
      </div>

      {/* Expandable Evidentiary Payload Details */}
      {expanded && (
        <div className="p-4 border-t border-forensic-border bg-forensic-850/60 text-xs space-y-2">
          <div className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] font-mono flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-forensic-cyan" />
            Evidentiary Payload Attributes
          </div>

          <div className="grid grid-cols-2 gap-2 bg-forensic-950 p-3 rounded border border-forensic-border font-mono text-[11px]">
            {block.evidenceName && (
              <div>
                <span className="text-slate-400">Target Evidence:</span>{' '}
                <span className="text-slate-200">{block.evidenceName}</span>
              </div>
            )}
            {Object.entries(block.payload || {}).map(([key, val]) => (
              <div key={key} className="truncate">
                <span className="text-slate-400">{key}:</span>{' '}
                <span className="text-cyan-300/90">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
