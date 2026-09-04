import React from 'react';
import { Shield, AlertCircle, Server, TrendingDown, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const eventsData = [
  { day: 'Mon', detected: 42, resolved: 38 },
  { day: 'Tue', detected: 28, resolved: 25 },
  { day: 'Wed', detected: 65, resolved: 50 },
  { day: 'Thu', detected: 33, resolved: 30 },
  { day: 'Fri', detected: 52, resolved: 44 },
  { day: 'Sat', detected: 18, resolved: 17 },
  { day: 'Sun', detected: 24, resolved: 20 },
];

const threatDist = [
  { name: 'Malware', value: 35, color: '#EF4444' },
  { name: 'Unauth Access', value: 28, color: '#F59E0B' },
  { name: 'Net Anomaly', value: 22, color: '#3B82F6' },
  { name: 'IAM Risk', value: 15, color: '#8B5CF6' },
];

const assetHealth = [
  { provider: 'AWS', healthy: 70, risk: 12 },
  { provider: 'Azure', healthy: 45, risk: 6 },
  { provider: 'GCP', healthy: 20, risk: 3 },
];

const incidents = [
  { id: 'INC-0042', title: 'Suspicious admin login from Tor exit node', severity: 'critical', time: '2 mins ago', status: 'Investigating' },
  { id: 'INC-0041', title: 'Unusual outbound traffic spike (50GB+)', severity: 'high', time: '18 mins ago', status: 'Detected' },
  { id: 'INC-0040', title: 'IAM permission change on production S3 bucket', severity: 'medium', time: '1 hr ago', status: 'Contained' },
  { id: 'INC-0039', title: 'Failed MFA attempts — API Gateway', severity: 'medium', time: '3 hrs ago', status: 'Resolved' },
];

const activity = [
  { time: '12:03 PM', text: 'Critical alert: Tor node login detected on prod-admin', color: 'bg-status-critical' },
  { time: '11:51 AM', text: 'IAM scan completed — 3 over-privileged roles found', color: 'bg-status-warning' },
  { time: '11:30 AM', text: 'Cloud asset inventory sync completed (156 assets)', color: 'bg-status-success' },
  { time: '10:47 AM', text: 'Threat rule updated: brute-force-ssh-v2', color: 'bg-primary' },
];

export default function SecurityOverview() {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Security Score', value: '87', sub: '/100', icon: Shield, color: 'text-primary', trend: '+2 this week' },
          { label: 'Active Incidents', value: '08', sub: '', icon: AlertCircle, color: 'text-status-critical', trend: '3 critical' },
          { label: 'Monitored Assets', value: '156', sub: '', icon: Server, color: 'text-status-success', trend: '+4 this week' },
          { label: 'Threats Detected', value: '24', sub: '', icon: TrendingDown, color: 'text-status-warning', trend: 'Last 24 hours' },
        ].map((m, i) => (
          <Card key={i} className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.label}</p>
              <div className={`p-2 rounded-lg bg-navy-900/80 border border-slate-800 ${m.color}`}><m.icon className="h-4 w-4" /></div>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight">{m.value}<span className="text-sm font-normal text-slate-500">{m.sub}</span></p>
            <p className="text-[11px] text-slate-500 font-medium">{m.trend}</p>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <h3 className="text-base font-bold text-white mb-4">Security Events — Last 7 Days</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={eventsData}>
                <defs>
                  <linearGradient id="detGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
                  <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.25} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1120', borderColor: '#1F2937', color: '#F1F5F9', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="detected" name="Detected" stroke="#EF4444" strokeWidth={2} fill="url(#detGrad)" />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10B981" strokeWidth={2} fill="url(#resGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <h3 className="text-base font-bold text-white mb-4">Threat Distribution</h3>
          <div className="h-[140px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={threatDist} innerRadius={48} outerRadius={65} paddingAngle={3} dataKey="value">
                  {threatDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {threatDist.map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                <span className="text-slate-400 truncate">{t.name}</span>
                <span className="text-white font-semibold ml-auto">{t.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Asset Health + Incidents */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4">
          <h3 className="text-base font-bold text-white mb-4">Cloud Asset Health</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetHealth} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="provider" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1120', borderColor: '#1F2937', color: '#F1F5F9', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="healthy" name="Healthy" stackId="a" fill="#10B981" />
                <Bar dataKey="risk" name="At Risk" stackId="a" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-8 p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Incidents</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {incidents.map((inc) => (
              <div key={inc.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition-colors gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Badge variant={inc.severity as any} className="flex-shrink-0">{inc.severity.charAt(0).toUpperCase() + inc.severity.slice(1)}</Badge>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{inc.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{inc.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 text-right">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500"><Clock className="h-3 w-3" />{inc.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Live Activity */}
      <Card>
        <h3 className="text-base font-bold text-white mb-4">Live Activity Feed</h3>
        <div className="space-y-3">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start gap-3 text-xs">
              <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${a.color}`} />
              <span className="text-slate-500 font-mono flex-shrink-0">{a.time}</span>
              <span className="text-slate-300">{a.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
