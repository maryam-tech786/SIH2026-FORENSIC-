import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, UserCheck, Key, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('Investigator');
  const [officerName, setOfficerName] = useState('Insp. Rajesh Kumar');
  const [badgeNumber, setBadgeNumber] = useState('DL-8821');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'Investigator') {
      setOfficerName('Insp. Rajesh Kumar');
      setBadgeNumber('DL-8821');
    } else if (role === 'Reviewer') {
      setOfficerName('Dr. Sunita Rao');
      setBadgeNumber('CFSL-SSO-409');
    } else if (role === 'Admin') {
      setOfficerName('Dr. Arvind Mehra');
      setBadgeNumber('NTRO-DIR-001');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    switchRole(selectedRole, officerName, badgeNumber);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-forensic-950 flex flex-col justify-between p-4 relative overflow-hidden">
      {/* Subtle background forensic grid lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Top Banner */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between text-xs text-slate-400 py-3 border-b border-forensic-border/50">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-forensic-cyan" />
          <span className="font-bold text-slate-200">NTRO CYBER FORENSICS CONSOLE</span>
        </div>
        <span className="font-mono text-cyan-400/80">NTRO-DFR-CORE // v4.2.8 (Restricted)</span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-forensic-900 border border-forensic-border rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {/* Emblem Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-forensic-850 border border-forensic-cyan/40 flex items-center justify-center text-forensic-cyan shadow-glow-cyan mb-5">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-wide uppercase">
              Multi-Vendor DVR/NVR Forensic Tool
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              National Technical Research Organisation (NTRO) Secure Terminal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Preset Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                Select Operational Role (Mock Auth):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Investigator', label: 'Investigator', badge: 'Field IO' },
                  { id: 'Reviewer', label: 'Reviewer', badge: 'Lab SSO' },
                  { id: 'Admin', label: 'Admin', badge: 'Director' }
                ].map(r => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => handleRoleChange(r.id)}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      selectedRole === r.id
                        ? 'bg-forensic-800 border-forensic-cyan text-forensic-cyan shadow-glow-cyan'
                        : 'bg-forensic-950 border-forensic-border text-slate-400 hover:text-slate-200 hover:bg-forensic-850'
                    }`}
                  >
                    <div className="text-xs font-bold">{r.label}</div>
                    <div className="text-[10px] font-mono text-slate-400">{r.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Officer Name Input */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Authorized Officer / Examiner Name:
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                required
                className="w-full bg-forensic-950 border border-forensic-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-forensic-cyan font-mono"
              />
            </div>

            {/* Officer Badge Number */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Forensic Badge / Service Credential ID:
              </label>
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                required
                className="w-full bg-forensic-950 border border-forensic-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-forensic-cyan font-mono"
              />
            </div>

            {/* Simulated Token / PIN info */}
            <div className="p-3 bg-forensic-950 rounded-lg border border-forensic-border text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono">
                <Key className="w-3.5 h-3.5 text-forensic-cyan" />
                <span>Session Key: ECDSA-SHA256</span>
              </span>
              <span className="text-emerald-400 font-mono text-[10px]">READY</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-forensic-cyan text-black font-extrabold rounded-lg hover:bg-cyan-300 transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-cyan mt-2"
            >
              <span>Authenticate & Access Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-[10px] text-slate-400 font-mono">
            Evidentiary compliance with Indian Evidence Act Sec 65B / BSA 2023
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-[11px] text-slate-400 py-3 border-t border-forensic-border/50 font-mono">
        National Technical Research Organisation (NTRO) • Digital Forensics Directorate • Government of India
      </div>
    </div>
  );
};
