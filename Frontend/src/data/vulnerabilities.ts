export type VulnerabilitySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type VulnerabilityStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ACCEPTED';
export type PatchStatus = 'OPEN' | 'PATCHING' | 'PATCHED' | 'VERIFIED';

export interface VulnerabilityRecord {
  id: string;
  assetId: string;
  assetIdentifier: string;
  assetName: string;
  vulnerabilityIdentifier: string;
  title: string;
  description: string;
  severity: VulnerabilitySeverity;
  status: VulnerabilityStatus;
  affectedComponent: string;
  detectedAt: string;
  dueDate?: string;
  remediation?: string;
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  cveRecordId?: string;
  cveId?: string;
  patchStatus?: PatchStatus;
  patchStartedAt?: string;
  patchCompletedAt?: string;
  verificationDate?: string;
  patchVersion?: string;
  verificationNotes?: string;
  assignedRemediationOwner?: string;
}

export const vulnerabilitySeverities: VulnerabilitySeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
export const vulnerabilityStatuses: VulnerabilityStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'ACCEPTED'];
export const patchStatuses: PatchStatus[] = ['OPEN', 'PATCHING', 'PATCHED', 'VERIFIED'];