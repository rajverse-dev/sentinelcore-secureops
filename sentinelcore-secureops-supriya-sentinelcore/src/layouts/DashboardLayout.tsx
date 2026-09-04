import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Search, AlertCircle, Cloud, Server, FileText, Users, Settings, Bell, Calendar, Menu, X, Bot, Sparkles, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! I am your SentinelCore Incident Assistant. How can I help you investigate today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard/incidents': return 'Incident Management';
      case '/dashboard/threats': return 'Threat Detection';
      case '/dashboard/assets': return 'Cloud Assets';
      default: return 'Security Overview';
    }
  };

  const navigation = [
    { name: 'Overview', heading: true },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Security', heading: true },
    { name: 'Threat Detection', href: '/dashboard/threats', icon: Search },
    { name: 'Incidents', href: '/dashboard/incidents', icon: AlertCircle },
    { name: 'Security Events', href: '#', icon: Shield },
    { name: 'Cloud', heading: true },
    { name: 'Cloud Assets', href: '/dashboard/assets', icon: Cloud },
    { name: 'Infrastructure', href: '#', icon: Server },
    { name: 'Management', heading: true },
    { name: 'Reports', href: '#', icon: FileText },
    { name: 'Users', href: '#', icon: Users },
    { name: 'System', heading: true },
    { name: 'Settings', href: '#', icon: Settings },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      let reply = "This incident involves an administrator account attempting access from an unusual location. The activity may indicate account compromise. Recommended: verify the login, review recent IAM changes, and temporarily restrict affected credentials.";
      if (userMsg.toLowerCase().includes('risk')) reply = "Risk score is 88/100 (Critical). High risk of lateral movement across AWS Production resources.";
      else if (userMsg.toLowerCase().includes('recommend') || userMsg.toLowerCase().includes('action')) reply = "Recommended: 1) Revoke active session tokens, 2) Enforce MFA re-authentication, 3) Block IP on Cloud WAF.";
      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 600);
  };

  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden text-slate-200">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-navy-900/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-800 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Sentinel<span className="text-primary">Core</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navigation.map((item, i) => {
            if (item.heading) {
              return <div key={i} className="px-3 pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.name}</div>;
            }
            return (
              <NavLink
                key={item.name}
                to={item.href!}
                end={item.href === '/dashboard'}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/15 text-primary font-semibold border border-primary/20' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-navy-900/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Jane Doe</p>
              <p className="text-[10px] text-slate-400 truncate">SOC Lead Analyst</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-navy-900/90 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white p-1">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">{getPageTitle()}</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Monitor your cloud security posture and respond to emerging threats.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-slate-700 text-xs text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Last 7 Days</span>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg bg-navy-800/80 border border-slate-800">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-critical" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">JD</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* AI ASSISTANT BUTTON */}
      <button
        onClick={() => setAssistantOpen(!assistantOpen)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-primary-dark transition-all duration-200 z-40 border border-blue-400/30 hover:scale-105"
        title="SentinelCore Assistant"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* AI ASSISTANT PANEL */}
      {assistantOpen && (
        <div className="fixed bottom-22 right-6 w-80 sm:w-96 bg-navy-800 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 h-[520px]">
          <div className="p-4 border-b border-slate-700 bg-navy-900/90 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/20 text-primary"><Sparkles className="h-4 w-4" /></div>
              <div>
                <h3 className="font-semibold text-white text-sm">SentinelCore Assistant</h3>
                <p className="text-[10px] text-slate-400">Contextual Guidance &amp; Triage</p>
              </div>
            </div>
            <button onClick={() => setAssistantOpen(false)} className="text-slate-400 hover:text-white p-1"><X className="h-4 w-4" /></button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${m.sender === 'user' ? 'bg-primary text-white ml-auto rounded-br-none' : 'bg-navy-900 border border-slate-700/80 text-slate-300 rounded-bl-none'}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-700 bg-navy-900/90 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {['Explain incident', 'Assess risk', 'Recommend actions', 'Summarize timeline'].map((chip) => (
                <button key={chip} onClick={() => setChatInput(chip)} className="text-[10px] bg-navy-800 border border-slate-700 px-2.5 py-1 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">{chip}</button>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about an incident..."
                className="flex-1 bg-navy-800 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
              />
              <Button type="submit" size="sm" className="px-3"><Send className="h-3.5 w-3.5" /></Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
