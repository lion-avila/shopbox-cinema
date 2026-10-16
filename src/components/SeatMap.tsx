import React from 'react';
import { Movie, Showtime, TheaterSeat } from '../types/cinema';
import { THEATER_SEATS, CinemaStorage } from '../services/storage';
import { Check, X, Lock, Eye, ArrowLeft, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';

interface SeatMapProps {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: number[];
  onToggleSeat: (seatId: number) => void;
  onClearSeats?: () => void;
  onProceedToCheckout: () => void;
  onBackToShowtimes: () => void;
  onOpenOriginalChart: () => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  movie,
  showtime,
  selectedSeats,
  onToggleSeat,
  onClearSeats,
  onProceedToCheckout,
  onBackToShowtimes,
  onOpenOriginalChart,
}) => {
  const { booked, blocked } = CinemaStorage.getOccupiedSeatsForShowtime(showtime.id);

  const isBooked = (id: number) => booked.includes(id);
  const isBlocked = (id: number) => blocked.includes(id);
  const isSelected = (id: number) => selectedSeats.includes(id);

  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const totalPrice = selectedSeats.length * showtime.price;
  const openCount = Math.max(0, 72 - (booked.length + blocked.length));
  const isMaxReached = selectedSeats.length >= 8;

  const getSeatRowLabel = (seatId: number) => {
    const found = THEATER_SEATS.find((s) => s.id === seatId);
    return found ? `${found.rowLabel}${seatId}` : `#${seatId}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Session Context Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button
            onClick={onBackToShowtimes}
            className="p-2 border border-[var(--border-strong)] hover:border-[var(--accent-brass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
            title="Back to Showtimes"
            aria-label="Back to Showtimes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-base sm:text-xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight truncate">
                {movie.title}
              </h2>
              <span className="font-mono text-[10px] sm:text-xs px-2 py-0.5 bg-[var(--bg-elevated)] text-[var(--accent-brass)] border border-[var(--border-subtle)] font-bold shrink-0">
                ₱{showtime.price} / Seat
              </span>
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5 truncate">
              {showtime.hall} • {showtime.date} at {showtime.time} • {openCount} of 72 Open
            </p>
          </div>
        </div>

        <button
          onClick={onOpenOriginalChart}
          className="flex items-center space-x-1.5 px-3 py-2 border border-[var(--border-strong)] hover:border-[var(--accent-brass)] text-[10px] sm:text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent-brass)] transition-colors shrink-0"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Architectural Blueprint (Seats.jpg)</span>
        </button>
      </div>

      {/* Max 8 Seats Edge State Alert */}
      {isMaxReached && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/40 text-amber-500 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Maximum limit of 8 seats per online reservation reached.</span>
          </div>
          <span className="text-[10px] uppercase font-bold">8 / 8 Selected</span>
        </div>
      )}

      {/* Main Theater Floor Plan Blueprint Container */}
      <div className="relative p-3 sm:p-10 lg:p-12 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        {/* Architectural Screen Arc */}
        <div className="max-w-xl mx-auto mb-8 sm:mb-10 text-center">
          <div className="relative pb-3">
            <div className="w-full h-7 sm:h-8 architectural-screen rounded-t-[100px] flex items-center justify-center">
              <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.45em] uppercase text-[var(--accent-brass)] pt-1.5">
                S C R E E N
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 sm:space-x-8 text-[10px] sm:text-xs font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
            <div>
              <span>DATE: </span>
              <span className="text-[var(--text-primary)] font-bold">{showtime.date}</span>
            </div>
            <div>
              <span>TIME: </span>
              <span className="text-[var(--text-primary)] font-bold">{showtime.time}</span>
            </div>
            <div className="hidden sm:block">
              <span>LAYOUT: </span>
              <span className="text-[var(--text-primary)] font-bold">72 SEATS (9×8)</span>
            </div>
          </div>
        </div>

        {/* Tactile Seat Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-7 pb-6 sm:pb-8 text-[10px] sm:text-xs font-mono text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="w-4 h-4 bg-[var(--seat-available-bg)] border border-[var(--seat-available-border)] text-[9px] text-[var(--seat-available-text)] flex items-center justify-center font-mono font-bold">
              1
            </div>
            <span>Available (₱{showtime.price})</span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="w-4 h-4 bg-[#C5A059] text-black font-bold flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-[var(--text-primary)] font-bold">Selected</span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="w-4 h-4 bg-[var(--seat-reserved-bg)] border border-[var(--seat-reserved-border)] text-[var(--seat-reserved-text)] flex items-center justify-center">
              <X className="w-2.5 h-2.5" />
            </div>
            <span className="text-[var(--text-muted)]">Reserved</span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="w-4 h-4 bg-[var(--seat-reserved-bg)] border border-[var(--border-strong)] text-[var(--text-muted)] flex items-center justify-center">
              <Lock className="w-2.5 h-2.5" />
            </div>
            <span className="text-[var(--text-muted)]">Box Office Hold</span>
          </div>
        </div>

        {/* 72 SEATS ARCHITECTURAL MATRIX (9 ROWS × 8 SEATS WITH CENTER AISLE) */}
        <div className="pt-6 sm:pt-8 w-full max-w-xl mx-auto space-y-1.5 sm:space-y-2.5">
          {/* Wing Column Headers */}
          <div className="flex items-center justify-center sm:justify-between text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] pb-1">
            <div className="w-4 sm:w-6 shrink-0" />
            <div className="w-[134px] sm:w-[184px] text-center border-b border-[var(--border-subtle)] pb-1">
              Left Wing (Cols 1–4)
            </div>
            <div className="w-4 sm:w-12 shrink-0" />
            <div className="w-[134px] sm:w-[184px] text-center border-b border-[var(--border-subtle)] pb-1">
              Right Wing (Cols 5–8)
            </div>
            <div className="w-4 sm:w-6 shrink-0" />
          </div>

          {rows.map((rowNum) => {
            const rowLabel = rowLetters[rowNum - 1];
            const rowSeats = THEATER_SEATS.filter((s) => s.row === rowNum);
            const leftBlock = rowSeats.filter((s) => s.block === 'left');
            const rightBlock = rowSeats.filter((s) => s.block === 'right');

            return (
              <div
                key={rowNum}
                className="flex items-center justify-center sm:justify-between group"
              >
                {/* Left Row Coordinate */}
                <div className="w-4 sm:w-6 text-[10px] sm:text-xs font-mono font-bold text-[var(--text-muted)] group-hover:text-[var(--accent-brass)] transition-colors text-right pr-1 sm:pr-2 shrink-0">
                  {rowLabel}
                </div>

                {/* Left Wing (4 Seats) */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2">
                  {leftBlock.map((seat) => renderSeatButton(seat))}
                </div>

                {/* Center Aisle */}
                <div className="w-4 sm:w-12 flex items-center justify-center text-[7px] sm:text-[9px] font-mono tracking-widest text-[var(--text-muted)] uppercase shrink-0 select-none">
                  <span className="hidden sm:inline">AISLE</span>
                  <span className="sm:hidden">•</span>
                </div>

                {/* Right Wing (4 Seats) */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2">
                  {rightBlock.map((seat) => renderSeatButton(seat))}
                </div>

                {/* Right Row Coordinate */}
                <div className="w-4 sm:w-6 text-[10px] sm:text-xs font-mono font-bold text-[var(--text-muted)] group-hover:text-[var(--accent-brass)] transition-colors pl-1 sm:pl-2 shrink-0">
                  {rowLabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rear Doors Landmark */}
        <div className="mt-8 sm:mt-10 pt-4 border-t border-[var(--border-subtle)] text-center text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-[0.25em]">
          ▼ AUDITORIUM 01 DOORS • REAR ENTRANCE ▼
        </div>
      </div>

      {/* Sticky Checkout Dock (Positioned cleanly above mobile bottom bar) */}
      <div className="sticky bottom-16 md:bottom-6 z-30 p-4 sm:p-6 bg-[var(--bg-surface-glass)] backdrop-blur-md border border-[var(--border-strong)] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
        <div className="w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold">
              Selected ({selectedSeats.length}/8):
            </span>
            {selectedSeats.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {[...selectedSeats]
                    .sort((a, b) => a - b)
                    .map((id) => (
                      <button
                        key={id}
                        onClick={() => onToggleSeat(id)}
                        title="Click to deselect seat"
                        className="px-2 py-0.5 bg-[#C5A059] hover:bg-rose-500 hover:text-white text-black font-mono text-[11px] font-bold transition-colors"
                      >
                        {getSeatRowLabel(id)}
                      </button>
                    ))}
                </div>
                {onClearSeats && selectedSeats.length > 1 && (
                  <button
                    onClick={onClearSeats}
                    className="inline-flex items-center space-x-1 text-[10px] font-mono uppercase text-[var(--text-muted)] hover:text-rose-500 ml-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </>
            ) : (
              <span className="font-mono text-[11px] sm:text-xs text-[var(--text-muted)]">
                Tap any numbered seat above to reserve
              </span>
            )}
          </div>
          <p className="font-mono text-[10px] sm:text-xs text-[var(--text-muted)] mt-1">
            General Admission: <span className="text-[var(--text-primary)] font-bold">₱{showtime.price}</span> flat rate per seat
          </p>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[var(--border-subtle)] pt-2.5 sm:pt-0">
          <div className="text-left sm:text-right font-mono">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
              Ticket Subtotal
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-[var(--text-primary)]">
              ₱{totalPrice.toLocaleString()}
            </span>
          </div>

          <button
            onClick={onProceedToCheckout}
            disabled={selectedSeats.length === 0}
            className={`px-5 sm:px-8 py-3 sm:py-3.5 text-xs font-mono uppercase tracking-widest font-bold flex items-center space-x-2 transition-all active:scale-95 ${
              selectedSeats.length > 0
                ? 'bg-[#C5A059] hover:bg-[#E2C285] text-black shadow-lg'
                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
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
        type="button"
        disabled={disabled}
        onClick={() => onToggleSeat(seat.id)}
        aria-label={`Row ${seat.rowLabel} Seat ${seat.id} - ${
          bookedStatus ? 'Reserved' : blockedStatus ? 'Held' : selected ? 'Selected' : 'Available'
        }`}
        title={`Row ${seat.rowLabel} • Seat #${seat.id} (₱${showtime.price})`}
        className={`relative w-[31px] h-[31px] sm:w-10 sm:h-10 flex flex-col items-center justify-between p-0.5 sm:p-1 transition-all duration-150 select-none ${
          selected
            ? 'bg-[#C5A059] text-black font-bold ring-2 ring-[#C5A059] z-10 scale-[1.05] shadow-md'
            : bookedStatus
            ? 'bg-[var(--seat-reserved-bg)] border border-[var(--seat-reserved-border)] text-[var(--seat-reserved-text)] cursor-not-allowed opacity-70'
            : blockedStatus
            ? 'bg-[var(--seat-reserved-bg)] border border-[var(--border-strong)] text-[var(--seat-reserved-text)] cursor-not-allowed opacity-75'
            : 'bg-[var(--seat-available-bg)] text-[var(--seat-available-text)] border border-[var(--seat-available-border)] hover:border-[#C5A059] hover:text-[var(--accent-brass)] active:scale-95'
        }`}
      >
        <span
          className={`font-mono text-[10px] sm:text-xs leading-none ${
            selected ? 'text-black font-extrabold' : 'font-semibold'
          }`}
        >
          {seat.id}
        </span>

        {/* Architectural Seat Cushion Bar */}
        <div
          className={`w-full h-[2px] ${
            selected
              ? 'bg-black/50'
              : bookedStatus || blockedStatus
              ? 'bg-current opacity-20'
              : 'bg-[#C5A059]/40'
          }`}
        />

        {selected && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#C5A059]">
            <div className="flex flex-col items-center">
              <span className="font-mono text-[9px] sm:text-[10px] font-black text-black leading-none">
                {seat.rowLabel}{seat.id}
              </span>
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3] text-black" />
            </div>
          </div>
        )}
        {bookedStatus && (
          <div className="absolute inset-0 flex items-center justify-center">
            <X className="w-3 h-3 opacity-60" />
          </div>
        )}
        {blockedStatus && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 opacity-60" />
          </div>
        )}
      </button>
    );
  }
};
