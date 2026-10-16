import React from 'react';
import { Movie, Showtime } from '../types/cinema';
import { CinemaStorage, getFormattedDate } from '../services/storage';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';

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

  const availableShowtimes = showtimes.filter(
    (st) => st.movieId === movie.id && st.date === selectedDate
  );

  return (
    <div className="space-y-8 sm:space-y-10 max-w-5xl mx-auto">
      {/* Selected Film Context Dossier Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="flex items-center space-x-3.5 sm:space-x-5 min-w-0">
          <div className="w-12 sm:w-16 aspect-[2/3] bg-zinc-900 border border-[var(--border-subtle)] shrink-0 overflow-hidden">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1 min-w-0">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[var(--accent-brass)] font-bold block">
              Auditorium 01 • Single Screen Exhibition
            </span>
            <h2 className="font-display text-lg sm:text-2xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight truncate">
              {movie.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-[var(--text-muted)] font-mono truncate">
              {movie.rating} • {movie.durationMin} MINS • Dir. {movie.director}
            </p>
          </div>
        </div>

        <button
          onClick={onBackToMovies}
          className="self-start sm:self-center px-3.5 py-2 border border-[var(--border-strong)] hover:border-[var(--accent-brass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Film</span>
        </button>
      </div>

      {/* Step 01: 7-Day Date Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[var(--text-primary)] font-bold flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[var(--accent-brass)]" />
            <span>01 / Select Exhibition Date</span>
          </h3>
          <span className="font-mono text-[10px] sm:text-xs text-[var(--text-muted)]">
            7-Day Window
          </span>
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
                    isSelected
                      ? 'text-[#C5A059] font-bold'
                      : countForDate > 0
                      ? 'text-[var(--accent-brass)]'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {countForDate > 0 ? `${countForDate} session${countForDate > 1 ? 's' : ''}` : 'No shows'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 02: Session Time Cards with Live Capacity Gauge */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[var(--text-primary)] font-bold flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-[var(--accent-brass)]" />
            <span>02 / Select Screening Time (Hall 01)</span>
          </h3>
          <span className="font-mono text-[10px] sm:text-xs text-[var(--accent-brass)] font-bold">
            72 Reserved Seats / Session
          </span>
        </div>

        {availableShowtimes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {availableShowtimes.map((st) => {
              const isSelected = selectedShowtime?.id === st.id;
              const { booked, blocked } = CinemaStorage.getOccupiedSeatsForShowtime(st.id);
              const occupiedCount = booked.length + blocked.length;
              const openSeats = Math.max(0, 72 - occupiedCount);
              const isSoldOut = openSeats === 0;
              const occupancyPct = Math.round((occupiedCount / 72) * 100);

              return (
                <button
                  key={st.id}
                  disabled={isSoldOut}
                  onClick={() => onSelectShowtime(st)}
                  className={`group p-4 sm:p-5 border transition-all text-left flex flex-col justify-between space-y-4 active:scale-[0.99] ${
                    isSoldOut
                      ? 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[var(--bg-surface)] border-[#C5A059] ring-1 ring-[#C5A059]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent-brass)]'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-lg sm:text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-brass)] transition-colors">
                      {st.time}
                    </span>
                    <span className="font-mono text-xs text-[var(--accent-brass)] font-bold px-2 py-0.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                      ₱{st.price}
                    </span>
                  </div>

                  {/* Live Auditorium Capacity Meter */}
                  <div className="space-y-1.5 font-mono text-[10px] sm:text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)] uppercase">Hall 01</span>
                      <span
                        className={`font-bold ${
                          isSoldOut
                            ? 'text-rose-500'
                            : openSeats <= 10
                            ? 'text-amber-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {isSoldOut ? 'SOLD OUT' : `${openSeats} / 72 OPEN`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-elevated)] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isSoldOut
                            ? 'bg-rose-500'
                            : openSeats <= 10
                            ? 'bg-amber-500'
                            : 'bg-[#C5A059]'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-wider font-bold text-[var(--text-primary)]">
                    <span>
                      {isSoldOut ? 'Session Full' : isSelected ? 'Selected' : 'Select Seats'}
                    </span>
                    {!isSoldOut && (
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[var(--accent-brass)]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
            <p className="font-mono text-xs font-bold uppercase text-[var(--text-primary)]">
              No Screenings Scheduled on {selectedDate}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Select another date above or switch to another film in the repertory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
