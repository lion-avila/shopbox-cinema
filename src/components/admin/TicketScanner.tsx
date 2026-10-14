import React, { useState } from 'react';
import { Booking } from '../../types/cinema';
import { CinemaStorage } from '../../services/storage';
import { QrCode, Search, CheckCircle2, AlertCircle, Ticket } from 'lucide-react';

interface TicketScannerProps {
  onRefreshData: () => void;
}

export const TicketScanner: React.FC<TicketScannerProps> = ({ onRefreshData }) => {
  const [refInput, setRefInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim()) return;

    setSearchAttempted(true);
    setActionMessage('');
    const bookings = CinemaStorage.getBookings();
    const found = bookings.find(
      (b) => b.referenceCode.toUpperCase() === refInput.trim().toUpperCase()
    );

    setSearchedBooking(found || null);
  };

  const handleCheckIn = () => {
    if (!searchedBooking) return;
    CinemaStorage.updateBookingStatus(searchedBooking.referenceCode, 'checked-in');
    setSearchedBooking({
      ...searchedBooking,
      status: 'checked-in',
      checkedInAt: new Date().toISOString(),
    });
    setActionMessage(`Success: Ticket ${searchedBooking.referenceCode} validated and admitted.`);
    onRefreshData();
  };

  const recentBookings = CinemaStorage.getBookings().slice(0, 5);

  return (
    <div className="space-y-8 max-w-3xl mx-auto font-mono text-xs">
      {/* Scanner & Code Input */}
      <div className="p-6 sm:p-8 bg-[#0c0c10] border border-white/[0.08] space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-zinc-900 border border-white/10 text-[#C5A059] flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">
              Hall 01 Gate Admission & Barcode Validator
            </h3>
            <p className="text-zinc-400 text-[11px]">
              Scan QR code or enter booking reference code to admit guests.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Enter Booking Reference (e.g. SBC-98124)..."
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-white/10 text-white font-mono text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500 uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold uppercase tracking-wider transition-colors shrink-0 text-xs"
          >
            Verify
          </button>
        </form>

        {actionMessage && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* Verification Result Card */}
      {searchedBooking ? (
        <div className="p-6 bg-[#0c0c10] border-2 border-[#C5A059]/40 space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-[10px] uppercase text-zinc-400 block">
                Verification Result
              </span>
              <span className="text-xl font-bold text-white">
                {searchedBooking.referenceCode}
              </span>
            </div>

            <span
              className={`px-3 py-1 font-bold text-[10px] uppercase border ${
                searchedBooking.status === 'checked-in'
                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}
            >
              {searchedBooking.status === 'checked-in' ? 'ALREADY ADMITTED' : 'VALID / UNUSED'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-400 block mb-0.5 text-[10px] uppercase">Film:</span>
              <span className="font-bold text-white text-sm">{searchedBooking.movieTitle}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5 text-[10px] uppercase">Patron:</span>
              <span className="font-bold text-white text-sm">{searchedBooking.customer.name}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5 text-[10px] uppercase">Session:</span>
              <span className="text-zinc-200">
                {searchedBooking.showtimeDate} • {searchedBooking.showtimeTime}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5 text-[10px] uppercase">Auditorium:</span>
              <span className="text-zinc-200">{searchedBooking.hall}</span>
            </div>
          </div>

          {/* Reserved Seats List */}
          <div className="p-4 bg-zinc-950 border border-white/[0.06] text-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
              Authorized Seats ({searchedBooking.seats.length} total)
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {searchedBooking.seats.map((seatId) => (
                <span
                  key={seatId}
                  className="px-3 py-1 bg-white text-black font-bold text-xs"
                >
                  SEAT #{seatId}
                </span>
              ))}
            </div>
          </div>

          {/* Action */}
          {searchedBooking.status !== 'checked-in' ? (
            <button
              onClick={handleCheckIn}
              className="w-full py-3.5 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Admit Patron & Validate Pass</span>
            </button>
          ) : (
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-center text-zinc-400">
              Admitted at{' '}
              {searchedBooking.checkedInAt
                ? new Date(searchedBooking.checkedInAt).toLocaleTimeString()
                : 'Earlier today'}
            </div>
          )}
        </div>
      ) : searchAttempted ? (
        <div className="p-6 bg-rose-950/20 border border-rose-900 text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
          <h4 className="font-bold text-white text-xs uppercase">No Record Found</h4>
          <p className="text-[11px] text-zinc-400">
            No booking exists with reference code "{refInput}".
          </p>
        </div>
      ) : null}

      {/* Quick Select from Recent Bookings */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] space-y-3">
        <h4 className="uppercase tracking-wider text-zinc-400 text-[10px]">
          Recent System Bookings (Click to Test Validate)
        </h4>

        <div className="space-y-2">
          {recentBookings.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setRefInput(b.referenceCode);
                setSearchedBooking(b);
                setSearchAttempted(true);
                setActionMessage('');
              }}
              className="w-full p-3 bg-zinc-950 hover:bg-zinc-900 border border-white/[0.06] text-left flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Ticket className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-bold text-white">{b.referenceCode}</span>
                <span className="text-zinc-400 truncate max-w-[150px]">{b.movieTitle}</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="text-zinc-400">Seats: {b.seats.join(', ')}</span>
                <span
                  className={`px-1.5 py-0.2 uppercase font-bold text-[9px] ${
                    b.status === 'checked-in' ? 'text-zinc-500' : 'text-emerald-400'
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
