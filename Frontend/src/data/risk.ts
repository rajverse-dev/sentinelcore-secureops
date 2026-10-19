import { VulnerabilitySeverity } from './vulnerabilities';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RiskAssessmentRecord {
  assetId: string;
  assetIdentifier: string;
  assetName: string;
  assetRiskLevel: RiskLevel;
  environment: string;
  riskScore: number;
  riskCategory: RiskLevel;
  openVulnerabilityCount: number;
  highestCvssScore: number;
  highestSeverity: VulnerabilitySeverity;
  vulnerabilityImpact?: number;
  openVulnerabilityPressure?: number;
  assetContextScore?: number;
}

export interface CveRecord {
  id: string;
  cveId: string;
  cvssScore: number;
  severity: VulnerabilitySeverity;
  description: string;
  affectedSoftware: string;
  affectedVersion?: string;
  remediation?: string;
  references?: string;
  publishedAt?: string;
  lastModifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const riskLevels: RiskLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
