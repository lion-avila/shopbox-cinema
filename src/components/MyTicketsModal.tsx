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

  // If logged in, filter only to this user's bookings
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c0c10] border border-white/15 shadow-2xl my-4 sm:my-8">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#C5A059] block">
              Ticket Archive
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
              {currentPatron ? `${currentPatron.name.split(' ')[0]}'s Tickets` : 'My Reservations'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 border border-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LOGGED IN PATRON VIEW */}
        {currentPatron ? (
          <>
            {/* Search if patron has bookings */}
            {patronBookings.length > 0 && (
              <div className="p-4 sm:p-6 pb-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search your tickets by Title or Reference (SBC-)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-zinc-950 border border-white/[0.08] text-white font-mono text-[16px] sm:text-xs focus:outline-none focus:border-zinc-500 uppercase"
                  />
                </div>
              </div>
            )}

            {/* Bookings List */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => onViewTicket(booking)}
                    className="group p-3 sm:p-4 bg-zinc-950 hover:bg-[#14141a] border border-white/[0.06] hover:border-zinc-500 transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                      <div className="w-12 h-16 sm:w-14 sm:h-20 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden aspect-[2/3]">
                        <img
                          src={booking.moviePoster}
                          alt={booking.movieTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-[#C5A059]">
                            {booking.referenceCode}
                          </span>
                          <span className={`font-mono text-[9px] uppercase px-1.5 py-0.2 ${
                            booking.status === 'cancelled'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <h4 className="font-display text-xs sm:text-sm font-bold text-white uppercase truncate">
                          {booking.movieTitle}
                        </h4>
                        <p className="font-mono text-[10px] sm:text-[11px] text-zinc-400">
                          {booking.showtimeDate} • {booking.showtimeTime} • Seats: {booking.seats.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 shrink-0 font-mono text-xs">
                      <div className="text-right hidden sm:block">
                        <span className="font-bold text-white block">
                          ₱{booking.totalAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-zinc-400">{booking.seats.length} Seat{booking.seats.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="p-2 border border-white/10 group-hover:bg-white group-hover:text-black text-zinc-400 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-3 font-mono text-xs text-zinc-400">
                  <Ticket className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-zinc-300 uppercase tracking-wider">No tickets found</p>
                  <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
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
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-[#C5A059]">
                <UserIcon className="w-6 h-6" />
              </div>
              <h4 className="font-display text-lg font-bold text-white uppercase tracking-tight">
                Sign In to View Your Tickets
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Sign in to your patron account to view your past and upcoming reservation passes, seat details, and admission QR codes.
              </p>
              {onOpenAuth && (
                <div className="pt-2">
                  <button
                    onClick={onOpenAuth}
                    className="px-6 py-3 bg-zinc-100 hover:bg-[#C5A059] text-black font-mono font-bold text-xs uppercase tracking-widest inline-flex items-center space-x-2 transition-all active:scale-95"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Account</span>
                  </button>
                </div>
              )}
            </div>

            {/* Guest Reference Lookup */}
            <div className="pt-6 border-t border-white/[0.08] max-w-md mx-auto text-left space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block text-center">
                Or look up a guest reservation
              </span>
              <form onSubmit={handleGuestLookup} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Booking Ref (e.g. SBC-98124)"
                  value={guestRefInput}
                  onChange={(e) => setGuestRefInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-zinc-950 border border-white/[0.1] text-white font-mono text-[16px] sm:text-xs uppercase focus:outline-none focus:border-zinc-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-white/20 hover:border-white text-zinc-200 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors shrink-0"
                >
                  Find Pass
                </button>
              </form>
              {guestLookupError && (
                <p className="text-xs text-rose-400 font-mono mt-1 text-center">
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
