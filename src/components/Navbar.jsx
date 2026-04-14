import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-10 sticky top-0">
      <div className="flex items-center md:hidden">
        {/* Mobile menu button would go here */}
      </div>
      
      <div className="flex-1 px-4 flex justify-between">
        <h1 className="text-xl font-semibold text-slate-800 md:hidden">NeuroSense</h1>
        <div className="hidden md:block"></div> {/* Spacer */}
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-slate-500 hover:text-primary-600 relative transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
          {user?.name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
        </div>
      </div>
    </header>
  );
}