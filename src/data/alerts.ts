export type AlertSeverity = 'Critical' | 'Warning' | 'Info' | 'Resolved';

export interface AlertRecord {
  id: string;
  asset: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  createdAt: string;
}

export const alertData: AlertRecord[] = [
  { id: 'ALT-401', asset: 'DB-SRV-12', type: 'CPU', severity: 'Critical', message: 'CPU reached 94% and triggered autoscaling.', status: 'Open', createdAt: '2026-08-31T09:20:00Z' },
  { id: 'ALT-402', asset: 'APP-SRV-47', type: 'Disk', severity: 'Warning', message: 'Disk utilization is 91% on the application node.', status: 'Investigating', createdAt: '2026-08-31T08:42:00Z' },
  { id: 'ALT-403', asset: 'NET-DEV-03', type: 'Latency', severity: 'Info', message: 'Network latency increased to 180ms during peak load.', status: 'Resolved', createdAt: '2026-08-31T07:55:00Z' }
];
