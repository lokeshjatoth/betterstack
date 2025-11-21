'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Globe, 
  Activity, 
  Loader2,
  Calendar,
  RefreshCw,
  LogOut
} from 'lucide-react';
import axios from 'axios';

// --- TYPES ---
enum WebsiteStatus {
  Up = 'Up',
  Down = 'Down',
  Unknown = 'Unknown'
}

interface WebsiteTick {
  id: string;
  response_time_ms: number;
  status: WebsiteStatus;
  createdAt: string; 
}

interface WebsiteDetails {
  id: string;
  url: string;
  user_id: string;
  ticks: WebsiteTick[];
}

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

const WebsiteDetails = () => {
  const [website, setWebsite] = useState<WebsiteDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract ID from URL (simple robust method for client-side only apps)
  const getWebsiteId = () => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/');
      return parts[parts.length - 1]; // Assumes /website/:id structure
    }
    return null;
  };

  const fetchDetails = useCallback(async () => {
    const id = getWebsiteId();
    const token = localStorage.getItem('token');

    if (!id || !token) {
      window.location.href = '/dashboard';
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${backend_url}/status/${id}`, {
        headers: { Authorization: token }
      });
      
      // Ensure we handle the case where backend might return the object directly or nested
      setWebsite(response.data);
      setError('');
    } catch (err) {
      console.error("Failed to fetch details:", err);
      setError("Could not load website details.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDetails, 30000);
    return () => clearInterval(interval);
  }, [fetchDetails]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };

  // --- DERIVED STATS ---
  const latestTick = website?.ticks?.[0]; // Assuming backend sorts desc (newest first)
  const isUp = latestTick?.status === WebsiteStatus.Up;
  const currentStatus = latestTick?.status || WebsiteStatus.Unknown;
  
  // Prepare ticks for display (We want Oldest -> Newest (Left to Right) for the visual bar)
  // Backend gives Newest -> Oldest (Desc). So we slice(0, 10) then reverse().
  const historyTicks = website?.ticks ? [...website.ticks].slice(0, 10).reverse() : [];

  // Pad ticks if we have fewer than 10 to keep visual consistency
  const filledTicks = [...Array(10 - historyTicks.length).fill(null), ...historyTicks];

  if (isLoading && !website) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-[#00a67d]">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span className="font-medium text-slate-600">Loading monitor details...</span>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <div className="text-red-500 mb-4">{error || "Website not found"}</div>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="flex items-center gap-2 rounded-md bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div 
            onClick={() => window.location.href = '/dashboard'}
            className="flex cursor-pointer items-center gap-2 text-xl font-bold text-slate-900"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#00a67d] text-white font-bold text-sm">B</div>
            Better Stack
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* --- CONTENT --- */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#00a67d] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Monitors
        </button>

        {/* Header Card */}
        <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isUp ? 'bg-green-100 text-[#00a67d]' : 'bg-red-100 text-red-600'}`}>
                  {isUp ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 truncate max-w-md" title={website.url}>
                    {website.url.replace(/^https?:\/\//, '')}
                  </h1>
                  <a 
                    href={website.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm text-slate-500 hover:text-[#00a67d] hover:underline"
                  >
                    <Globe className="h-3 w-3" />
                    {website.url}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <div className={`rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wide ${isUp ? 'bg-green-100 text-[#00a67d]' : 'bg-red-100 text-red-600'}`}>
                    {currentStatus === WebsiteStatus.Unknown ? 'Checking...' : currentStatus}
                 </div>
                 <button 
                    onClick={fetchDetails}
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    title="Refresh Status"
                 >
                    <RefreshCw className="h-5 w-5" />
                 </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
             {/* Metric 1 */}
             <div className="p-6">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Activity className="h-4 w-4" />
                  Response Time
                </div>
                <div className="text-2xl font-semibold text-slate-900">
                  {latestTick ? `${latestTick.response_time_ms}ms` : '-'}
                </div>
             </div>
             
             {/* Metric 2 */}
             <div className="p-6">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Clock className="h-4 w-4" />
                  Last Checked
                </div>
                <div className="text-2xl font-semibold text-slate-900">
                  {latestTick ? new Date(latestTick.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </div>
             </div>

             {/* Metric 3 */}
             <div className="p-6">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Calendar className="h-4 w-4" />
                  Added On
                </div>
                <div className="text-xl font-semibold text-slate-900">
                  {new Date().toLocaleDateString()} {/* Placeholder or real date from website.time_added */}
                </div>
             </div>
          </div>
        </div>

        {/* History Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-bold text-slate-900">Recent Activity (Last 10 Checks)</h2>
          
          <div className="flex w-full items-end gap-1.5 h-16 sm:gap-2">
            {filledTicks.map((tick, index) => {
              // Determine visual state
              const isTickUp = tick?.status === WebsiteStatus.Up;
              const isTickDown = tick?.status === WebsiteStatus.Down;
              const isEmpty = !tick;

              let bgClass = 'bg-slate-100'; // Default / Empty
              if (isTickUp) bgClass = 'bg-[#00a67d]';
              if (isTickDown) bgClass = 'bg-red-500';

              return (
                <div 
                  key={tick ? tick.id : `empty-${index}`} 
                  className="group relative flex-1 flex flex-col justify-end"
                >
                  {/* Tooltip */}
                  {tick && (
                    <div className="absolute bottom-full left-1/2 mb-2 hidden w-32 -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-center text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-10">
                      <div className="font-bold">{tick.status}</div>
                      <div>{tick.response_time_ms}ms</div>
                      <div className="text-slate-400">{new Date(tick.createdAt).toLocaleTimeString()}</div>
                      {/* Triangle pointer */}
                      <div className="absolute top-full left-1/2 -ml-1 h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-slate-900"></div>
                    </div>
                  )}

                  {/* The Bar */}
                  <div 
                    className={`w-full rounded-sm transition-all duration-300 ${bgClass} ${isEmpty ? 'h-2' : 'h-12 hover:h-14'}`} 
                  />
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex justify-between text-xs text-slate-400">
            <span>Older</span>
            <span>Now</span>
          </div>
        </div>

      </main>
    </div>
  );
};

export default WebsiteDetails;