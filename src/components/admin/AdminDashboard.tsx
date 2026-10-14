import React, { useState } from 'react';
import { Showtime, Movie } from '../../types/cinema';
import { BoxOfficeCounter } from './BoxOfficeCounter';
import { ScheduleManager } from './ScheduleManager';
import { TicketScanner } from './TicketScanner';
import { CinemaStorage } from '../../services/storage';
import { 
  LayoutGrid, 
  Calendar, 
  QrCode, 
  RotateCcw, 
  Shield, 
  ArrowLeft
} from 'lucide-react';

interface AdminDashboardProps {
  showtimes: Showtime[];
  movies: Movie[];
  onRefreshData: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  showtimes,
  movies,
  onRefreshData,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'counter' | 'schedule' | 'scanner'>('counter');

  const handleResetData = () => {
    if (confirm('Reset all bookings, showtimes, and seat holds to initial demo data?')) {
      CinemaStorage.resetAllData();
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-8 bg-[#0c0c10] border border-white/[0.08]">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-zinc-900 border border-white/10 text-[#C5A059] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="font-display text-xl font-bold text-white uppercase tracking-tight">
                Box Office Terminal
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 bg-zinc-800 text-[#C5A059] border border-zinc-700">
                HALL 01 • 72 SEATS
              </span>
            </div>
            <p className="font-mono text-xs text-zinc-400 mt-0.5">
              Shopbox Cinema • House Management & Gate Admission
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={handleResetData}
            className="px-3.5 py-2 border border-white/10 hover:border-white text-zinc-400 hover:text-white flex items-center space-x-1.5 transition-colors"
            title="Reset data to pristine defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="px-4 py-2 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold flex items-center space-x-1.5 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Patron View</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex space-x-1 border-b border-white/[0.08] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('counter')}
          className={`flex items-center space-x-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all ${
            activeTab === 'counter'
              ? 'bg-zinc-100 text-black font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>72-Seat Box Office Grid</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center space-x-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all ${
            activeTab === 'schedule'
              ? 'bg-zinc-100 text-black font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Single-Hall Programming</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex items-center space-x-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all ${
            activeTab === 'scanner'
              ? 'bg-zinc-100 text-black font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Gate Admission & Scanner</span>
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === 'counter' && (
          <BoxOfficeCounter
            showtimes={showtimes}
            movies={movies}
            onRefreshData={onRefreshData}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleManager
            showtimes={showtimes}
            movies={movies}
            onRefreshData={onRefreshData}
          />
        )}

        {activeTab === 'scanner' && (
          <TicketScanner onRefreshData={onRefreshData} />
        )}
      </div>
    </div>
  );
};
