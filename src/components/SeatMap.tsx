import React from 'react';
import { Movie, Showtime, TheaterSeat } from '../types/cinema';
import { THEATER_SEATS, CinemaStorage } from '../services/storage';
import { 
  Check, 
  X, 
  Lock, 
  Eye, 
  ArrowLeft, 
  ArrowRight
} from 'lucide-react';

interface SeatMapProps {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: number[];
  onToggleSeat: (seatId: number) => void;
  onProceedToCheckout: () => void;
  onBackToShowtimes: () => void;
  onOpenOriginalChart: () => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  movie,
  showtime,
  selectedSeats,
  onToggleSeat,
  onProceedToCheckout,
  onBackToShowtimes,
  onOpenOriginalChart,
}) => {
  // Get occupied seats from storage
  const { booked, blocked } = CinemaStorage.getOccupiedSeatsForShowtime(showtime.id);

  const isBooked = (id: number) => booked.includes(id);
  const isBlocked = (id: number) => blocked.includes(id);
  const isSelected = (id: number) => selectedSeats.includes(id);

  // Rows 1 to 9
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const totalPrice = selectedSeats.length * showtime.price;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Session Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-[#0c0c10] border border-white/[0.08]">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onBackToShowtimes}
            className="p-1.5 sm:p-2 border border-white/10 hover:border-white text-zinc-400 hover:text-white transition-colors"
            title="Back to Showtimes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <h2 className="font-display text-base sm:text-xl font-bold text-white uppercase tracking-tight truncate max-w-[200px] sm:max-w-none">
                {movie.title}
              </h2>
              <span className="font-mono text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-zinc-800 text-[#C5A059] border border-zinc-700 shrink-0">
                ₱{showtime.price} / Seat
              </span>
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-zinc-400 mt-0.5 sm:mt-1">
              {showtime.hall} • {showtime.date} at {showtime.time}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenOriginalChart}
          className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 border border-white/15 hover:border-[#C5A059] text-[10px] sm:text-xs font-mono text-zinc-300 hover:text-[#C5A059] transition-colors"
        >
          <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          <span>Paper Chart (Seats.jpg)</span>
        </button>
      </div>

      {/* Main Theater Floor Plan Container */}
      <div className="relative p-3 sm:p-14 bg-[#0a0a0d] border border-white/[0.08] overflow-x-auto">
        {/* Architectural Screen Display */}
        <div className="max-w-xl mx-auto mb-12 text-center">
          {/* Subtle curved arc */}
          <div className="relative pb-4">
            <div className="w-full h-8 architectural-screen rounded-t-[100px] flex items-center justify-center">
              <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#C5A059] pt-2">
                S C R E E N
              </span>
            </div>
          </div>

          {/* Date & Time Metadata matching Seats.jpg layout */}
          <div className="flex items-center justify-center space-x-8 text-xs font-mono text-zinc-400 pt-2 border-t border-white/[0.04]">
            <div>
              <span className="text-zinc-400">DATE: </span>
              <span className="text-zinc-200">{showtime.date}</span>
            </div>
            <div>
              <span className="text-zinc-400">TIME: </span>
              <span className="text-zinc-200">{showtime.time}</span>
            </div>
            <div>
              <span className="text-zinc-400">CAPACITY: </span>
              <span className="text-zinc-200">72 SEATS</span>
            </div>
          </div>
        </div>

        {/* Minimalist Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-8 pb-8 text-[11px] sm:text-xs font-mono text-zinc-400 border-b border-white/[0.06]">
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#141418] border border-white/20 text-[8px] sm:text-[9px] text-zinc-300 flex items-center justify-center font-mono">
              1
            </div>
            <span>Available (₱{showtime.price})</span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#C5A059] text-black font-bold flex items-center justify-center text-[8px] sm:text-[9px]">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
            </div>
            <span className="text-zinc-200">Selected</span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center text-[8px] sm:text-[9px]">
              <X className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
            </div>
            <span className="text-zinc-400">Reserved</span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-zinc-900 border border-zinc-700 text-zinc-400 flex items-center justify-center text-[8px] sm:text-[9px]">
              <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
            </div>
            <span className="text-zinc-400">Hold</span>
          </div>
        </div>

        {/* 72 SEATS ARCHITECTURAL GRID (9 ROWS x 8 SEATS WITH CENTER AISLE) */}
        <div className="pt-8 w-full max-w-xl mx-auto space-y-1.5 sm:space-y-3">
          {rows.map((rowNum) => {
            const rowLabel = rowLetters[rowNum - 1];
            const rowSeats = THEATER_SEATS.filter((s) => s.row === rowNum);
            const leftBlock = rowSeats.filter((s) => s.block === 'left'); // 4 seats
            const rightBlock = rowSeats.filter((s) => s.block === 'right'); // 4 seats

            return (
              <div key={rowNum} className="flex items-center justify-center sm:justify-between group">
                {/* Left Row Indicator */}
                <div className="w-4 sm:w-6 text-[10px] sm:text-xs font-mono font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors text-right pr-1 sm:pr-2 shrink-0">
                  {rowLabel}
                </div>

                {/* Left Block (Seats 1-4, 9-12, etc.) */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2">
                  {leftBlock.map((seat) => renderSeatButton(seat))}
                </div>

                {/* Center Aisle */}
                <div className="w-4 sm:w-12 flex items-center justify-center text-[7px] sm:text-[9px] font-mono tracking-widest text-zinc-400 uppercase shrink-0">
                  <span className="hidden sm:inline">AISLE</span>
                  <span className="sm:hidden">|</span>
                </div>

                {/* Right Block (Seats 5-8, 13-16, etc.) */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2">
                  {rightBlock.map((seat) => renderSeatButton(seat))}
                </div>

                {/* Right Row Indicator */}
                <div className="w-4 sm:w-6 text-[10px] sm:text-xs font-mono font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors pl-1 sm:pl-2 shrink-0">
                  {rowLabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Entrance Label */}
        <div className="mt-10 text-center text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          ▼ MAIN AUDITORIUM DOORS / REAR ENTRANCE ▼
        </div>
      </div>

      {/* Sleek Floating Checkout Bar (Offsets above mobile bottom bar) */}
      <div className="sticky bottom-16 md:bottom-6 z-30 p-3.5 sm:p-6 bg-[#0c0c10]/95 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
        <div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400">
              Selected:
            </span>
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedSeats
                  .sort((a, b) => a - b)
                  .map((id) => (
                    <span
                      key={id}
                      className="px-1.5 py-0.5 bg-[#C5A059] text-black font-mono text-[11px] sm:text-xs font-bold"
                    >
                      #{id}
                    </span>
                  ))}
              </div>
            ) : (
              <span className="font-mono text-[11px] sm:text-xs text-zinc-400 italic">None (Max 8 seats)</span>
            )}
          </div>
          <p className="font-mono text-[10px] sm:text-xs text-zinc-400 mt-0.5 sm:mt-1">
            General Admission: <span className="text-zinc-200">₱{showtime.price}</span> flat rate
          </p>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 block">Subtotal</span>
            <span className="font-mono text-lg sm:text-2xl font-bold text-white">₱{totalPrice.toLocaleString()}</span>
          </div>

          <button
            onClick={onProceedToCheckout}
            disabled={selectedSeats.length === 0}
            className={`px-5 sm:px-8 py-2.5 sm:py-3.5 text-xs font-mono uppercase tracking-widest font-bold flex items-center space-x-2 transition-all active:scale-95 ${
              selectedSeats.length > 0
                ? 'bg-zinc-100 hover:bg-[#C5A059] text-black'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
            }`}
          >
            <span>Confirm</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  function renderSeatButton(seat: TheaterSeat) {
    const bookedStatus = isBooked(seat.id);
    const blockedStatus = isBlocked(seat.id);
    const selected = isSelected(seat.id);
    const disabled = bookedStatus || blockedStatus;

    return (
      <button
        key={seat.id}
        disabled={disabled}
        onClick={() => onToggleSeat(seat.id)}
        title={`Seat ${seat.id} (Row ${seat.rowLabel}) - ₱${showtime.price}`}
        className={`relative w-[32px] h-[32px] sm:w-10 sm:h-10 flex flex-col items-center justify-between p-0.5 sm:p-1 transition-all duration-150 ${
          selected
            ? 'bg-[#C5A059] text-black font-bold ring-1 ring-[#C5A059] z-10 scale-[1.03]'
            : bookedStatus
            ? 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 cursor-not-allowed'
            : blockedStatus
            ? 'bg-zinc-900 border border-zinc-700 text-zinc-400 cursor-not-allowed'
            : 'bg-[#121217] text-zinc-300 border border-white/[0.12] hover:border-[#C5A059] hover:text-white'
        }`}
      >
        {/* Seat Number */}
        <span
          className={`font-mono text-[10px] sm:text-xs font-medium leading-none ${
            selected ? 'text-black font-bold' : bookedStatus ? 'text-zinc-400' : 'text-zinc-300'
          }`}
        >
          {seat.id}
        </span>

        {/* Minimalist lower line matching Seats.jpg */}
        <div
          className={`w-full h-[1px] ${
            selected
              ? 'bg-black/40'
              : bookedStatus
              ? 'bg-zinc-800'
              : blockedStatus
              ? 'bg-zinc-700'
              : 'bg-white/10'
          }`}
        />

        {/* Status indicator */}
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3] text-black" />
          </div>
        )}
        {bookedStatus && (
          <div className="absolute inset-0 flex items-center justify-center">
            <X className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-zinc-400" />
          </div>
        )}
        {blockedStatus && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-2 h-2 sm:w-3 sm:h-3 text-zinc-400" />
          </div>
        )}
      </button>
    );
  }
};
