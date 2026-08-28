import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Cloud, Server, Database, ShieldCheck, ShieldAlert, Filter, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const providerData = [
  { name: 'AWS', healthy: 70, risk: 12 },
  { name: 'Azure', healthy: 45, risk: 6 },
  { name: 'GCP', healthy: 20, risk: 3 },
];

const assets = [
  { id: 'i-04abcd1234', name: 'prod-web-server-01', provider: 'AWS', type: 'EC2 Instance', region: 'us-east-1', risk: 'Low', status: 'Healthy', lastScan: '10 mins ago' },
  { id: 'i-04abcd1235', name: 'prod-web-server-02', provider: 'AWS', type: 'EC2 Instance', region: 'us-east-1', risk: 'Medium', status: 'Warning', lastScan: '12 mins ago' },
  { id: 'db-customer-prod', name: 'customer-data-primary', provider: 'AWS', type: 'RDS Postgres', region: 'us-east-1', risk: 'High', status: 'At Risk', lastScan: '5 mins ago' },
  { id: 'vm-api-gw-node', name: 'api-gateway-node-01', provider: 'Azure', type: 'Virtual Machine', region: 'eastus', risk: 'Low', status: 'Healthy', lastScan: '1 hr ago' },
  { id: 'aks-cluster-main', name: 'prod-k8s-cluster', provider: 'Azure', type: 'AKS Engine', region: 'eastus', risk: 'Critical', status: 'At Risk', lastScan: '2 mins ago' },
  { id: 'gcs-backup-bucket', name: 'daily-storage-backups', provider: 'GCP', type: 'Cloud Storage', region: 'us-central1', risk: 'Low', status: 'Healthy', lastScan: '4 hrs ago' },
];

export default function CloudAssets() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Cloud Assets &amp; Infrastructure</h2>
          <p className="text-xs text-slate-400">Inventory and posture monitoring across cloud environments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5"><Filter className="h-3.5 w-3.5" /> Filter</Button>
          <Button variant="outline" size="sm" className="text-xs gap-1.5"><Download className="h-3.5 w-3.5" /> Export Inventory</Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="col-span-2 md:col-span-1 p-4 bg-navy-800/90 flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Assets</h3>
          <p className="text-3xl font-bold text-white tracking-tight">156</p>
          <span className="text-[10px] text-slate-500 font-medium">Across 3 Cloud Providers</span>
        </Card>
        
        <Card className="col-span-1 p-4 bg-navy-800/90 flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Healthy Assets</h3>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-status-success" />
            <p className="text-2xl font-bold text-white">135</p>
          </div>
          <span className="text-[10px] text-status-success font-semibold">86.5% Compliant</span>
        </Card>
        
        <Card className="col-span-1 p-4 bg-navy-800/90 flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">At-Risk Assets</h3>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-status-warning" />
            <p className="text-2xl font-bold text-white">21</p>
          </div>
          <span className="text-[10px] text-status-warning font-semibold">Requires Attention</span>
        </Card>
        
        <Card className="col-span-2 p-4 bg-navy-800/90 flex items-center justify-around">
          <div className="text-center">
            <p className="text-xl font-bold text-white">82</p>
            <p className="text-xs text-amber-500 font-semibold mt-0.5">AWS</p>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <p className="text-xl font-bold text-white">51</p>
            <p className="text-xs text-primary font-semibold mt-0.5">Azure</p>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <p className="text-xl font-bold text-white">23</p>
            <p className="text-xs text-indigo-400 font-semibold mt-0.5">GCP</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Provider Distribution Chart */}
        <Card className="lg:col-span-4 flex flex-col justify-between">
          <h3 className="text-base font-bold text-white mb-4">Assets Health by Provider</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerData} layout="vertical" margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1120', borderColor: '#1F2937', color: '#F1F5F9', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="healthy" name="Healthy" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="risk" name="At Risk" stackId="a" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Assets Table */}
        <Card className="lg:col-span-8 p-0 overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-800 bg-navy-900/40 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Asset Telemetry Table</h3>
            <span className="text-xs text-slate-400 font-mono">Showing 6 of 156 assets</span>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] text-slate-400 uppercase bg-navy-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Asset Name</th>
                  <th className="px-4 py-3 font-semibold">Provider</th>
                  <th className="px-4 py-3 font-semibold">Type &amp; Region</th>
                  <th className="px-4 py-3 font-semibold">Status / Risk</th>
                  <th className="px-4 py-3 font-semibold">Last Scan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-navy-800/20">
                {assets.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-200">{ast.name}</p>
                      <span className="text-[10px] text-slate-500 font-mono">{ast.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Cloud className={`h-4 w-4 ${
                          ast.provider === 'AWS' ? 'text-amber-500' :
                          ast.provider === 'Azure' ? 'text-primary' : 'text-indigo-400'
                        }`} />
                        <span className="font-semibold text-slate-300">{ast.provider}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {ast.type.includes('Database') || ast.type.includes('RDS') ? <Database className="h-3.5 w-3.5 text-slate-400" /> : <Server className="h-3.5 w-3.5 text-slate-400" />}
                        <span className="text-slate-300">{ast.type}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block">{ast.region}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        ast.status === 'Healthy' ? 'healthy' : 
                        ast.risk === 'Critical' ? 'critical' : 
                        ast.risk === 'High' ? 'high' : 'medium'
                      } className="capitalize text-[10px]">{ast.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{ast.lastScan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
