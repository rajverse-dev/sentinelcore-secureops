
import { Link } from 'react-router-dom';
import { Shield, Activity, Search, AlertCircle, CheckCircle, ChevronRight, Lock, Server, Cloud } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-900 selection:bg-primary/30">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-status-success"></span>
                <span className="text-xs font-medium text-slate-300">SentinelCore v2.0 is now live</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
                Cloud Security Monitoring, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Simplified.</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Monitor your cloud environment, detect threats, investigate incidents, and respond faster from one intelligent security platform.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">Explore Platform</Button>
                </Link>
              </div>
            </div>
            
            {/* Hero Dashboard Visualization */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl blur-xl" />
              <div className="relative bg-navy-800 border border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-white">Security Posture</span>
                  </div>
                  <Badge variant="healthy">98.4% Healthy</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="p-4 bg-navy-900 border-slate-800">
                    <p className="text-sm text-slate-400 mb-1">Active Threats</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </Card>
                  <Card className="p-4 bg-navy-900 border-slate-800">
                    <p className="text-sm text-slate-400 mb-1">Monitored Assets</p>
                    <p className="text-2xl font-bold text-white">156</p>
                  </Card>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-300">Recent Activity</p>
                  {[
                    { icon: CheckCircle, color: 'text-status-success', text: 'AWS IAM Policy scan completed', time: '2m ago' },
                    { icon: AlertCircle, color: 'text-status-warning', text: 'Unusual network spike detected', time: '15m ago' },
                    { icon: Activity, color: 'text-primary', text: 'Automated threat containment', time: '1h ago' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-navy-900 p-3 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-sm text-slate-200">{item.text}</span>
                      </div>
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / METRICS SECTION */}
      <section className="py-12 border-y border-slate-800 bg-navy-800/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Monitored Assets', value: '156+', icon: Server },
              { label: 'Threats Detected', value: '24', icon: Shield },
              { label: 'Active Incidents', value: '08', icon: AlertCircle },
              { label: 'Security Health', value: '98.4%', icon: Activity }
            ].map((metric, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center">
                <metric.icon className="h-6 w-6 text-slate-500 mb-3" />
                <span className="text-3xl font-bold text-white mb-1">{metric.value}</span>
                <span className="text-sm text-slate-400">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need to stay ahead of threats.</h2>
            <p className="text-slate-400">Comprehensive security tools built into a single, unified platform.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Cloud Security Monitoring',
                desc: 'Monitor cloud resources and security activity across your environment.',
                icon: Cloud
              },
              {
                title: 'Threat Detection',
                desc: 'Identify suspicious behavior and potential threats in real-time.',
                icon: Search
              },
              {
                title: 'Incident Management',
                desc: 'Track, investigate, prioritize, and resolve security incidents.',
                icon: Activity
              },
              {
                title: 'Intelligent Assistance',
                desc: 'Provide contextual recommendations to help security teams respond faster.',
                icon: Lock
              }
            ].map((feature, i) => (
              <Card key={i} className="group hover:border-primary/50 transition-colors cursor-pointer">
                <div className="h-12 w-12 rounded-lg bg-navy-900 border border-slate-700 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors text-slate-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* INCIDENT MANAGEMENT SECTION */}
      <section id="incident-management" className="py-24 bg-navy-800/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">From detection to resolution.</h2>
            <p className="text-slate-400">Streamlined incident workflow to help you respond to threats faster.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-slate-700 -z-10" />
              {['Detected', 'Investigating', 'Contained', 'Resolved'].map((step, i) => (
                <div key={step} className="flex flex-col items-center gap-2 bg-navy-900 px-4">
                  <div className={`h-4 w-4 rounded-full border-2 ${i === 0 ? 'bg-status-critical border-status-critical' : 'bg-navy-900 border-slate-600'}`} />
                  <span className={`text-sm font-medium ${i === 0 ? 'text-white' : 'text-slate-400'}`}>{step}</span>
                </div>
              ))}
            </div>
            
            <Card className="overflow-hidden p-0">
              <div className="divide-y divide-slate-800">
                {[
                  { title: 'Suspicious administrator login', severity: 'critical', type: 'Critical' },
                  { title: 'Unusual outbound network traffic', severity: 'high', type: 'High' },
                  { title: 'Unexpected IAM permission change', severity: 'medium', type: 'Medium' }
                ].map((inc, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <Badge variant={inc.severity as any}>{inc.type}</Badge>
                      <span className="font-medium text-slate-200">{inc.title}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                      View <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How SentinelCore Works</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Connect', desc: 'Connect your cloud environment.' },
              { step: '02', title: 'Monitor', desc: 'Continuously monitor security activity.' },
              { step: '03', title: 'Detect', desc: 'Identify suspicious events and threats.' },
              { step: '04', title: 'Respond', desc: 'Investigate and resolve incidents faster.' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <span className="text-6xl font-bold text-slate-800/50 absolute -top-8 -left-4 -z-10">{item.step}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-primary/5 blur-[100px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-white mb-6">Take control of your cloud security.</h2>
          <p className="text-lg text-slate-300 mb-8">
            Monitor, detect, investigate, and respond from one unified security platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary">View Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-navy-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold tracking-tight text-white">SentinelCore</span>
              </Link>
              <p className="text-slate-400 text-sm max-w-xs">
                Cloud Security Monitoring & Incident Management Platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Monitoring</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Threat Detection</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Incidents</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Security</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} SentinelCore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
