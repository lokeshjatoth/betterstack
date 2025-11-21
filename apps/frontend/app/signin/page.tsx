'use client'
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';

// Fix: Use NEXT_PUBLIC_ prefix for client-side env vars
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

const SignIn = () => {
  const [formData, setFormData] = useState({
    identifier: '', // usage: maps to 'username' for backend
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user tries again
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Fix: Map 'identifier' to 'username' as expected by backend
      const response = await axios.post(`${backend_url}/user/signin`, {
        username: formData.identifier,
        password: formData.password
      });

      localStorage.setItem('token', response.data.jwt);
      
      // Fix: Use window.location for robust client-side navigation
      window.location.href = "/dashboard";

    } catch (err) {
      console.error("Signin failed", err);
      setError("Invalid username or password.");
    } finally {
      // Fix: Ensure loading state is always turned off
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-slate-900">
      {/* LEFT SIDE */}
      <div className="hidden w-1/2 flex-col justify-center bg-slate-50 px-12 lg:flex">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#00a67d] text-white font-bold">B</div>
            Better Stack
          </div>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight">
            Welcome back to <br />
            <span className="text-[#00a67d]">better monitoring.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Log in to access your dashboards, uptime monitors, and incident reports.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-600">
            <CheckCircle2 className="h-5 w-5 text-[#00a67d]" />
            <span>99.9% Uptime reliability</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <CheckCircle2 className="h-5 w-5 text-[#00a67d]" />
            <span>Real-time incident alerts</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full flex-col justify-center bg-white px-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Sign in</h2>
            <p className="mt-2 text-slate-600">
              New to Better Stack?{' '}
              <a href="/signup" className="font-medium text-[#00a67d] hover:underline">
                Start for free
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Username or Email
              </label>
              {/* Fix: name="identifier" matches state key, value maps correctly */}
              <input
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-[#00a67d] focus:outline-none focus:ring-1 focus:ring-[#00a67d]"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-[#00a67d] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-[#00a67d] focus:outline-none focus:ring-1 focus:ring-[#00a67d]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#00a67d] px-4 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-slate-500">
            &copy; 2025 Better Stack. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;