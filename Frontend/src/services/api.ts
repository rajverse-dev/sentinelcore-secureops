import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, endpoints } from '../config/api';
import { storage } from '../utils/storage';
import { RegisterRequest } from '../types/auth';
import { IncidentRequest } from '../data/incidents';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers = new AxiosHeaders(config.headers);
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isAuthEndpoint = error.config?.url?.includes('/api/auth');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      storage.clear();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (payload: Record<string, string>) => api.post(endpoints.login, payload),
  register: (payload: RegisterRequest) => api.post(endpoints.register, payload)
};

export const assetApi = {
  getAssets: () => api.get(endpoints.assets),
  getAsset: (id: string) => api.get(`${endpoints.assets}/${id}`),
  createAsset: (payload: Record<string, unknown>) => api.post(endpoints.assets, payload),
  updateAsset: (id: string, payload: Record<string, unknown>) => api.put(`${endpoints.assets}/${id}`, payload),
  deleteAsset: (id: string) => api.delete(`${endpoints.assets}/${id}`),
  searchAssets: (name: string) => api.get(`${endpoints.assets}/search`, { params: { name } }),
  getAssetsByStatus: (status: string) => api.get(`${endpoints.assets}/status/${status}`),
  getAssetsByRisk: (riskLevel: string) => api.get(`${endpoints.assets}/risk/${riskLevel}`)
};

export const vulnerabilityApi = {
  getVulnerabilities: () => api.get(endpoints.vulnerabilities),
  getVulnerability: (id: string) => api.get(`${endpoints.vulnerabilities}/${id}`),
  getVulnerabilitiesByAsset: (assetId: string) => api.get(`${endpoints.vulnerabilities}/asset/${assetId}`),
  getVulnerabilitiesBySeverity: (severity: string) => api.get(`${endpoints.vulnerabilities}/severity/${severity}`),
  getVulnerabilitiesByStatus: (status: string) => api.get(`${endpoints.vulnerabilities}/status/${status}`),
  createVulnerability: (payload: Record<string, unknown>) => api.post(endpoints.vulnerabilities, payload),
  updateVulnerability: (id: string, payload: Record<string, unknown>) => api.put(`${endpoints.vulnerabilities}/${id}`, payload),
  updateStatus: (id: string, status: string) => api.patch(`${endpoints.vulnerabilities}/${id}/status`, { status }),
  deleteVulnerability: (id: string) => api.delete(`${endpoints.vulnerabilities}/${id}`)
};

export const riskApi = {
  getRiskAssessments: () => api.get(endpoints.riskAssessments),
  getAssetRiskAssessment: (assetId: string) => api.get(`${endpoints.assets}/${assetId}/risk-assessment`)
};

export const cveApi = {
  getCves: () => api.get(endpoints.cves),
  getCve: (id: string) => api.get(`${endpoints.cves}/${id}`),
  getCveByCveId: (cveId: string) => api.get(`${endpoints.cves}/cve-id/${cveId}`),
  getCvesBySeverity: (severity: string) => api.get(`${endpoints.cves}/severity/${severity}`),
  searchCves: (query: string) => api.get(`${endpoints.cves}/search`, { params: { query } }),
  createCve: (data: any) => api.post(endpoints.cves, data),
  updateCve: (id: string, data: any) => api.put(`${endpoints.cves}/${id}`, data),
  deleteCve: (id: string) => api.delete(`${endpoints.cves}/${id}`),
  getVulnerabilitiesForCve: (id: string) => api.get(`${endpoints.cves}/${id}/vulnerabilities`)
};

export const alertApi = {
  getAlerts: () => api.get(endpoints.alerts)
};

export const incidentApi = {
  getIncidents: (params?: { status?: string; severity?: string }) =>
    api.get(endpoints.incidents, { params }),
  getIncident: (id: string) => api.get(`${endpoints.incidents}/${id}`),
  createIncident: (payload: IncidentRequest) => api.post(endpoints.incidents, payload),
  updateIncident: (id: string, payload: IncidentRequest) => api.put(`${endpoints.incidents}/${id}`, payload),
  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`${endpoints.incidents}/${id}/status`, { status, notes }),
  getHistory: (id: string) => api.get(`${endpoints.incidents}/${id}/history`)
};

export const auditApi = {
  getLogs: (query?: string, page = 0, size = 25) => api.get(endpoints.audit, { params: { query, page, size } }),
  search: (params?: Record<string, unknown>) => api.get(`${endpoints.audit}/search`, { params }),
  getSummary: () => api.get(`${endpoints.audit}/summary`),
  getIntegrity: () => api.get(`${endpoints.audit}/integrity`),
  getByUser: (userId: string, page = 0, size = 25) => api.get(`${endpoints.audit}/users/${userId}`, { params: { page, size } }),
  getByEntity: (entityType: string, entityId: string, page = 0, size = 25) =>
    api.get(`${endpoints.audit}/entity/${entityType}/${entityId}`, { params: { page, size } })
};

