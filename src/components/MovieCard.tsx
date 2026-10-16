import React from 'react';
import { Movie } from '../types/cinema';
import { Play, ArrowRight, Clock } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  ticketPrice?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onOpenDetails,
  ticketPrice = 350,
}) => {
  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  return (
    <article className="group flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] transition-all duration-300">
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

        {/* Top Technical Meta Strip - Solid High-Contrast Pills */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between pointer-events-none">
          <span className="font-mono text-[9px] sm:text-[10px] font-bold px-2 py-0.5 bg-[#09090d] text-white border border-white/25 shadow-md">
            {movie.rating}
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 bg-[#09090d] text-white border border-white/25 shadow-md inline-flex items-center space-x-1">
            <Clock className="w-2.5 h-2.5 hidden sm:inline text-[#C5A059]" />
            <span>{formatDuration(movie.durationMin)}</span>
          </span>
        </div>

        {/* Status Ribbon if Coming Soon */}
        {!movie.isNowShowing && (
          <div className="absolute bottom-0 inset-x-0 bg-[#09090d] border-t border-white/20 py-1.5 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold shadow-md">
            Upcoming Exhibition
          </div>
        )}

        {/* Hover Dossier Trigger */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#09090d] text-white border border-[#C5A059] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-2xl">
            <Play className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
            <span>Film Dossier</span>
          </span>
        </div>
      </div>

      {/* Swiss Editorial Metadata Block */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4">
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

        {/* Admission Rate & Direct Action */}
        <div className="pt-2.5 sm:pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-1.5">
          <div className="shrink-0">
            <span className="hidden sm:block font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
              Hall 01 Flat Rate
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
                ? 'bg-[var(--text-primary)] hover:bg-[#C5A059] text-[var(--text-inverse)] hover:text-black'
                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed'
            }`}
          >
            <span>{movie.isNowShowing ? 'Reserve' : 'Soon'}</span>
            {movie.isNowShowing && <ArrowRight className="w-3 h-3 hidden sm:inline" />}
          </button>
        </div>
      </div>
    </article>
  );
};
