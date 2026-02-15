import React from 'react';
import { LayoutDashboard, PlusCircle, Users, Settings, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItemClass = (view: ViewState) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
      currentView === view
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col text-white flex-shrink-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          TalentInsight
        </h1>
        <p className="text-xs text-gray-500 mt-1">AI Interview Analyzer</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div
          className={navItemClass('dashboard')}
          onClick={() => setView('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dasbor</span>
        </div>
        
        <div
          className={navItemClass('new-interview')}
          onClick={() => setView('new-interview')}
        >
          <PlusCircle size={20} />
          <span className="font-medium">Analisis Baru</span>
        </div>

        {/* Placeholder links for visual completeness */}
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white cursor-not-allowed opacity-50">
          <Users size={20} />
          <span className="font-medium">Tim (Pro)</span>
        </div>
        
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white cursor-not-allowed opacity-50">
          <Settings size={20} />
          <span className="font-medium">Pengaturan</span>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer px-4 py-2">
          <LogOut size={18} />
          <span className="text-sm">Keluar</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;