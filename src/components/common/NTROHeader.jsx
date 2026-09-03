import React, { useState } from 'react';
import { Shield, Info, ExternalLink, Cpu, Database, CheckCircle, FileCheck2 } from 'lucide-react';

export const NTROHeader = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-forensic-950 via-forensic-900 to-forensic-950 border-b border-forensic-border px-4 py-1.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 font-bold text-forensic-cyan tracking-wider">
            <Shield className="w-3.5 h-3.5 text-forensic-cyan" />
            <span>NTRO CYBER COMMAND</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 truncate hidden md:inline">
            National Technical Research Organisation • Multi-Vendor DVR/NVR Forensic Analysis & Evidentiary Ledger
          </span>
          <span className="bg-forensic-800 text-forensic-cyan border border-forensic-cyan/30 text-[10px] px-2 py-0.2 rounded-full font-mono hidden lg:inline">
            BSA 2023 / Sec 65B Certified
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-forensic-cyan transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="underline decoration-dotted underline-offset-2">System Standards & Compliance</span>
          </button>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono">LEDGER ACTIVE</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-forensic-900 border border-forensic-border rounded-xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-start justify-between pb-4 border-b border-forensic-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-forensic-cyan/10 border border-forensic-cyan/30 rounded-lg text-forensic-cyan">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    NTRO Digital Forensics & Multimedia System
                  </h3>
                  <p className="text-xs text-slate-400">
                    Authority: <strong className="text-slate-200">National Technical Research Organisation (Govt. of India)</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-100 p-1 rounded-md text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-forensic-850 rounded-lg border border-forensic-border">
                <div className="font-semibold text-forensic-cyan mb-1 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Operational Mandate:
                </div>
                <p className="font-medium text-slate-200 text-sm">
                  Vendor-Agnostic DVR/NVR Bitstream Carving & Blockchain-Anchored Chain of Custody
                </p>
                <div className="mt-1 text-[11px] text-slate-400">
                  Division: <strong>Cyber Security & Digital Evidence Forensics</strong>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-200 mb-1">Standard Operating Capabilities:</h4>
                <ul className="space-y-1.5 list-disc list-inside text-slate-400 pl-1">
                  <li><strong className="text-slate-300">Proprietary Format Demuxing:</strong> Bypasses vendor-exclusive playback restrictions across Hikvision, Dahua, CP Plus, and Honeywell devices.</li>
                  <li><strong className="text-slate-300">Evidentiary Anomaly Audits:</strong> Automated detection of timestamp discontinuities, dropped frame bursts, re-encoding artifacts, and zeroed partitions.</li>
                  <li><strong className="text-slate-300">Blockchain Chain of Custody:</strong> Cryptographic parent-child SHA-256 block ledger preserving untampered chain of custody for court admissibility.</li>
                  <li><strong className="text-slate-300">Statutory Certification:</strong> Automated generation of certificates under Section 63 Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Indian Evidence Act.</li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-forensic-950 p-2.5 rounded border border-forensic-border text-center">
                  <div className="text-forensic-cyan font-bold text-sm">Multi-Vendor</div>
                  <div className="text-[10px] text-slate-400">Direct Bitstream Parsing</div>
                </div>
                <div className="bg-forensic-950 p-2.5 rounded border border-forensic-border text-center">
                  <div className="text-emerald-400 font-bold text-sm">Immutable Ledger</div>
                  <div className="text-[10px] text-slate-400">Cryptographic Chain</div>
                </div>
                <div className="bg-forensic-950 p-2.5 rounded border border-forensic-border text-center">
                  <div className="text-amber-400 font-bold text-sm">Sec 65B BSA</div>
                  <div className="text-[10px] text-slate-400">Court Certified Report</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-forensic-cyan text-black font-semibold rounded-lg hover:bg-cyan-300 transition-colors text-xs"
              >
                Return to Console
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
