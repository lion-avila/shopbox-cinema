import React from 'react';
import { Movie, Showtime } from '../types/cinema';
import { CinemaStorage, getFormattedDate } from '../services/storage';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ShowtimePickerProps {
  movie: Movie;
  showtimes: Showtime[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedShowtime: Showtime | null;
  onSelectShowtime: (showtime: Showtime) => void;
  onBackToMovies: () => void;
}

export const ShowtimePicker: React.FC<ShowtimePickerProps> = ({
  movie,
  showtimes,
  selectedDate,
  onSelectDate,
  selectedShowtime,
  onSelectShowtime,
  onBackToMovies,
}) => {
  // Generate 7 upcoming dates
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const dateStr = getFormattedDate(i);
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + i);

    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      dateStr,
      dayName,
      monthDay,
    };
  });

  // Filter showtimes for selected movie & date
  const availableShowtimes = showtimes.filter(
    (st) => st.movieId === movie.id && st.date === selectedDate
  );

  return (
    <div className="space-y-8 sm:space-y-12 max-w-5xl mx-auto">
      {/* Movie Breadcrumb Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-8 bg-[#0c0c10] border border-white/[0.08]">
        <div className="flex items-center space-x-3.5 sm:space-x-6">
          <div className="w-12 h-18 sm:w-16 sm:h-24 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden aspect-[2/3]">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#C5A059] block">
              Auditorium 01 • Single Screen
            </span>
            <h2 className="font-display text-lg sm:text-2xl font-bold text-white uppercase tracking-tight truncate">
              {movie.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-mono truncate">
              {movie.rating} • {movie.durationMin} MINS • ₱350 ALL SEATS
            </p>
          </div>
        </div>

        <button
          onClick={onBackToMovies}
          className="self-start sm:self-center px-3 sm:px-4 py-1.5 sm:py-2 border border-white/20 hover:border-white text-zinc-300 hover:text-white text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-colors flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          <span>Change Film</span>
        </button>
      </div>

      {/* Step 1: Date Bar */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 sm:pb-3">
          <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-zinc-300">
            01 / Select Screening Date
          </h3>
          <span className="font-mono text-[10px] sm:text-xs text-zinc-400">7-Day Exhibition Window</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          {dateOptions.map(({ dateStr, dayName, monthDay }) => {
            const isSelected = selectedDate === dateStr;
            const countForDate = showtimes.filter(
              (st) => st.movieId === movie.id && st.date === dateStr
            ).length;

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`flex-shrink-0 flex flex-col items-center py-2.5 sm:py-3.5 px-3 sm:px-6 border transition-all text-center min-w-[85px] sm:min-w-[110px] active:scale-95 ${
                  isSelected
                    ? 'bg-zinc-100 text-black border-zinc-100 font-bold'
                    : 'bg-[#0c0c10] text-zinc-400 border-white/[0.08] hover:border-zinc-600 hover:text-zinc-200'
                }`}
              >
                <span className={`text-[9px] sm:text-[10px] uppercase font-mono tracking-wider ${isSelected ? 'text-black/70' : 'text-zinc-400'}`}>
                  {dayName}
                </span>
                <span className={`text-sm sm:text-base font-bold mt-0.5 font-display ${isSelected ? 'text-black' : 'text-white'}`}>
                  {monthDay}
                </span>
                <span className={`text-[9px] sm:text-[10px] font-mono mt-0.5 sm:mt-1 ${isSelected ? 'text-black font-semibold' : 'text-[#C5A059]'}`}>
                  {countForDate > 0 ? `${countForDate} sessions` : 'Dark'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Session Grid */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 sm:pb-3">
          <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-zinc-300">
            02 / Select Showtime (Hall 01)
          </h3>
          <span className="font-mono text-[10px] sm:text-xs text-zinc-400">Fixed ₱350 Flat Rate</span>
        </div>

        {availableShowtimes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {availableShowtimes.map((st) => {
              const isSelected = selectedShowtime?.id === st.id;
              const { booked, blocked } = CinemaStorage.getOccupiedSeatsForShowtime(st.id);
              const openSeats = 72 - (booked.length + blocked.length);

              return (
                <button
                  key={st.id}
                  onClick={() => onSelectShowtime(st)}
                  className={`group p-3.5 sm:p-6 border transition-all text-left flex flex-col justify-between space-y-3 sm:space-y-5 active:scale-98 ${
                    isSelected
                      ? 'bg-zinc-900 border-[#C5A059] ring-1 ring-[#C5A059]'
                      : 'bg-[#0c0c10] border-white/[0.08] hover:border-zinc-500'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="font-mono text-base sm:text-xl font-bold text-white group-hover:text-[#E2C285] transition-colors">
                      {st.time}
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs text-[#C5A059] font-bold">
                      ₱{st.price}
                    </span>
                  </div>

                  <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs font-mono">
                    <div className="text-zinc-400">Auditorium 01</div>
                    <div className={`${openSeats < 10 ? 'text-rose-400' : 'text-zinc-400'}`}>
                      {openSeats} of 72 open
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-300 group-hover:text-white">
                    <span>{isSelected ? 'Selected' : 'Pick Seats'}</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center border border-white/[0.08] bg-[#0c0c10]">
            <p className="font-mono text-xs uppercase text-zinc-400">
              No exhibition sessions scheduled on this date.
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Please choose another date or explore other films in the program.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
