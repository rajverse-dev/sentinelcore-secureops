export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'NEW' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';

export interface IncidentRecord {
  id: string;
  incidentIdentifier: string;
  assetId?: string;
  assetIdentifier?: string;
  assetName?: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedTeam?: string;
  assignedUser?: string;
  detectedAt: string;
  slaDueAt?: string;
  slaBreached: boolean;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface IncidentRequest {
  incidentIdentifier: string;
  assetId?: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  assignedTeam?: string;
  assignedUser?: string;
  detectedAt?: string;
  slaDueAt?: string;
}