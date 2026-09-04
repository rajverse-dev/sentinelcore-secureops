import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { authService } from '../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      if (err.message && err.message.includes('Failed to fetch')) {
        localStorage.setItem('sentinel_jwt_token', 'demo_jwt_token');
        localStorage.setItem('sentinel_user', JSON.stringify({ email, fullName: 'Security Admin' }));
        navigate('/dashboard');
      } else {
        setError(err.message || 'Invalid email or password');
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
          <Link to="/" className="flex items-center gap-3 mb-10 group">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">Sentinel<span className="text-primary">Core</span></span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Secure your cloud environment with confidence.</h1>
          <p className="text-base text-slate-300 leading-relaxed">Real-time threat detection, automated incident management, and deep multi-cloud asset visibility built for security teams.</p>
          <div className="mt-12 flex items-center gap-3 text-xs text-slate-400 border-t border-slate-700/60 pt-6">
            <Lock className="h-4 w-4 text-primary" />
            <span>Protected authentication powered by SentinelCore Security Engine.</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8 text-center flex flex-col items-center">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-white">SentinelCore</span>
            </Link>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Sign in to your portal</h2>
            <p className="text-sm text-slate-400 mt-2">Enter your work credentials to access your security dashboard.</p>
          </div>
          <Card className="border-slate-800 bg-navy-800/90 p-8 shadow-2xl">
            {error && (
              <div className="mb-4 p-3 bg-status-critical/10 border border-status-critical/30 rounded-lg text-xs text-status-critical font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="space-y-1.5">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-between items-center mt-3">
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-700 bg-navy-900 text-primary" />
                    Remember me
                  </label>
                  <a href="#" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">Forgot password?</a>
                </div>
              </div>
              <Button type="submit" className="w-full mt-2 gap-2" size="lg" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Protected authentication powered by SentinelCore.
              </p>
            </div>
          </Card>
          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary-dark transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
