import React, { useState, useEffect } from 'react';
import { Showtime, Movie, Booking, User } from '../../types/cinema';
import { CinemaStorage } from '../../services/storage';
import { AdminAuthView } from './AdminAuthView';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { CMSManager } from './CMSManager';
import { ScheduleManager } from './ScheduleManager';
import { BoxOfficeCounter } from './BoxOfficeCounter';
import { TicketManager } from './TicketManager';
import { TicketScanner } from './TicketScanner';
import { ClientAccountsManager } from './ClientAccountsManager';
import { ConcessionsManager } from './ConcessionsManager';
import { StaffManager } from './StaffManager';
import { TicketModal } from '../TicketModal';
import { 
  BarChart3, 
  Sparkles, 
  Calendar, 
  Grid, 
  Ticket, 
  QrCode, 
  Users, 
  Popcorn, 
  Shield, 
  LogOut, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface AdminPortalProps {
  showtimes: Showtime[];
  movies: Movie[];
  onRefreshData: () => void;
  onExitToCustomerSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  showtimes,
  movies,
  onRefreshData,
  onExitToCustomerSite,
}) => {
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(CinemaStorage.getCurrentAdmin());
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'cms' | 'schedule' | 'counter' | 'tickets' | 'scanner' | 'clients' | 'concessions' | 'staff'
  >('analytics');

  const [previewTicket, setPreviewTicket] = useState<Booking | null>(null);

  useEffect(() => {
    setCurrentAdmin(CinemaStorage.getCurrentAdmin());
  }, []);

  const handleLogout = () => {
    CinemaStorage.setCurrentAdmin(null);
    setCurrentAdmin(null);
  };

  const handleResetData = () => {
    if (confirm('Reset all bookings, showtimes, users, and CMS configuration to pristine demo data?')) {
      CinemaStorage.resetAllData();
    }
  };

  // If unauthenticated, show Key-Guarded Admin Auth View
  if (!currentAdmin) {
    return (
      <AdminAuthView
        onSuccess={(admin) => setCurrentAdmin(admin)}
        onExitToCustomerSite={onExitToCustomerSite}
      />
    );
  }

  const navItems = [
    { id: 'analytics', label: 'Analytics & Gross', icon: BarChart3 },
    { id: 'cms', label: 'Hero & Site CMS', icon: Sparkles },
    { id: 'schedule', label: 'Single-Hall Schedule', icon: Calendar },
    { id: 'counter', label: '72-Seat Box Office', icon: Grid },
    { id: 'tickets', label: 'Ticket Management', icon: Ticket },
    { id: 'scanner', label: 'Gate QR Scanner', icon: QrCode },
    { id: 'clients', label: 'Client Accounts', icon: Users },
    { id: 'concessions', label: 'Concessions & Bar', icon: Popcorn },
    { id: 'staff', label: 'Staff & Security', icon: Shield },
  ] as const;

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-100 flex font-sans selection:bg-[#C5A059] selection:text-black">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0a0a0d] border-r border-white/[0.08] flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/logo-white.svg"
                alt="Shopbox Cinema"
                className="w-9 h-9 object-contain shrink-0"
              />
              <div>
                <h1 className="font-display font-extrabold text-sm uppercase tracking-[0.15em] text-white">
                  Shopbox
                </h1>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#C5A059]">
                  Auditorium 01 Admin
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 font-mono text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 transition-colors text-left uppercase tracking-wider text-[11px] ${
                    isActive
                      ? 'bg-zinc-100 text-black font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.08] font-mono text-xs space-y-3">
          <div className="px-2 py-1 bg-zinc-950 border border-white/5">
            <span className="text-[9px] uppercase text-zinc-500 block">Operator</span>
            <span className="text-white font-bold block truncate">{currentAdmin.name}</span>
            <span className="text-[9px] uppercase text-[#C5A059]">{currentAdmin.role}</span>
          </div>

          <div className="space-y-1">
            <button
              onClick={onExitToCustomerSite}
              className="w-full px-3 py-2 border border-white/10 hover:border-white text-zinc-300 hover:text-white flex items-center justify-between text-[11px] uppercase transition-colors"
            >
              <span>Patron Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 flex items-center space-x-2 text-[11px] uppercase transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Staff Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-[#0a0a0d] border-b border-white/[0.08] px-6 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-3">
            <span className="md:hidden font-display font-bold uppercase tracking-wider text-white">
              Shopbox Admin
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 bg-zinc-900 border border-white/10 text-zinc-400 text-[10px] uppercase">
              Hall 01 • Capacity: 72 Seats
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleResetData}
              className="hidden sm:flex items-center space-x-1.5 text-zinc-400 hover:text-white transition-colors text-[11px]"
              title="Reset data to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            <button
              onClick={onExitToCustomerSite}
              className="px-3.5 py-1.5 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5 transition-colors"
            >
              <span>Customer View</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* Mobile Sub-Navigation Rails */}
        <div className="md:hidden flex overflow-x-auto p-2 bg-[#0c0c10] border-b border-white/[0.08] space-x-1 font-mono text-[11px] scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 uppercase whitespace-nowrap ${
                activeTab === item.id ? 'bg-zinc-100 text-black font-bold' : 'text-zinc-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'analytics' && <AnalyticsDashboard movies={movies} />}

          {activeTab === 'cms' && (
            <CMSManager movies={movies} onRefreshData={onRefreshData} />
          )}

          {activeTab === 'schedule' && (
            <ScheduleManager
              showtimes={showtimes}
              movies={movies}
              onRefreshData={onRefreshData}
            />
          )}

          {activeTab === 'counter' && (
            <BoxOfficeCounter
              showtimes={showtimes}
              movies={movies}
              onRefreshData={onRefreshData}
            />
          )}

          {activeTab === 'tickets' && (
            <TicketManager
              onRefreshData={onRefreshData}
              onViewTicketPass={(b) => setPreviewTicket(b)}
            />
          )}

          {activeTab === 'scanner' && (
            <TicketScanner onRefreshData={onRefreshData} />
          )}

          {activeTab === 'clients' && (
            <ClientAccountsManager onRefreshData={onRefreshData} />
          )}

          {activeTab === 'concessions' && (
            <ConcessionsManager onRefreshData={onRefreshData} />
          )}

          {activeTab === 'staff' && (
            <StaffManager onRefreshData={onRefreshData} />
          )}
        </main>
      </div>

      {/* Ticket Pass Modal preview */}
      <TicketModal
        booking={previewTicket}
        onClose={() => setPreviewTicket(null)}
      />
    </div>
  );
};
