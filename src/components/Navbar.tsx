import React, { useState, useRef, useEffect } from 'react';
import { Ticket, User as UserIcon, LogOut, Film, Calendar, MapPin } from 'lucide-react';
import { User } from '../types/cinema';
import { BrandLogo, ThemeToggle } from '../context/ThemeContext';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Architectural Specification Strip (Desktop) */}
      <div className="hidden sm:block bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1.5 text-[var(--text-secondary)] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>AUDITORIUM 01 • 72 RESERVED SEATS</span>
            </span>
            <span>•</span>
            <span>4K DCI LASER & DOLBY ATMOS</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-[var(--accent-brass)]" />
              <span>4/F SHOPBOX BLDG., SAN JOSE, VIRAC, CATANDUANES</span>
            </span>
            <span>•</span>
            <span className="text-[var(--accent-brass)] font-bold">FLAT RATE ₱350</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-glass-heavy)] backdrop-blur-md border-b border-[var(--border-strong)] shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Identity — Pure Logo Without Rounded Box */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 sm:space-x-3.5 text-left group focus:outline-none"
            >
              <BrandLogo
                className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-200 group-hover:scale-105"
                alt="Shopbox Cinema Logo"
              />
              <div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-display text-sm sm:text-base font-extrabold tracking-[0.18em] text-[var(--text-primary)] uppercase">
                    Shopbox
                  </span>
                  <span className="font-display text-sm sm:text-base font-medium tracking-[0.18em] text-[var(--text-muted)] uppercase">
                    Cinema
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="font-mono text-[9px] sm:text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
                    Virac, Catanduanes • Hall 01
                  </span>
                </div>
              </div>
            </button>

            {/* Desktop Swiss Editorial Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 font-mono">
              <button
                onClick={() => onNavigate('home')}
                className={`text-xs uppercase tracking-[0.15em] py-2 relative transition-colors ${
                  currentView === 'home'
                    ? 'text-[var(--text-primary)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="text-[10px] text-[var(--accent-brass)] mr-1.5">01/</span>
                Program
                {currentView === 'home' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]" />
                )}
              </button>

              <button
                onClick={() => onNavigate('schedule')}
                className={`text-xs uppercase tracking-[0.15em] py-2 relative transition-colors ${
                  currentView === 'schedule'
                    ? 'text-[var(--text-primary)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="text-[10px] text-[var(--accent-brass)] mr-1.5">02/</span>
                Schedule
                {currentView === 'schedule' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]" />
                )}
              </button>

              <button
                onClick={onOpenMyTickets}
                className="text-xs uppercase tracking-[0.15em] py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center space-x-1.5"
              >
                <span className="text-[10px] text-[var(--accent-brass)]">03/</span>
                <span>My Passes</span>
                {bookingCount > 0 && (
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#C5A059] text-black">
                    {bookingCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Theme Toggle & Patron Account Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <ThemeToggle />

              {currentPatron ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] font-mono text-[11px] sm:text-xs text-[var(--text-primary)] transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[var(--accent-brass)]" />
                    <span className="max-w-[85px] sm:max-w-[120px] truncate uppercase font-bold">
                      {currentPatron.name.split(' ')[0]}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl py-2 z-50 font-mono text-xs">
                      <div className="px-4 py-2.5 border-b border-[var(--border-subtle)]">
                        <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] block">
                          Patron Account
                        </span>
                        <span className="text-[var(--text-primary)] font-bold truncate block mt-0.5">
                          {currentPatron.name}
                        </span>
                        <span className="text-[var(--text-muted)] text-[10px] truncate block">
                          {currentPatron.email}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenMyTickets();
                        }}
                        className="w-full px-4 py-2.5 text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center space-x-2">
                          <Ticket className="w-3.5 h-3.5 text-[var(--accent-brass)]" />
                          <span>My Passes</span>
                        </span>
                        <span className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-bold">
                          {bookingCount}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogoutPatron();
                        }}
                        className="w-full px-4 py-2.5 text-left text-rose-500 hover:bg-rose-500/10 flex items-center space-x-2 border-t border-[var(--border-subtle)] transition-colors"
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
                  className="px-3 sm:px-4 py-2 bg-[var(--text-primary)] hover:bg-[#C5A059] text-[var(--text-inverse)] hover:text-black font-mono font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 active:scale-95"
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
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface-glass)] backdrop-blur-md border-t border-[var(--border-strong)] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-2 py-1.5 grid grid-cols-4 items-center"
      >
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center py-1 transition-colors relative ${
            currentView === 'home'
              ? 'text-[var(--accent-brass)] font-bold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {currentView === 'home' && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#C5A059]" />
          )}
          <Film className="w-4 h-4 mb-0.5" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Program</span>
        </button>

        <button
          onClick={() => onNavigate('schedule')}
          className={`flex flex-col items-center py-1 transition-colors relative ${
            currentView === 'schedule'
              ? 'text-[var(--accent-brass)] font-bold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {currentView === 'schedule' && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#C5A059]" />
          )}
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Schedule</span>
        </button>

        <button
          onClick={onOpenMyTickets}
          className="flex flex-col items-center py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative"
        >
          <Ticket className="w-4 h-4 mb-0.5" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Passes</span>
          {bookingCount > 0 && (
            <span className="absolute top-0 right-5 min-w-[14px] h-[14px] px-1 rounded-full bg-[#C5A059] text-black font-mono text-[8px] font-bold flex items-center justify-center">
              {bookingCount}
            </span>
          )}
        </button>

        {currentPatron ? (
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex flex-col items-center py-1 text-[var(--text-primary)] transition-colors"
          >
            <UserIcon className="w-4 h-4 mb-0.5 text-[var(--accent-brass)]" />
            <span className="font-mono text-[9px] uppercase tracking-wider truncate max-w-[60px] font-bold">
              {currentPatron.name.split(' ')[0]}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <UserIcon className="w-4 h-4 mb-0.5" />
            <span className="font-mono text-[9px] uppercase tracking-wider">Sign In</span>
          </button>
        )}
      </nav>
    </>
  );
};
