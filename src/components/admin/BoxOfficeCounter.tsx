import React, { useState } from 'react';
import { Showtime, Movie, TheaterSeat } from '../../types/cinema';
import { THEATER_SEATS, CinemaStorage } from '../../services/storage';
import { 
  Users, 
  Lock, 
  X
} from 'lucide-react';

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

  const currentShowtime = showtimes.find((st) => st.id === selectedShowtimeId) || showtimes[0];
  const currentMovie = movies.find((m) => m.id === currentShowtime?.movieId);

  if (!currentShowtime) {
    return <div className="p-8 text-center font-mono text-xs text-zinc-400">No showtimes available.</div>;
  }

  const { booked, blocked } = CinemaStorage.getOccupiedSeatsForShowtime(currentShowtime.id);

  const handleSeatClick = (seatId: number) => {
    if (booked.includes(seatId)) {
      alert(`Seat #${seatId} was booked online by a customer.`);
      return;
    }

    CinemaStorage.toggleBlockedSeat(currentShowtime.id, seatId);
    onRefreshData();
  };

  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const availableCount = 72 - (booked.length + blocked.length);
  const totalSessionRevenue = (booked.length + blocked.length) * currentShowtime.price;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="md:col-span-2 p-5 bg-[#0c0c10] border border-white/[0.08] space-y-2">
          <label className="uppercase tracking-wider text-zinc-400 block">
            Select Exhibition Session (Hall 01)
          </label>
          <select
            value={selectedShowtimeId}
            onChange={(e) => setSelectedShowtimeId(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-zinc-500"
          >
            {showtimes.map((st) => {
              const movie = movies.find((m) => m.id === st.movieId);
              return (
                <option key={st.id} value={st.id} className="bg-zinc-950 text-white">
                  {st.date} • {st.time} — {movie?.title || 'Unknown'} (₱{st.price})
                </option>
              );
            })}
          </select>
          <p className="text-zinc-400 text-[11px]">
            Film: <span className="text-white font-bold">{currentMovie?.title}</span> • Single Screen Auditorium
          </p>
        </div>

        <div className="p-5 bg-[#0c0c10] border border-white/[0.08] flex flex-col justify-between">
          <span className="uppercase tracking-wider text-zinc-400">
            Occupancy Rate
          </span>
          <div className="flex items-baseline space-x-2 my-1">
            <span className="text-2xl font-bold text-white">
              {Math.round(((booked.length + blocked.length) / 72) * 100)}%
            </span>
            <span className="text-zinc-400 text-[11px]">
              ({booked.length + blocked.length}/72)
            </span>
          </div>
          <span className="text-emerald-400 text-[11px]">{availableCount} seats remaining</span>
        </div>

        <div className="p-5 bg-[#0c0c10] border border-white/[0.08] flex flex-col justify-between">
          <span className="uppercase tracking-wider text-zinc-400">
            Session Gross
          </span>
          <div className="flex items-baseline space-x-1 my-1">
            <span className="text-2xl font-bold text-[#C5A059]">
              ₱{totalSessionRevenue.toLocaleString()}
            </span>
          </div>
          <span className="text-zinc-400 text-[11px]">Fixed ₱{currentShowtime.price} General Admission</span>
        </div>
      </div>

      {/* Seating Grid */}
      <div className="p-6 sm:p-8 bg-[#0c0c10] border border-white/[0.08] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#C5A059]" />
              <span>Box Office Walk-In Hold & Seat Control</span>
            </h3>
            <p className="text-zinc-400 text-[11px] mt-0.5">
              Click any available seat to toggle Walk-In Cash Hold or Maintenance Block.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-[#121217] border border-white/20 inline-block" />
              <span className="text-zinc-400">Available</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-zinc-900 border border-zinc-800 text-zinc-400 inline-block text-center text-[8px] leading-3">X</span>
              <span className="text-zinc-400">Online Booked</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-zinc-900 border border-zinc-700 text-zinc-300 inline-block" />
              <span className="text-zinc-300">Staff Held</span>
            </span>
          </div>
        </div>

        {/* Screen Indicator */}
        <div className="max-w-md mx-auto text-center py-1.5 bg-zinc-950 border border-white/[0.08] text-zinc-400 font-mono text-[10px] tracking-[0.3em] uppercase">
          S C R E E N
        </div>

        {/* 72 Seats Grid */}
        <div className="min-w-[560px] max-w-xl mx-auto space-y-2">
          {rows.map((rowNum) => {
            const rowLabel = rowLetters[rowNum - 1];
            const rowSeats = THEATER_SEATS.filter((s) => s.row === rowNum);
            const leftBlock = rowSeats.filter((s) => s.block === 'left');
            const rightBlock = rowSeats.filter((s) => s.block === 'right');

            return (
              <div key={rowNum} className="flex items-center justify-between">
                <span className="w-6 font-mono text-xs text-zinc-400 text-right pr-2">
                  {rowLabel}
                </span>

                <div className="grid grid-cols-4 gap-2">
                  {leftBlock.map((seat) => renderAdminSeat(seat))}
                </div>

                <div className="w-10 text-center font-mono text-[8px] text-zinc-400 tracking-wider">
                  AISLE
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {rightBlock.map((seat) => renderAdminSeat(seat))}
                </div>

                <span className="w-6 font-mono text-xs text-zinc-400 pl-2">
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
        onClick={() => handleSeatClick(seat.id)}
        title={`Seat ${seat.id} (${isOnlineBooked ? 'Online Booked' : isManualHold ? 'Held' : 'Available'})`}
        className={`w-9 h-9 sm:w-10 sm:h-10 text-xs font-mono font-medium flex items-center justify-center transition-all ${
          isOnlineBooked
            ? 'bg-zinc-900 border border-zinc-800 text-zinc-400 cursor-not-allowed'
            : isManualHold
            ? 'bg-zinc-800 border-2 border-zinc-600 text-white hover:bg-zinc-700'
            : 'bg-[#121217] border border-white/[0.12] text-zinc-300 hover:border-white hover:text-white'
        }`}
      >
        {isOnlineBooked ? (
          <X className="w-3 h-3 text-zinc-400" />
        ) : isManualHold ? (
          <Lock className="w-3 h-3 text-zinc-300" />
        ) : (
          seat.id
        )}
      </button>
    );
  }
};
