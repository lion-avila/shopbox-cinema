import React, { useState } from 'react';
import { Movie, Showtime } from '../types/cinema';
import { CinemaStorage, getFormattedDate } from '../services/storage';
import { Film, ArrowRight, Clock } from 'lucide-react';

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

  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const dateStr = getFormattedDate(i);
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + i);

    const dayName =
      i === 0
        ? 'Today'
        : i === 1
        ? 'Tomorrow'
        : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
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
    <div className="space-y-8 sm:space-y-12 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[var(--border-subtle)] pb-5 space-y-2">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--accent-brass)] font-bold block">
          02 / Daily Exhibition Timetable
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
          Auditorium 01 Master Schedule
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
          All screenings take place sequentially in Hall 01 (4/F Shopbox Bldg., Virac, Catanduanes) with 72-seat capacity per session.
        </p>
      </div>

      {/* 7-Day Date Selector Rail */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
        {dateOptions.map(({ dateStr, dayName, monthDay }) => {
          const isSelected = selectedDate === dateStr;
          const countForDate = showtimes.filter((st) => st.date === dateStr).length;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex-shrink-0 flex flex-col items-center py-2.5 sm:py-3.5 px-3.5 sm:px-6 border transition-all text-center min-w-[90px] sm:min-w-[115px] active:scale-95 ${
                isSelected
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] border-[var(--text-primary)] font-bold shadow-md'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-brass)]'
              }`}
            >
              <span
                className={`text-[9px] sm:text-[10px] uppercase font-mono tracking-wider ${
                  isSelected ? 'opacity-80' : 'text-[var(--text-muted)]'
                }`}
              >
                {dayName}
              </span>
              <span className="text-sm sm:text-base font-extrabold mt-0.5 font-display">
                {monthDay}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-mono mt-1 ${
                  isSelected ? 'text-[#C5A059] font-bold' : 'text-[var(--accent-brass)]'
                }`}
              >
                {countForDate} sessions
              </span>
            </button>
          );
        })}
      </div>

      {/* Sequential Timetable Dossier */}
      <div className="space-y-3 sm:space-y-4">
        {dailyShowtimes.length > 0 ? (
          dailyShowtimes.map((st, idx) => {
            const movie = movies.find((m) => m.id === st.movieId);
            if (!movie) return null;

            const { booked, blocked } = CinemaStorage.getOccupiedSeatsForShowtime(st.id);
            const occupied = booked.length + blocked.length;
            const remaining = Math.max(0, 72 - occupied);
            const isSoldOut = remaining === 0;

            return (
              <div
                key={st.id}
                className="p-4 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6"
              >
                <div className="flex items-center space-x-3.5 sm:space-x-5 min-w-0">
                  <span className="hidden md:inline-block font-mono text-xs text-[var(--text-muted)] w-6">
                    0{idx + 1}
                  </span>

                  <div className="w-14 sm:w-16 aspect-[2/3] bg-zinc-900 border border-[var(--border-subtle)] shrink-0 overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold">
                        <Clock className="w-3 h-3 text-[var(--accent-brass)]" />
                        <span>{st.time}</span>
                      </span>
                      <span className="text-[var(--accent-brass)] uppercase text-[11px] font-bold">
                        {st.hall}
                      </span>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-extrabold text-[var(--text-primary)] uppercase truncate">
                      {movie.title}
                    </h3>

                    <p className="font-mono text-[10px] sm:text-xs text-[var(--text-muted)] truncate">
                      {movie.rating} • {movie.durationMin} MINS • Dir. {movie.director}
                    </p>

                    <div className="pt-0.5 flex items-center space-x-3 font-mono text-[10px] sm:text-xs">
                      <span
                        className={`font-bold ${
                          isSoldOut
                            ? 'text-rose-500'
                            : remaining <= 12
                            ? 'text-amber-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {isSoldOut ? 'SOLD OUT' : `${remaining} of 72 seats open`}
                      </span>
                      <span className="text-[var(--text-muted)]">•</span>
                      <span className="text-[var(--text-primary)] font-bold">₱{st.price} Flat Rate</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end shrink-0">
                  <button
                    disabled={isSoldOut}
                    onClick={() => onSelectSession(movie, st)}
                    className={`w-full sm:w-auto px-5 py-3 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                      isSoldOut
                        ? 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed'
                        : 'bg-[var(--text-primary)] hover:bg-[#C5A059] text-[var(--text-inverse)] hover:text-black'
                    }`}
                  >
                    <span>{isSoldOut ? 'Sold Out' : 'Select Seats'}</span>
                    {!isSoldOut && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <Film className="w-8 h-8 text-[var(--accent-brass)] mx-auto mb-3" />
            <p className="font-mono text-xs uppercase font-bold text-[var(--text-primary)]">
              No Screenings Scheduled on {selectedDate}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Select another date tab above to view upcoming presentations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