export const complianceApi = {
  getFrameworks: () => api.get(`${endpoints.compliance}/frameworks`),
  getControls: (frameworkId?: string) => api.get(`${endpoints.compliance}/controls`, { params: { frameworkId } }),
  getControl: (id: string) => api.get(`${endpoints.compliance}/controls/${id}`),
  updateStatus: (id: string, status: string, owner?: string) =>
    api.patch(`${endpoints.compliance}/controls/${id}/status`, { status, owner }),
  getEvidence: (controlId: string) => api.get(`${endpoints.compliance}/controls/${controlId}/evidence`),
  addEvidence: (controlId: string, payload: { evidenceType: string; description: string; reference?: string; status?: string }) =>
    api.post(`${endpoints.compliance}/controls/${controlId}/evidence`, payload),
  getGapAnalysis: (frameworkId: string) => api.get(`${endpoints.compliance}/frameworks/${frameworkId}/gap-analysis`),
  getSummary: (frameworkId: string) => api.get(`${endpoints.compliance}/summary/${frameworkId}`)
};

export const securityReviewApi = {
  getReviews: () => api.get(endpoints.securityReviews),
  getReview: (id: string) => api.get(`${endpoints.securityReviews}/${id}`),
  createReview: (payload: Record<string, unknown>) => api.post(endpoints.securityReviews, payload),
  updateReview: (id: string, payload: Record<string, unknown>) => api.put(`${endpoints.securityReviews}/${id}`, payload),
  approve: (id: string, comments?: string) => api.post(`${endpoints.securityReviews}/${id}/approve`, null, { params: { comments } }),
  reject: (id: string, reason?: string) => api.post(`${endpoints.securityReviews}/${id}/reject`, null, { params: { reason } })
};

export const reportApi = {
  getCurrentReport: () => api.get(`${endpoints.riskReports}/current`),
  exportReport: (format: 'markdown' | 'json' = 'markdown') =>
    api.get(`${endpoints.riskReports}/export`, {
      params: { format },
      responseType: 'blob'
    }),
  getAccessReport: (from?: string, to?: string) => api.get('/api/reports/access', { params: { from, to } }),
  getSecurityReport: () => api.get('/api/reports/security'),
  getComplianceReport: (frameworkId: string) => api.get(`/api/reports/compliance/${frameworkId}`),
  exportComplianceCsv: (frameworkId: string) =>
    api.get(`/api/reports/compliance/${frameworkId}/export`, { params: { format: 'csv' }, responseType: 'blob' }),
  exportCompliancePdf: (frameworkId: string) =>
    api.get(`/api/reports/compliance/${frameworkId}/export`, { params: { format: 'pdf' }, responseType: 'blob' }),
  exportAccessPdf: (from?: string, to?: string) =>
    api.get('/api/reports/access/export', { params: { from, to, format: 'pdf' }, responseType: 'blob' }),
  exportSecurityPdf: () =>
    api.get('/api/reports/security/export', { params: { format: 'pdf' }, responseType: 'blob' })
};

export const getSseStreamUrl = () => {
  const token = storage.getToken();
  const base = `${api.defaults.baseURL || ''}/api/events/stream`;
  return token ? `${base}?token=${encodeURIComponent(token)}` : base;
};



export const monitoringApi = {
  getOverview: () => api.get(endpoints.monitoring)
};

export interface TrivyScanRequest {
  assetId: string;
  scanTarget?: string;
  trivyJson?: string;
}

export interface TrivyFinding {
  vulnerabilityId: string;
  cveId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affectedComponent: string;
  installedVersion: string;
  fixedVersion: string;
  created: boolean;
  title?: string;
  description?: string;
  cvssScore?: number;
  remediation?: string;
  references?: string;
}

export interface TrivyScanSummary {
  assetId: string;
  assetIdentifier: string;
  scanTarget: string;
  status?: string;
  scannedAt?: string;
  parsedFindings: number;
  createdFindings: number;
  updatedFindings: number;
  duplicateFindingsPrevented: number;
  criticalCount?: number;
  highCount?: number;
  mediumCount?: number;
  lowCount?: number;
  riskAssessment: {
    assetId?: string;
    assetIdentifier?: string;
    assetName?: string;
    riskScore: number;
    riskCategory: string;
    openVulnerabilities: number;
    highestCvss: number;
    highestSeverity: string;
    environment: string;
    assetRiskLevel?: string;
    criticalFindingsRatio?: number;
    resolvedPatchesRatio?: number;
    overallHealthScore?: number;
  };
  findings: TrivyFinding[];
}

export const scanApi = {
  runTrivyScan: (payload: TrivyScanRequest) => api.post<TrivyScanSummary>(`${endpoints.scans}/trivy`, payload)
};

export default api;
