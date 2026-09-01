export const dashboardStats = [
  { label: 'Assets Monitored', value: '2,847', trend: '+2.4%', trendTime: 'this week', icon: '📊' },
  { label: 'Uptime', value: '99.99%', trend: '+0.01%', trendTime: 'this month', icon: '✅' },
  { label: 'Active Alerts', value: '12', trend: '-3', trendTime: 'from yesterday', icon: '⚠️' },
  { label: 'Healthy Assets', value: '2,823', trend: '+5', trendTime: 'this week', icon: '💚' },
  { label: 'Warning Assets', value: '10', trend: '-1', trendTime: 'from yesterday', icon: '⚡' },
  { label: 'Critical Assets', value: '14', trend: '+2', trendTime: 'from yesterday', icon: '🔴' },
  { label: 'CPU Usage', value: '23%', trend: '-2%', trendTime: 'average', icon: '⚙️' },
  { label: 'Memory Usage', value: '47%', trend: '+1%', trendTime: 'average', icon: '🧠' }
];

export const healthSummary = [
  { label: 'Servers', healthy: 1235, warning: 10, critical: 2, total: 1247 },
  { label: 'Cloud resources', healthy: 820, warning: 15, critical: 12, total: 847 },
  { label: 'Network devices', healthy: 730, warning: 15, critical: 8, total: 753 }
];

export const alertExamples = [
  { id: 'DB-SRV-12', message: 'CPU 94%', severity: 'Critical', status: 'Auto-scaled' },
  { id: 'APP-SRV-47', message: 'Disk 91%', severity: 'Warning', status: 'Monitoring' },
  { id: 'NET-DEV-03', message: 'Latency spike 180ms', severity: 'Warning', status: 'Investigating' }
];

export const infrastructureHealthStats = {
  servers: { total: 1247, healthy: 1235, warning: 10, critical: 2 },
  cloud: { total: 847, healthy: 820, warning: 15, critical: 12 },
  network: { total: 753, healthy: 730, warning: 15, critical: 8 }
};

export const assetHealthDistribution = {
  healthy: 2785,
  warning: 40,
  critical: 22
};

export const quickSnapshotMetrics = [
  { label: 'System Availability', value: '99.99%', status: 'Healthy', icon: '⬆️' },
  { label: 'Network Health', value: '98.7%', status: 'Healthy', icon: '🌐' },
  { label: 'Cloud Health', value: '97.8%', status: 'Healthy', icon: '☁️' },
  { label: 'Automation Coverage', value: '87%', status: 'Healthy', icon: '🤖' },
  { label: 'Resource Efficiency', value: '92%', status: 'Healthy', icon: '📈' }
];

export const liveInfrastructureEvents: Array<{ id: string; asset: string; assetType: string; message: string; severity: 'Critical' | 'Warning' | 'Info'; timestamp: string }> = [
  { id: 'EVT-001', asset: 'DB-SRV-12', assetType: 'Server', message: 'CPU usage reached 94%', severity: 'Critical', timestamp: '2 minutes ago' },
  { id: 'EVT-002', asset: 'APP-SRV-47', assetType: 'Server', message: 'Disk usage reached 91%', severity: 'Warning', timestamp: '5 minutes ago' },
  { id: 'EVT-003', asset: 'CLOUD-EC2-102', assetType: 'Cloud', message: 'Health check completed', severity: 'Info', timestamp: '8 minutes ago' },
  { id: 'EVT-004', asset: 'NETWORK-RTR-05', assetType: 'Network', message: 'Network health check passed', severity: 'Info', timestamp: '12 minutes ago' },
  { id: 'EVT-005', asset: 'WEB-SRV-21', assetType: 'Server', message: 'Memory usage reached 86%', severity: 'Warning', timestamp: '15 minutes ago' }
];

