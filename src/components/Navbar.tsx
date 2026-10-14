import React, { useState } from 'react';
import { Ticket, User as UserIcon, LogOut, Film, Calendar } from 'lucide-react';
import { User } from '../types/cinema';

interface NavbarProps {
  currentView: 'home' | 'schedule';
  onNavigate: (view: 'home' | 'schedule') => void;
  onOpenMyTickets: () => void;
  bookingCount: number;
  currentPatron: User | null;
  onOpenAuth: () => void;
  onLogoutPatron: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenMyTickets,
  bookingCount,
  currentPatron,
  onOpenAuth,
  onLogoutPatron,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#060608]/95 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Identity */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2.5 sm:space-x-3.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 p-1 sm:p-1.5 overflow-hidden shrink-0 border border-white/15 transition-transform group-hover:scale-[1.05] group-hover:border-[#C5A059]/40 flex items-center justify-center">
                <img
                  src="/assets/logo-white.svg"
                  alt="Shopbox Cinema Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5 sm:space-x-2.5">
                  <span className="font-display text-sm sm:text-base font-extrabold tracking-[0.18em] text-white uppercase">
                    Shopbox
                  </span>
                  <span className="font-display text-sm sm:text-base font-medium tracking-[0.18em] text-zinc-400 uppercase">
                    Cinema
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400 tracking-wider uppercase">
                    Hall 01 • 72 Seats
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className={`text-xs uppercase tracking-[0.15em] font-semibold transition-colors pb-1 relative ${
                  currentView === 'home'
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Now Showing
                {currentView === 'home' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]" />
                )}
              </button>

              <button
                onClick={() => onNavigate('schedule')}
                className={`text-xs uppercase tracking-[0.15em] font-semibold transition-colors pb-1 relative ${
                  currentView === 'schedule'
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Schedule
                {currentView === 'schedule' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]" />
                )}
              </button>

              <button
                onClick={onOpenMyTickets}
                className="text-xs uppercase tracking-[0.15em] font-semibold text-zinc-400 hover:text-white transition-colors flex items-center space-x-1.5"
              >
                <span>My Tickets</span>
                {bookingCount > 0 && (
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-[#C5A059] border border-zinc-700">
                    {bookingCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Patron Account & Auth */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {currentPatron ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-zinc-900 border border-white/10 hover:border-zinc-700 font-mono text-[11px] sm:text-xs text-zinc-200 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="max-w-[90px] sm:max-w-[120px] truncate uppercase font-bold">
                      {currentPatron.name.split(' ')[0]}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#0c0c10] border border-white/15 shadow-2xl py-2 z-50 font-mono text-xs">
                      <div className="px-4 py-2 border-b border-white/[0.08]">
                        <span className="text-[10px] uppercase text-zinc-400 block">Signed in as</span>
                        <span className="text-white font-bold truncate block">{currentPatron.name}</span>
                        <span className="text-zinc-400 text-[10px] truncate block">{currentPatron.email}</span>
                      </div>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenMyTickets();
                        }}
                        className="w-full px-4 py-2 text-left text-zinc-300 hover:text-white hover:bg-white/5 flex items-center space-x-2"
                      >
                        <Ticket className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>My Tickets ({bookingCount})</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogoutPatron();
                        }}
                        className="w-full px-4 py-2 text-left text-rose-400 hover:text-rose-300 hover:bg-white/5 flex items-center space-x-2 border-t border-white/[0.06]"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-100 hover:bg-[#C5A059] text-black font-mono font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom App Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08080c]/95 backdrop-blur-2xl border-t border-white/[0.08] px-4 py-1.5 flex justify-around items-center">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            currentView === 'home' ? 'text-[#C5A059]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Film className="w-4 h-4 mb-0.5" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Films</span>
        </button>

        <button
          onClick={() => onNavigate('schedule')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            currentView === 'schedule' ? 'text-[#C5A059]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Schedule</span>
        </button>

        <button
          onClick={onOpenMyTickets}
          className="flex flex-col items-center py-1 px-3 text-zinc-400 hover:text-zinc-200 transition-colors relative"
        >
          <Ticket className="w-4 h-4 mb-0.5" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Tickets</span>
          {bookingCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#C5A059]" />
          )}
        </button>

        {currentPatron ? (
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex flex-col items-center py-1 px-3 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <UserIcon className="w-4 h-4 mb-0.5 text-[#C5A059]" />
            <span className="font-mono text-[9px] uppercase tracking-wider truncate max-w-[50px]">
              {currentPatron.name.split(' ')[0]}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center py-1 px-3 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <UserIcon className="w-4 h-4 mb-0.5" />
            <span className="font-mono text-[9px] uppercase tracking-wider">Sign In</span>
          </button>
        )}
      </nav>
    </>
  );
};
