import React, { useState } from 'react';
import { UploadCloud, HardDrive, FileVideo, CheckCircle2, Shield, FolderPlus } from 'lucide-react';

const PRELOADED_SAMPLES = [
  {
    name: 'HIK_SEIZED_DEV01_SDA_RAW.dd',
    vendorHint: 'Hikvision Turbo HD (DS-7204)',
    size: '14.8 GB',
    type: 'Raw Bitstream Image',
    desc: 'Proprietary HIK-FS v3 filesystem with embedded SEI timecodes',
  },
  {
    name: 'DAHUA_GATE_BOOTH_REC.dav',
    vendorHint: 'Dahua WizSense (DHAV)',
    size: '8.4 GB',
    type: 'Proprietary Stream Container',
    desc: 'DHAV container with BCD timecode headers and 4 audio/video multiplexes',
  },
  {
    name: 'CPPLUS_STRONGROOM_CH1-4.bin',
    vendorHint: 'CP Plus Orange UVR',
    size: '32.1 GB',
    type: 'Custom Ext3 Sector Dump',
    desc: 'CP-Stream bin archive with sector watermark timestamp maps',
  },
  {
    name: 'SEIZED_UNBRANDED_DVR_DISK0.raw',
    vendorHint: 'Unknown White-Label CCTV',
    size: '2.1 GB Carved',
    type: 'Wiped MBR Raw Dump',
    desc: 'Zeroed partition headers requiring automated NALU heuristic carving',
  }
];

export const Dropzone = ({ onSelectFile }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onSelectFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'Binary Raw Image',
      });
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onSelectFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'Binary Raw Image',
      });
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedSample(sample.name);
    onSelectFile(sample);
  };

  return (
    <div className="space-y-5">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragOver
            ? 'border-forensic-cyan bg-forensic-cyan/10 shadow-glow-cyan'
            : 'border-forensic-border hover:border-forensic-border-light bg-forensic-900/50'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-forensic-850 border border-forensic-cyan/40 flex items-center justify-center text-forensic-cyan">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">
              Mount Seized DVR/NVR Disk Image or Video Container
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Supports raw bitstream dumps (<span className="font-mono text-cyan-300">.dd, .raw, .img, .e01</span>) and proprietary streams (<span className="font-mono text-cyan-300">.dav, .bin, .hsv, .sec</span>)
            </p>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-forensic-cyan text-black font-bold rounded-lg hover:bg-cyan-300 cursor-pointer text-xs transition-colors shadow-glow-cyan">
              <FolderPlus className="w-4 h-4" />
              <span>Browse Local Evidence Image</span>
              <input type="file" className="hidden" onChange={handleFileInput} />
            </label>
          </div>
        </div>
      </div>

      {/* Preloaded Realistic Forensic Samples for Instant Demo */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-forensic-cyan" />
            Quick Demo: Select Pre-Seized Multi-Vendor Evidence Images
          </span>
          <span className="text-[10px] font-mono text-slate-500">Certified Forensic Evidence Bench</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRELOADED_SAMPLES.map((s) => (
            <button
              key={s.name}
              onClick={() => handleSelectSample(s)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedSample === s.name
                  ? 'bg-forensic-800 border-forensic-cyan shadow-glow-cyan'
                  : 'bg-forensic-900 border-forensic-border hover:border-forensic-border-light'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-forensic-cyan shrink-0" />
                  <span className="font-mono font-bold text-xs text-slate-200 truncate">
                    {s.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-forensic-950 px-1.5 py-0.5 rounded border border-forensic-border shrink-0 ml-2">
                  {s.size}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-amber-300/90 mt-1">
                Vendor: {s.vendorHint}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {s.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
