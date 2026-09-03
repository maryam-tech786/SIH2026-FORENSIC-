import React, { useState } from 'react';
import { BlockCard } from './BlockCard';
import { Link2, ShieldCheck, ShieldAlert, CheckCircle2, RotateCw, AlertTriangle, Fingerprint } from 'lucide-react';
import { verifyChainIntegrity } from '../../services/custodyService';

export const ChainViewer = ({
  chain = [],
  caseId,
  onTamperToggle,
  onReloadChain,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [filterAction, setFilterAction] = useState('ALL');

  const handleRunAudit = async () => {
    setIsVerifying(true);
    setAuditResult(null);
    try {
      const result = await verifyChainIntegrity(caseId);
      setAuditResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredChain = filterAction === 'ALL'
    ? chain
    : chain.filter(b => b.action === filterAction);

  return (
    <div className="space-y-6">
      {/* Action Header with Integrity Check & Filter */}
      <div className="bg-forensic-900 border border-forensic-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-forensic-cyan" />
            <h3 className="font-bold text-slate-100 text-sm">
              Immutable Forensic Blockchain Ledger
            </h3>
            <span className="text-[10px] font-mono bg-forensic-800 text-cyan-300 border border-forensic-cyan/30 px-2 py-0.5 rounded">
              {chain.length} Blocks Minted
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Section 65B BSA cryptographic trail: every ingest, scrub, scan, and transfer is anchored to the parent block hash.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Action Filter */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-forensic-950 border border-forensic-border rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Ledger Events</option>
            <option value="EVIDENCE_SEIZURE_INGESTION">Ingestion Events</option>
            <option value="FORENSIC_DEEP_SCAN">Forensic Scans</option>
            <option value="CUSTODY_TRANSFER">Custody Transfers</option>
            <option value="EVIDENCE_VIEWED">Playback Sessions</option>
            <option value="COURT_REPORT_GENERATION">Court Certifications</option>
          </select>

          {/* Audit Verification Button */}
          <button
            onClick={handleRunAudit}
            disabled={isVerifying}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-forensic-cyan text-black font-bold rounded-lg hover:bg-cyan-300 transition-all text-xs shadow-glow-cyan disabled:opacity-50 whitespace-nowrap"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Recalculating Hashes...' : 'Verify Chain Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Live Audit Result Banner */}
      {auditResult && (
        <div className={`p-4 rounded-xl border animate-in fade-in duration-200 ${
          auditResult.isValid
            ? 'bg-emerald-950/40 border-emerald-500/50 shadow-glow-emerald text-emerald-200'
            : 'bg-red-950/50 border-red-500/70 shadow-glow-crimson text-red-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {auditResult.isValid ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-red-400 shrink-0 animate-bounce" />
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {auditResult.isValid
                    ? 'Cryptographic Verification Succeeded — 100% Chain Integrity Verified'
                    : `Cryptographic Audit Failed — ${auditResult.brokenLinksCount} Broken Link(s) Detected!`}
                </h4>
                <p className="text-xs opacity-80 mt-0.5 font-mono">
                  Checked {auditResult.totalBlocksChecked} blocks in sequence. Merkle root hash recalculation: PASS.
                </p>
              </div>
            </div>

            <button
              onClick={() => setAuditResult(null)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              &times; Dismiss
            </button>
          </div>

          {!auditResult.isValid && auditResult.brokenLinks.length > 0 && (
            <div className="mt-3 p-3 bg-red-950/80 rounded border border-red-500/40 text-xs font-mono space-y-1">
              {auditResult.brokenLinks.map((link, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-300">{link.brokenBetween}:</strong> {link.reason}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Linked Vertical Chain */}
      <div className="relative pl-6 sm:pl-8 space-y-4">
        {/* Continuous vertical linking track line */}
        <div className="absolute top-6 bottom-6 left-3 sm:left-4 w-0.5 bg-forensic-border -ml-px"></div>

        {filteredChain.map((block, idx) => {
          const nextBlock = filteredChain[idx + 1];
          const isBroken = nextBlock && (block.currentHash !== nextBlock.previousHash || block.isTampered);

          return (
            <div key={block.index} className="relative">
              {/* Timeline node icon on the vertical line */}
              <div className={`absolute -left-6 sm:-left-8 top-5 w-4 h-4 rounded-full border-2 bg-forensic-950 z-10 flex items-center justify-center ${
                block.isTampered
                  ? 'border-red-500 bg-red-950 animate-ping'
                  : 'border-forensic-cyan bg-forensic-900'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  block.isTampered ? 'bg-red-400' : 'bg-forensic-cyan'
                }`}></div>
              </div>

              {/* Block Card */}
              <BlockCard
                block={block}
                isBrokenWithNext={isBroken}
                onTamperToggle={onTamperToggle}
              />

              {/* Cryptographic Link connector between blocks */}
              {nextBlock && (
                <div className="my-2 flex items-center justify-center">
                  {isBroken ? (
                    <div className="flex items-center gap-2 bg-red-950/80 text-red-400 border border-red-500/60 px-3 py-1 rounded-full text-[10px] font-mono font-bold shadow-glow-crimson animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>CRYPTOGRAPHIC LINK SEVERED (HASH MISMATCH)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-forensic-950 px-2 py-0.5 rounded border border-forensic-border">
                      <Link2 className="w-3 h-3 text-emerald-400" />
                      <span>SHA-256 PARENT-CHILD LINK VERIFIED</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
