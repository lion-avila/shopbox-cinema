import React, { useState } from 'react';
import { Movie, SiteConfig } from '../types/cinema';
import { MovieCard } from './MovieCard';
import { Search, ArrowRight, Play, Film, LayoutGrid, List, RotateCcw, Sparkles, X } from 'lucide-react';

interface MovieListProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onSelectShowtimeQuick: () => void;
  siteConfig?: SiteConfig;
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

  const nowCount = movies.filter((m) => m.isNowShowing).length;
  const comingCount = movies.filter((m) => !m.isNowShowing).length;

  return (
    <div className="space-y-8 sm:space-y-14">
      {/* Swiss Editorial Screening Room Spotlight (Theme-Adaptive High-Contrast Surface) */}
      {featuredMovie && (
        <section
          aria-label="Featured Exhibition"
          className="relative border border-[var(--border-strong)] bg-[var(--bg-surface)] overflow-hidden shadow-lg"
        >
          {/* Backdrop Image with High-Opacity Theme Mask */}
          <div className="absolute inset-0">
            <img
              src={featuredMovie.backdropUrl || featuredMovie.posterUrl}
              alt={featuredMovie.title}
              className="w-full h-full object-cover opacity-25 sm:opacity-35"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, var(--bg-surface) 10%, var(--bg-surface-glass) 55%, transparent 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, var(--bg-surface) 15%, var(--bg-surface-glass) 65%, transparent 100%)',
              }}
            />
          </div>

          <div className="relative z-10 p-5 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
              {/* Technical Ribbon */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[var(--bg-elevated)] text-[var(--accent-brass)] border border-[var(--border-strong)] font-bold uppercase tracking-widest text-[9px] sm:text-[10px] shadow-sm">
                  <Sparkles className="w-3 h-3 text-[var(--accent-brass)]" />
                  <span>
                    {siteConfig?.announcementText
                      ? siteConfig.announcementText
                      : 'Now Screening • Auditorium 01'}
                  </span>
                </span>
              </div>

              {/* Overline & Display Title */}
              <div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-xs text-[var(--accent-brass)] font-bold uppercase tracking-[0.2em] mb-1.5">
                  <span>Featured Presentation • {featuredMovie.title}</span>
                  <span>•</span>
                  <span className="px-1.5 py-0.5 bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold text-[10px]">
                    {featuredMovie.rating}
                  </span>
                  <span>•</span>
                  <span className="text-[var(--text-secondary)]">{featuredMovie.durationMin} MINS</span>
                </div>
                <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase leading-[1.06]">
                  {headline}
                </h1>
              </div>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3 font-medium">
                {subtitle}
              </p>

              {/* Credits */}
              <div className="pt-0.5 flex flex-wrap gap-x-6 gap-y-1 text-[10px] sm:text-xs text-[var(--text-muted)] font-mono">
                <p>
                  DIRECTOR: <span className="text-[var(--text-primary)] font-bold">{featuredMovie.director}</span>
                </p>
                <p className="hidden sm:block">
                  CAST: <span className="text-[var(--text-secondary)] font-semibold">{featuredMovie.cast.slice(0, 3).join(', ')}</span>
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-2">
                <button
                  onClick={() => onSelectMovie(featuredMovie)}
                  className="px-5 py-3 sm:px-7 sm:py-3.5 bg-[#C5A059] hover:bg-[#E2C285] text-black font-mono font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 active:scale-95 shadow-md"
                >
                  <span>Reserve Seats • ₱{ticketPrice}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenDetails(featuredMovie)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 sm:px-5 sm:py-3.5 bg-[var(--bg-surface-glass)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-strong)] font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--accent-brass)]" />
                    <span>Dossier & Trailer</span>
                  </button>
                  <button
                    onClick={onSelectShowtimeQuick}
                    className="flex-1 sm:flex-initial px-3 py-2.5 sm:px-4 sm:py-3.5 bg-[var(--bg-surface-glass)] border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] text-[var(--text-primary)] hover:text-[var(--accent-brass)] text-[11px] sm:text-xs uppercase tracking-wider font-mono font-bold transition-colors text-center"
                  >
                    Full Schedule →
                  </button>
                </div>
              </div>
            </div>

            {/* Right Architectural Spec Box (Desktop) */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
              <div className="w-64 p-5 bg-[var(--bg-surface-glass)] backdrop-blur-md border border-[var(--border-strong)] font-mono text-xs space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--accent-brass)] font-bold">
                    Auditorium Spec
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">ROOM:</span>
                    <span className="text-[var(--text-primary)] font-bold">HALL 01</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">CAPACITY:</span>
                    <span className="text-[var(--text-primary)] font-bold">72 SEATS (9×8)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">ADMISSION:</span>
                    <span className="text-[var(--accent-brass)] font-bold">₱{ticketPrice} FLAT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">LOCATION:</span>
                    <span className="text-[var(--text-primary)] font-semibold">VIRAC, CATANDUANES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Program Control Bar: Filter Tabs, View Switcher, & Search */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--accent-brass)] font-bold block mb-1">
              01 / Repertory & First-Run Program
            </span>
            <h2 className="font-display text-xl sm:text-3xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
              Exhibition Lineup
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
            {/* Filter Segmented Control */}
            <div className="flex items-center border border-[var(--border-subtle)] p-1 bg-[var(--bg-surface)] font-mono">
              <button
                onClick={() => setFilter('now')}
                className={`px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-xs uppercase tracking-wider transition-all ${
                  filter === 'now'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Showing ({nowCount})
              </button>
              <button
                onClick={() => setFilter('coming')}
                className={`px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-xs uppercase tracking-wider transition-all ${
                  filter === 'coming'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Soon ({comingCount})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-xs uppercase tracking-wider transition-all ${
                  filter === 'all'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                All ({movies.length})
              </button>
            </div>

            {/* View Mode Switcher (Grid vs Compact List) */}
            <div className="flex items-center border border-[var(--border-subtle)] p-1 bg-[var(--bg-surface)]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="2-Column Poster Grid"
                aria-label="Poster Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Compact Editorial Index"
                aria-label="Compact List View"
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Input with Instant Clear */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by film title, director, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2 sm:py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-[16px] sm:text-xs font-mono focus:outline-none focus:border-[var(--accent-brass)] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* Catalog Display */}
      {filteredMovies.length > 0 ? (
        viewMode === 'grid' ? (
          /* Strict 2-Column Mobile Grid -> 3-Col Tablet -> 4-Col Desktop */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectMovie={onSelectMovie}
                onOpenDetails={onOpenDetails}
                ticketPrice={ticketPrice}
              />
            ))}
          </div>
        ) : (
          /* Compact Editorial Dossier List View */
          <div className="space-y-3">
            {filteredMovies.map((movie, idx) => (
              <div
                key={movie.id}
                className="group p-3 sm:p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] transition-all flex items-center justify-between gap-3 sm:gap-6"
              >
                <div
                  onClick={() => onOpenDetails(movie)}
                  className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1 cursor-pointer"
                >
                  <span className="hidden sm:inline-block font-mono text-xs text-[var(--text-muted)] w-6">
                    0{idx + 1}
                  </span>

                  <div className="w-12 sm:w-16 aspect-[2/3] bg-zinc-900 border border-[var(--border-subtle)] shrink-0 overflow-hidden relative">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 space-y-0.5 sm:space-y-1">
                    <div className="flex items-center space-x-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
                      <span className="text-[var(--accent-brass)] font-bold">
                        {movie.genre.join(' • ')}
                      </span>
                      <span className="text-[var(--text-muted)]">•</span>
                      <span className="px-1.5 py-0.2 bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold">
                        {movie.rating}
                      </span>
                    </div>
                    <h3 className="font-display text-sm sm:text-base font-extrabold text-[var(--text-primary)] group-hover:text-[var(--accent-brass)] transition-colors truncate uppercase">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono truncate">
                      {movie.durationMin} MINS • Dir. {movie.director}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
                  <div className="text-right hidden sm:block font-mono">
                    <span className="text-[9px] text-[var(--text-muted)] uppercase block">
                      Hall 01
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      ₱{ticketPrice}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectMovie(movie)}
                    disabled={!movie.isNowShowing}
                    className={`px-3 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 active:scale-95 ${
                      movie.isNowShowing
                        ? 'bg-[var(--text-primary)] hover:bg-[#C5A059] text-[var(--text-inverse)] hover:text-black'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed'
                    }`}
                  >
                    <span>{movie.isNowShowing ? 'Reserve' : 'Soon'}</span>
                    {movie.isNowShowing && <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Actionable Empty State */
        <div className="py-16 px-4 text-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
          <Film className="w-8 h-8 text-[var(--accent-brass)] mx-auto" />
          <div className="space-y-1">
            <p className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              No Exhibitions Match Your Filter
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              No films found matching "{searchTerm || filter}". Reset your filter criteria to view all scheduled screenings in Hall 01.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[var(--text-primary)] text-[var(--text-inverse)] hover:bg-[#C5A059] hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Program Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
