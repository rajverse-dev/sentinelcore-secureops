export const dashboardStats = [
  { label: 'Assets Monitored', value: '2,847' },
  { label: 'Uptime', value: '99.99%' },
  { label: 'Active Alerts', value: '12' },
  { label: 'CPU', value: '23%' },
  { label: 'Memory', value: '47%' },
  { label: 'Disk', value: '67%' },
  { label: 'Network', value: '12%' }
];

export const healthSummary = [
  { label: 'Servers', healthy: 148, warning: 11, critical: 3 },
  { label: 'Cloud resources', healthy: 820, warning: 15, critical: 2 },
  { label: 'Network devices', healthy: 260, warning: 14, critical: 6 }
];

export const alertExamples = [
  { id: 'DB-SRV-12', message: 'CPU 94%', severity: 'Critical', status: 'Auto-scaled' },
  { id: 'APP-SRV-47', message: 'Disk 91%', severity: 'Warning', status: 'Monitoring' },
  { id: 'NET-DEV-03', message: 'Latency spike 180ms', severity: 'Warning', status: 'Investigating' }
];
