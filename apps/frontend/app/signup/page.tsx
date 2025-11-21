'use client'
import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Ensure your .env file has NEXT_PUBLIC_BACKEND_URL=http://your-api.com
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  // Optional: Add error state to show messages to user
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${backend_url}/user/signup`, {
        username: formData.username,
        password: formData.password
      });

      // Assuming response.data.jwt exists based on your snippet
      localStorage.setItem('token', response.data.jwt);
      
      // Redirect after successful signup
      router.push("/dashboard");
      
    } catch (err) {
      console.error("Signup failed", err);
      setError("Signup failed. Please try again.");
    } finally {
      // Always turn off loading, even if it failed
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
            Monitor your entire <br />
            <span className="text-[#00a67d]">infrastructure.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Get instant alerts when things go wrong. Built for teams that ship fast and need reliability.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="italic text-slate-700">"The most intuitive monitoring tool we've ever used. It just works."</p>
          <div className="mt-4 flex items-center gap-2">
             <div className="h-8 w-8 rounded-full bg-slate-200"></div>
             <div className="text-sm font-semibold text-slate-900">Engineering Team Lead</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full flex-col justify-center bg-white px-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
            <p className="mt-2 text-slate-600">
              Already have an account?{' '}
              <a href="/signin" className="font-medium text-[#00a67d] hover:underline">
                Log in
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-[#00a67d] focus:outline-none focus:ring-1 focus:ring-[#00a67d]"
                placeholder="Pick a username"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-[#00a67d] focus:outline-none focus:ring-1 focus:ring-[#00a67d]"
                placeholder="Create a password"
              />
              <p className="mt-1 text-xs text-slate-500">Must be at least 8 characters long.</p>
            </div>
            
             <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-[#00a67d] focus:outline-none focus:ring-1 focus:ring-[#00a67d]"
                placeholder="Confirm your password"
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
                  <span>Signing up...</span>
                  </>
              ) : (
                  <>
                  Start monitoring for free
                  <ArrowRight className="h-4 w-4" />
                  </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            By clicking "Start monitoring", you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;