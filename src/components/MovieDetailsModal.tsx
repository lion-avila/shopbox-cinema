import React from 'react';
import { Movie } from '../types/cinema';
import { X, Play, ArrowRight, User } from 'lucide-react';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onSelectMovie,
}) => {
  if (!movie) return null;

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl my-4 sm:my-8">
        {/* Close Button - Solid High Contrast */}
        <button
          onClick={onClose}
          aria-label="Close film dossier"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 sm:p-2.5 bg-[#09090d] hover:bg-[#C5A059] text-white hover:text-black border border-white/25 transition-colors shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Backdrop */}
        <div className="relative h-52 sm:h-80 bg-zinc-950 overflow-hidden">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-55"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--bg-surface) 8%, var(--bg-surface-glass) 50%, transparent 100%)',
            }}
          />

          {/* Quick Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end space-x-4 sm:space-x-6">
            <div className="hidden sm:block w-20 sm:w-24 aspect-[2/3] overflow-hidden border border-[var(--border-strong)] shadow-xl shrink-0 bg-zinc-900">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] text-[var(--text-secondary)] font-semibold">
                <span className="px-2 py-0.5 bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold">
                  {movie.rating}
                </span>
                <span>{formatDuration(movie.durationMin)}</span>
                <span>•</span>
                <span>HALL 01</span>
                <span>•</span>
                <span className="text-[var(--accent-brass)] font-bold">₱350 ALL SEATS</span>
              </div>
              <h2 className="font-display text-lg sm:text-3xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight truncate">
                {movie.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
          {/* Genre Badges */}
          <div className="flex flex-wrap gap-2">
            {movie.genre.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-brass)] font-bold">
              Synopsis
            </h4>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Director & Cast Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-y border-[var(--border-subtle)] text-xs font-mono">
            <div>
              <span className="text-[var(--text-muted)] block mb-1 uppercase tracking-wider font-bold">Director</span>
              <p className="font-bold text-[var(--text-primary)] flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-[var(--accent-brass)]" />
                {movie.director}
              </p>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block mb-1 uppercase tracking-wider font-bold">Starring Cast</span>
              <p className="text-[var(--text-secondary)] font-semibold">
                {movie.cast.join(', ')}
              </p>
            </div>
          </div>

          {/* Trailer Link & Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {movie.trailerUrl ? (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-strong)] hover:border-[var(--accent-brass)] text-[var(--text-primary)] text-xs font-mono font-bold uppercase tracking-wider transition-colors"
              >
                <Play className="w-3.5 h-3.5 mr-2 text-[var(--accent-brass)]" />
                <span>Watch Official Trailer</span>
              </a>
            ) : <div />}

            <button
              onClick={() => {
                onClose();
                onSelectMovie(movie);
              }}
              disabled={!movie.isNowShowing}
              className={`w-full sm:w-auto px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all ${
                movie.isNowShowing
                  ? 'bg-[#C5A059] hover:bg-[#E2C285] text-black active:scale-95 shadow-md'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed'
              }`}
            >
              <span>{movie.isNowShowing ? 'Select Seats • ₱350' : 'Coming Soon'}</span>
              {movie.isNowShowing && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
