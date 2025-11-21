'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BetterStack</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Features
            </a>
            <a href="#integrations" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Integrations
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Pricing
            </a>
            <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Docs
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={()=>{
                router.push("/signin")
            }} className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Sign In
            </button>
            <button onClick={()=>{
                router.push("/signup")
            }} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-all font-medium shadow-sm hover:shadow-md">
              Start Free Trial
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Features
              </a>
              <a href="#integrations" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Integrations
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Pricing
              </a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Docs
              </a>
              <button className="text-gray-700 hover:text-emerald-600 transition-colors font-medium text-left">
                Sign In
              </button>
              <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-all font-medium shadow-sm">
                Start Free Trial
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
