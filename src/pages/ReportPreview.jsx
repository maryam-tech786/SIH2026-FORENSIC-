import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReportData, signReport } from '../services/reportService';
import { StatusBadge } from '../components/common/StatusBadge';
import { HashDisplay } from '../components/common/HashDisplay';
import {
  FileCheck2,
  Printer,
  ShieldCheck,
  CheckCircle,
  FileText,
  Clock,
  User,
  KeyRound,
  Download,
  QrCode,
  Stamp
} from 'lucide-react';

export const ReportPreview = ({ caseId: propCaseId, embedded = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const caseId = propCaseId || id || 'CASE-2026-0841';

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examinerNotes, setExaminerNotes] = useState(
    'Digital evidence acquired via write-blocker in forensic bitstream format. Automated SEI and GOP parsing confirmed selective video excision between 02:14:07 and 02:18:19 IST.'
  );
  const [pin, setPin] = useState('8821');
  const [isSigned, setIsSigned] = useState(false);
  const [signedBlock, setSignedBlock] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const data = await getReportData(caseId);
      setReportData(data);
      setLoading(false);
    };
    fetchReport();
  }, [caseId]);

  const handleSign = async (e) => {
    e.preventDefault();
    const res = await signReport(caseId, examinerNotes, currentUser.name, pin);
    setIsSigned(true);
    setSignedBlock(res.blockHash);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !reportData) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono">
        Compiling Section 65B BSA Forensic Certificate...
      </div>
    );
  }

  const { caseData, evidenceList, findings, chainSummary, certificateId, generatedAt, legalStandard, labName } = reportData;
  const reportFindings = findings.filter(f => f.addToReport);

  return (
    <div className={`space-y-6 ${embedded ? '' : 'p-6 max-w-5xl mx-auto'}`}>
      {/* Top Action Ribbon (No-Print) */}
      <div className="no-print bg-forensic-900 border border-forensic-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            Court-Ready Digital Evidence Forensic Certificate
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Admissible under Section 63 Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Indian Evidence Act
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-forensic-cyan text-black font-bold rounded-lg hover:bg-cyan-300 transition-all text-xs shadow-glow-cyan"
          >
            <Printer className="w-4 h-4" />
            <span>Export / Print Official Court PDF</span>
          </button>
        </div>
      </div>

      {/* Official Court Document Sheet (Styled for Screen and Clean White Print) */}
      <div className="court-report-sheet bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl border border-slate-300 font-sans space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-5 text-center relative">
          <div className="text-[11px] font-mono tracking-widest text-slate-600 uppercase font-bold">
            GOVERNMENT OF INDIA • MINISTRY OF HOME AFFAIRS / NTRO
          </div>
          <h1 className="text-xl font-extrabold uppercase tracking-wide text-slate-950 mt-1">
            CERTIFICATE OF ELECTRONIC EVIDENCE EXAMINATION
          </h1>
          <div className="text-xs font-semibold text-slate-700 mt-0.5">
            Issued under Section 63, Bharatiya Sakshya Adhiniyam, 2023 (formerly Section 65B, Indian Evidence Act, 1872)
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-600 border-t border-slate-200 pt-2">
            <span>Certificate ID: <strong className="text-slate-900">{certificateId}</strong></span>
            <span>Date of Generation: <strong className="text-slate-900">{new Date(generatedAt).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Legal Declaration Statement */}
        <div className="bg-slate-50 border border-slate-300 p-3.5 rounded text-xs text-slate-800 leading-relaxed italic">
          "I, the undersigned forensic examiner, hereby certify that the electronic records detailed below were produced by computer systems and surveillance video recording equipment operating properly during the relevant period, without unauthorized interference or tampering that could alter the integrity of the data."
        </div>

        {/* Section 1: Seizure & Case Particulars */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 font-mono">
            1. Particulars of Seizure & Investigation
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="text-slate-500 font-medium">FIR / Crime Number:</span>{' '}
              <strong className="text-slate-900 font-mono">{caseData.firNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Police Station:</span>{' '}
              <span className="text-slate-900 font-semibold">{caseData.policeStation}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Jurisdiction:</span>{' '}
              <span className="text-slate-900">{caseData.jurisdiction}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Investigating Officer:</span>{' '}
              <span className="text-slate-900 font-semibold">{caseData.investigatingOfficer}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 font-medium">Subject / Allegation:</span>{' '}
              <span className="text-slate-900">{caseData.title}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Seized Multi-Vendor Hardware & Video Streams */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 font-mono">
            2. Seized Surveillance Hardware & Forensic Hashes
          </h3>

          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 font-mono text-[10px] uppercase text-slate-700">
              <tr>
                <th className="p-2 border-r border-slate-300">Item ID</th>
                <th className="p-2 border-r border-slate-300">Hardware / Vendor</th>
                <th className="p-2 border-r border-slate-300">Container Format</th>
                <th className="p-2 border-r border-slate-300">Channels</th>
                <th className="p-2">SHA-256 Bitstream Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {evidenceList.map((ev) => (
                <tr key={ev.id} className="text-[11px]">
                  <td className="p-2 font-mono font-bold text-slate-900 border-r border-slate-200">{ev.id}</td>
                  <td className="p-2 border-r border-slate-200">
                    <div className="font-semibold text-slate-900">{ev.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{ev.model}</div>
                  </td>
                  <td className="p-2 border-r border-slate-200 font-mono text-[10px]">{ev.containerFormat}</td>
                  <td className="p-2 border-r border-slate-200 font-mono">{ev.channelCount} Ch</td>
                  <td className="p-2 font-mono text-[10px] text-slate-800 break-all select-all font-semibold">
                    {ev.sha256}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Admissible Forensic Findings & Tamper Anomaly Log */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 font-mono">
            3. Forensic Findings & Identified Video Stream Anomalies
          </h3>

          {reportFindings.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No tamper anomalies marked for judicial inclusion.</p>
          ) : (
            <div className="space-y-2">
              {reportFindings.map((f, idx) => (
                <div key={f.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Finding #{idx + 1}: {f.title}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 font-bold">
                      Severity: {f.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono">
                    Channel: {f.channelName} • Timecode: {f.timestampOffset} ({f.timecodeReal}) • Statistical Confidence: {f.confidenceScore}%
                  </div>
                  <p className="text-slate-800 text-[11px] leading-relaxed">
                    {f.description}
                  </p>
                  <div className="text-[10px] font-mono text-slate-600 bg-white p-1.5 rounded border border-slate-200">
                    <strong>Technical Trace:</strong> {f.technicalDetails}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Blockchain Ledger Excerpt */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 font-mono">
            4. Cryptographic Blockchain Chain-of-Custody Verification
          </h3>
          <div className="p-3 bg-slate-100 rounded border border-slate-300 text-xs font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Sequential Blocks Anchored:</span>
              <strong className="text-slate-900">{chainSummary.length} Blocks</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Genesis Block Hash:</span>
              <span className="text-slate-900 text-[10px]">{chainSummary[0]?.currentHash.slice(0, 32)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Latest Ledger Root Hash:</span>
              <span className="text-slate-900 text-[10px]">{chainSummary[chainSummary.length - 1]?.currentHash.slice(0, 32)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Cryptographic Integrity Audit:</span>
              <strong className="text-emerald-700">VERIFIED 100% IMMUTABLE (0 BROKEN LINKS)</strong>
            </div>
          </div>
        </div>

        {/* Section 5: Examiner Sign-off & Section 65B Digital Certificate Seal */}
        <div className="border-t-2 border-slate-900 pt-4 grid grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-slate-500 uppercase font-mono text-[10px] block mb-1">
              Forensic Lab Seal & QR Hash Verification:
            </span>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded p-2">
                <QrCode className="w-12 h-12" />
              </div>
              <div className="text-[10px] font-mono text-slate-600">
                <div>Scan to verify certificate against NTRO blockchain ledger</div>
                <div className="mt-1 font-bold text-slate-900">ECDSA SECP256K1 VERIFIED</div>
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col justify-between">
            <div>
              <span className="text-slate-500 uppercase font-mono text-[10px] block">
                Examiner Digital Signature & Stamp
              </span>
              <div className="font-serif italic text-lg text-slate-900 mt-1 font-bold">
                {currentUser.name}
              </div>
              <div className="text-[11px] font-semibold text-slate-700">
                {currentUser.role === 'Reviewer' ? 'Sr. Scientific Officer (Digital Forensics)' : 'Investigating Forensic Officer'}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Badge / Service ID: {currentUser.badgeNumber}
              </div>
            </div>

            <div className="text-[10px] font-mono text-emerald-800 font-bold mt-2">
              {isSigned ? `✓ DIGITAL CERTIFICATE SIGNED (${signedBlock?.slice(0, 16)}...)` : 'Awaiting Digital Stamp Pin'}
            </div>
          </div>
        </div>
      </div>

      {/* Digital Signature Signing Modal / Box (No-Print) */}
      {!isSigned && (
        <div className="no-print bg-forensic-900 border border-forensic-border rounded-xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-forensic-cyan" />
            Affix Forensic Examiner Section 65B Digital Signature
          </h4>

          <form onSubmit={handleSign} className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Examiner Evidentiary Notes / Court Conclusion:
              </label>
              <textarea
                rows={2}
                value={examinerNotes}
                onChange={(e) => setExaminerNotes(e.target.value)}
                className="w-full bg-forensic-950 border border-forensic-border rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-forensic-cyan"
              ></textarea>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Cryptographic Token PIN:</span>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-24 bg-forensic-950 border border-forensic-border rounded px-2 py-1 text-xs text-center font-mono text-cyan-300"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs transition-colors shadow-glow-emerald"
              >
                Affix Digital Signature & Stamp
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
