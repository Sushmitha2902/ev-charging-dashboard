'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const demoUsers = [
  { label: 'Demo User', email: 'arjun@example.com', password: 'password123' },
  { label: 'Admin', email: 'admin@evcharge.com', password: 'admin123' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setAuthError('');
    await new Promise(r => setTimeout(r, 600)); // mock delay
    const result = login(data.email, data.password);
    if (result.success) {
      const user = useAuthStore.getState().user;
      router.push(user?.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setAuthError(result.error || 'Login failed');
    }
  };

  const fillDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-electric-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-volt-500 flex items-center justify-center shadow-lg shadow-electric-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">VoltMap</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Welcome back</h1>
          <p className="text-white/40 mt-2 text-sm">Sign in to manage your EV charging</p>
        </div>

        {/* Demo buttons */}
        <div className="flex gap-2 mb-5">
          {demoUsers.map(({ label, email, password }) => (
            <button
              key={label}
              onClick={() => fillDemo(email, password)}
              className="flex-1 text-xs bg-electric-500/10 hover:bg-electric-500/20 border border-electric-500/20 hover:border-electric-500/40 text-electric-300 py-2 px-3 rounded-lg transition-all font-medium"
            >
              Try as {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-gray-900/60 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {authError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-300">{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-500 hover:to-electric-400 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-electric-500/20 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-white/40">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-electric-400 hover:text-electric-300 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
