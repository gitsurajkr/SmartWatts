'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gauge, User, Mail, Lock, Eye, EyeOff, TrendingDown, Plug, BarChart3 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup({ name, email, password });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0a1428] via-[#0d1f3c] to-[#071a10] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute -top-20 -right-20 w-85 h-85 rounded-full border border-[#00d9a3]/10 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-55 h-55 rounded-full border border-[#00d9a3]/15 pointer-events-none" />
        <div className="absolute -bottom-25 -left-15 w-75 h-75 rounded-full border border-[#0066ff]/10 pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#00d9a3]/15 border border-[#00d9a3]/30 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-[#00d9a3]" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">SmartWatts</span>
        </div>

        {/* Headline + features */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Track. Save.<br />
              <span className="text-[#00d9a3]">Stay in control.</span>
            </h2>
            <p className="text-[#8fa3c0] mt-4 text-base leading-relaxed max-w-xs">
              Monitor your home electricity usage in real time and cut your bills with smart insights.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#0066ff]/15 border border-[#0066ff]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BarChart3 className="w-4 h-4 text-[#0066ff]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Live usage analytics</p>
                <p className="text-[#8fa3c0] text-xs mt-0.5">Hour-by-hour breakdown of every device</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#00d9a3]/15 border border-[#00d9a3]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingDown className="w-4 h-4 text-[#00d9a3]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Bill forecasting</p>
                <p className="text-[#8fa3c0] text-xs mt-0.5">Know your next bill before it arrives</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#6b5eff]/15 border border-[#6b5eff]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Plug className="w-4 h-4 text-[#6b5eff]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Device-level monitoring</p>
                <p className="text-[#8fa3c0] text-xs mt-0.5">See exactly what&apos;s drawing power</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stat */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-[#8fa3c0] text-xs">Trusted by homeowners to reduce energy costs</p>
          <p className="text-white font-semibold text-sm mt-1">Avg. 23% reduction in monthly bills</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">SmartWatts</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-foreground">Create account</h1>
            <p className="text-muted-foreground text-sm mt-1">Start tracking your electricity usage</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-lg bg-primary text-white hover:bg-primary/90 active:scale-[0.98] transition-all font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
