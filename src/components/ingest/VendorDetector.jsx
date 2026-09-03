import React from 'react';
import { Cpu, Search, CheckCircle2, ShieldCheck, HardDrive, Database, Layers } from 'lucide-react';

export const VendorDetector = ({ detectionResult, isDetecting = false }) => {
  if (isDetecting) {
    return (
      <div className="bg-forensic-900 border border-forensic-cyan/30 rounded-xl p-8 text-center space-y-4 shadow-glow-cyan animate-pulse">
        <div className="w-14 h-14 mx-auto rounded-full bg-forensic-850 border border-forensic-cyan flex items-center justify-center text-forensic-cyan">
          <Cpu className="w-7 h-7 animate-spin" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Scanning Magic Bytes & Storage Partitions...
          </h4>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Searching for HIKVISION_H264, DHAV, CP_UVR, and raw NALU slice signatures
          </p>
        </div>
        <div className="w-48 mx-auto h-1.5 bg-forensic-950 rounded-full overflow-hidden border border-forensic-border">
          <div className="h-full bg-forensic-cyan rounded-full animate-indeterminate"></div>
        </div>
      </div>
    );
  }

  if (!detectionResult) return null;

  const { vendor, confidence, detectedMagic, suggestedContainer, estimatedChannels, deviceGuess } = detectionResult;

  return (
    <div className="bg-forensic-900 border border-emerald-500/40 rounded-xl p-5 space-y-4 shadow-glow-emerald">
      <div className="flex items-center justify-between border-b border-forensic-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
              Vendor Signature Successfully Identified
            </div>
            <h4 className="text-base font-bold text-slate-100">{vendor.name}</h4>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">Match Confidence:</span>
          <div className="text-base font-bold font-mono text-emerald-400">{confidence}%</div>
        </div>
      </div>

      {/* Grid of Extracted Vendor Parameters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-forensic-950 p-2.5 rounded border border-forensic-border">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Engine Allocated</span>
          <span className="font-semibold text-slate-200 mt-0.5 block truncate">{vendor.parserEngine}</span>
        </div>

        <div className="bg-forensic-950 p-2.5 rounded border border-forensic-border">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Identified Magic Bytes</span>
          <span className="font-mono text-[11px] text-cyan-300 mt-0.5 block truncate" title={detectedMagic}>
            {detectedMagic}
          </span>
        </div>

        <div className="bg-forensic-950 p-2.5 rounded border border-forensic-border">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Estimated Channels</span>
          <span className="font-semibold text-slate-200 mt-0.5 block">{estimatedChannels} Synchronized Streams</span>
        </div>

        <div className="bg-forensic-950 p-2.5 rounded border border-forensic-border">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Probable Hardware</span>
          <span className="font-semibold text-amber-300 mt-0.5 block truncate" title={deviceGuess}>
            {deviceGuess}
          </span>
        </div>
      </div>

      <div className="bg-forensic-850 p-3 rounded-lg border border-forensic-border text-xs text-slate-300 flex items-start gap-2">
        <Layers className="w-4 h-4 text-forensic-cyan shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Forensic Extraction Protocol:</span>{' '}
          <span>
            {vendor.notes} Video streams will be carved directly from sector boundaries without transcoding original H.264/H.265 bitstreams.
          </span>
        </div>
      </div>
    </div>
  );
};
