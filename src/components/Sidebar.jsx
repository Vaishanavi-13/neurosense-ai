import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Gamepad2, 
  TrendingUp, 
  ShieldAlert, 
  HeartHandshake, 
  UserCircle,
  LogOut,
  BrainCircuit
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
  { name: 'Cognitive Games', path: '/dashboard/games/memory', icon: Gamepad2 },
  { name: 'Progress', path: '/dashboard/progress', icon: TrendingUp },
  { name: 'Risk Assessment', path: '/dashboard/risk', icon: ShieldAlert },
  { name: 'Therapy', path: '/dashboard/therapy', icon: HeartHandshake },
  { name: 'Profile', path: '/dashboard/profile', icon: UserCircle },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <BrainCircuit className="h-8 w-8 text-primary-600 mr-3" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
          NeuroSense
        </span>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => 
              `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 font-medium ${
                isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={logout}
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 font-medium"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}