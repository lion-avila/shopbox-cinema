import React, { useState } from 'react';
import { Movie, Showtime } from '../types/cinema';
import { CinemaStorage, getFormattedDate } from '../services/storage';
import { Film, ArrowRight } from 'lucide-react';

interface ScheduleViewProps {
  movies: Movie[];
  showtimes: Showtime[];
  onSelectSession: (movie: Movie, showtime: Showtime) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  movies,
  showtimes,
  onSelectSession,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate(0));

  // Generate 7 days
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

  const dailyShowtimes = showtimes
    .filter((st) => st.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Schedule Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C5A059] block">
          Daily Program
        </span>
        <h2 className="font-display text-3xl font-extrabold text-white uppercase tracking-tight">
          Auditorium 01 Screenings
        </h2>
        <p className="text-sm text-zinc-400 font-light max-w-xl">
          All films are exhibited sequentially in our boutique 72-seat theater with 4K laser projection.
        </p>
      </div>

      {/* Date Carousel Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
        {dateOptions.map(({ dateStr, dayName, monthDay }) => {
          const isSelected = selectedDate === dateStr;
          const countForDate = showtimes.filter((st) => st.date === dateStr).length;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
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
                {countForDate} sessions
              </span>
            </button>
          );
        })}
      </div>

      {/* Showtimes Timeline */}
      <div className="space-y-3 sm:space-y-4">
        {dailyShowtimes.length > 0 ? (
          dailyShowtimes.map((st) => {
            const movie = movies.find((m) => m.id === st.movieId);
            if (!movie) return null;

            const { booked, blocked } = CinemaStorage.getOccupiedSeatsForShowtime(st.id);
            const remaining = 72 - (booked.length + blocked.length);

            return (
              <div
                key={st.id}
                className="p-3.5 sm:p-6 bg-[#0c0c10] border border-white/[0.08] hover:border-zinc-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6"
              >
                <div className="flex items-center space-x-3.5 sm:space-x-6 min-w-0">
                  <div className="w-14 h-20 sm:w-16 sm:h-24 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden aspect-[2/3]">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 font-mono text-[11px] sm:text-xs">
                      <span className="text-base sm:text-lg font-bold text-white">
                        {st.time}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-[#C5A059] uppercase">{st.hall}</span>
                    </div>

                    <h3 className="font-display text-sm sm:text-lg font-bold text-white uppercase truncate">
                      {movie.title}
                    </h3>

                    <p className="font-mono text-[10px] sm:text-xs text-zinc-400 truncate">
                      {movie.rating} • {movie.durationMin} MINS • {movie.genre.slice(0, 2).join(', ')}
                    </p>

                    <div className="pt-0.5 flex items-center space-x-2 sm:space-x-3 font-mono text-[10px] sm:text-xs">
                      <span className={`${remaining < 15 ? 'text-rose-400' : 'text-zinc-400'}`}>
                        {remaining} of 72 open
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-white font-bold">₱{st.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => onSelectSession(movie, st)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3.5 bg-zinc-100 hover:bg-[#C5A059] text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-95"
                  >
                    <span>Pick Seats</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-10 sm:p-16 text-center border border-white/[0.08] bg-[#0c0c10]">
            <Film className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-400 mx-auto mb-3" />
            <p className="font-mono text-xs uppercase text-zinc-400">No screenings on this date</p>
          </div>
        )}
      </div>
    </div>
  );
};
