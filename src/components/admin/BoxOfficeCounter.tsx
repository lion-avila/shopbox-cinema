import React, { useState } from 'react';
import { Showtime, Movie, TheaterSeat } from '../../types/cinema';
import { THEATER_SEATS, CinemaStorage } from '../../services/storage';
import { Users, Lock, X, RotateCcw } from 'lucide-react';

interface BoxOfficeCounterProps {
  showtimes: Showtime[];
  movies: Movie[];
  onRefreshData: () => void;
}

export const BoxOfficeCounter: React.FC<BoxOfficeCounterProps> = ({
  showtimes,
  movies,
  onRefreshData,
}) => {
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>(
    showtimes[0]?.id || ''
  );

  const currentShowtime =
    showtimes.find((st) => st.id === selectedShowtimeId) || showtimes[0];
  const currentMovie = movies.find((m) => m.id === currentShowtime?.movieId);

  if (!currentShowtime) {
    return (
      <div className="p-8 text-center font-mono text-xs text-[var(--text-muted)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        No exhibition sessions scheduled. Add a session in Single-Hall Schedule first.
      </div>
    );
  }

  const { booked, blocked } = CinemaStorage.getOccupiedSeatsForShowtime(
    currentShowtime.id
  );

  const handleSeatClick = (seatId: number) => {
    if (booked.includes(seatId)) {
      alert(
        `Seat #${seatId} was reserved online by a patron. To release it, cancel the booking in Ticket Management.`
      );
      return;
    }

    CinemaStorage.toggleBlockedSeat(currentShowtime.id, seatId);
    onRefreshData();
  };

  const handleClearAllHolds = () => {
    if (blocked.length === 0) return;
    if (
      confirm(
        `Release all ${blocked.length} staff-held seat(s) for this session back to available status?`
      )
    ) {
      blocked.forEach((seatId) => {
        CinemaStorage.toggleBlockedSeat(currentShowtime.id, seatId);
      });
      onRefreshData();
    }
  };

  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const availableCount = Math.max(0, 72 - (booked.length + blocked.length));
  const totalSessionRevenue =
    (booked.length + blocked.length) * currentShowtime.price;

  return (
    <div className="space-y-6">
      {/* Operational Metrics & Session Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="md:col-span-2 p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <label className="uppercase tracking-wider text-[var(--text-muted)] text-[10px] font-bold block">
            Select Exhibition Session (Hall 01)
          </label>
          <select
            value={selectedShowtimeId}
            onChange={(e) => setSelectedShowtimeId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent-brass)]"
          >
            {showtimes.map((st) => {
              const movie = movies.find((m) => m.id === st.movieId);
              return (
                <option key={st.id} value={st.id}>
                  {st.date} • {st.time} — {movie?.title || 'Unknown'} (₱{st.price})
                </option>
              );
            })}
          </select>
          <p className="text-[var(--text-muted)] text-[11px] truncate">
            Film: <span className="text-[var(--text-primary)] font-bold">{currentMovie?.title}</span> • 72 Seats
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between">
          <span className="uppercase tracking-wider text-[var(--text-muted)] text-[10px] font-bold">
            Auditorium Occupancy
          </span>
          <div className="flex items-baseline space-x-2 my-1">
            <span className="font-display text-2xl font-extrabold text-[var(--text-primary)]">
              {Math.round(((booked.length + blocked.length) / 72) * 100)}%
            </span>
            <span className="text-[var(--text-muted)] text-[11px]">
              ({booked.length + blocked.length}/72)
            </span>
          </div>
          <span className="text-emerald-500 font-bold text-[11px]">
            {availableCount} seats open
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between">
          <span className="uppercase tracking-wider text-[var(--text-muted)] text-[10px] font-bold">
            Session Gross
          </span>
          <div className="flex items-baseline space-x-1 my-1">
            <span className="font-display text-2xl font-extrabold text-[var(--accent-brass)]">
              ₱{totalSessionRevenue.toLocaleString()}
            </span>
          </div>
          <span className="text-[var(--text-muted)] text-[11px]">
            {booked.length} Online • {blocked.length} Walk-In/Hold
          </span>
        </div>
      </div>

      {/* Responsive 72-Seat Box Office Matrix */}
      <div className="p-4 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center space-x-2">
              <Users className="w-4 h-4 text-[var(--accent-brass)]" />
              <span>72-Seat Box Office Counter & Walk-In Hold Matrix</span>
            </h3>
            <p className="text-[var(--text-muted)] text-[11px] mt-0.5">
              Tap any available seat to toggle a Walk-In Cash Sale / Staff Hold.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 bg-[var(--seat-available-bg)] border border-[var(--seat-available-border)] inline-block" />
              <span className="text-[var(--text-secondary)]">Open ({availableCount})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 bg-[var(--seat-reserved-bg)] border border-[var(--seat-reserved-border)] text-[var(--seat-reserved-text)] inline-flex items-center justify-center text-[8px]">
                ✕
              </span>
              <span className="text-[var(--text-muted)]">Online ({booked.length})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 bg-[#C5A059] text-black font-bold inline-flex items-center justify-center text-[8px]">
                ■
              </span>
              <span className="text-[var(--text-primary)] font-bold">Walk-In Hold ({blocked.length})</span>
            </span>

            {blocked.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllHolds}
                className="inline-flex items-center space-x-1 px-2.5 py-1 border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 text-[10px] uppercase font-bold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Release Holds ({blocked.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Screen Indicator */}
        <div className="max-w-md mx-auto text-center py-2 architectural-screen text-[var(--accent-brass)] font-mono text-[10px] font-bold tracking-[0.35em] uppercase">
          S C R E E N • H A L L 0 1
        </div>

        {/* Mobile-Responsive 72-Seat Matrix (No Horizontal Clipping) */}
        <div className="w-full max-w-xl mx-auto space-y-1.5 sm:space-y-2.5">
          {rows.map((rowNum) => {
            const rowLabel = rowLetters[rowNum - 1];
            const rowSeats = THEATER_SEATS.filter((s) => s.row === rowNum);
            const leftBlock = rowSeats.filter((s) => s.block === 'left');
            const rightBlock = rowSeats.filter((s) => s.block === 'right');

            return (
              <div
                key={rowNum}
                className="flex items-center justify-center sm:justify-between"
              >
                <span className="w-4 sm:w-6 font-mono text-[10px] sm:text-xs font-bold text-[var(--text-muted)] text-right pr-1 sm:pr-2 shrink-0">
                  {rowLabel}
                </span>

                <div className="grid grid-cols-4 gap-1 sm:gap-2">
                  {leftBlock.map((seat) => renderAdminSeat(seat))}
                </div>

                <div className="w-4 sm:w-10 text-center font-mono text-[7px] sm:text-[9px] text-[var(--text-muted)] tracking-wider shrink-0">
                  <span className="hidden sm:inline">AISLE</span>
                  <span className="sm:hidden">•</span>
                </div>

                <div className="grid grid-cols-4 gap-1 sm:gap-2">
                  {rightBlock.map((seat) => renderAdminSeat(seat))}
                </div>

                <span className="w-4 sm:w-6 font-mono text-[10px] sm:text-xs font-bold text-[var(--text-muted)] pl-1 sm:pl-2 shrink-0">
                  {rowLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  function renderAdminSeat(seat: TheaterSeat) {
    const isOnlineBooked = booked.includes(seat.id);
    const isManualHold = blocked.includes(seat.id);

    return (
      <button
        key={seat.id}
        type="button"
        onClick={() => handleSeatClick(seat.id)}
        title={`Row ${seat.rowLabel} Seat #${seat.id} (${
          isOnlineBooked
            ? 'Online Booked'
            : isManualHold
            ? 'Walk-In / Staff Held — Click to release'
            : 'Available — Click to hold'
        })`}
        className={`w-[31px] h-[31px] sm:w-10 sm:h-10 text-[10px] sm:text-xs font-mono font-semibold flex items-center justify-center transition-all select-none ${
          isOnlineBooked
            ? 'bg-[var(--seat-reserved-bg)] border border-[var(--seat-reserved-border)] text-[var(--seat-reserved-text)] cursor-not-allowed opacity-70'
            : isManualHold
            ? 'bg-[#C5A059] border border-[#C5A059] text-black font-bold shadow-sm'
            : 'bg-[var(--seat-available-bg)] border border-[var(--seat-available-border)] text-[var(--seat-available-text)] hover:border-[#C5A059] hover:text-[var(--accent-brass)] active:scale-95'
        }`}
      >
        {isOnlineBooked ? (
          <X className="w-3 h-3 opacity-60" />
        ) : isManualHold ? (
          <div className="flex flex-col items-center leading-none">
            <span className="text-[8px] font-black">{seat.rowLabel}{seat.id}</span>
            <Lock className="w-2.5 h-2.5 text-black" />
          </div>
        ) : (
          seat.id
        )}
      </button>
    );
  }
};
