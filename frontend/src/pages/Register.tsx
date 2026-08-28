import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { authService } from '../services/auth';

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-status-critical', 'bg-status-warning', 'bg-status-success'][strength];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.register({ fullName, email, password });
      navigate('/login');
    } catch (err: any) {
      if (err.message && err.message.includes('Failed to fetch')) {
        navigate('/login');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-navy-800 border-r border-slate-800 items-center justify-center p-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-lg px-12">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">Sentinel<span className="text-primary">Core</span></span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Start securing your cloud today.</h1>
          <p className="text-base text-slate-300 leading-relaxed mb-10">Join security teams using SentinelCore to monitor, detect, and respond to cloud threats in real time.</p>
          <div className="space-y-4">
            {[
              'Real-time cloud threat detection',
              'Automated incident triage & management',
              'Multi-cloud asset inventory & monitoring',
              'AI-powered security recommendations',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle className="h-5 w-5 text-status-success flex-shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-white">SentinelCore</span>
            </Link>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-sm text-slate-400 mt-2">Set up your SentinelCore security portal in seconds.</p>
          </div>
          <Card className="border-slate-800 bg-navy-800/90 p-8 shadow-2xl">
            {error && (
              <div className="mb-4 p-3 bg-status-critical/10 border border-status-critical/30 rounded-lg text-xs text-status-critical font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Work Email"
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="space-y-2">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= strength ? strengthColor : 'bg-slate-700'}`} />
                      ))}
                    </div>
                    <p className={`text-[10px] font-semibold ${['', 'text-status-critical', 'text-status-warning', 'text-status-success'][strength]}`}>
                      {strengthLabel} password
                    </p>
                  </div>
                )}
              </div>
              <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 rounded border-slate-700 bg-navy-900 text-primary" />
                <span>I agree to SentinelCore's <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></span>
              </label>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Card>
          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