export const atRiskAssets: Array<{ id: string; name: string; type: string; cpu: string; memory: string; disk: string; network: string; status: 'Critical' | 'Warning' | 'Healthy' }> = [
  { id: 'DB-SRV-12', name: 'DB Core Primary', type: 'Server', cpu: '94%', memory: '72%', disk: '67%', network: '12%', status: 'Critical' },
  { id: 'WEB-SRV-21', name: 'Public Web Cluster', type: 'Server', cpu: '86%', memory: '81%', disk: '58%', network: '18%', status: 'Warning' },
  { id: 'APP-SRV-47', name: 'Web Frontend-01', type: 'Server', cpu: '62%', memory: '74%', disk: '91%', network: '21%', status: 'Warning' },
  { id: 'NET-SW-04', name: 'Core Switch 01', type: 'Network', cpu: '82%', memory: 'N/A', disk: 'N/A', network: '88%', status: 'Critical' },
  { id: 'NETWORK-RTR-05', name: 'WAN Router East', type: 'Network', cpu: '58%', memory: 'N/A', disk: 'N/A', network: '71%', status: 'Warning' }
];

export const topResourceConsumers = [
  { id: 'DB-SRV-12', name: 'DB Core Primary', resource: 'CPU', usage: '94%' },
  { id: 'APP-SRV-47', name: 'Web Frontend-01', resource: 'Disk', usage: '91%' },
  { id: 'WEB-SRV-21', name: 'Public Web Cluster', resource: 'Memory', usage: '86%' },
  { id: 'CLOUD-EC2-18', name: 'Compute Node 18', resource: 'CPU', usage: '82%' },
  { id: 'NETWORK-RTR-05', name: 'WAN Router East', resource: 'Network', usage: '78%' }
];

export const resourceUsageTrendLast24h = {
  CPU: [
    { label: '00:00', value: 24 }, { label: '01:00', value: 26 }, { label: '02:00', value: 29 }, { label: '03:00', value: 25 }, 
    { label: '04:00', value: 25 }, { label: '05:00', value: 27 }, { label: '06:00', value: 31 }, { label: '07:00', value: 28 }, 
    { label: '08:00', value: 28 }, { label: '09:00', value: 30 }, { label: '10:00', value: 24 }, { label: '11:00', value: 22 }, 
    { label: '12:00', value: 23 }, { label: '13:00', value: 25 }, { label: '14:00', value: 27 }, { label: '15:00', value: 26 }, 
    { label: '16:00', value: 26 }, { label: '17:00', value: 28 }, { label: '18:00', value: 35 }, { label: '19:00', value: 32 }, 
    { label: '20:00', value: 30 }, { label: '21:00', value: 27 }, { label: '22:00', value: 23 }, { label: '23:00', value: 21 }
  ],
  Memory: [
    { label: '00:00', value: 40 }, { label: '01:00', value: 41 }, { label: '02:00', value: 43 }, { label: '03:00', value: 44 }, 
    { label: '04:00', value: 46 }, { label: '05:00', value: 48 }, { label: '06:00', value: 50 }, { label: '07:00', value: 47 }, 
    { label: '08:00', value: 47 }, { label: '09:00', value: 50 }, { label: '10:00', value: 52 }, { label: '11:00', value: 51 }, 
    { label: '12:00', value: 49 }, { label: '13:00', value: 47 }, { label: '14:00', value: 45 }, { label: '15:00', value: 48 }, 
    { label: '16:00', value: 53 }, { label: '17:00', value: 55 }, { label: '18:00', value: 57 }, { label: '19:00', value: 54 }, 
    { label: '20:00', value: 49 }, { label: '21:00', value: 48 }, { label: '22:00', value: 47 }, { label: '23:00', value: 46 }
  ],
  Disk: [
    { label: '00:00', value: 54 }, { label: '01:00', value: 55 }, { label: '02:00', value: 57 }, { label: '03:00', value: 58 }, 
    { label: '04:00', value: 58 }, { label: '05:00', value: 60 }, { label: '06:00', value: 63 }, { label: '07:00', value: 60 }, 
    { label: '08:00', value: 60 }, { label: '09:00', value: 62 }, { label: '10:00', value: 64 }, { label: '11:00', value: 65 }, 
    { label: '12:00', value: 66 }, { label: '13:00', value: 66 }, { label: '14:00', value: 67 }, { label: '15:00', value: 67 }, 
    { label: '16:00', value: 70 }, { label: '17:00', value: 71 }, { label: '18:00', value: 69 }, { label: '19:00', value: 68 }, 
    { label: '20:00', value: 68 }, { label: '21:00', value: 67 }, { label: '22:00', value: 67 }, { label: '23:00', value: 66 }
  ],
  Network: [
    { label: '00:00', value: 12 }, { label: '01:00', value: 14 }, { label: '02:00', value: 13 }, { label: '03:00', value: 11 }, 
    { label: '04:00', value: 10 }, { label: '05:00', value: 15 }, { label: '06:00', value: 18 }, { label: '07:00', value: 22 }, 
    { label: '08:00', value: 28 }, { label: '09:00', value: 31 }, { label: '10:00', value: 25 }, { label: '11:00', value: 20 }, 
    { label: '12:00', value: 19 }, { label: '13:00', value: 21 }, { label: '14:00', value: 24 }, { label: '15:00', value: 26 }, 
    { label: '16:00', value: 29 }, { label: '17:00', value: 32 }, { label: '18:00', value: 35 }, { label: '19:00', value: 30 }, 
    { label: '20:00', value: 28 }, { label: '21:00', value: 24 }, { label: '22:00', value: 18 }, { label: '23:00', value: 15 }
  ]
};

