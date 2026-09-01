export type AssetType = 'Server' | 'Cloud' | 'Network' | 'Storage';
export type AssetStatus = 'Healthy' | 'Warning' | 'Critical';
export type AlertSeverity = 'Critical' | 'Warning' | 'Info' | 'Resolved';
export type AlertStatus = 'Active' | 'Investigating' | 'Resolved';

export interface AssetRecord {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  ip: string;
  environment: 'Production' | 'Staging' | 'Development';
  cpu: string;
  memory: string;
  disk: string;
  network: string;
  lastHealthCheck: string;
}

export interface AlertRecord {
  id: string;
  asset: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  status: AlertStatus;
  createdAt: string;
}

export interface ResourceSeriesPoint {
  label: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  asset: string;
  action: string;
  time: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  severity: 'Critical' | 'Warning' | 'Info';
}

export const assetData: AssetRecord[] = [
  { id: 'DB-SRV-12', name: 'DB Core Primary', type: 'Server', status: 'Critical', ip: '10.0.0.12', environment: 'Production', cpu: '94%', memory: '72%', disk: '67%', network: '12%', lastHealthCheck: '2 minutes ago' },
  { id: 'APP-SRV-47', name: 'Web Frontend-01', type: 'Server', status: 'Warning', ip: '10.0.0.18', environment: 'Production', cpu: '62%', memory: '74%', disk: '91%', network: '21%', lastHealthCheck: '5 minutes ago' },
  { id: 'CLOUD-EC2-102', name: 'API Gateway', type: 'Cloud', status: 'Healthy', ip: '52.14.74.20', environment: 'Production', cpu: '48%', memory: '52%', disk: '45%', network: '31%', lastHealthCheck: '12 minutes ago' },
  { id: 'NETWORK-RTR-05', name: 'WAN Router East', type: 'Network', status: 'Warning', ip: '192.168.30.8', environment: 'Production', cpu: '58%', memory: 'N/A', disk: 'N/A', network: '71%', lastHealthCheck: '18 minutes ago' },
  { id: 'STOR-ARC-09', name: 'Archive Storage', type: 'Storage', status: 'Healthy', ip: '10.20.0.45', environment: 'Development', cpu: '17%', memory: '32%', disk: '70%', network: '8%', lastHealthCheck: '21 minutes ago' },
  { id: 'WEB-SRV-21', name: 'Public Web Cluster', type: 'Server', status: 'Warning', ip: '10.0.0.42', environment: 'Staging', cpu: '86%', memory: '81%', disk: '58%', network: '18%', lastHealthCheck: '7 minutes ago' },
  { id: 'DB-SRV-18', name: 'Analytics Replica', type: 'Server', status: 'Healthy', ip: '10.0.0.77', environment: 'Production', cpu: '37%', memory: '41%', disk: '49%', network: '14%', lastHealthCheck: '3 minutes ago' },
  { id: 'CLOUD-RDS-08', name: 'Secure Metrics DB', type: 'Cloud', status: 'Healthy', ip: '10.16.22.44', environment: 'Production', cpu: '24%', memory: '45%', disk: '50%', network: '9%', lastHealthCheck: '9 minutes ago' },
  { id: 'NET-SW-04', name: 'Core Switch 01', type: 'Network', status: 'Critical', ip: '172.16.0.3', environment: 'Production', cpu: '82%', memory: 'N/A', disk: 'N/A', network: '88%', lastHealthCheck: '1 minute ago' },
  { id: 'CLOUD-S3-12', name: 'Threat Archive Bucket', type: 'Cloud', status: 'Healthy', ip: '54.90.14.66', environment: 'Production', cpu: '14%', memory: '22%', disk: '42%', network: '7%', lastHealthCheck: '18 minutes ago' }
];

export const alertData: AlertRecord[] = [
  { id: 'ALT-401', asset: 'DB-SRV-12', type: 'CPU', severity: 'Critical', message: 'CPU usage reached 94% and auto-scaling triggered.', status: 'Active', createdAt: '2026-08-31T09:20:00Z' },
  { id: 'ALT-402', asset: 'APP-SRV-47', type: 'Disk', severity: 'Warning', message: 'Disk usage reached 91% on the application node.', status: 'Investigating', createdAt: '2026-08-31T08:42:00Z' },
  { id: 'ALT-403', asset: 'WEB-SRV-21', type: 'Memory', severity: 'Warning', message: 'Memory usage reached 86% and requires review.', status: 'Active', createdAt: '2026-08-31T07:55:00Z' },
  { id: 'ALT-404', asset: 'CLOUD-EC2-102', type: 'Availability', severity: 'Info', message: 'Health check completed successfully across the edge cluster.', status: 'Resolved', createdAt: '2026-08-31T06:18:00Z' },
  { id: 'ALT-405', asset: 'NETWORK-RTR-05', type: 'Connectivity', severity: 'Warning', message: 'Dual-path failover activated after packet loss detected.', status: 'Investigating', createdAt: '2026-08-31T04:10:00Z' }
];

