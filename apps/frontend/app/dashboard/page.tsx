'use client'
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Search, 
  LogOut, 
  Globe, 
  Clock, 
  Activity, 
  Trash2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import axios from 'axios';

// --- TYPES BASED ON PRISMA SCHEMA ---

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
  region_id?: string;
}

interface Website {
  id: string;
  url: string;
  time_added: string;
  user_id: string;
  ticks: WebsiteTick[];
}

// Get backend URL from environment
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

const Dashboard = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [newUrl, setNewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH DATA FROM BACKEND ---
  const fetchWebsites = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/signin';
        return;
      }

      const response = await axios.get(`${backend_url}/websites`, {
        headers: {
          Authorization: token
        }
      });

      // Backend returns { websites: [...] }
      setWebsites(response.data.websites);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch websites:", error);
      // Optional: Redirect to signin on 401/403
      if (axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 401)) {
        window.location.href = '/signin';
      }
    }
  }, []);

  // Initial fetch and Polling (every 30 seconds)
  useEffect(() => {
    fetchWebsites(); // Fetch immediately on mount

    const intervalId = setInterval(() => {
      fetchWebsites();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchWebsites]);


  // Helper to calculate stats from ticks
  const getWebsiteStats = (ticks: WebsiteTick[]) => {
    if (!ticks || ticks.length === 0) {
      return { 
        status: WebsiteStatus.Unknown, 
        lastCheck: 'Pending', 
        uptime: '-', 
        color: 'bg-slate-100 text-slate-500' 
      };
    }

    // Backend returns ticks ordered by createdAt desc, so [0] is latest
    const latest = ticks[0];

    // Determine Colors
    let color = 'bg-slate-100 text-slate-600';
    if (latest.status === WebsiteStatus.Up) color = 'bg-green-50 text-[#00a67d]';
    if (latest.status === WebsiteStatus.Down) color = 'bg-red-50 text-red-600';

    // Format Time
    const timeDiff = Math.floor((new Date().getTime() - new Date(latest.createdAt).getTime()) / 1000);
    let lastCheck = 'Just now';
    if (timeDiff > 60) lastCheck = `${Math.floor(timeDiff / 60)} min ago`;
    
    // Note: Since backend sends `take: 1`, we can't calculate historical uptime percentage accurately 
    // on the frontend without fetching more history. Showing status based on latest tick.
    const uptime = latest.status === WebsiteStatus.Up ? 'Operational' : 'Down';

    return { 
      status: latest.status, 
      lastCheck, 
      uptime, 
      color 
    };
  };

  const filteredWebsites = useMemo(() => {
    return websites.filter(site => 
      site.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [websites, searchQuery]);

  // --- ADD MONITOR ---
  const handleAddMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    // Fix: Ensure URL has https:// prefix before sending
    let urlToSend = newUrl.trim();
    if (!/^https?:\/\//i.test(urlToSend)) {
      urlToSend = `https://${urlToSend}`;
    }

    try {
      await axios.post(`${backend_url}/website`, {
        url: urlToSend
      }, {
        headers: { Authorization: token }
      });

      // Refresh the list from backend to get the new entry with correct ID/structure
      await fetchWebsites();
      
      setNewUrl('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add monitor:", error);
      alert("Failed to add website. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete functionality is not yet implemented in the backend schema provided. This will only remove it from view temporarily.')) {
        // Optimistic update for UI demo
        setWebsites(websites.filter(w => w.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };

  // Stats for top cards
  const totalMonitors = websites.length;
  const upMonitors = websites.filter(w => w.ticks[0]?.status === WebsiteStatus.Up).length;
  const downMonitors = websites.filter(w => w.ticks[0]?.status === WebsiteStatus.Down).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#00a67d] text-white font-bold text-sm">B</div>
            Better Stack
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden text-sm text-slate-500 sm:block">Dashboard</div>
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

      {/* --- MAIN CONTENT --- */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Monitors</h1>
            <p className="mt-1 text-slate-500">Overview of your infrastructure status.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-md bg-[#00a67d] px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            <Plus className="h-5 w-5" />
            Add monitor
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <Activity className="h-5 w-5" />
              <span className="text-sm font-medium">Total Monitors</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {isLoading ? '...' : totalMonitors}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 text-[#00a67d]">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Up Monitors</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {isLoading ? '...' : upMonitors}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 text-red-500">
              <XCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Down Monitors</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {isLoading ? '...' : downMonitors}
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-4 flex items-center gap-2">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search URLs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-[#00a67d] focus:outline-none focus:ring-1 focus:ring-[#00a67d]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {isLoading && websites.length === 0 ? (
             <div className="flex w-full items-center justify-center py-20 text-slate-500">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#00a67d]" />
                Loading monitors...
             </div>
          ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">URL</th>
                <th className="hidden px-6 py-3 font-medium sm:table-cell">Details</th>
                <th className="hidden px-6 py-3 font-medium md:table-cell">Last Checked</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWebsites.length > 0 ? (
                filteredWebsites.map((site) => {
                  const stats = getWebsiteStats(site.ticks);
                  
                  return (
                    <tr key={site.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${stats.color}`}>
                          {stats.status === WebsiteStatus.Up ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : stats.status === WebsiteStatus.Down ? (
                            <XCircle className="h-3.5 w-3.5" />
                          ) : (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          )}
                          <span className="uppercase">
                            {stats.status === WebsiteStatus.Unknown ? 'Checking' : stats.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs" title={site.url}>
                            {site.url}
                        </div>
                        <button 
                          onClick={() => window.location.href = `/website/${site.id}`}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#00a67d] hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Visit site
                        </button>
                      </td>
                      <td className="hidden px-6 py-4 text-slate-600 sm:table-cell">
                        {stats.uptime}
                      </td>
                      <td className="hidden px-6 py-4 text-slate-600 md:table-cell">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {stats.lastCheck}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleDelete(site.id)}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500" 
                            title="Delete"
                          >
                             <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="mb-2 h-8 w-8 text-slate-300" />
                      <p>No websites found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </main>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">Add New Monitor</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddMonitor} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">URL to Monitor</label>
                  <div className="flex rounded-md border border-slate-300 shadow-sm focus-within:border-[#00a67d] focus-within:ring-1 focus-within:ring-[#00a67d]">
                    <span className="inline-flex items-center rounded-l-md border-r border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                      https://
                    </span>
                    <input 
                      type="text" 
                      required
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="example.com"
                      className="block w-full flex-1 rounded-none rounded-r-md border-0 px-3 py-2 text-sm focus:ring-0"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">We'll check this URL every 3 minutes.</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-md bg-[#00a67d] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-70"
                >
                   {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                   ) : (
                     "Create Monitor"
                   )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;