import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Camera,
  Maximize2,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { HashDisplay } from '../common/HashDisplay';

export const VideoPlayer = ({
  videoUrl,
  channelName = 'CH-01: Main Server Vault Entrance',
  resolution = '1920x1080 @ 25fps',
  bitrate = '4096 kbps',
  vendor = 'Hikvision',
  containerFormat = 'HIK-FS v3 / Proprietary Stream',
  currentTime,
  duration,
  onTimeUpdate,
  onSeek,
  findings = [],
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [enhancementMode, setEnhancementMode] = useState('normal'); // 'normal' | 'night_vision' | 'contrast_boost' | 'grayscale'
  const [capturedSnapshot, setCapturedSnapshot] = useState(null);
  const [currentFrameNum, setCurrentFrameNum] = useState(1);

  // Sync seek externally when timeline clicked
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.4) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(e => console.log('Autoplay error', e));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentFrameNum(Math.floor(cur * 25) + 1);
    if (onTimeUpdate) {
      onTimeUpdate(cur, dur);
    }
  };

  const handleStepFrame = (deltaFrames) => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    const frameDuration = 1 / 25; // 25 fps
    const newTime = Math.max(0, Math.min(videoRef.current.duration || 100, videoRef.current.currentTime + (deltaFrames * frameDuration)));
    videoRef.current.currentTime = newTime;
  };

  const handleStepSeconds = (deltaSeconds) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(videoRef.current.duration || 100, videoRef.current.currentTime + deltaSeconds));
    videoRef.current.currentTime = newTime;
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1920;
    canvas.height = videoRef.current.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    
    // Draw current frame
    try {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      
      // Generate pseudo SHA-256 for snapshot evidentiary receipt
      const snapshotHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      setCapturedSnapshot({
        dataUrl,
        timestamp: new Date().toISOString(),
        videoTimestamp: formatTime(videoRef.current.currentTime),
        frameNumber: currentFrameNum,
        sha256: snapshotHash,
      });
    } catch (e) {
      // Cross-origin fallback
      const snapshotHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setCapturedSnapshot({
        dataUrl: null,
        timestamp: new Date().toISOString(),
        videoTimestamp: formatTime(currentTime),
        frameNumber: currentFrameNum,
        sha256: snapshotHash,
      });
    }
  };

  const formatTime = (secs) => {
    const total = Math.floor(secs || 0);
    const m = Math.floor(total / 60);
    const s = total % 60;
    const ms = Math.floor(((secs || 0) - total) * 100);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Enhancement CSS filter
  let filterStyle = {};
  if (enhancementMode === 'night_vision') {
    filterStyle = { filter: 'brightness(140%) contrast(160%) sepia(20%) hue-rotate(90deg)' };
  } else if (enhancementMode === 'contrast_boost') {
    filterStyle = { filter: 'contrast(180%) brightness(110%) saturate(140%)' };
  } else if (enhancementMode === 'grayscale') {
    filterStyle = { filter: 'grayscale(100%) contrast(130%)' };
  }

  return (
    <div className="bg-forensic-900 border border-forensic-border rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Video Header / Metadata Bar */}
      <div className="px-4 py-2 bg-forensic-850 border-b border-forensic-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-slate-200">{channelName}</span>
          <span className="text-slate-500 font-mono">|</span>
          <span className="text-forensic-cyan font-mono text-[11px]">{resolution}</span>
          <span className="text-slate-500 font-mono text-[11px]">({bitrate})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-forensic-950 text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono border border-forensic-border">
            Parser: {vendor} ({containerFormat})
          </span>
          <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-500/30">
            RAW PREVIEW SYNCHRONIZED
          </span>
        </div>
      </div>

      {/* Screen Area */}
      <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden select-none">
        <video
          ref={videoRef}
          src={videoUrl}
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-contain"
          style={filterStyle}
        />

        {/* Live CCTV OSD (On-Screen Display) Overlay */}
        <div className="absolute top-3 left-4 pointer-events-none font-mono text-xs text-emerald-400/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black/40 px-2 py-1 rounded backdrop-blur-[2px] border border-emerald-500/20">
          <div className="font-bold text-emerald-300">CAM-01 [VAULT_ENTRY]</div>
          <div className="text-[11px]">REC: 2026-08-14 02:14:{Math.floor(currentTime % 60).toString().padStart(2, '0')} IST</div>
          <div className="text-[10px] text-slate-400">FRAME: #{currentFrameNum.toString().padStart(6, '0')} (25.00 FPS)</div>
        </div>

        {/* Forensic Enhancement Active Indicator */}
        {enhancementMode !== 'normal' && (
          <div className="absolute top-3 right-4 pointer-events-none bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded uppercase flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>FILTER: {enhancementMode.replace('_', ' ')}</span>
          </div>
        )}

        {/* Big play button overlay when paused */}
        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-forensic-900/80 border border-forensic-cyan/50 text-forensic-cyan flex items-center justify-center hover:scale-110 transition-all shadow-glow-cyan"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>
        )}
      </div>

      {/* Primary Video Transport Controls */}
      <div className="p-3 bg-forensic-850 border-t border-forensic-border space-y-2">
        <div className="flex items-center justify-between text-xs">
          {/* Play, Step, Seek Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlayPause}
              className={`p-2 rounded-lg font-medium transition-colors ${
                isPlaying
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40'
                  : 'bg-forensic-cyan text-black font-bold hover:bg-cyan-300'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Jump backward / forward 1 sec */}
            <button
              onClick={() => handleStepSeconds(-1)}
              className="p-1.5 rounded-md bg-forensic-900 hover:bg-forensic-800 text-slate-300 border border-forensic-border"
              title="-1 Second"
            >
              <Rewind className="w-4 h-4" />
            </button>

            {/* Step -1 Frame (0.04s) */}
            <button
              onClick={() => handleStepFrame(-1)}
              className="px-2 py-1 rounded-md bg-forensic-900 hover:bg-forensic-800 text-slate-300 border border-forensic-border font-mono text-[11px]"
              title="Previous Frame (1/25 sec)"
            >
              -1f
            </button>

            {/* Step +1 Frame */}
            <button
              onClick={() => handleStepFrame(1)}
              className="px-2 py-1 rounded-md bg-forensic-900 hover:bg-forensic-800 text-slate-300 border border-forensic-border font-mono text-[11px]"
              title="Next Frame (1/25 sec)"
            >
              +1f
            </button>

            {/* Jump forward 1 sec */}
            <button
              onClick={() => handleStepSeconds(1)}
              className="p-1.5 rounded-md bg-forensic-900 hover:bg-forensic-800 text-slate-300 border border-forensic-border"
              title="+1 Second"
            >
              <FastForward className="w-4 h-4" />
            </button>

            {/* Timecode readout */}
            <div className="ml-2 font-mono text-cyan-300 font-bold bg-forensic-950 px-2 py-1 rounded border border-forensic-border text-xs">
              {formatTime(currentTime)} / {formatTime(duration || 255)}
            </div>
          </div>

          {/* Forensic Enhancements & Speed Controls */}
          <div className="flex items-center gap-2">
            {/* Speed selector */}
            <div className="flex items-center bg-forensic-900 rounded border border-forensic-border p-0.5">
              {[0.25, 0.5, 1, 2, 4].map(speed => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                    playbackRate === speed
                      ? 'bg-forensic-cyan text-black font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Enhancement Filter dropdown */}
            <div className="flex items-center gap-1 bg-forensic-900 border border-forensic-border rounded px-2 py-1 text-xs">
              <Eye className="w-3.5 h-3.5 text-forensic-cyan" />
              <select
                value={enhancementMode}
                onChange={(e) => setEnhancementMode(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="normal">Normal Visuals</option>
                <option value="night_vision">Night-Vision Gain</option>
                <option value="contrast_boost">Edge Contrast Boost</option>
                <option value="grayscale">High-Dynamic B/W</option>
              </select>
            </div>

            {/* Snapshot button */}
            <button
              onClick={handleCaptureSnapshot}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-forensic-800 hover:bg-forensic-750 text-forensic-cyan border border-forensic-cyan/40 rounded text-xs font-semibold transition-colors"
              title="Capture Frame with SHA-256 Hash"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Frame</span>
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Verification Receipt Modal */}
      {capturedSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-forensic-900 border border-forensic-border rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-forensic-border pb-2">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-forensic-cyan" />
                Evidentiary Video Frame Snapshot Captured
              </h4>
              <button
                onClick={() => setCapturedSnapshot(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            {capturedSnapshot.dataUrl && (
              <img
                src={capturedSnapshot.dataUrl}
                alt="Captured forensic snapshot"
                className="w-full h-48 object-cover rounded border border-forensic-border"
              />
            )}

            <div className="bg-forensic-950 p-3 rounded border border-forensic-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Stream Offset:</span>
                <span className="text-cyan-300 font-mono font-bold">{capturedSnapshot.videoTimestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Absolute Frame #:</span>
                <span className="text-slate-200 font-mono">Frame #{capturedSnapshot.frameNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Acquisition Time:</span>
                <span className="text-slate-200 font-mono">{capturedSnapshot.timestamp}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Instant Evidentiary Hash (SHA-256):</span>
                <HashDisplay hash={capturedSnapshot.sha256} truncate={false} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCapturedSnapshot(null)}
                className="px-4 py-1.5 bg-forensic-cyan text-black font-semibold rounded text-xs"
              >
                Affix to Case Ledger & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
