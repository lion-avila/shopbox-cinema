import React, { useState } from 'react';
import { Movie } from '../types/cinema';
import { MovieCard } from './MovieCard';
import { Search, ArrowRight, Play, Film, LayoutGrid, List } from 'lucide-react';

interface MovieListProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onSelectShowtimeQuick: () => void;
  siteConfig?: import('../types/cinema').SiteConfig;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  onSelectMovie,
  onOpenDetails,
  onSelectShowtimeQuick,
  siteConfig,
}) => {
  const [filter, setFilter] = useState<'all' | 'now' | 'coming'>('now');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMovies = movies.filter((movie) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'now'
        ? movie.isNowShowing
        : !movie.isNowShowing;

    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const featuredMovie =
    movies.find((m) => m.id === siteConfig?.featuredMovieId) ||
    movies.find((m) => m.isNowShowing) ||
    movies[0];

  const headline = siteConfig?.heroHeadline || featuredMovie?.title;
  const subtitle = siteConfig?.heroSubtitle || featuredMovie?.synopsis;
  const ticketPrice = siteConfig?.ticketPrice || 350;

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Editorial Cinema Hero Spotlight */}
      {featuredMovie && (
        <div className="relative border border-white/[0.08] bg-[#0c0c10] overflow-hidden">
          {/* Backdrop Image */}
          <div className="absolute inset-0">
            <img
              src={featuredMovie.backdropUrl || featuredMovie.posterUrl}
              alt={featuredMovie.title}
              className="w-full h-full object-cover opacity-20 sm:opacity-25 filter grayscale-[20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c10] via-[#0c0c10]/95 to-transparent" />
          </div>

          <div className="relative z-10 p-5 sm:p-12 lg:p-16 max-w-3xl space-y-4 sm:space-y-6">
            {/* Meta Ribbon */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono text-zinc-400">
              <span className="px-2 py-0.5 bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">
                {siteConfig?.announcementText ? siteConfig.announcementText : 'Now Screening • Hall 01'}
              </span>
              <span>•</span>
              <span>{featuredMovie.rating}</span>
              <span>•</span>
              <span>{featuredMovie.durationMin} MINS</span>
              <span>•</span>
              <span className="text-zinc-200 font-bold">₱{ticketPrice} FLAT RATE</span>
            </div>

            {/* Title */}
            <div>
              <span className="font-mono text-[10px] sm:text-xs text-[#C5A059] uppercase tracking-widest block mb-1 sm:mb-2">
                Featured Presentation • {featuredMovie.title}
              </span>
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase leading-[1.1]">
                {headline}
              </h1>
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light line-clamp-2 sm:line-clamp-3 max-w-2xl">
              {subtitle}
            </p>

            {/* Film Details */}
            <div className="pt-0.5 text-[10px] sm:text-xs text-zinc-400 font-mono space-y-0.5 sm:space-y-1">
              <p>DIRECTED BY <span className="text-zinc-200">{featuredMovie.director}</span></p>
              <p className="hidden sm:block">STARRING <span className="text-zinc-300">{featuredMovie.cast.slice(0, 3).join(', ')}</span></p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-2 sm:pt-4">
              <button
                onClick={() => onSelectMovie(featuredMovie)}
                className="px-5 py-3 sm:px-6 sm:py-3.5 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Reserve Seats in Hall 1</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenDetails(featuredMovie)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 sm:px-5 sm:py-3.5 bg-black/60 hover:bg-black text-zinc-200 hover:text-white border border-white/20 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Trailer & Info</span>
                </button>
                <button
                  onClick={onSelectShowtimeQuick}
                  className="flex-1 sm:flex-initial px-3 py-2.5 sm:px-4 sm:py-3.5 text-zinc-400 hover:text-white text-[11px] sm:text-xs uppercase tracking-wider font-mono transition-colors text-center"
                >
                  Full Schedule →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Program Header & Filter Row */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-white/[0.08] pb-4 sm:pb-6">
          <div>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
              Program Selection
            </span>
            <h2 className="font-display text-xl sm:text-3xl font-bold text-white uppercase tracking-tight">
              Current & Upcoming Films
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
            {/* Filter Pills */}
            <div className="flex items-center space-x-1 border border-white/[0.08] p-1 bg-zinc-950 text-xs">
              <button
                onClick={() => setFilter('now')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all ${
                  filter === 'now'
                    ? 'bg-zinc-100 text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Now Showing
              </button>
              <button
                onClick={() => setFilter('coming')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all ${
                  filter === 'coming'
                    ? 'bg-zinc-100 text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Soon
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all ${
                  filter === 'all'
                    ? 'bg-zinc-100 text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
            </div>

            {/* View Mode Switcher (Grid vs List) */}
            <div className="flex items-center space-x-1 border border-white/[0.08] p-1 bg-zinc-950">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="2-Column Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Compact Editorial List View"
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title, director, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-zinc-950 border border-white/[0.08] text-zinc-200 placeholder-zinc-500 text-[16px] sm:text-xs font-mono focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>
      </div>

      {/* Movies Catalog */}
      {filteredMovies.length > 0 ? (
        viewMode === 'grid' ? (
          /* 2-Column Mobile Grid, 3-Col Tablet, 4-Col Desktop */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectMovie={onSelectMovie}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        ) : (
          /* Compact Editorial Horizontal List View for Mobile & Power Users */
          <div className="space-y-3">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group p-3 sm:p-4 bg-[#0e0e12] border border-white/[0.08] hover:border-zinc-500/50 transition-all flex items-center justify-between gap-3 sm:gap-6"
              >
                <div 
                  onClick={() => onOpenDetails(movie)}
                  className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1 cursor-pointer"
                >
                  {/* Compact Poster Thumbnail */}
                  <div className="w-14 sm:w-20 aspect-[2/3] bg-zinc-950 border border-white/10 shrink-0 overflow-hidden relative">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1 left-1 font-mono text-[8px] px-1 bg-black/80 text-zinc-300">
                      {movie.rating}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#C5A059] block truncate">
                      {movie.genre.join(' • ')}
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-[#E2C285] transition-colors truncate">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono truncate">
                      {movie.durationMin} MINS • Dir. {movie.director}
                    </p>
                    <p className="hidden md:block text-xs text-zinc-400 font-light line-clamp-1 max-w-xl">
                      {movie.synopsis}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="font-mono text-[9px] text-zinc-400 uppercase block">Rate</span>
                    <span className="font-mono text-xs font-bold text-white">₱350</span>
                  </div>
                  <button
                    onClick={() => onSelectMovie(movie)}
                    disabled={!movie.isNowShowing}
                    className={`px-3 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 active:scale-95 ${
                      movie.isNowShowing
                        ? 'bg-zinc-100 hover:bg-[#C5A059] text-black'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                    }`}
                  >
                    <span>{movie.isNowShowing ? 'Book Seats' : 'Coming Soon'}</span>
                    {movie.isNowShowing && <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="py-20 text-center border border-white/[0.08] bg-zinc-950">
          <Film className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <p className="font-mono text-sm text-zinc-300 uppercase">No screenings match your criteria</p>
          <p className="text-xs text-zinc-400 mt-1">Try resetting the filter or search term</p>
        </div>
      )}
    </div>
  );
};
