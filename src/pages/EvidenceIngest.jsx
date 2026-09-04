import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dropzone } from '../components/ingest/Dropzone';
import { IngestProgress } from '../components/ingest/IngestProgress';
import { HashDisplay } from '../components/common/HashDisplay';

import {
  HardDriveUpload,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Link2,
  AlertCircle
} from 'lucide-react';

export const EvidenceIngest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const caseId = id || 'CASE-2026-0841';

  const [step, setStep] = useState(1);

  const [selectedFile, setSelectedFile] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [currentTask, setCurrentTask] = useState('');

  const [ingestedEvidence, setIngestedEvidence] = useState(null);

  const [error, setError] = useState('');

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setError('');
    setStep(2);
  };

  const handleStartIngest = async () => {
    if (!selectedFile) {
      setError('Please select a video file first.');
      return;
    }

    setStep(3);
    setUploadProgress(10);
    setCurrentTask('Preparing evidence file for secure upload...');

    try {
      const timer1 = setTimeout(() => {
        setUploadProgress(25);
        setCurrentTask('Uploading evidence to forensic server...');
      }, 300);

      const timer2 = setTimeout(() => {
        setUploadProgress(50);
        setCurrentTask('Extracting video metadata...');
      }, 700);

      const timer3 = setTimeout(() => {
        setUploadProgress(70);
        setCurrentTask('Generating SHA-256 cryptographic hash...');
      }, 1100);

      const timer4 = setTimeout(() => {
        setUploadProgress(85);
        setCurrentTask('Saving evidence record to forensic database...');
      }, 1500);

      // REAL BACKEND UPLOAD
      const formData = new FormData();

      formData.append('file', selectedFile);

      // IMPORTANT:
      // Backend case_id expects an integer.
      // Using 1 for now because our backend database uses numeric case IDs.
      const response = await fetch(
        'http://127.0.0.1:8000/evidence/upload?case_id=1',
        {
          method: 'POST',
          body: formData
        }
      );

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);

      if (!response.ok) {
        throw new Error(
          `Upload failed with status ${response.status}`
        );
      }

      const data = await response.json();

      setUploadProgress(100);
      setCurrentTask(
        'Evidence successfully uploaded and SHA-256 hash generated.'
      );

      // Convert backend response into frontend evidence format
      const evidenceData = {
        id: data.evidence_id,
        caseId: data.case_id,

        name: data.file_name,

        fileName: data.file_name,

        fileType: selectedFile.type,

        fileSize: selectedFile.size,

        sha256: data.sha256_hash,

        metadata: data.metadata,

        status: data.status,

        backendEvidenceId: data.evidence_id
      };

      setIngestedEvidence(evidenceData);

      // Small delay so 100% progress is visible
      setTimeout(() => {
        setStep(4);
      }, 700);

    } catch (err) {
      console.error('Evidence upload error:', err);

      setError(
        'Unable to connect to the forensic backend. Please make sure the backend server is running on port 8000.'
      );

      setStep(2);
    }
  };

  const handleReset = () => {
    setStep(1);

    setSelectedFile(null);

    setUploadProgress(0);

    setCurrentTask('');

    setIngestedEvidence(null);

    setError('');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-xl font-extrabold text-slate-100 uppercase tracking-wide flex items-center gap-2">

            <HardDriveUpload className="w-5 h-5 text-forensic-cyan" />

            Evidence Upload & Forensic Hash Pipeline

          </h1>

          <p className="text-xs text-slate-400 mt-1">

            Upload CCTV or video evidence for metadata extraction,
            cryptographic hashing and AI-powered forensic analysis.

          </p>

        </div>

        <button
          onClick={() => navigate(`/cases/${caseId}`)}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          ← Back to Case
        </button>

      </div>


      {/* ERROR MESSAGE */}

      {error && (

        <div className="bg-red-950/50 border border-red-500/40 rounded-xl p-4 flex items-center gap-3">

          <AlertCircle className="w-5 h-5 text-red-400" />

          <div>

            <div className="font-bold text-red-300 text-sm">

              Upload Error

            </div>

            <div className="text-xs text-red-200 mt-1">

              {error}

            </div>

          </div>

        </div>

      )}


      {/* STEPPER */}

      <div className="bg-forensic-900 border border-forensic-border rounded-xl p-3">

        <div className="grid grid-cols-4 gap-2 text-xs font-mono">

          {[
            {
              num: 1,
              label: '1. Select Video'
            },

            {
              num: 2,
              label: '2. Upload Evidence'
            },

            {
              num: 3,
              label: '3. Hash & Process'
            },

            {
              num: 4,
              label: '4. Evidence Ready'
            }

          ].map((item) => (

            <div
              key={item.num}

              className={`

                p-2.5
                rounded-lg
                border
                text-center
                transition-all

                ${
                  step === item.num

                    ? 'bg-forensic-800 border-forensic-cyan text-forensic-cyan font-bold shadow-glow-cyan'

                    : step > item.num

                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'

                    : 'bg-forensic-950 border-forensic-border text-slate-500'

                }

              `}
            >

              {item.label}

            </div>

          ))}

        </div>

      </div>


      {/* STEP 1 */}

      {step === 1 && (

        <Dropzone
          onSelectFile={handleSelectFile}
        />

      )}


      {/* STEP 2 */}

      {step === 2 && selectedFile && (

        <div className="bg-forensic-900 border border-forensic-border rounded-xl p-6 space-y-5">

          <div>

            <h2 className="text-sm font-bold text-slate-100">

              Selected Evidence File

            </h2>

            <p className="text-xs text-slate-400 mt-1">

              The selected video will be uploaded to the forensic backend.

            </p>

          </div>


          <div className="bg-forensic-950 border border-forensic-border rounded-lg p-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

              <div>

                <span className="text-slate-500">

                  File Name

                </span>

                <p className="text-slate-200 font-medium mt-1 break-all">

                  {selectedFile.name}

                </p>

              </div>


              <div>

                <span className="text-slate-500">

                  File Type

                </span>

                <p className="text-cyan-300 font-mono mt-1">

                  {selectedFile.type || 'Unknown'}

                </p>

              </div>


              <div>

                <span className="text-slate-500">

                  File Size

                </span>

                <p className="text-slate-200 mt-1">

                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB

                </p>

              </div>


              <div>

                <span className="text-slate-500">

                  Processing

                </span>

                <p className="text-emerald-400 mt-1">

                  Metadata + SHA-256 + Database Storage

                </p>

              </div>

            </div>

          </div>


          <div className="flex items-center justify-between">

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200"
            >

              <RotateCcw className="w-4 h-4" />

              Select Different Video

            </button>


            <button
              onClick={handleStartIngest}
              className="flex items-center gap-2 px-5 py-2 bg-forensic-cyan text-black font-bold rounded-lg hover:bg-cyan-300 text-xs shadow-glow-cyan"
            >

              Upload & Generate Hash

              <ArrowRight className="w-4 h-4" />

            </button>

          </div>

        </div>

      )}


      {/* STEP 3 */}

      {step === 3 && (

        <IngestProgress

          progress={uploadProgress}

          stageText="Forensic Evidence Processing"

          currentTask={currentTask}

        />

      )}


      {/* STEP 4 */}

      {step === 4 && ingestedEvidence && (

        <div className="bg-forensic-900 border border-emerald-500/40 rounded-xl p-6 space-y-6">

          {/* SUCCESS HEADER */}

          <div className="flex items-center gap-4 border-b border-forensic-border pb-5">

            <div className="w-14 h-14 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center">

              <ShieldCheck className="w-8 h-8 text-emerald-400" />

            </div>


            <div>

              <div className="text-xs font-mono text-emerald-400 uppercase font-bold">

                Evidence Successfully Secured

              </div>

              <h2 className="text-lg font-bold text-slate-100 mt-1">

                {ingestedEvidence.name}

              </h2>

            </div>

          </div>


          {/* EVIDENCE DETAILS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-forensic-950 border border-forensic-border rounded-lg p-4">

              <span className="text-[10px] font-mono text-slate-500 uppercase">

                Evidence ID

              </span>

              <p className="text-cyan-300 font-mono font-bold mt-1">

                {ingestedEvidence.id}

              </p>

            </div>


            <div className="bg-forensic-950 border border-forensic-border rounded-lg p-4">

              <span className="text-[10px] font-mono text-slate-500 uppercase">

                Evidence Status

              </span>

              <p className="text-emerald-400 font-bold mt-1">

                {ingestedEvidence.status}

              </p>

            </div>


            <div className="bg-forensic-950 border border-forensic-border rounded-lg p-4">

              <span className="text-[10px] font-mono text-slate-500 uppercase">

                Video Duration

              </span>

              <p className="text-slate-200 mt-1">

                {ingestedEvidence.metadata?.duration_seconds
                  ? `${ingestedEvidence.metadata.duration_seconds} seconds`
                  : 'Metadata extracted successfully'}

              </p>

            </div>


            <div className="bg-forensic-950 border border-forensic-border rounded-lg p-4">

              <span className="text-[10px] font-mono text-slate-500 uppercase">

                Processing Result

              </span>

              <p className="text-emerald-400 mt-1">

                Ready for AI Video Analysis

              </p>

            </div>

          </div>


          {/* SHA 256 */}

          <div className="bg-forensic-950 border border-forensic-border rounded-lg p-4 space-y-3">

            <div className="flex items-center gap-2">

              <Link2 className="w-4 h-4 text-forensic-cyan" />

              <span className="text-xs font-mono text-slate-400 uppercase">

                SHA-256 Evidence Integrity Hash

              </span>

            </div>


            <HashDisplay
              hash={ingestedEvidence.sha256}
              truncate={false}
            />

          </div>


          {/* METADATA */}

          {ingestedEvidence.metadata && (

            <div className="bg-forensic-950 border border-forensic-border rounded-lg p-4">

              <h3 className="text-xs font-bold text-slate-200 mb-3">

                Extracted Video Metadata

              </h3>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">

                {Object.entries(
                  ingestedEvidence.metadata
                ).map(([key, value]) => (

                  <div
                    key={key}
                    className="border border-forensic-border rounded p-2"
                  >

                    <span className="text-slate-500 text-[10px] uppercase">

                      {key.replace(/_/g, ' ')}

                    </span>

                    <p className="text-slate-200 mt-1 break-all">

                      {String(value)}

                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}


          {/* ACTION BUTTONS */}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-forensic-850 hover:bg-forensic-800 text-slate-300 rounded-lg text-xs"
            >

              Upload Another Video

            </button>


            <button
              onClick={() =>

                navigate(
                  `/cases/${caseId}/evidence/${ingestedEvidence.id}`
                )

              }

              className="flex items-center gap-2 px-6 py-2.5 bg-forensic-cyan text-black font-bold rounded-lg hover:bg-cyan-300 text-xs shadow-glow-cyan"
            >

              Launch AI Analysis

              <ArrowRight className="w-4 h-4" />

            </button>

          </div>

        </div>

      )}

    </div>
  );
};