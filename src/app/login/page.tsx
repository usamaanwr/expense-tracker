'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supbase';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  
  // States
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Custom UI Messages (No Browser Alert)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Submit Handler
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Client-side Check: Password Match Validation for Registration
    if (isSignUp && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-check.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // --- REGISTER ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          // Supabase handles "User already registered" error here
          if (error.message.toLowerCase().includes('already registered')) {
            throw new Error('This email is already registered. Please sign in instead.');
          }
          throw error;
        }

        if (data?.user && !data?.session) {
          setSuccessMessage('Registration successful! Please check your email to confirm your account.');
        } else if (data?.session) {
          router.push('/');
          router.refresh();
        }

      } else {
        // --- LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            throw new Error('Incorrect email or password. Please try again.');
          }
          throw error;
        }

        if (data?.session) {
          router.push('/');
          router.refresh();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleLogin = async () => {
  setErrorMessage(null);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // /auth/callback HATA KAR DIRECT ROOT '/' PATH DEIN:
      redirectTo: `${window.location.origin}/`,
    },
  });

  if (error) {
    setErrorMessage(error.message);
  }
};
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-zinc-400">
            {isSignUp
              ? 'Enter your details below to register'
              : 'Enter your credentials to access your dashboard'}
          </p>
        </div>

        {/* Custom Inline Error Message */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3.5 flex items-center gap-3 text-rose-400 text-xs animate-fadeIn">
            <AlertCircle size={16} className="shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Custom Inline Success Message */}
        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-400 text-xs animate-fadeIn">
            <CheckCircle2 size={16} className="shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Confirm Password Input (Only when Sign Up is active) */}
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-semibold py-2.5 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : isSignUp ? (
              <>
                <UserPlus size={16} />
                <span>Register Account</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-zinc-900 px-3 text-[10px] text-zinc-500 uppercase font-semibold absolute">
            Or
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 font-semibold py-2.5 rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggle Login/Register */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="text-xs text-zinc-400 hover:text-emerald-400 transition underline underline-offset-4 cursor-pointer"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Register"}
          </button>
        </div>

      </div>
    </div>
  );
}