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
import { BrandLogo, ThemeToggle } from '../../context/ThemeContext';
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
  RotateCcw,
  Menu,
  X,
} from 'lucide-react';

interface AdminPortalProps {
  showtimes: Showtime[];
  movies: Movie[];
  onRefreshData: () => void;
  onExitToCustomerSite: () => void;
}

type AdminTabId =
  | 'analytics'
  | 'cms'
  | 'schedule'
  | 'counter'
  | 'tickets'
  | 'scanner'
  | 'clients'
  | 'concessions'
  | 'staff';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  showtimes,
  movies,
  onRefreshData,
  onExitToCustomerSite,
}) => {
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(
    CinemaStorage.getCurrentAdmin()
  );
  const [activeTab, setActiveTab] = useState<AdminTabId>('analytics');
  const [previewTicket, setPreviewTicket] = useState<Booking | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    setCurrentAdmin(CinemaStorage.getCurrentAdmin());
  }, []);

  const handleLogout = () => {
    CinemaStorage.setCurrentAdmin(null);
    setCurrentAdmin(null);
  };

  const handleResetData = () => {
    if (
      confirm(
        'Reset all bookings, showtimes, users, and CMS configuration to pristine demo data?'
      )
    ) {
      CinemaStorage.resetAllData();
    }
  };

  if (!currentAdmin) {
    return (
      <AdminAuthView
        onSuccess={(admin) => setCurrentAdmin(admin)}
        onExitToCustomerSite={onExitToCustomerSite}
      />
    );
  }

  const navGroups: Array<{
    title: string;
    items: Array<{ id: AdminTabId; label: string; icon: React.ElementType }>;
  }> = [
    {
      title: '01 / Box Office & Gate',
      items: [
        { id: 'analytics', label: 'Analytics & Gross', icon: BarChart3 },
        { id: 'counter', label: '72-Seat Box Office', icon: Grid },
        { id: 'scanner', label: 'Gate QR Scanner', icon: QrCode },
        { id: 'tickets', label: 'Ticket Management', icon: Ticket },
      ],
    },
    {
      title: '02 / Programming & CMS',
      items: [
        { id: 'schedule', label: 'Single-Hall Schedule', icon: Calendar },
        { id: 'cms', label: 'Hero & Site CMS', icon: Sparkles },
        { id: 'concessions', label: 'Concessions & Bar', icon: Popcorn },
      ],
    },
    {
      title: '03 / Directory & Security',
      items: [
        { id: 'clients', label: 'Client Accounts', icon: Users },
        { id: 'staff', label: 'Staff & Security', icon: Shield },
      ],
    },
  ];

  const allNavItems = navGroups.reduce<
    Array<{ id: AdminTabId; label: string; icon: React.ElementType }>
  >((acc, g) => [...acc, ...g.items], []);
  const currentTabInfo = allNavItems.find((i) => i.id === activeTab);

  const selectTab = (id: AdminTabId) => {
    setActiveTab(id);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex font-sans selection:bg-[#C5A059] selection:text-black pb-16 md:pb-0">
      {/* Desktop Categorized Sidebar */}
      <aside className="w-64 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center space-x-3">
              <BrandLogo className="w-9 h-9" alt="Shopbox Cinema" />
              <div>
                <h1 className="font-display font-extrabold text-sm uppercase tracking-[0.15em] text-[var(--text-primary)]">
                  Shopbox
                </h1>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--accent-brass)] font-bold">
                  Auditorium 01 Admin
                </p>
              </div>
            </div>
          </div>

          {/* Categorized Navigation */}
          <nav className="p-3 space-y-5 font-mono text-xs overflow-y-auto max-h-[calc(100vh-220px)]">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <span className="px-3 text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)] font-bold block mb-1.5">
                  {group.title}
                </span>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => selectTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 transition-colors text-left uppercase tracking-wider text-[11px] ${
                        isActive
                          ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#C5A059]' : ''
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] font-mono text-xs space-y-3">
          <div className="px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <span className="text-[9px] uppercase text-[var(--text-muted)] block">
              Authenticated Operator
            </span>
            <span className="text-[var(--text-primary)] font-bold block truncate">
              {currentAdmin.name}
            </span>
            <span className="text-[9px] uppercase text-[var(--accent-brass)] font-bold">
              {currentAdmin.role}
            </span>
          </div>

          <div className="space-y-1">
            <button
              onClick={onExitToCustomerSite}
              className="w-full px-3 py-2 border border-[var(--border-strong)] hover:border-[var(--accent-brass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-between text-[11px] uppercase transition-colors"
            >
              <span>Patron Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-rose-500 hover:bg-rose-500/10 flex items-center space-x-2 text-[11px] uppercase transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Staff Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Instrumentation Bar */}
        <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 sm:px-6 flex items-center justify-between font-mono text-xs sticky top-0 z-30">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="md:hidden flex items-center space-x-2.5">
              <BrandLogo className="w-7 h-7" alt="Shopbox" />
              <div className="truncate">
                <span className="font-display font-extrabold uppercase tracking-wider text-xs text-[var(--text-primary)] block leading-none">
                  Shopbox Admin
                </span>
                <span className="text-[9px] text-[var(--accent-brass)] uppercase font-bold">
                  {currentTabInfo?.label}
                </span>
              </div>
            </div>

            <span className="hidden md:inline-block font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {currentTabInfo?.label}
            </span>
            <span className="hidden lg:inline-block px-2.5 py-0.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] text-[10px] uppercase">
              Virac, Catanduanes • Hall 01 (72 Seats)
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <ThemeToggle />

            <button
              onClick={handleResetData}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-2 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-[11px]"
              title="Reset data to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset Demo</span>
            </button>

            <button
              onClick={onExitToCustomerSite}
              className="px-3 py-2 bg-[#C5A059] hover:bg-[#E2C285] text-black font-bold uppercase tracking-wider text-[10px] sm:text-[11px] flex items-center space-x-1.5 transition-colors"
            >
              <span>Patron Site</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* Active Module Workspace */}
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

      {/* Mobile Admin Quick-Action Bottom Dock */}
      <nav
        aria-label="Mobile Admin Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-2xl border-t border-[var(--border-subtle)] px-2 py-1.5 grid grid-cols-5 items-center font-mono"
      >
        {[
          { id: 'analytics' as const, label: 'Stats', icon: BarChart3 },
          { id: 'counter' as const, label: '72-Seat', icon: Grid },
          { id: 'scanner' as const, label: 'QR Gate', icon: QrCode },
          { id: 'tickets' as const, label: 'Tickets', icon: Ticket },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !isMobileDrawerOpen;
          return (
            <button
              key={item.id}
              onClick={() => selectTab(item.id)}
              className={`flex flex-col items-center py-1 relative ${
                isActive
                  ? 'text-[var(--accent-brass)] font-bold'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-0.5 bg-[#C5A059]" />
              )}
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className={`flex flex-col items-center py-1 relative ${
            isMobileDrawerOpen
              ? 'text-[var(--accent-brass)] font-bold'
              : 'text-[var(--text-muted)]'
          }`}
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase tracking-wider">Modules</span>
        </button>
      </nav>

      {/* Mobile Full Categorized Drawer Sheet */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
          <div className="w-72 bg-[var(--bg-surface)] border-l border-[var(--border-strong)] h-full flex flex-col justify-between p-5 overflow-y-auto font-mono text-xs">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center space-x-2.5">
                  <BrandLogo className="w-7 h-7" />
                  <span className="font-display font-bold uppercase text-sm text-[var(--text-primary)]">
                    All Modules
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {navGroups.map((group) => (
                <div key={group.title} className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-bold block mb-1">
                    {group.title}
                  </span>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => selectTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left uppercase tracking-wider text-[11px] ${
                          isActive
                            ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
              <div className="px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <span className="text-[9px] uppercase text-[var(--text-muted)] block">
                  Operator: {currentAdmin.role}
                </span>
                <span className="text-[var(--text-primary)] font-bold block truncate">
                  {currentAdmin.name}
                </span>
              </div>
              <button
                onClick={handleResetData}
                className="w-full px-3 py-2 border border-[var(--border-subtle)] text-[var(--text-secondary)] flex items-center space-x-2 text-[11px] uppercase"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-rose-500 border border-rose-500/30 flex items-center space-x-2 text-[11px] uppercase"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Staff Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Pass Modal preview */}
      <TicketModal
        booking={previewTicket}
        onClose={() => setPreviewTicket(null)}
      />
    </div>
  );
};
