import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Cpu, ShieldCheck, ArrowRight, Activity, Lock, AlertOctagon } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const Login: React.FC = () => {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('bhanu.sreekar@chainiq.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed or popup was closed. Access denied.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glow grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-center">
        {/* Left Column: Login Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                ChainIQ<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Enterprise Identity Sign In
            </h1>
            <p className="text-xs text-slate-400">
              Access CatBoost ML decision engine and global supply chain telemetry.
            </p>
          </div>

          <Card variant="glass" className="p-6 space-y-4 border-slate-800">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Google SSO Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-xs font-bold text-white transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'Signing in with Google...' : 'Sign in with Google'}</span>
            </button>

            <div className="flex items-center gap-3 text-[11px] text-slate-500 my-1">
              <div className="h-px bg-slate-800 flex-1" />
              <span>OR EMAIL SIGN IN</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                label="Corporate Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bhanu.sreekar@chainiq.ai"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>Remember Session</span>
                </label>
                <span className="text-indigo-400 hover:underline cursor-pointer">SAML SSO</span>
              </div>

              <Button
                type="submit"
                variant="ai"
                size="lg"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 mt-2"
              >
                {loading ? 'Authenticating Token...' : 'Sign In to Platform'}
              </Button>
            </form>
          </Card>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> TLS 1.3 256-bit Encrypted
            </span>
            <span className="font-mono text-cyan-400 font-bold">Strict Security Active</span>
          </div>
        </div>

        {/* Right Column: Animated Telemetry Visualizer (7 cols) */}
        <div className="lg:col-span-7">
          <Card variant="indigo" className="p-8 space-y-6 border-indigo-500/40 relative min-h-[440px] flex flex-col justify-between overflow-hidden">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 animate-pulse" /> LIVE LOGISTICS TELEMETRY
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  CatBoost ML Active
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Predictive Risk &amp; Decision Intelligence Platform
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Real-time CatBoost classifier analyzing 180,519 order vectors across 5 continental trade corridors.
              </p>
            </div>

            {/* Simulated Live Node Radar */}
            <div className="relative flex-1 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 min-h-[200px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
              <div className="w-32 h-32 rounded-full border-2 border-indigo-500/30 flex items-center justify-center relative">
                <div className="w-24 h-24 rounded-full border-2 border-cyan-400/40 animate-ping opacity-75" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xs shadow-lg shadow-cyan-500/40">
                  ChainIQ
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-500/20 flex items-center justify-between text-xs text-slate-300 relative z-10">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authenticated Enterprise Gateway
              </span>
              <span className="font-mono text-slate-400">v1.5.0-prod</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
