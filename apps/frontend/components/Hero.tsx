import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            All systems operational
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Monitor your entire
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              infrastructure
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Get instant alerts when things go wrong. Monitor uptime, logs, and performance across your entire stack.
            Built for teams that ship fast and need reliability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="group bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2">
              Start monitoring for free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all font-semibold border-2 border-gray-200 flex items-center gap-2">
              <Play size={20} />
              Watch demo
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-3 text-left font-mono text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">api.example.com</span>
                  <span className="text-emerald-400">99.99% uptime</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">app.example.com</span>
                  <span className="text-emerald-400">45ms response</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">db.example.com</span>
                  <span className="text-emerald-400">healthy</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400">⚠</span>
                  <span className="text-gray-300">cdn.example.com</span>
                  <span className="text-yellow-400">degraded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