export const resourceUsageSeries: Record<string, ResourceSeriesPoint[]> = {
  CPU: [
    { label: '00:00', value: 24 }, { label: '02:00', value: 29 }, { label: '04:00', value: 25 }, { label: '06:00', value: 31 }, { label: '08:00', value: 28 }, { label: '10:00', value: 24 }, { label: '12:00', value: 23 }, { label: '14:00', value: 27 }, { label: '16:00', value: 26 }, { label: '18:00', value: 35 }, { label: '20:00', value: 30 }, { label: '22:00', value: 23 }
  ],
  Memory: [
    { label: '00:00', value: 40 }, { label: '02:00', value: 43 }, { label: '04:00', value: 46 }, { label: '06:00', value: 50 }, { label: '08:00', value: 47 }, { label: '10:00', value: 52 }, { label: '12:00', value: 49 }, { label: '14:00', value: 45 }, { label: '16:00', value: 53 }, { label: '18:00', value: 57 }, { label: '20:00', value: 49 }, { label: '22:00', value: 47 }
  ],
  Disk: [
    { label: '00:00', value: 54 }, { label: '02:00', value: 57 }, { label: '04:00', value: 58 }, { label: '06:00', value: 63 }, { label: '08:00', value: 60 }, { label: '10:00', value: 64 }, { label: '12:00', value: 66 }, { label: '14:00', value: 67 }, { label: '16:00', value: 70 }, { label: '18:00', value: 69 }, { label: '20:00', value: 68 }, { label: '22:00', value: 67 }
  ],
  Network: [
    { label: '00:00', value: 9 }, { label: '02:00', value: 10 }, { label: '04:00', value: 11 }, { label: '06:00', value: 12 }, { label: '08:00', value: 15 }, { label: '10:00', value: 16 }, { label: '12:00', value: 14 }, { label: '14:00', value: 12 }, { label: '16:00', value: 13 }, { label: '18:00', value: 17 }, { label: '20:00', value: 15 }, { label: '22:00', value: 12 }
  ]
};

export const serverHealthSeries = [
  { label: '00:00', healthy: 94, warning: 5, critical: 1 },
  { label: '04:00', healthy: 92, warning: 7, critical: 1 },
  { label: '08:00', healthy: 95, warning: 4, critical: 1 },
  { label: '12:00', healthy: 93, warning: 6, critical: 1 },
  { label: '16:00', healthy: 90, warning: 8, critical: 2 },
  { label: '20:00', healthy: 94, warning: 5, critical: 1 }
];

export const healthOverview = [
  { label: 'Servers', total: 1247, healthy: 1235, warning: 10, critical: 2 },
  { label: 'Cloud Resources', total: 847, healthy: 830, warning: 13, critical: 4 },
  { label: 'Network Devices', total: 753, healthy: 734, warning: 14, critical: 5 }
];

export const recentActivity: ActivityItem[] = [
  { id: 'A1', asset: 'DB-SRV-12', action: 'CPU threshold exceeded', time: '2 minutes ago' },
  { id: 'A2', asset: 'APP-SRV-47', action: 'Disk warning generated', time: '8 minutes ago' },
  { id: 'A3', asset: 'CLOUD-EC2-102', action: 'Health check completed', time: '12 minutes ago' },
  { id: 'A4', asset: 'NETWORK-RTR-05', action: 'Network status changed', time: '18 minutes ago' }
];

export const notifications: NotificationItem[] = [
  { id: 'N1', title: 'Critical CPU alert', message: 'DB-SRV-12 CPU reached 94%.', time: '2 min ago', unread: true, severity: 'Critical' },
  { id: 'N2', title: 'Disk warning', message: 'APP-SRV-47 Disk reached 91%.', time: '8 min ago', unread: true, severity: 'Warning' },
  { id: 'N3', title: 'Health check completed', message: 'All network devices checked successfully.', time: '14 min ago', unread: false, severity: 'Info' }
];

