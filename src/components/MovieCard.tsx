import React from 'react';
import { Movie, Showtime } from '../types/cinema';
import { Play, ArrowRight, Clock } from 'lucide-react';
import { useArtworkLuminance } from '../hooks/useArtworkLuminance';
import { CinemaStorage } from '../services/storage';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onSelectShowtimeSession?: (movie: Movie, showtime: Showtime) => void;
  showtimes?: Showtime[];
  ticketPrice?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onOpenDetails,
  onSelectShowtimeSession,
  showtimes = [],
  ticketPrice = 350,
}) => {
  const { isLight } = useArtworkLuminance(movie.posterUrl);

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  // Movie showtimes for the selected date
  const movieShowtimes = showtimes.filter((st) => st.movieId === movie.id);

  return (
    <article className="group flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Poster Frame (Strict 2:3 Aspect Ratio) */}
      <div
        onClick={() => onOpenDetails(movie)}
        className="relative aspect-[2/3] overflow-hidden bg-zinc-900 cursor-pointer border-b border-[var(--border-subtle)]"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Technical Meta Strip - Luminance-Aware Dynamic Badges */}
        <div className="absolute top-2 left-2 right-2 sm:top-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span
            className={`font-mono text-[9px] sm:text-[10px] font-bold px-2 py-0.5 shadow-md border ${
              isLight
                ? 'bg-[#0A0A0E] text-white border-white/30'
                : 'bg-[#101015]/95 text-white border-[#C5A059]/40'
            }`}
          >
            {movie.rating}
          </span>
          <span
            className={`font-mono text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 shadow-md border inline-flex items-center space-x-1 ${
              isLight
                ? 'bg-[#0A0A0E] text-white border-white/30'
                : 'bg-[#101015]/95 text-white border-[#C5A059]/40'
            }`}
          >
            <Clock className="w-2.5 h-2.5 hidden sm:inline text-[#C5A059]" />
            <span>{formatDuration(movie.durationMin)}</span>
          </span>
        </div>

        {/* Status Ribbon if Coming Soon */}
        {!movie.isNowShowing && (
          <div className="absolute bottom-0 inset-x-0 bg-[#09090d]/95 border-t border-white/20 py-1.5 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold shadow-md">
            Upcoming Exhibition
          </div>
        )}

        {/* Hover Trailer Trigger */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#09090d] text-white border border-[#C5A059] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-2xl">
            <Play className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
            <span>Trailer</span>
          </span>
        </div>
      </div>

      {/* Swiss Editorial Metadata Block */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          {/* Genre Index */}
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-[var(--accent-brass)] font-semibold truncate">
            {movie.genre.slice(0, 2).join(' • ')}
          </p>

          {/* Film Title */}
          <h3
            onClick={() => onOpenDetails(movie)}
            className="font-display text-xs sm:text-base font-extrabold text-[var(--text-primary)] group-hover:text-[var(--accent-brass)] transition-colors truncate cursor-pointer uppercase tracking-tight leading-snug"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Director Credit */}
          <p className="font-mono text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate">
            Dir. {movie.director}
          </p>
        </div>

        {/* 1-Tap Inline Showtime Chips (Instant Seat Selection Trigger) */}
        {movie.isNowShowing && movieShowtimes.length > 0 && (
          <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
            <div className="flex items-center justify-between text-[8.5px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              <span>Today's Sessions</span>
              <span>Hall 01</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {movieShowtimes.map((st) => {
                const { booked, blocked } = CinemaStorage.getOccupiedSeatsForShowtime(st.id);
                const openCount = Math.max(0, 72 - (booked.length + blocked.length));
                const isAlmostFull = openCount <= 12 && openCount > 0;
                const isSoldOut = openCount === 0;

                return (
                  <button
                    key={st.id}
                    disabled={isSoldOut}
                    onClick={() => {
                      if (onSelectShowtimeSession) {
                        onSelectShowtimeSession(movie, st);
                      } else {
                        onSelectMovie(movie);
                      }
                    }}
                    className={`px-2 py-1.5 border text-left font-mono transition-all flex flex-col justify-between ${
                      isSoldOut
                        ? 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] opacity-40 cursor-not-allowed text-[var(--text-muted)]'
                        : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border-[var(--border-strong)] hover:border-[var(--accent-brass)] text-[var(--text-primary)] active:scale-95'
                    }`}
                    title={`${st.time} • ${openCount} seats open`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[10px] sm:text-[11px]">{st.time}</span>
                      {st.format && (
                        <span className="text-[7.5px] uppercase font-bold text-[var(--accent-brass)]">
                          {st.format === 'Dolby Atmos 7.1' ? 'Atmos' : st.format === "Director's Cut" ? 'VIP' : '4K'}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[8px] tracking-tight ${
                        isSoldOut
                          ? 'text-rose-500 font-bold'
                          : isAlmostFull
                          ? 'text-amber-500 font-bold'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {isSoldOut ? 'Sold Out' : isAlmostFull ? `${openCount} left!` : `${openCount} open`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Admission Rate & Direct Action */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-1.5">
          <div className="shrink-0">
            <span className="hidden sm:block font-mono text-[8.5px] text-[var(--text-muted)] uppercase tracking-wider">
              Admission
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              ₱{ticketPrice}
            </span>
          </div>

          <button
            onClick={() => onSelectMovie(movie)}
            disabled={!movie.isNowShowing}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center space-x-1.5 active:scale-95 ${
              movie.isNowShowing
                ? 'bg-[var(--text-primary)] hover:bg-[#C5A059] text-[var(--text-inverse)] hover:text-black shadow-sm'
                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed'
            }`}
          >
            <span>{movie.isNowShowing ? 'Seats' : 'Soon'}</span>
            {movie.isNowShowing && <ArrowRight className="w-3 h-3 hidden sm:inline" />}
          </button>
        </div>
      </div>
    </article>
  );
};
