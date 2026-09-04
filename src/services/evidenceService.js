import { MOCK_EVIDENCE } from '../data/mockEvidence';
import { MOCK_FINDINGS } from '../data/mockFindings';
import { VENDOR_MATRIX } from '../data/mockVendors';
import { appendBlock } from './custodyService';

const API_BASE_URL = 'http://127.0.0.1:8000';

let evidenceStore = [...MOCK_EVIDENCE];
let findingsStore = [...MOCK_FINDINGS];

const delay = (ms = 300) =>
  new Promise(resolve => setTimeout(resolve, ms));


// ==========================================
// GET EVIDENCE BY CASE
// ==========================================

export const getEvidenceByCase = async (caseId) => {
  await delay(250);

  return evidenceStore.filter(
    evidence => String(evidence.caseId) === String(caseId)
  );
};


// ==========================================
// GET EVIDENCE BY ID
// ==========================================

export const getEvidenceById = async (evidenceId) => {
  await delay(200);

  const found = evidenceStore.find(
    evidence => String(evidence.id) === String(evidenceId)
  );

  if (!found) {
    throw new Error(`Evidence item ${evidenceId} not found`);
  }

  return {
    ...found
  };
};


// ==========================================
// VENDOR DETECTION
// ==========================================

export const detectVendor = async (filename, mimeType) => {
  await delay(800);

  const lower = filename.toLowerCase();

  if (
    lower.includes('hik') ||
    lower.includes('ds72') ||
    lower.endsWith('.hsv')
  ) {
    return {
      vendor: VENDOR_MATRIX.find(
        vendor => vendor.id === 'hikvision'
      ),

      confidence: 99.4,

      detectedMagic:
        '48 49 4B 56 49 53 49 4F 4E 5F 48 32 36 34',

      suggestedContainer:
        'HIK-FS v3 / Proprietary Stream',

      estimatedChannels: 4,

      deviceGuess:
        'Hikvision Turbo HD DS-7204 / DS-7208 Series'
    };
  }

  if (
    lower.includes('dahua') ||
    lower.endsWith('.dav') ||
    lower.includes('dhfs')
  ) {
    return {
      vendor: VENDOR_MATRIX.find(
        vendor => vendor.id === 'dahua'
      ),

      confidence: 98.9,

      detectedMagic:
        '44 48 41 56 ("DHAV")',

      suggestedContainer:
        'Dahua DHAV Audio/Video Multiplex',

      estimatedChannels: 4,

      deviceGuess:
        'Dahua WizSense XVR5000 Series'
    };
  }

  if (
    lower.includes('cp') ||
    lower.includes('cpplus') ||
    lower.includes('uvr')
  ) {
    return {
      vendor: VENDOR_MATRIX.find(
        vendor => vendor.id === 'cpplus'
      ),

      confidence: 97.8,

      detectedMagic:
        '43 50 5F 55 56 52 5F 48 44 ("CP_UVR_HD")',

      suggestedContainer:
        'CP Plus Proprietary Bin / Sector Stream',

      estimatedChannels: 4,

      deviceGuess:
        'CP Plus Orange Series UVR-0401/0801'
    };
  }

  if (
    lower.includes('honeywell') ||
    lower.endsWith('.sec')
  ) {
    return {
      vendor: VENDOR_MATRIX.find(
        vendor => vendor.id === 'honeywell'
      ),

      confidence: 99.1,

      detectedMagic:
        '48 4F 4E 45 59 57 45 4C 4C 5F 53 45 43',

      suggestedContainer:
        'Honeywell Secure Video Container',

      estimatedChannels: 2,

      deviceGuess:
        'Honeywell MaxPro NVR'
    };
  }


  // DEFAULT VIDEO DETECTION

  return {
    vendor: {
      id: 'unknown_raw',
      name: 'Standard Video Evidence',
      parserEngine: 'Universal Video Parser'
    },

    confidence: 95.0,

    detectedMagic:
      'Standard MP4 / Video Container',

    suggestedContainer:
      'MP4 / Standard Video Stream',

    estimatedChannels: 1,

    deviceGuess:
      'Uploaded Digital Video Evidence'
  };
};


