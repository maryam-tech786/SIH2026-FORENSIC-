import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCustodyChain, toggleSimulateTamper } from '../services/custodyService';
import { getCaseById } from '../services/caseService';
import { ChainViewer } from '../components/ledger/ChainViewer';
import { Link2, ShieldCheck, ArrowLeft, Plus } from 'lucide-react';

export const ChainOfCustody = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setActiveCaseId } = useAuth();
  const caseId = id || 'CASE-2026-0841';

  const [chain, setChain] = useState([]);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadChain = async () => {
    setLoading(true);
    try {
      setActiveCaseId(caseId);
      const c = await getCaseById(caseId);
      const blocks = await getCustodyChain(caseId);
      setCaseData(c);
      setChain(blocks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChain();
  }, [caseId]);

  const handleTamperToggle = async (blockIndex) => {
    await toggleSimulateTamper(caseId, blockIndex);
    const updated = await getCustodyChain(caseId);
    setChain(updated);
  };

  if (loading || !caseData) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono">
        Connecting to Blockchain Ledger Node for {caseId}...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Link2 className="w-5 h-5 text-forensic-cyan" />
            Blockchain-Backed Chain of Custody Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Case: <strong className="text-cyan-300 font-mono">{caseData.firNumber}</strong> • {caseData.policeStation}
          </p>
        </div>

        <button
          onClick={() => navigate(`/cases/${caseId}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-forensic-850 hover:bg-forensic-800 text-slate-300 rounded-lg text-xs border border-forensic-border"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Case Detail</span>
        </button>
      </div>

      {/* Embedded Chain Viewer */}
      <ChainViewer
        chain={chain}
        caseId={caseId}
        onTamperToggle={handleTamperToggle}
        onReloadChain={loadChain}
      />
    </div>
  );
};
