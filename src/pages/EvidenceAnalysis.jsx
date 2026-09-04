import React, { useState } from "react";

import {
  Video,
  Users,
  Car,
  Clock,
  RotateCw,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export const EvidenceAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  // Actual backend evidence ID
  const evidenceId = 4;

  const handleAnalyze = async () => {
    try {
      setIsScanning(true);
      setError("");
      setAnalysis(null);

      // REAL BACKEND API CALL
      const response = await fetch(
        `http://127.0.0.1:8000/evidence/${evidenceId}/analyze`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Backend analysis failed");
      }

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      // Backend response has analysis inside it
      setAnalysis(data.analysis);

    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the AI analysis backend."
      );

    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">

      {/* HEADER */}

      <div className="bg-forensic-900 border border-forensic-border rounded-xl p-5 shadow-xl">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-xl bg-forensic-850 border border-forensic-cyan/40 flex items-center justify-center">

              <Video className="w-7 h-7 text-forensic-cyan" />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-white">

                Video Evidence Analysis

              </h1>

              <p className="text-sm text-slate-400 mt-1">

                Evidence ID: {evidenceId}

              </p>

              <p className="text-sm text-slate-400">

                Status: {analysis ? "Analysis Complete" : "Ready for Analysis"}

              </p>

            </div>

          </div>


          <button
            onClick={handleAnalyze}
            disabled={isScanning}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-forensic-cyan text-black font-bold rounded-xl hover:bg-cyan-300 disabled:opacity-50 text-lg"
          >

            <RotateCw
              className={`w-6 h-6 ${
                isScanning ? "animate-spin" : ""
              }`}
            />

            {isScanning
              ? "AI Analysis Running..."
              : "Run AI Analysis"}

          </button>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="bg-red-950/50 border border-red-500 rounded-xl p-5 text-red-300">

          <strong>Analysis Error:</strong> {error}

        </div>

      )}


      {/* READY STATE */}

      {!analysis && !isScanning && !error && (

        <div className="bg-forensic-900 border border-forensic-border rounded-xl p-12 text-center">

          <Video className="w-16 h-16 text-forensic-cyan mx-auto mb-5" />

          <h2 className="text-xl font-bold text-white">

            AI Video Analysis Ready

          </h2>

          <p className="text-slate-400 mt-3">

            Click "Run AI Analysis" to analyze the evidence
            using YOLO object detection.

          </p>

        </div>

      )}


      {/* LOADING */}

      {isScanning && (

        <div className="bg-forensic-900 border border-forensic-border rounded-xl p-12 text-center">

          <RotateCw className="w-16 h-16 animate-spin text-forensic-cyan mx-auto mb-5" />

          <h2 className="text-xl font-bold text-white">

            Analyzing Video Evidence...

          </h2>

          <p className="text-slate-400 mt-3">

            YOLO AI is detecting persons, vehicles and suspicious activities.

          </p>

        </div>

      )}


      {/* RESULTS */}

      {analysis && (

        <>

          {/* METRICS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


            <div className="bg-forensic-900 border border-forensic-border rounded-xl p-6">

              <div className="flex items-center gap-4">

                <Users className="w-8 h-8 text-cyan-400" />

                <div>

                  <p className="text-sm text-slate-400">

                    Person Detections

                  </p>

                  <p className="text-4xl font-bold text-white mt-1">

                    {analysis.total_person_detections || 0}

                  </p>

                </div>

              </div>

            </div>


            <div className="bg-forensic-900 border border-forensic-border rounded-xl p-6">

              <div className="flex items-center gap-4">

                <Car className="w-8 h-8 text-yellow-400" />

                <div>

                  <p className="text-sm text-slate-400">

                    Vehicle Detections

                  </p>

                  <p className="text-4xl font-bold text-white mt-1">

                    {analysis.total_vehicle_detections || 0}

                  </p>

                </div>

              </div>

            </div>


            <div className="bg-forensic-900 border border-forensic-border rounded-xl p-6">

              <div className="flex items-center gap-4">

                <Video className="w-8 h-8 text-purple-400" />

                <div>

                  <p className="text-sm text-slate-400">

                    Frames Analyzed

                  </p>

                  <p className="text-4xl font-bold text-white mt-1">

                    {analysis.frames_analyzed || 0}

                  </p>

                </div>

              </div>

            </div>


            <div className="bg-forensic-900 border border-forensic-border rounded-xl p-6">

              <div className="flex items-center gap-4">

                <Clock className="w-8 h-8 text-green-400" />

                <div>

                  <p className="text-sm text-slate-400">

                    Video Duration

                  </p>

                  <p className="text-4xl font-bold text-white mt-1">

                    {analysis.video_duration_seconds || 0}s

                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* DETECTED OBJECTS */}

          <div className="bg-forensic-900 border border-forensic-border rounded-xl p-6">

            <h2 className="text-xl font-bold text-white mb-5">

              Detected Objects

            </h2>

            <div className="flex flex-wrap gap-3">

              {analysis.detected_objects?.length > 0 ? (

                analysis.detected_objects.map((object, index) => (

                  <div
                    key={index}
                    className="px-5 py-3 bg-forensic-850 border border-forensic-cyan/40 rounded-lg text-cyan-300 font-bold"
                  >

                    {object}

                  </div>

                ))

              ) : (

                <p className="text-slate-400">

                  No objects detected

                </p>

              )}

            </div>

          </div>


          {/* SUSPICIOUS EVENTS */}

          <div className="bg-forensic-900 border border-forensic-border rounded-xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <ShieldAlert className="w-7 h-7 text-red-400" />

              <h2 className="text-xl font-bold text-white">

                Suspicious Events

              </h2>

              <span className="ml-auto bg-red-950 text-red-300 px-4 py-2 rounded-lg font-bold">

                {analysis.suspicious_events?.length || 0} Events

              </span>

            </div>


            {!analysis.suspicious_events ||
            analysis.suspicious_events.length === 0 ? (

              <div className="text-center py-10">

                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />

                <p className="text-slate-400">

                  No suspicious activities detected.

                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {analysis.suspicious_events.map(
                  (event, index) => (

                    <div
                      key={index}
                      className="bg-forensic-950 border border-forensic-border rounded-xl p-5"
                    >

                      <div className="flex gap-4">

                        <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />

                        <div>

                          <h3 className="font-bold text-white text-lg">

                            {event.event}

                          </h3>

                          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">

                            <span>

                              Frame:
                              <strong className="text-cyan-300 ml-1">

                                {event.frame}

                              </strong>

                            </span>


                            <span>

                              Track ID:
                              <strong className="text-cyan-300 ml-1">

                                {event.track_id}

                              </strong>

                            </span>


                            {event.object && (

                              <span>

                                Object:
                                <strong className="text-cyan-300 ml-1">

                                  {event.object}

                                </strong>

                              </span>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* POTENTIAL OBSTACLES */}

          <div className="bg-forensic-900 border border-forensic-border rounded-xl p-6">

            <h2 className="text-xl font-bold text-white mb-4">

              Potential Obstacles

            </h2>


            {analysis.potential_obstacles?.length > 0 ? (

              <div className="space-y-3">

                {analysis.potential_obstacles.map(
                  (obstacle, index) => (

                    <div
                      key={index}
                      className="p-4 bg-yellow-950/30 border border-yellow-500/30 rounded-lg text-yellow-300"
                    >

                      {JSON.stringify(obstacle)}

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="text-slate-400">

                No potential obstacles detected.

              </p>

            )}

          </div>

        </>

      )}

    </div>
  );
};