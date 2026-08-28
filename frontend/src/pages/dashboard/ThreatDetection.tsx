import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldAlert, Crosshair, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const hourlyThreatData = [
  { time: '12 AM', malware: 4, intrusion: 2, anomaly: 1 },
  { time: '4 AM', malware: 2, intrusion: 1, anomaly: 3 },
  { time: '8 AM', malware: 8, intrusion: 5, anomaly: 4 },
  { time: '12 PM', malware: 5, intrusion: 3, anomaly: 2 },
  { time: '4 PM', malware: 12, intrusion: 7, anomaly: 6 },
  { time: '8 PM', malware: 6, intrusion: 4, anomaly: 3 },
];

export default function ThreatDetection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Threat Detection Center</h2>
          <p className="text-xs text-slate-400">Real-time heuristics, signature matching, and anomalous threat feeds</p>
        </div>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Global Threat Index', value: '4.8', sub: '/10 Low Risk', icon: ShieldAlert, color: 'text-primary' },
          { label: 'Active Scanners', value: '1,421', sub: 'Threat signatures loaded', icon: Crosshair, color: 'text-status-warning' },
          { label: 'Scans/Sec', value: '8.4k', sub: 'Real-time throughput', icon: Activity, color: 'text-status-success' },
          { label: 'Unresolved Alerts', value: '12', sub: 'Requires immediate audit', icon: AlertTriangle, color: 'text-status-critical' },
        ].map((m, i) => (
          <Card key={i} className="flex flex-col justify-between p-4 bg-navy-800/90">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.label}</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-white tracking-tight">{m.value}</span>
              <span className="text-xs text-slate-500 font-medium">{m.sub}</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              <m.icon className={`h-4 w-4 ${m.color}`} />
              Active telemetry
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-8">
          <h3 className="text-base font-bold text-white mb-4">Hourly Threat Feed (Last 24 Hours)</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyThreatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1120', borderColor: '#1F2937', color: '#F1F5F9', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="malware" name="Malware" stackId="a" fill="#EF4444" />
                <Bar dataKey="intrusion" name="Intrusion" stackId="a" fill="#F59E0B" />
                <Bar dataKey="anomaly" name="Anomaly" stackId="a" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Resources list */}
        <Card className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-4">Top Affected Resources</h3>
            <div className="space-y-4">
              {[
                { name: 'prod-api-cluster-01', type: 'Kubernetes Engine', events: 142, risk: 'High' },
                { name: 'db-customer-primary', type: 'RDS Postgres Instance', events: 88, risk: 'High' },
                { name: 'prod-web-server-02', type: 'EC2 Virtual Machine', events: 45, risk: 'Medium' },
                { name: 'api-gateway-auth-node', type: 'App Service Node', events: 21, risk: 'Low' },
              ].map((res, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-2.5 rounded-lg bg-navy-900/60 border border-slate-800">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{res.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{res.type}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-white block">{res.events} events</span>
                    <Badge variant={res.risk.toLowerCase() as any} className="mt-1 text-[10px]">{res.risk}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-4">
            <span className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-status-warning" /> Heuristics scoring loaded</span>
            <span className="text-[10px] text-slate-500 font-mono">V2.4_HEUR</span>
          </div>
        </Card>
      </div>

      {/* Detections Log */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-navy-900/40">
          <h3 className="text-base font-bold text-white">Automated Detection Feed</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {[
            { id: 'DET-9812', title: 'Brute-force SSH attack detected', src: '185.220.101.42', dest: 'prod-web-server-01', time: '5 mins ago', rule: 'brute-force-ssh-v2' },
            { id: 'DET-9811', title: 'SQL injection pattern matched in payload', src: '94.21.18.156', dest: 'api-gateway-node-02', time: '12 mins ago', rule: 'waf-sql-injection-heur' },
            { id: 'DET-9810', title: 'Suspicious credential usage (Admin privilege)', src: 'IAM_Session_AWS_04', dest: 'aws-iam-control', time: '40 mins ago', rule: 'iam-anomaly-policy-03' },
          ].map((det) => (
            <div key={det.id} className="p-4 hover:bg-slate-800/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[10px] text-slate-500">{det.id}</span>
                  <Badge variant="medium">{det.rule}</Badge>
                </div>
                <p className="font-semibold text-slate-200">{det.title}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Source: {det.src} &rarr; Destination: {det.dest}</p>
              </div>
              <span className="text-slate-500 font-medium whitespace-nowrap text-right self-end sm:self-center">{det.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
