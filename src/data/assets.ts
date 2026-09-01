export interface AssetRecord {
  id: string;
  name: string;
  type: 'Server' | 'Cloud' | 'Network' | 'Storage';
  status: 'Healthy' | 'Warning' | 'Critical';
  ip: string;
  environment: 'Production' | 'Staging' | 'Development';
  cpu: string;
  memory: string;
  disk: string;
  network: string;
}

export const assetData: AssetRecord[] = [
  { id: 'AS-1001', name: 'DB Core Primary', type: 'Server', status: 'Healthy', ip: '10.0.0.12', environment: 'Production', cpu: '24%', memory: '48%', disk: '51%', network: '11%' },
  { id: 'AS-1002', name: 'Web Frontend-01', type: 'Server', status: 'Warning', ip: '10.0.0.18', environment: 'Production', cpu: '61%', memory: '72%', disk: '63%', network: '18%' },
  { id: 'AS-1003', name: 'AWS Edge Cluster', type: 'Cloud', status: 'Healthy', ip: '52.14.74.20', environment: 'Production', cpu: '41%', memory: '39%', disk: '44%', network: '9%' },
  { id: 'AS-1004', name: 'Core Switch 01', type: 'Network', status: 'Critical', ip: '172.16.0.3', environment: 'Production', cpu: '82%', memory: 'N/A', disk: 'N/A', network: '88%' },
  { id: 'AS-1005', name: 'Archive Storage', type: 'Storage', status: 'Healthy', ip: '10.20.0.45', environment: 'Development', cpu: '17%', memory: '32%', disk: '70%', network: '8%' },
  { id: 'AS-1006', name: 'API Gateway', type: 'Server', status: 'Warning', ip: '10.0.0.28', environment: 'Staging', cpu: '56%', memory: '63%', disk: '58%', network: '14%' }
];
