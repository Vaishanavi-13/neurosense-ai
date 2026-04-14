import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/Card';
import { UserCircle, Mail, Calendar as CalendarIcon, FileText } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center">
        <UserCircle className="mr-2 h-6 w-6 text-primary-600" /> My Profile
      </h2>
      
      <Card>
        <div className="flex flex-col md:flex-row items-center md:items-start p-6">
          <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center mb-6 md:mb-0 md:mr-8 border-4 border-white shadow-lg shadow-slate-200">
            <span className="text-5xl font-bold text-primary-600">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{user?.name || 'User Name'}</h3>
              <p className="text-slate-500 flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2" /> {user?.email || 'user@example.com'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-500 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" /> Age
                </p>
                <p className="font-semibold text-slate-800 mt-1">{user?.age || 'N/A'} years</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 flex items-center">
                  <FileText className="h-4 w-4 mr-2" /> Medical History
                </p>
                <p className="font-semibold text-slate-800 mt-1">{user?.medicalHistory || 'None provided'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 border-t border-slate-100 p-4 -mx-6 -mb-6 mt-6 rounded-b-xl flex justify-between items-center">
           <button className="btn-outline">Edit Profile</button>
           <button 
             onClick={logout}
             className="text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
           >
             Sign Out
           </button>
        </div>
      </Card>
      
      <div className="text-center text-slate-400 text-sm pt-8">
        <p>NeuroSense-AI Version 1.0.0</p>
        <p>© 2026 NeuroSense AI. All rights reserved.</p>
      </div>
    </div>
  );
}