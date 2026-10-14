import React from 'react';
import { Movie } from '../types/cinema';
import { Play, ArrowRight } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onOpenDetails,
}) => {
  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  return (
    <div className="group flex flex-col bg-[#0e0e12] border border-white/[0.08] hover:border-zinc-500/50 transition-all duration-300">
      {/* Poster Media Box */}
      <div 
        onClick={() => onOpenDetails(movie)}
        className="relative aspect-[2/3] overflow-hidden bg-zinc-950 cursor-pointer"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500 ease-out"
          loading="lazy"
        />

        {/* Minimalist Top Meta Badges */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between pointer-events-none">
          <span className="font-mono text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-black/85 text-zinc-200 border border-white/10 backdrop-blur-md">
            {movie.rating}
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-black/85 text-zinc-400 border border-white/10 backdrop-blur-md">
            {formatDuration(movie.durationMin)}
          </span>
        </div>

        {/* Trailer Icon Pill on Hover / Tap */}
        {movie.trailerUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
            <span className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white text-black text-[10px] sm:text-xs font-semibold tracking-wide shadow-xl">
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" />
              <span>Details</span>
            </span>
          </div>
        )}
      </div>

      {/* Editorial Content Info */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          {/* Genre line */}
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-[#C5A059] truncate">
            {movie.genre.slice(0, 2).join(' / ')}
          </p>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetails(movie)}
            className="font-display text-xs sm:text-base font-bold text-white group-hover:text-[#E2C285] transition-colors truncate sm:line-clamp-1 cursor-pointer leading-tight"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Director */}
          <p className="text-[10px] sm:text-xs text-zinc-400 truncate font-light">
            Dir. {movie.director}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 sm:pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
          <div className="shrink-0">
            <span className="hidden sm:block font-mono text-[9px] text-zinc-400 uppercase">Admission</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-white">₱350</span>
          </div>

          <button
            onClick={() => onSelectMovie(movie)}
            disabled={!movie.isNowShowing}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center space-x-1 active:scale-95 ${
              movie.isNowShowing
                ? 'bg-zinc-100 hover:bg-[#C5A059] text-black hover:text-black font-bold'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed font-mono'
            }`}
          >
            <span>{movie.isNowShowing ? 'Book' : 'Soon'}</span>
            {movie.isNowShowing && <ArrowRight className="w-3 h-3 hidden sm:inline" />}
          </button>
        </div>
      </div>
    </div>
  );
};