export const atRiskAssets = [
  { id: 'DB-SRV-12', name: 'DB Core Primary', type: 'Server', cpu: '94%', memory: '72%', disk: '67%', network: '12%', status: 'Critical' },
  { id: 'APP-SRV-47', name: 'Web Frontend-01', type: 'Server', cpu: '62%', memory: '74%', disk: '91%', network: '21%', status: 'Warning' },
  { id: 'WEB-SRV-21', name: 'Public Web Cluster', type: 'Server', cpu: '86%', memory: '81%', disk: '58%', network: '18%', status: 'Warning' },
  { id: 'NET-SW-04', name: 'Core Switch 01', type: 'Network', cpu: '82%', memory: 'N/A', disk: 'N/A', network: '88%', status: 'Critical' }
];

export const networkDevices = [
  { device: 'Core Switch 01', type: 'Switch', ip: '172.16.0.3', status: 'Critical', bandwidth: '10 Gbps', latency: '18 ms', lastCheck: '2 min ago' },
  { device: 'WAN Router East', type: 'Router', ip: '192.168.30.8', status: 'Warning', bandwidth: '8 Gbps', latency: '27 ms', lastCheck: '5 min ago' },
  { device: 'Firewall Gateway', type: 'Firewall', ip: '10.5.1.14', status: 'Healthy', bandwidth: '12 Gbps', latency: '12 ms', lastCheck: '1 min ago' },
  { device: 'Edge Load Balancer', type: 'Load Balancer', ip: '10.5.2.11', status: 'Healthy', bandwidth: '9 Gbps', latency: '14 ms', lastCheck: '3 min ago' }
];

export const cloudResources = [
  { resource: 'EC2-API-01', type: 'EC2', region: 'us-east-1', status: 'Healthy', cpu: '48%', memory: '52%', network: '31%', lastCheck: '8 min ago' },
  { resource: 'RDS-Primary', type: 'RDS', region: 'us-east-1', status: 'Healthy', cpu: '32%', memory: '44%', network: '12%', lastCheck: '10 min ago' },
  { resource: 'S3-Threat-Archive', type: 'S3', region: 'us-west-2', status: 'Warning', cpu: '18%', memory: '29%', network: '19%', lastCheck: '14 min ago' },
  { resource: 'EKS-Core', type: 'EKS', region: 'eu-west-1', status: 'Critical', cpu: '71%', memory: '69%', network: '42%', lastCheck: '2 min ago' }
];

export const healthChecks = [
  { asset: 'DB-SRV-12', checkType: 'CPU', status: 'Failed', responseTime: '214 ms', lastChecked: '2 min ago' },
  { asset: 'APP-SRV-47', checkType: 'Disk', status: 'Warning', responseTime: '186 ms', lastChecked: '8 min ago' },
  { asset: 'CLOUD-EC2-102', checkType: 'Availability', status: 'Successful', responseTime: '112 ms', lastChecked: '12 min ago' },
  { asset: 'NETWORK-RTR-05', checkType: 'Network', status: 'Warning', responseTime: '232 ms', lastChecked: '18 min ago' }
];

export const summaryMetrics = [
  { label: 'Assets Monitored', value: '2,847', delta: '+2.4%', status: 'success' },
  { label: 'Uptime', value: '99.99%', delta: '+0.01%', status: 'success' },
  { label: 'Active Alerts', value: '12', delta: '-3 alerts', status: 'warning' },
  { label: 'Healthy Assets', value: '2,823', delta: '+18', status: 'success' },
  { label: 'Warning Assets', value: '10', delta: '-2', status: 'warning' },
  { label: 'Critical Assets', value: '14', delta: '+3', status: 'error' },
  { label: 'CPU Usage', value: '23%', delta: '-4%', status: 'success' },
  { label: 'Memory Usage', value: '47%', delta: '+5%', status: 'warning' },
  { label: 'Disk Usage', value: '67%', delta: '+3%', status: 'warning' },
  { label: 'Network Usage', value: '12%', delta: '-1%', status: 'success' }
];

export interface IncidentRecord {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Investigating' | 'Contained' | 'Resolved';
  asset: string;
  detectedAt: string;
  duration: string;
  description: string;
  affectedAssets: number;
}