// ==========================================
// REAL BACKEND EVIDENCE UPLOAD
// ==========================================

export const ingestEvidence = async (
  caseId,
  payload
) => {

  try {

    if (!payload.file) {
      throw new Error(
        'No video file selected'
      );
    }


    const formData = new FormData();

    formData.append(
      'file',
      payload.file
    );


    // Extract numeric case ID
    let numericCaseId = caseId;

    if (typeof caseId === 'string') {

      const numbers =
        caseId.match(/\d+/g);

      if (numbers && numbers.length > 0) {

        numericCaseId =
          parseInt(
            numbers[numbers.length - 1]
          );

      } else {

        numericCaseId = 1;

      }
    }


    console.log(
      'Uploading to backend...',
      numericCaseId
    );


    const response = await fetch(

      `${API_BASE_URL}/evidence/upload?case_id=${numericCaseId}`,

      {
        method: 'POST',
        body: formData
      }

    );


    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        'Backend Upload Error:',
        errorText
      );

      throw new Error(
        `Upload failed: ${errorText}`
      );
    }


    const data =
      await response.json();


    console.log(
      'Backend Response:',
      data
    );


    const metadata =
      data.metadata || {};


    const fileSizeMB =
      (
        payload.file.size /
        (1024 * 1024)
      ).toFixed(2);


    // Create frontend evidence object
    const newEvidence = {

      id: data.evidence_id,

      caseId: data.case_id,

      name: data.file_name,

      originalFilename:
        data.file_name,


      vendor:
        payload.vendorName ||
        'Auto Detected',

      vendorId:
        payload.vendorId ||
        'unknown',


      model:
        payload.modelGuess ||
        'Uploaded Video Evidence',


      firmwareVersion:
        'N/A',


      serialNumber:
        'N/A',


      containerFormat:

        metadata.format ||

        payload.containerFormat ||

        'Standard Video File',


      fileSize:
        `${fileSizeMB} MB`,


      sha256:
        data.sha256_hash,


      blake3:
        'Not Generated',


      ingestTimestamp:
        new Date().toISOString(),


      channelCount:
        1,


      channels: [

        {

          id: 1,

          name:
            'CH-01: Uploaded Video',

          resolution:

            metadata.width &&
            metadata.height

              ? `${metadata.width}x${metadata.height}`

              : 'Auto Detected',


          bitrate:
            'Auto Detected',


          status:
            'Ready'

        }

      ],


      duration:

        metadata.duration

          ? `${metadata.duration} seconds`

          : 'Auto Detected',


      durationSeconds:

        metadata.duration ||

        0,


      recordingStart:
        'N/A',


      recordingEnd:
        'N/A',


      status:
        'Uploaded',


      integrityStatus:
        'Verified',


      parserUsed:
        'FastAPI Forensic Backend',


      // Local browser video URL
      videoUrl:

        URL.createObjectURL(
          payload.file
        ),


      rawMetadata:
        metadata

    };


    // Add to frontend evidence store

    evidenceStore.unshift(
      newEvidence
    );


    // Blockchain custody entry

    try {

      await appendBlock(
        caseId,
        {

          action:
            'EVIDENCE_SEIZURE_INGESTION',

          actionLabel:
            `Evidence Uploaded & SHA-256 Hashed: ${newEvidence.name}`,

          actor:
            'Active Investigator',

          actorRole:
            'Investigator',

          evidenceId:
            newEvidence.id,

          evidenceName:
            newEvidence.name,

          payload: {

            filename:
              newEvidence.originalFilename,

            fileSize:
              newEvidence.fileSize,

            sha256:
              newEvidence.sha256,

            vendor:
              newEvidence.vendor

          }

        }
      );

    } catch (ledgerError) {

      console.warn(
        'Custody ledger error:',
        ledgerError
      );

    }


    return newEvidence;


  } catch (error) {

    console.error(
      'Upload API Error:',
      error
    );

    throw error;

  }

};


