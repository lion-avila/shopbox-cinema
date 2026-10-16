import React, { useState } from 'react';
import { Booking, User } from '../types/cinema';
import { CinemaStorage } from '../services/storage';
import { Search, X, ChevronRight, Ticket, User as UserIcon, LogIn } from 'lucide-react';

interface MyTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTicket: (booking: Booking) => void;
  currentPatron?: User | null;
  onOpenAuth?: () => void;
}

export const MyTicketsModal: React.FC<MyTicketsModalProps> = ({
  isOpen,
  onClose,
  onViewTicket,
  currentPatron,
  onOpenAuth,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [guestRefInput, setGuestRefInput] = useState('');
  const [guestLookupError, setGuestLookupError] = useState('');

  if (!isOpen) return null;

  const allBookings = CinemaStorage.getBookings();

  const patronBookings = currentPatron
    ? allBookings.filter(
        (b) =>
          b.userId === currentPatron.id ||
          b.customer.email.toLowerCase() === currentPatron.email.toLowerCase()
      )
    : [];

  const filteredBookings = patronBookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.referenceCode.toLowerCase().includes(term) ||
      b.movieTitle.toLowerCase().includes(term) ||
      b.showtimeDate.includes(term)
    );
  });

  const handleGuestLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setGuestLookupError('');
    const cleanRef = guestRefInput.trim().toUpperCase();
    if (!cleanRef) return;

    const found = allBookings.find(
      (b) => b.referenceCode.toUpperCase() === cleanRef
    );

    if (found) {
      onViewTicket(found);
    } else {
      setGuestLookupError(`No reservation found matching reference "${cleanRef}". Please verify the code.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl my-4 sm:my-8">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[var(--accent-brass)] font-bold block">
              Ticket Archive
            </span>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
              {currentPatron ? `${currentPatron.name.split(' ')[0]}'s Tickets` : 'My Reservations'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LOGGED IN PATRON VIEW */}
        {currentPatron ? (
          <>
            {patronBookings.length > 0 && (
              <div className="p-4 sm:p-6 pb-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search your tickets by Title or Reference (SBC-)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono text-[16px] sm:text-xs focus:outline-none focus:border-[var(--accent-brass)] uppercase"
                  />
                </div>
              </div>
            )}

            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => onViewTicket(booking)}
                    className="group p-3 sm:p-4 bg-[var(--bg-elevated)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                      <div className="w-12 h-16 sm:w-14 sm:h-20 bg-zinc-900 border border-[var(--border-subtle)] shrink-0 overflow-hidden aspect-[2/3]">
                        <img
                          src={booking.moviePoster}
                          alt={booking.movieTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-[var(--accent-brass)]">
                            {booking.referenceCode}
                          </span>
                          <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 font-bold ${
                            booking.status === 'cancelled'
                              ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <h4 className="font-display text-xs sm:text-sm font-bold text-[var(--text-primary)] uppercase truncate">
                          {booking.movieTitle}
                        </h4>
                        <p className="font-mono text-[10px] sm:text-[11px] text-[var(--text-secondary)]">
                          {booking.showtimeDate} • {booking.showtimeTime} • Seats: {booking.seats.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 shrink-0 font-mono text-xs">
                      <div className="text-right hidden sm:block">
                        <span className="font-bold text-[var(--text-primary)] block">
                          ₱{booking.totalAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">{booking.seats.length} Seat{booking.seats.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="p-2 border border-[var(--border-strong)] group-hover:bg-[#C5A059] group-hover:text-black text-[var(--text-secondary)] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-3 font-mono text-xs text-[var(--text-secondary)]">
                  <Ticket className="w-8 h-8 text-[var(--accent-brass)] mx-auto" />
                  <p className="text-[var(--text-primary)] font-bold uppercase tracking-wider">No tickets found</p>
                  <p className="text-[11px] text-[var(--text-muted)] max-w-sm mx-auto">
                    You haven't reserved any screenings yet under this account. Pick a film from our program to book your seats in Hall 01.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* GUEST / SIGNED OUT VIEW */
          <div className="p-6 sm:p-10 space-y-8 text-center">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mx-auto text-[var(--accent-brass)]">
                <UserIcon className="w-6 h-6" />
              </div>
              <h4 className="font-display text-lg font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
                Sign In to View Your Tickets
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Sign in to your patron account to view your past and upcoming reservation passes, seat details, and admission QR codes.
              </p>
              {onOpenAuth && (
                <div className="pt-2">
                  <button
                    onClick={onOpenAuth}
                    className="px-6 py-3 bg-[#C5A059] hover:bg-[#E2C285] text-black font-mono font-bold text-xs uppercase tracking-widest inline-flex items-center space-x-2 transition-all active:scale-95"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Account</span>
                  </button>
                </div>
              )}
            </div>

            {/* Guest Reference Lookup */}
            <div className="pt-6 border-t border-[var(--border-subtle)] max-w-md mx-auto text-left space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold block text-center">
                Or look up a guest reservation
              </span>
              <form onSubmit={handleGuestLookup} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Booking Ref (e.g. SBC-98124)"
                  value={guestRefInput}
                  onChange={(e) => setGuestRefInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono text-[16px] sm:text-xs uppercase focus:outline-none focus:border-[var(--accent-brass)]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--text-primary)] text-[var(--text-inverse)] hover:bg-[#C5A059] hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                >
                  Find Pass
                </button>
              </form>
              {guestLookupError && (
                <p className="text-xs text-rose-500 font-mono mt-1 text-center font-semibold">
                  {guestLookupError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
