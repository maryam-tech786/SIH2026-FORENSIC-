import React, { useState } from 'react';
import { Copy, Check, Hash } from 'lucide-react';

export const HashDisplay = ({ hash, label = 'SHA-256', truncate = true, showLabel = true }) => {
  const [copied, setCopied] = useState(false);

  if (!hash) return <span className="text-slate-500 text-xs font-mono">--</span>;

  const displayHash = truncate && hash.length > 20
    ? `${hash.slice(0, 10)}...${hash.slice(-10)}`
    : hash;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-xs bg-forensic-900 border border-forensic-border px-2 py-0.5 rounded text-slate-300 hover:border-forensic-cyan/50 transition-colors group">
      {showLabel && (
        <span className="text-slate-500 flex items-center gap-0.5 text-[10px] uppercase font-sans font-semibold tracking-wider">
          <Hash className="w-2.5 h-2.5 text-forensic-cyan" />
          {label}:
        </span>
      )}
      <span className="font-mono text-cyan-300/90 select-all" title={hash}>
        {displayHash}
      </span>
      <button
        onClick={handleCopy}
        className="p-1 hover:text-forensic-cyan text-slate-500 rounded transition-colors"
        title="Copy full cryptographic hash"
      >
        {copied ? (
          <Check className="w-3 h-3 text-emerald-400" />
        ) : (
          <Copy className="w-3 h-3 opacity-70 group-hover:opacity-100" />
        )}
      </button>
    </div>
  );
};