export interface ThreatRecord {
  id: string;
  name: string;
  type: 'Vulnerability' | 'Malware' | 'Intrusion' | 'Misconfiguration';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cvss: number;
  affectedAssets: number;
  discoveredAt: string;
  status: 'Unpatched' | 'Patching' | 'Patched' | 'Mitigated';
}

export interface HeatmapPoint {
  label: string;
  value: number;
  intensity: 'low' | 'medium' | 'high' | 'critical';
}

export const incidents: IncidentRecord[] = [
  { id: 'INC-001', title: 'Unauthorized SSH Access Attempt', severity: 'Critical', status: 'Investigating', asset: 'DB-SRV-12', detectedAt: '2026-09-01T08:30:00Z', duration: '2h 45m', description: 'Multiple failed SSH login attempts from external IP detected on database server.', affectedAssets: 1 },
  { id: 'INC-002', title: 'Ransomware Signature Detected', severity: 'Critical', status: 'Active', asset: 'APP-SRV-47', detectedAt: '2026-08-31T14:12:00Z', duration: '18h 20m', description: 'Encrypted file extension behavior pattern matched known ransomware family.', affectedAssets: 3 },
  { id: 'INC-003', title: 'Data Exfiltration Detected', severity: 'High', status: 'Contained', asset: 'CLOUD-EC2-102', detectedAt: '2026-08-30T10:05:00Z', duration: '1d 4h', description: 'Abnormal outbound data transfer to foreign IP addresses detected.', affectedAssets: 2 },
  { id: 'INC-004', title: 'Privilege Escalation Attempt', severity: 'High', status: 'Investigating', asset: 'WEB-SRV-21', detectedAt: '2026-08-29T19:44:00Z', duration: '5h 22m', description: 'User account attempted to elevate privileges without authorization.', affectedAssets: 1 },
  { id: 'INC-005', title: 'DDoS Attack Detected', severity: 'High', status: 'Contained', asset: 'NETWORK-RTR-05', detectedAt: '2026-08-28T03:15:00Z', duration: '3h 18m', description: 'Network flooded with traffic from multiple source IPs exceeding threshold.', affectedAssets: 5 }
];

export const threats: ThreatRecord[] = [
  { id: 'THR-001', name: 'CVE-2026-41234 - Remote Code Execution', type: 'Vulnerability', severity: 'Critical', cvss: 9.8, affectedAssets: 12, discoveredAt: '2026-08-28T12:00:00Z', status: 'Patching' },
  { id: 'THR-002', name: 'Emotet Botnet Malware', type: 'Malware', severity: 'Critical', cvss: 9.2, affectedAssets: 7, discoveredAt: '2026-08-25T08:30:00Z', status: 'Unpatched' },
  { id: 'THR-003', name: 'Weak SSL/TLS Configuration', type: 'Misconfiguration', severity: 'High', cvss: 7.5, affectedAssets: 28, discoveredAt: '2026-08-22T15:45:00Z', status: 'Mitigated' },
  { id: 'THR-004', name: 'Lateral Movement Detection', type: 'Intrusion', severity: 'High', cvss: 8.1, affectedAssets: 4, discoveredAt: '2026-08-20T09:20:00Z', status: 'Mitigated' },
  { id: 'THR-005', name: 'SQL Injection Vulnerability', type: 'Vulnerability', severity: 'Medium', cvss: 6.3, affectedAssets: 3, discoveredAt: '2026-08-18T14:00:00Z', status: 'Patched' }
];

export const threatHeatmap: HeatmapPoint[] = [
  { label: 'Production East', value: 87, intensity: 'critical' },
  { label: 'Production West', value: 64, intensity: 'high' },
  { label: 'Production Central', value: 48, intensity: 'medium' },
  { label: 'Staging Environment', value: 23, intensity: 'low' },
  { label: 'Development', value: 12, intensity: 'low' },
  { label: 'Cloud VPC-1', value: 71, intensity: 'high' },
  { label: 'Cloud VPC-2', value: 55, intensity: 'medium' },
  { label: 'Edge Network', value: 41, intensity: 'medium' }
];

export const riskScoreHistory = [
  { time: '00:00', score: 34 },
  { time: '04:00', score: 42 },
  { time: '08:00', score: 38 },
  { time: '12:00', score: 51 },
  { time: '16:00', score: 68 },
  { time: '20:00', score: 72 },
  { time: '24:00', score: 87 }
];
