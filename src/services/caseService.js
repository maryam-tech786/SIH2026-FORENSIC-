import { MOCK_CASES } from '../data/mockCases';

// In-memory state during session
let casesStore = [...MOCK_CASES];

const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));

export const getCases = async (searchQuery = '', statusFilter = 'ALL') => {
  await delay(250);
  return casesStore.filter(c => {
    const matchesSearch =
      c.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.policeStation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.investigatingOfficer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
};

export const getCaseById = async (id) => {
  await delay(200);
  const found = casesStore.find(c => c.id === id);
  if (!found) throw new Error(`Case with ID ${id} not found`);
  return { ...found };
};

export const createCase = async (newCaseData) => {
  await delay(500);
  const newId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const created = {
    id: newId,
    firNumber: newCaseData.firNumber || `FIR No. ${Math.floor(100 + Math.random() * 900)}/2026`,
    title: newCaseData.title,
    policeStation: newCaseData.policeStation,
    jurisdiction: newCaseData.jurisdiction || 'New Delhi',
    investigatingOfficer: newCaseData.investigatingOfficer || 'Insp. Rajesh Kumar (DL-8821)',
    forensicExaminer: newCaseData.forensicExaminer || 'Dr. Sunita Rao (SSO Digital Forensics)',
    dateOpened: new Date().toISOString().split('T')[0],
    incidentDate: newCaseData.incidentDate || new Date().toISOString().replace('T', ' ').slice(0, 19),
    status: 'Open',
    priority: newCaseData.priority || 'Medium',
    evidenceCount: 0,
    tamperFlagsCount: 0,
    summary: newCaseData.summary || 'Initial seizure registered for forensic examination.',
    tags: newCaseData.tags || ['Initial Seizure', 'CCTV DVR'],
  };
  casesStore.unshift(created);
  return created;
};

export const updateCaseStatus = async (id, status) => {
  await delay(300);
  const index = casesStore.findIndex(c => c.id === id);
  if (index !== -1) {
    casesStore[index] = { ...casesStore[index], status };
    return { ...casesStore[index] };
  }
  throw new Error(`Case ${id} not found`);
};
