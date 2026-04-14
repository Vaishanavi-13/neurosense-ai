import React from 'react';
import { Bell, User, Sun, Moon, Languages } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme, language, setLanguage, t } = useApp();
  
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 z-10 sticky top-0 transition-colors duration-200">
      <div className="flex items-center md:hidden">
        {/* Mobile menu button would go here */}
      </div>
      
      <div className="flex-1 px-4 flex justify-between">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 md:hidden">NeuroSense</h1>
        <div className="hidden md:block"></div> {/* Spacer */}
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Language Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('mr')}
            className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${language === 'mr' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            मराठी
          </button>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title={theme === 'light' ? t.switch_dark : t.switch_light}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        <button className="text-slate-500 dark:text-slate-300 hover:text-primary-600 relative transition-colors p-2 md:p-0">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 md:top-0 md:right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-200 flex items-center justify-center font-bold border border-primary-200 dark:border-primary-700 shadow-sm">
          {user?.name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
        </div>
      </div>
    </header>
  );
}