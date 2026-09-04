import { apiRequest } from './api';


// Convert backend case data into the format
// already expected by the React frontend.
const mapCaseFromBackend = (backendCase) => ({
  id: backendCase.id,

  // Frontend naming
  firNumber: backendCase.fir_number,
  title: backendCase.case_name,

  policeStation: backendCase.police_station,
  jurisdiction: backendCase.jurisdiction,

  investigatingOfficer: backendCase.investigating_officer,
  forensicExaminer: backendCase.forensic_examiner,

  incidentDate: backendCase.incident_date,
  dateOpened: backendCase.date_opened,

  priority: backendCase.priority,
  status: backendCase.status,

  summary: backendCase.description,

  // These will come from the Evidence API later.
  evidenceCount: 0,
  tamperFlagsCount: 0,

  // Keep this so the existing UI does not break.
  tags: [],
});


// GET ALL CASES
export const getCases = async (
  searchQuery = '',
  statusFilter = 'ALL'
) => {

  const data = await apiRequest('/cases/');

  let cases = data.map(mapCaseFromBackend);

  // Frontend search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();

    cases = cases.filter((c) =>
      c.firNumber.toLowerCase().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      c.policeStation.toLowerCase().includes(query) ||
      c.investigatingOfficer.toLowerCase().includes(query)
    );
  }

  // Frontend status filter
  if (statusFilter !== 'ALL') {
    cases = cases.filter(
      (c) => c.status === statusFilter
    );
  }

  return cases;
};


// GET ONE CASE
export const getCaseById = async (id) => {

  const data = await apiRequest(`/cases/${id}`);

  if (data.message === 'Case not found') {
    throw new Error(`Case with ID ${id} not found`);
  }

  return mapCaseFromBackend(data);
};


// CREATE CASE
export const createCase = async (newCaseData) => {

  const data = await apiRequest('/cases/', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      fir_number: newCaseData.firNumber,
      case_name: newCaseData.title,
      description: newCaseData.summary,

      police_station: newCaseData.policeStation,
      jurisdiction: newCaseData.jurisdiction,

      investigating_officer:
        newCaseData.investigatingOfficer,

      forensic_examiner:
        newCaseData.forensicExaminer,

      incident_date: newCaseData.incidentDate,
      date_opened: newCaseData.dateOpened,

      priority: newCaseData.priority,
    }),
  });

  return mapCaseFromBackend(data);
};


// UPDATE CASE
export const updateCaseStatus = async (
  id,
  status
) => {

  const data = await apiRequest(`/cases/${id}`, {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      status: status,
    }),
  });

  return mapCaseFromBackend(data);
};