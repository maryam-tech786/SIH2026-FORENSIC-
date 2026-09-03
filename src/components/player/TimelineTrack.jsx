import React, { useState } from 'react';
import { AlertTriangle, Clock, Activity, Zap } from 'lucide-react';

export const TimelineTrack = ({
  currentTime = 0,
  duration = 255,
  onSeek,
  findings = [],
  onSelectFinding,
}) => {
  const [hoveredFinding, setHoveredFinding] = useState(null);
  const [hoverX, setHoverX] = useState(null);
  const [hoverSec, setHoverSec] = useState(null);

  const safeDuration = duration > 0 ? duration : 255;
  const currentPercentage = Math.min(100, Math.max(0, (currentTime / safeDuration) * 100));

  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = clickRatio * safeDuration;
    if (onSeek) onSeek(targetSeconds);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    setHoverX(x);
    setHoverSec(ratio * safeDuration);
  };

  const formatSec = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-forensic-900 border border-forensic-border rounded-lg p-3 space-y-2 select-none">
      {/* Header with Legend */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-forensic-cyan" />
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Forensic Bitstream Timeline & Discontinuity Map
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2 rounded-sm bg-emerald-500/80"></span>
            <span className="text-slate-400">Continuous Stream</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2 rounded-sm bg-red-500 shadow-glow-crimson animate-pulse"></span>
            <span className="text-red-400 font-semibold">Timestamp Discontinuity</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2 rounded-sm bg-amber-400"></span>
            <span className="text-amber-300">Re-Encode / QP Spike</span>
          </div>
        </div>
      </div>

      {/* Main Track Bar */}
      <div
        className="relative h-10 bg-forensic-950 rounded border border-forensic-border/80 cursor-pointer overflow-hidden group"
        onClick={handleTrackClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHoverX(null); setHoverSec(null); }}
      >
        {/* Base normal continuous recording track (simulated active recording blocks) */}
        <div className="absolute inset-y-1 left-[2%] right-[2%] bg-emerald-950/40 rounded border border-emerald-500/30 flex items-center">
          <div className="w-full h-1.5 bg-emerald-500/40 rounded-full mx-1"></div>
        </div>

        {/* Anomaly markers on timeline */}
        {findings.map((finding) => {
          const isHigh = finding.severity === 'High';
          const isMedium = finding.severity === 'Medium';
          const pct = finding.timelinePercentage || 50;

          return (
            <div
              key={finding.id}
              onClick={(e) => {
                e.stopPropagation();
                if (onSeek) onSeek((pct / 100) * safeDuration);
                if (onSelectFinding) onSelectFinding(finding);
              }}
              onMouseEnter={() => setHoveredFinding(finding)}
              onMouseLeave={() => setHoveredFinding(null)}
              style={{ left: `${pct}%` }}
              className={`absolute top-0 bottom-0 w-2.5 -ml-1 flex flex-col items-center justify-between py-0.5 z-20 cursor-pointer transition-transform hover:scale-125 ${
                isHigh ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${
                isHigh ? 'bg-red-500 shadow-glow-crimson animate-ping' : 'bg-amber-400'
              }`}></div>
              <div className={`w-0.5 h-full ${
                isHigh ? 'bg-red-500' : 'bg-amber-400'
              }`}></div>
              <div className={`w-2 h-2 rounded-sm ${
                isHigh ? 'bg-red-500' : 'bg-amber-400'
              }`}></div>
            </div>
          );
        })}

        {/* Current playhead line */}
        <div
          style={{ left: `${currentPercentage}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-forensic-cyan shadow-glow-cyan z-30 pointer-events-none transition-all duration-75"
        >
          <div className="w-3 h-3 -ml-[5px] -mt-0.5 bg-forensic-cyan rotate-45 border border-black shadow"></div>
        </div>

        {/* Hover preview tooltip */}
        {hoverX !== null && hoverSec !== null && (
          <div
            style={{ left: `${hoverX}px` }}
            className="absolute top-0 bottom-0 w-px bg-white/40 pointer-events-none z-10"
          >
            <div className="absolute -top-7 -translate-x-1/2 bg-black/90 border border-slate-700 text-slate-200 text-[10px] font-mono px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap">
              {formatSec(hoverSec)}
            </div>
          </div>
        )}
      </div>

      {/* Hovered Finding Callout Tooltip */}
      {hoveredFinding && (
        <div className="bg-forensic-850 border border-forensic-border rounded p-2 text-xs flex items-center justify-between text-slate-300 animate-in fade-in duration-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${
              hoveredFinding.severity === 'High' ? 'text-red-400' : 'text-amber-400'
            }`} />
            <div>
              <span className="font-bold text-slate-100">{hoveredFinding.title}</span>
              <span className="text-slate-500 text-[11px] ml-2 font-mono">at {hoveredFinding.timestampOffset}</span>
            </div>
          </div>
          <span className="text-[10px] bg-forensic-900 border border-forensic-border px-2 py-0.5 rounded font-mono text-cyan-300">
            Confidence: {hoveredFinding.confidenceScore}% (Click to seek)
          </span>
        </div>
      )}

      {/* Time ticks indicator */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
        <span>00:00:00 (Start)</span>
        <span>01:00:00</span>
        <span>02:00:00</span>
        <span>03:00:00</span>
        <span>{formatSec(safeDuration)} (End)</span>
      </div>
    </div>
  );
};
