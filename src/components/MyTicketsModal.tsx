import React, { useState } from 'react';
import { Booking } from '../types/cinema';
import { CinemaStorage } from '../services/storage';
import { Search, X, ChevronRight } from 'lucide-react';

interface MyTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTicket: (booking: Booking) => void;
}

export const MyTicketsModal: React.FC<MyTicketsModalProps> = ({
  isOpen,
  onClose,
  onViewTicket,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const allBookings = CinemaStorage.getBookings();

  const filteredBookings = allBookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.referenceCode.toLowerCase().includes(term) ||
      b.movieTitle.toLowerCase().includes(term) ||
      b.customer.name.toLowerCase().includes(term) ||
      b.customer.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c0c10] border border-white/15 shadow-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#C5A059] block">
              Ticket Archive
            </span>
            <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">
              My Reservations
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 border border-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by Reference Code (SBC-), Movie Title, or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-white/[0.08] text-white font-mono text-xs focus:outline-none focus:border-zinc-500 uppercase"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => onViewTicket(booking)}
                className="group p-4 bg-zinc-950 hover:bg-[#14141a] border border-white/[0.06] hover:border-zinc-500 transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="w-12 h-16 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden">
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
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 bg-zinc-800 text-zinc-300">
                        {booking.status}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-white uppercase truncate">
                      {booking.movieTitle}
                    </h4>
                    <p className="font-mono text-[11px] text-zinc-400">
                      {booking.showtimeDate} • {booking.showtimeTime} • Seats: {booking.seats.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0 font-mono text-xs">
                  <div className="text-right hidden sm:block">
                    <span className="font-bold text-white block">
                      ₱{booking.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-zinc-400">{booking.customer.name}</span>
                  </div>
                  <div className="p-2 border border-white/10 group-hover:bg-white group-hover:text-black text-zinc-400 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center font-mono text-xs text-zinc-400">
              No reservations found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
