import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Search, AlertCircle, CheckCircle, ChevronRight, Lock, Server, Cloud, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const heroChartData = [
  { time: '00:00', threats: 12 },
  { time: '04:00', threats: 8 },
  { time: '08:00', threats: 24 },
  { time: '12:00', threats: 15 },
  { time: '16:00', threats: 29 },
  { time: '20:00', threats: 14 },
];

const posturePieData = [
  { name: 'Healthy', value: 78, color: '#10B981' },
  { name: 'Warning', value: 15, color: '#F59E0B' },
  { name: 'Critical', value: 7, color: '#EF4444' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-slate-200">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-slate-300">SentinelCore v2.0 Platform is Live</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
                Cloud Security Monitoring, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-400">Simplified.</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
                Monitor your cloud environment, detect threats, investigate incidents, and respond faster from one intelligent security platform.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/register"><Button size="lg" className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
                <Link to="/dashboard"><Button size="lg" variant="outline">Explore Platform</Button></Link>
              </div>
              <div className="mt-12 flex items-center gap-8 text-xs text-slate-400 border-t border-slate-800/80 pt-6">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-status-success" /> Multi-Cloud AWS, Azure &amp; GCP</div>
                <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> SOC2 Type II Certified</div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-blue-500/10 to-transparent rounded-2xl blur-xl" />
              <div className="relative bg-navy-800/90 border border-slate-700/80 rounded-2xl shadow-2xl p-5 overflow-hidden backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-700/70 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-status-success animate-pulse" />
                    <span className="font-semibold text-sm text-white">Live Posture Monitoring</span>
                  </div>
                  <Badge variant="healthy">98.4% Health</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-navy-900/90 border border-slate-800 rounded-lg">
                    <p className="text-xs text-slate-400">Security Score</p>
                    <p className="text-2xl font-bold text-white mt-1">87<span className="text-xs font-normal text-slate-500">/100</span></p>
                  </div>
                  <div className="p-3 bg-navy-900/90 border border-slate-800 rounded-lg">
                    <p className="text-xs text-slate-400">Monitored Assets</p>
                    <p className="text-2xl font-bold text-white mt-1">156</p>
                  </div>
                </div>
                <div className="bg-navy-900/90 border border-slate-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Threat Velocity</span>
                    <span className="text-xs text-status-success font-semibold">-12% vs last week</span>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={heroChartData}>
                        <defs>
                          <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="threats" stroke="#3B82F6" strokeWidth={2} fill="url(#heroGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-navy-900/80 rounded-md text-xs border border-slate-800">
                    <div className="flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-status-critical" /><span className="text-slate-200">Suspicious Admin Login</span></div>
                    <Badge variant="critical">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-navy-900/80 rounded-md text-xs border border-slate-800">
                    <div className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-status-success" /><span className="text-slate-200">IAM Policy Scan Complete</span></div>
                    <Badge variant="healthy">Healthy</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST METRICS */}
      <section className="py-14 border-y border-slate-800/80 bg-navy-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Monitored Assets', value: '156+', icon: Server },
              { label: 'Threats Detected', value: '24', icon: Shield },
              { label: 'Active Incidents', value: '08', icon: AlertCircle },
              { label: 'Security Health', value: '98.4%', icon: Activity }
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center p-4">
                <m.icon className="h-6 w-6 text-primary mb-3" />
                <span className="text-3xl sm:text-4xl font-bold text-white mb-1 tracking-tight">{m.value}</span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to stay ahead of threats.</h2>
            <p className="text-slate-400 text-base">Continuous cloud visibility, intelligent detection rules, and automated incident triage.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Cloud Security Monitoring', desc: 'Monitor cloud resources and security activity across your environment in real-time.', icon: Cloud },
              { title: 'Threat Detection', desc: 'Identify suspicious behavior, unauthorized logins, and potential security threats instantly.', icon: Search },
              { title: 'Incident Management', desc: 'Track, investigate, prioritize, and resolve security incidents with full audit trails.', icon: Activity },
              { title: 'Intelligent Assistance', desc: 'Provide contextual recommendations to help security teams respond faster.', icon: Sparkles }
            ].map((f, i) => (
              <Card key={i} className="group hover:border-primary/50 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-navy-900 border border-slate-700/80 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:border-primary/40 transition-colors text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY VISUALIZATION */}
      <section id="security" className="py-24 bg-navy-800/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">See your security posture at a glance.</h2>
            <p className="text-slate-400">Unified visualization across AWS, Azure, and Google Cloud Platform.</p>
          </div>
          <div className="grid lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-5 flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-white mb-4">Cloud Health Posture</h3>
              <div className="h-56 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={posturePieData} innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value">
                      {posturePieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-3xl font-bold text-white">87%</span>
                  <span className="block text-xs text-slate-400 uppercase">Overall Posture</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-800 pt-4 mt-2">
                <div><span className="block text-xs text-slate-400">Healthy</span><span className="font-bold text-status-success">135</span></div>
                <div><span className="block text-xs text-slate-400">Warning</span><span className="font-bold text-status-warning">13</span></div>
                <div><span className="block text-xs text-slate-400">Critical</span><span className="font-bold text-status-critical">8</span></div>
              </div>
            </Card>
            <Card className="lg:col-span-7 flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-white mb-4">Cloud Provider Distribution</h3>
              <div className="space-y-5">
                {[
                  { name: 'Amazon Web Services (AWS)', count: 82, percent: 52, color: 'bg-amber-500' },
                  { name: 'Microsoft Azure', count: 51, percent: 33, color: 'bg-primary' },
                  { name: 'Google Cloud Platform (GCP)', count: 23, percent: 15, color: 'bg-indigo-500' }
                ].map((prov, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-200">{prov.name}</span>
                      <span className="text-slate-400">{prov.count} Assets ({prov.percent}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-navy-900 rounded-full overflow-hidden border border-slate-800">
                      <div className={`h-full ${prov.color}`} style={{ width: `${prov.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-navy-900/80 rounded-lg border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-status-success" /> Automated vulnerability scanning enabled</span>
                <span className="text-slate-500">Updated 5m ago</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* INCIDENT MANAGEMENT */}
      <section id="incident-management" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">From detection to resolution.</h2>
            <p className="text-slate-400">Automated incident workflow designed for fast investigation and containment.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-4 gap-2 mb-10 text-center">
              {['Detected', 'Investigating', 'Contained', 'Resolved'].map((step, i) => (
                <div key={step} className="p-3 bg-navy-800/80 border border-slate-700/80 rounded-lg">
                  <span className="block text-xs text-primary font-bold mb-1">0{i + 1}</span>
                  <span className="text-sm font-semibold text-white">{step}</span>
                </div>
              ))}
            </div>
            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-slate-800">
                {[
                  { title: 'Suspicious administrator login from Tor exit node', severity: 'critical', type: 'Critical', res: 'AWS Production' },
                  { title: 'Unusual outbound network traffic spike (50GB+)', severity: 'high', type: 'High', res: 'Azure API Gateway' },
                  { title: 'Unexpected IAM permission change on S3 bucket', severity: 'medium', type: 'Medium', res: 'AWS Dev Storage' }
                ].map((inc, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <Badge variant={inc.severity as any}>{inc.type}</Badge>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{inc.title}</h4>
                        <span className="text-xs text-slate-400">{inc.res}</span>
                      </div>
                    </div>
                    <Link to="/dashboard/incidents">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">Investigate <ChevronRight className="h-4 w-4" /></Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-navy-800/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How SentinelCore Works</h2>
            <p className="text-slate-400">Four straightforward steps to secure your entire cloud ecosystem.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Connect', desc: 'Connect your AWS, Azure, or GCP cloud environments in under 5 minutes.' },
              { step: '02', title: 'Monitor', desc: 'Continuously monitor cloud activity, configurations, and network flows.' },
              { step: '03', title: 'Detect', desc: 'Identify suspicious behavior and potential threats with high precision.' },
              { step: '04', title: 'Respond', desc: 'Investigate incidents with AI guidance and execute automated containment.' }
            ].map((item, i) => (
              <div key={i} className="relative p-6 bg-navy-800/60 border border-slate-800 rounded-xl">
                <span className="text-4xl font-bold text-primary/40 block mb-3 font-mono">{item.step}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Take control of your cloud security.</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Monitor, detect, investigate, and respond from one unified security platform.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register"><Button size="lg" className="px-8">Get Started</Button></Link>
            <Link to="/dashboard"><Button size="lg" variant="secondary" className="px-8">View Dashboard</Button></Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-navy-900 py-12 text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-white">SentinelCore</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">Cloud Security Monitoring &amp; Incident Management Platform.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/dashboard/threats" className="hover:text-white transition-colors">Threat Detection</Link></li>
                <li><Link to="/dashboard/incidents" className="hover:text-white transition-colors">Incidents</Link></li>
                <li><Link to="/dashboard/assets" className="hover:text-white transition-colors">Cloud Assets</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Security</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} SentinelCore Inc. All rights reserved.</p>
            <p>Enterprise Cloud Security Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