export const resourceUsageTrendLast7d = {
  CPU: [
    { label: 'Mon', value: 24 }, { label: 'Tue', value: 26 }, { label: 'Wed', value: 29 }, { label: 'Thu', value: 25 }, 
    { label: 'Fri', value: 28 }, { label: 'Sat', value: 22 }, { label: 'Sun', value: 23 }
  ],
  Memory: [
    { label: 'Mon', value: 45 }, { label: 'Tue', value: 48 }, { label: 'Wed', value: 50 }, { label: 'Thu', value: 47 }, 
    { label: 'Fri', value: 52 }, { label: 'Sat', value: 44 }, { label: 'Sun', value: 47 }
  ],
  Disk: [
    { label: 'Mon', value: 60 }, { label: 'Tue', value: 62 }, { label: 'Wed', value: 65 }, { label: 'Thu', value: 66 }, 
    { label: 'Fri', value: 68 }, { label: 'Sat', value: 65 }, { label: 'Sun', value: 66 }
  ],
  Network: [
    { label: 'Mon', value: 20 }, { label: 'Tue', value: 22 }, { label: 'Wed', value: 25 }, { label: 'Thu', value: 28 }, 
    { label: 'Fri', value: 30 }, { label: 'Sat', value: 18 }, { label: 'Sun', value: 16 }
  ]
};

export const resourceUsageTrendLast30d = {
  CPU: [
    { label: 'Week 1', value: 26 }, { label: 'Week 2', value: 24 }, { label: 'Week 3', value: 27 }, { label: 'Week 4', value: 25 }
  ],
  Memory: [
    { label: 'Week 1', value: 48 }, { label: 'Week 2', value: 49 }, { label: 'Week 3', value: 50 }, { label: 'Week 4', value: 47 }
  ],
  Disk: [
    { label: 'Week 1', value: 63 }, { label: 'Week 2', value: 64 }, { label: 'Week 3', value: 67 }, { label: 'Week 4', value: 66 }
  ],
  Network: [
    { label: 'Week 1', value: 24 }, { label: 'Week 2', value: 26 }, { label: 'Week 3', value: 28 }, { label: 'Week 4', value: 23 }
  ]
};

export const notificationsMockData: Array<{ id: string; title: string; message: string; time: string; unread: boolean; severity: 'Critical' | 'Warning' | 'Info' }> = [
  { id: 'NOT-001', title: 'Critical Alert', message: 'DB-SRV-12 CPU reached 94%', time: '2 minutes ago', unread: true, severity: 'Critical' },
  { id: 'NOT-002', title: 'Warning', message: 'APP-SRV-47 disk usage is 91%', time: '5 minutes ago', unread: true, severity: 'Warning' },
  { id: 'NOT-003', title: 'Health Check', message: 'All cloud resources checked successfully', time: '8 minutes ago', unread: false, severity: 'Info' },
  { id: 'NOT-004', title: 'Warning', message: 'WEB-SRV-21 memory usage reached 86%', time: '15 minutes ago', unread: false, severity: 'Warning' },
  { id: 'NOT-005', title: 'Info', message: 'Network health check completed', time: '20 minutes ago', unread: false, severity: 'Info' }
];