// ==========================================
// GET FORENSIC FINDINGS
// ==========================================

export const getFindingsByEvidence =
  async (evidenceId) => {

    await delay(150);

    return findingsStore.filter(

      finding =>
        String(finding.evidenceId) ===
        String(evidenceId)

    );

  };


// ==========================================
// TOGGLE REPORT STATUS
// ==========================================

export const toggleFindingReportStatus =
  async (findingId) => {

    const index =
      findingsStore.findIndex(

        finding =>
          finding.id === findingId

      );


    if (index !== -1) {

      findingsStore[index] = {

        ...findingsStore[index],

        addToReport:

          !findingsStore[index]
            .addToReport

      };


      return {

        ...findingsStore[index]

      };

    }


    throw new Error(
      `Finding ${findingId} not found`
    );

  };


// ==========================================
// REAL BACKEND VIDEO ANALYSIS
// ==========================================

export const analyzeEvidence =
  async (evidenceId) => {

    try {

      console.log(
        'Starting analysis for evidence:',
        evidenceId
      );


      const response =
        await fetch(

          `${API_BASE_URL}/evidence/${evidenceId}/analyze`,

          {
            method: 'POST'
          }

        );


      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          'Analysis backend error:',
          errorText
        );


        throw new Error(
          'Video analysis failed'
        );

      }


      const data =
        await response.json();


      console.log(
        'Analysis result:',
        data
      );


      return data;


    } catch (error) {

      console.error(
        'Analysis API Error:',
        error
      );


      throw error;

    }

  };


// ==========================================
// FORENSIC SCAN
// ==========================================

export const runForensicScan =
  async (evidenceId) => {

    try {

      const analysisResponse =
        await analyzeEvidence(
          evidenceId
        );


      const analysis =
        analysisResponse.analysis;


      const evidence =
        evidenceStore.find(

          item =>
            String(item.id) ===
            String(evidenceId)

        );


      if (!evidence) {

        throw new Error(
          'Evidence not found'
        );

      }


      const newFindings = [];


      // Convert suspicious events into findings

      if (
        analysis.suspicious_events &&
        analysis.suspicious_events.length > 0
      ) {

        analysis.suspicious_events.forEach(

          (event, index) => {

            newFindings.push({

              id:
                `FND-${evidenceId}-${index + 1}`,

              evidenceId:

                evidenceId,


              channelId:
                1,


              channelName:
                'CH-01: Uploaded Video',


              type:
                'AI Suspicious Activity Detection',


              title:
                event.event,


              timestampOffset:

                `Frame ${event.frame}`,


              timecodeReal:

                `Video Frame ${event.frame}`,


              timelinePercentage:

                analysis.frames_analyzed

                  ? (
                      event.frame /
                      analysis.frames_analyzed
                    ) * 100

                  : 0,


              severity:

                event.event
                  .toLowerCase()
                  .includes('loitering')

                    ? 'High'

                    : 'Medium',


              confidenceScore:
                95,


              addToReport:
                true,


              description:

                `AI detected: ${event.event}. Track ID: ${event.track_id}`,



              technicalDetails:

                `Detected at frame ${event.frame} by YOLO AI object tracking system. Track ID: ${event.track_id}.`,



              forensicImpact:

                'Potentially relevant activity identified by automated video forensic analysis.'

            });

          }

        );

      }


      // Add findings to store

      findingsStore = [

        ...findingsStore.filter(

          finding =>
            String(finding.evidenceId) !==
            String(evidenceId)

        ),

        ...newFindings

      ];


      // Update evidence

      if (newFindings.length > 0) {

        evidence.integrityStatus =
          'Anomalies Detected';

        evidence.status =
          'Analysis Complete';

      } else {

        evidence.integrityStatus =
          'No Suspicious Activity';

        evidence.status =
          'Analysis Complete';

      }


      return newFindings;


    } catch (error) {

      console.error(
        'Forensic Scan Error:',
        error
      );

      throw error;

    }

  };