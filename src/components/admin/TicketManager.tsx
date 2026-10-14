import React, { useState } from 'react';
import { Booking } from '../../types/cinema';
import { CinemaStorage } from '../../services/storage';
import { Search, CheckCircle2, Ban, Eye } from 'lucide-react';

interface TicketManagerProps {
  onRefreshData: () => void;
  onViewTicketPass: (booking: Booking) => void;
}

export const TicketManager: React.FC<TicketManagerProps> = ({
  onRefreshData,
  onViewTicketPass,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'checked-in' | 'cancelled'>('all');
  const [actionMsg, setActionMsg] = useState('');

  const allBookings = CinemaStorage.getBookings();

  const filteredBookings = allBookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      b.referenceCode.toLowerCase().includes(term) ||
      b.movieTitle.toLowerCase().includes(term) ||
      b.customer.name.toLowerCase().includes(term) ||
      b.customer.email.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCancelBooking = (booking: Booking) => {
    if (
      confirm(
        `Are you sure you want to cancel booking ${booking.referenceCode} for ${booking.customer.name}? This will immediately release Seats ${booking.seats.join(', ')} back to available status in Hall 01.`
      )
    ) {
      CinemaStorage.cancelBooking(booking.referenceCode);
      setActionMsg(`Booking ${booking.referenceCode} cancelled. Seats ${booking.seats.join(', ')} are now open for rebooking.`);
      onRefreshData();
      setTimeout(() => setActionMsg(''), 4000);
    }
  };

  const handleCheckInBooking = (booking: Booking) => {
    CinemaStorage.updateBookingStatus(booking.referenceCode, 'checked-in');
    setActionMsg(`Ticket ${booking.referenceCode} marked as checked in.`);
    onRefreshData();
    setTimeout(() => setActionMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header & Filters */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] block">
            Box Office Operations
          </span>
          <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">
            Ticket & Reservation Management
          </h3>
          <p className="text-zinc-400 text-xs mt-1 font-light">
            Search, validate, or cancel bookings. Cancelling automatically releases seats.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex border border-white/10 bg-zinc-950 p-0.5">
            {(['all', 'confirmed', 'checked-in', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 uppercase text-[10px] transition-colors ${
                  statusFilter === st
                    ? 'bg-zinc-100 text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search code, patron, movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-60 pl-9 pr-3 py-2 bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-zinc-500 uppercase"
            />
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-[#0c0c10] border border-white/[0.08] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-zinc-950 text-zinc-400 text-[10px] uppercase tracking-wider">
              <th className="p-4">Reference</th>
              <th className="p-4">Film & Session</th>
              <th className="p-4">Patron Details</th>
              <th className="p-4 text-center">Seats</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-[#C5A059]">
                    {b.referenceCode}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{b.movieTitle}</span>
                    <span className="text-zinc-400 text-[10px]">
                      {b.showtimeDate} • {b.showtimeTime}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-zinc-200 block">{b.customer.name}</span>
                    <span className="text-zinc-400 text-[10px] block">{b.customer.email}</span>
                  </td>
                  <td className="p-4 text-center font-bold text-white">
                    {b.seats.join(', ')}
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-white block">₱{b.totalAmount.toLocaleString()}</span>
                    <span className="text-zinc-400 text-[10px]">{b.paymentMethod}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase border ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                          : b.status === 'checked-in'
                          ? 'bg-blue-950/60 text-blue-400 border-blue-800'
                          : 'bg-rose-950/60 text-rose-400 border-rose-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => onViewTicketPass(b)}
                      className="p-1.5 border border-white/10 text-zinc-300 hover:text-white hover:border-white transition-colors"
                      title="View & Print Ticket Pass"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleCheckInBooking(b)}
                        className="p-1.5 border border-blue-900 text-blue-400 hover:bg-blue-950 transition-colors"
                        title="Admit / Check In"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {b.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(b)}
                        className="p-1.5 border border-rose-900 text-rose-400 hover:bg-rose-950 transition-colors"
                        title="Cancel Booking & Free Seats"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-400">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
