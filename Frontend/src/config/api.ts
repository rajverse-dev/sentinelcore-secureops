export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const endpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  assets: '/api/assets',
  vulnerabilities: '/api/vulnerabilities',
  cves: '/api/cves',
  riskAssessments: '/api/risk-assessments',
  riskReports: '/api/risk-reports',
  alerts: '/api/alerts',
  incidents: '/api/incidents',
  audit: '/api/audit',
  compliance: '/api/compliance',
  securityReviews: '/api/security-reviews',
  monitoring: '/api/monitoring',
  scans: '/api/scans',
  users: '/api/users'
};

