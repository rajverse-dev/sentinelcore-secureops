import { VulnerabilitySeverity, VulnerabilityStatus, PatchStatus } from './vulnerabilities';
import { RiskAssessmentRecord, CveRecord, RiskLevel } from './risk';

export interface RemediationItemRecord {
  vulnerabilityId: string;
  assetId: string;
  assetIdentifier: string;
  assetName: string;
  vulnerabilityIdentifier: string;
  title: string;
  severity: VulnerabilitySeverity;
  status: VulnerabilityStatus;
  patchStatus: PatchStatus;
  affectedComponent: string;
  remediation?: string;
  dueDate?: string;
  assignedRemediationOwner?: string;
  cveId?: string;
  patchVersion?: string;
  detectedAt?: string;
}

export interface SonarQubeFindingRecord {
  id: string;
  assetId?: string;
  assetIdentifier?: string;
  issueKey: string;
  rule: string;
  severity: VulnerabilitySeverity;
  message: string;
  component: string;
  lineNumber?: number;
  status: string;
  projectKey: string;
  sonarCreatedAt?: string;
  sonarUpdatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RiskReportRecord {
  reportId: string;
  generatedAt: string;
  generatedBy: string;
  scope: string;
  executiveSummary: string;
  overallRiskScore: number;
  overallRiskCategory: RiskLevel;

  totalAssetsAssessed: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  openVulnerabilities: number;
  patchedVulnerabilities: number;
  pendingPatches: number;

  highestCvssScore?: number;
  averageCvssScore?: number;

  highestRiskAssets: RiskAssessmentRecord[];
  cveRecords: CveRecord[];
  pendingRemediations: RemediationItemRecord[];
  sonarQubeFindings: SonarQubeFindingRecord[];
  trivyFindingsCount: number;
}