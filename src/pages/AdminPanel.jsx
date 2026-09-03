import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { VENDOR_MATRIX } from '../data/mockVendors';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Server,
  Users,
  Shield,
  Cpu,
  Database,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Lock,
  Plus
} from 'lucide-react';

const MOCK_USERS = [
  { id: 'USR-8821', name: 'Insp. Rajesh Kumar', badge: 'DL-8821', role: 'Investigator', jurisdiction: 'Special Cell, Delhi Police', status: 'Active' },
  { id: 'USR-4019', name: 'SI Vikram Salunkhe', badge: 'MH-4019', role: 'Investigator', jurisdiction: 'Bandra East PS, Mumbai', status: 'Active' },
  { id: 'USR-0409', name: 'Dr. Sunita Rao', badge: 'CFSL-SSO-409', role: 'Reviewer', jurisdiction: 'Central Forensic Science Lab', status: 'Active' },
  { id: 'USR-0312', name: 'Anand Verma', badge: 'GJ-CYB-312', role: 'Reviewer', jurisdiction: 'State Cyber Crime Lab, Gujarat', status: 'Active' },
  { id: 'USR-0001', name: 'Dr. Arvind Mehra', badge: 'NTRO-DIR-001', role: 'Admin', jurisdiction: 'NTRO Cyber Command HQ', status: 'Active' },
];

export const AdminPanel = () => {
  const { currentUser } = useAuth();
  const [vendorList, setVendorList] = useState(VENDOR_MATRIX);
  const [users, setUsers] = useState(MOCK_USERS);
  const [activeTab, setActiveTab] = useState('vendors'); // 'vendors' | 'users'

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Server className="w-5 h-5 text-forensic-cyan" />
            Forensic Administration & Multi-Vendor Parser Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            NTRO Security Terminal • Reverse-engineered CCTV codec definitions & investigator access control
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-forensic-900 border border-forensic-border px-3 py-1.5 rounded-lg text-slate-300">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Access Level: <strong className="text-red-400">ADMINISTRATOR (ROOT)</strong></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-forensic-border">
        <button
          onClick={() => setActiveTab('vendors')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'vendors'
              ? 'border-forensic-cyan text-forensic-cyan bg-forensic-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Supported Vendor Signature Library ({vendorList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-forensic-cyan text-forensic-cyan bg-forensic-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Examiner Roles & Digital Certificates ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: Multi-Vendor Format Matrix */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="bg-forensic-900 border border-forensic-border rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-forensic-cyan" />
              Reverse-Engineered DVR/NVR Proprietary Container & File System Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Directly resolves proprietary vendor lock-in: universal decoding and carving without vendor proprietary player software.
            </p>
          </div>

          <div className="bg-forensic-900 border border-forensic-border rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-forensic-850 border-b border-forensic-border text-slate-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Vendor / Manufacturer</th>
                    <th className="py-3 px-4">Parser Engine</th>
                    <th className="py-3 px-4">Magic Byte Signatures</th>
                    <th className="py-3 px-4">Container Formats</th>
                    <th className="py-3 px-4">Proprietary Filesystem</th>
                    <th className="py-3 px-4 text-center">Accuracy</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forensic-border/60">
                  {vendorList.map((v) => (
                    <tr key={v.id} className="hover:bg-forensic-850/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-100">{v.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{v.country}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">
                        {v.parserEngine}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300 max-w-xs truncate" title={v.magicBytes}>
                        {v.magicBytes}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {v.containers.join(', ')}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-amber-300/90">
                        {v.filesystem}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                        {v.accuracyScore}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                          v.status === 'Supported' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 font-bold' :
                          v.status === 'Beta' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
                          'bg-blue-950 text-blue-300 border-blue-500/40'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: User Role Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-forensic-900 border border-forensic-border rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-forensic-850 border-b border-forensic-border text-slate-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Examiner Name</th>
                    <th className="py-3 px-4">Badge / Service ID</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Police Jurisdiction / Lab Unit</th>
                    <th className="py-3 px-4 text-center">ECDSA Token</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forensic-border/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-forensic-850/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-100">
                        {u.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-300">
                        {u.badge}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                          u.role === 'Admin' ? 'bg-red-950 text-red-300 border-red-500/40' :
                          u.role === 'Reviewer' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
                          'bg-forensic-800 text-forensic-cyan border-forensic-cyan/40'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {u.jurisdiction}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[10px] text-slate-400">
                        secp256k1:Active
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
