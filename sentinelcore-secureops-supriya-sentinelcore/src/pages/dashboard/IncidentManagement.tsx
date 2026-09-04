import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AlertCircle, Clock, Search, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

const incidents = [
  { id: 'INC-0042', title: 'Suspicious admin login from Tor exit node', severity: 'critical', time: '2 mins ago', status: 'Investigating', resource: 'AWS prod-admin', risk: 92 },
  { id: 'INC-0041', title: 'Unusual outbound traffic spike (50GB+)', severity: 'high', time: '18 mins ago', status: 'Detected', resource: 'Azure API Gateway', risk: 74 },
  { id: 'INC-0040', title: 'IAM permission change on production S3 bucket', severity: 'medium', time: '1 hr ago', status: 'Contained', resource: 'AWS S3 prod-data', risk: 58 },
  { id: 'INC-0039', title: 'Failed MFA attempts — API Gateway Node', severity: 'medium', time: '3 hrs ago', status: 'Resolved', resource: 'Azure API Gateway', risk: 40 },
];

export default function IncidentManagement() {
  const [selected, setSelected] = useState(incidents[0]);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.severity === filter);
  const stages = ['Detected', 'Investigating', 'Contained', 'Resolved'];
  const stageIdx = stages.indexOf(selected.status);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Incident Management Hub</h2>
          <p className="text-xs text-slate-400">Triage, investigate, and resolve security incidents</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', 'critical', 'high', 'medium'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-navy-800 border border-slate-700 text-slate-400 hover:text-white'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        {/* Incident List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input type="text" placeholder="Search incidents..." className="w-full bg-navy-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary" />
          </div>
          {filtered.map((inc) => (
            <div key={inc.id} onClick={() => setSelected(inc)} className={`p-4 rounded-xl border cursor-pointer transition-all ${selected.id === inc.id ? 'border-primary/50 bg-primary/10' : 'border-slate-800 bg-navy-800/50 hover:border-slate-700'}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant={inc.severity as any}>{inc.severity.charAt(0).toUpperCase() + inc.severity.slice(1)}</Badge>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 flex-shrink-0"><Clock className="h-3 w-3" />{inc.time}</span>
              </div>
              <p className="text-xs font-semibold text-slate-200 leading-snug">{inc.title}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">{inc.id} · {inc.resource}</p>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <Card className="lg:col-span-8 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1"><Badge variant={selected.severity as any}>{selected.severity.charAt(0).toUpperCase() + selected.severity.slice(1)}</Badge><span className="text-[10px] text-slate-500 font-mono">{selected.id}</span></div>
              <h2 className="text-lg font-bold text-white">{selected.title}</h2>
              <p className="text-xs text-slate-400 mt-1">Affected resource: <span className="text-slate-200 font-semibold">{selected.resource}</span></p>
            </div>
            <Button variant="outline" size="sm">Assign</Button>
          </div>

          {/* Lifecycle */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Incident Lifecycle</p>
            <div className="flex items-center gap-0">
              {stages.map((stage, i) => {
                const done = i < stageIdx;
                const active = i === stageIdx;
                return (
                  <React.Fragment key={stage}>
                    <div className={`flex-1 text-center py-2 px-1 rounded-lg text-xs font-semibold border transition-colors ${active ? 'bg-primary/20 border-primary/50 text-primary' : done ? 'bg-status-success/10 border-status-success/30 text-status-success' : 'bg-navy-900/60 border-slate-800 text-slate-500'}`}>
                      {done && <CheckCircle className="h-3 w-3 inline mr-1" />}{stage}
                    </div>
                    {i < stages.length - 1 && <div className={`h-px flex-shrink-0 w-4 ${i < stageIdx ? 'bg-status-success' : 'bg-slate-700'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Risk */}
          <div className="p-4 bg-navy-900/60 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-300">Risk Score</p>
              <span className={`text-sm font-bold ${selected.risk >= 80 ? 'text-status-critical' : selected.risk >= 60 ? 'text-status-warning' : 'text-status-success'}`}>{selected.risk}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${selected.risk >= 80 ? 'bg-status-critical' : selected.risk >= 60 ? 'bg-status-warning' : 'bg-status-success'}`} style={{ width: `${selected.risk}%` }} />
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-slate-300 leading-relaxed">This incident was triggered by anomalous login activity detected on the resource <span className="font-semibold text-slate-200">{selected.resource}</span>. The behavior deviates significantly from established baseline patterns. Immediate investigation and containment is recommended.</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            <Button size="sm" className="gap-1.5 text-xs"><ShieldAlert className="h-3.5 w-3.5" />Contain Threat</Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs"><CheckCircle className="h-3.5 w-3.5" />Mark Resolved</Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-status-critical hover:text-status-critical"><XCircle className="h-3.5 w-3.5" />Escalate</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
