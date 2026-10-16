import React, { useState } from 'react';
import { Movie, Showtime, SiteConfig, ExhibitionFormat } from '../types/cinema';
import { MovieCard } from './MovieCard';
import { Search, ArrowRight, Play, Film, LayoutGrid, List, RotateCcw, Sparkles, X, Calendar } from 'lucide-react';
import { getFormattedDate } from '../services/storage';

interface MovieListProps {
  movies: Movie[];
  showtimes?: Showtime[];
  onSelectMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onSelectShowtimeQuick?: () => void;
  onSelectShowtimeSession?: (movie: Movie, showtime: Showtime) => void;
  siteConfig?: SiteConfig;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  showtimes = [],
  onSelectMovie,
  onOpenDetails,
  onSelectShowtimeQuick,
  onSelectShowtimeSession,
  siteConfig,
}) => {
  const [filter, setFilter] = useState<'all' | 'now' | 'coming'>('now');
  const [formatFilter, setFormatFilter] = useState<'all' | ExhibitionFormat>('all');
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate(0));
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Generate 7-day date strip
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = getFormattedDate(i);
    const dayName =
      i === 0
        ? 'Today'
        : i === 1
        ? 'Tomorrow'
        : d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return { dateStr, dayName, monthDay };
  });

  // Filter showtimes by currently active date & format
  const activeShowtimes = showtimes.filter((st) => {
    const matchesDate = st.date === selectedDate;
    const matchesFormat = formatFilter === 'all' || st.format === formatFilter;
    return matchesDate && matchesFormat;
  });

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

    const matchesFormat =
      formatFilter === 'all' ||
      activeShowtimes.some((st) => st.movieId === movie.id);

    return matchesFilter && matchesSearch && matchesFormat;
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
    <div className="space-y-6 sm:space-y-12">
      {/* 
        HERO SPOTLIGHT SECTION:
        - Mobile (<640px): Compact ~160px architectural spotlight strip to keep Date Rail & First Film Cards ABOVE THE FOLD on 390px screens (iPhone 16)
        - Desktop (≥640px): Full editorial screening spotlight
      */}
      {featuredMovie && (
        <section
          aria-label="Featured Exhibition"
          className="border border-[var(--border-strong)] bg-[var(--bg-surface)] overflow-hidden shadow-sm"
        >
          {/* MOBILE COMPACT SPOTLIGHT (< 640px): Height constrained to ~160px */}
          <div className="sm:hidden p-3.5 flex items-center space-x-3.5 bg-[var(--bg-surface)] relative overflow-hidden">
            <div className="w-20 aspect-[2/3] bg-zinc-950 border border-[var(--border-subtle)] shrink-0 overflow-hidden relative shadow-md">
              <img
                src={featuredMovie.posterUrl}
                alt={featuredMovie.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 px-1 py-0.2 bg-[#09090d] text-white font-mono text-[8px] font-bold">
                {featuredMovie.rating}
              </span>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center space-x-1.5 font-mono text-[8.5px] text-[var(--accent-brass)] font-bold uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Featured Presentation</span>
              </div>
              <h2 className="font-display text-sm font-extrabold uppercase text-[var(--text-primary)] truncate leading-tight">
                {featuredMovie.title}
              </h2>
              <p className="font-mono text-[9px] text-[var(--text-muted)] truncate">
                {featuredMovie.durationMin} MINS • Dir. {featuredMovie.director}
              </p>

              <div className="pt-1.5 flex items-center space-x-2">
                <button
                  onClick={() => onSelectMovie(featuredMovie)}
                  className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#E2C285] text-black font-mono font-bold text-[10px] uppercase tracking-wider transition-all flex items-center space-x-1 active:scale-95 shadow-sm"
                >
                  <span>Reserve</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onOpenDetails(featuredMovie)}
                  className="px-2.5 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-[10px] uppercase tracking-wider font-semibold"
                >
                  Trailer
                </button>
              </div>
            </div>
          </div>

          {/* DESKTOP EDITORIAL SPOTLIGHT (≥ 640px) */}
          <div className="hidden sm:grid relative p-6 sm:p-10 lg:p-12 grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="absolute inset-0 pointer-events-none">
              <img
                src={featuredMovie.backdropUrl || featuredMovie.posterUrl}
                alt={featuredMovie.title}
                className="w-full h-full object-cover opacity-20 dark:opacity-30"
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

            <div className="relative z-10 lg:col-span-8 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[var(--bg-elevated)] text-[var(--accent-brass)] border border-[var(--border-strong)] font-bold uppercase tracking-widest text-[9px] shadow-sm">
                  <Sparkles className="w-3 h-3 text-[var(--accent-brass)]" />
                  <span>
                    {siteConfig?.announcementText || 'Now Screening • Auditorium 01'}
                  </span>
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2 font-mono text-[10px] sm:text-xs text-[var(--accent-brass)] font-bold uppercase tracking-[0.2em] mb-1">
                  <span>Featured Film</span>
                  <span>•</span>
                  <span className="px-1.5 py-0.5 bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold text-[10px]">
                    {featuredMovie.rating}
                  </span>
                  <span>•</span>
                  <span className="text-[var(--text-secondary)]">{featuredMovie.durationMin} MINS</span>
                </div>
                <h1 className="font-display font-display-fluid font-extrabold uppercase text-[var(--text-primary)] leading-[1.05]">
                  {headline}
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl line-clamp-2">
                {subtitle}
              </p>

              <div className="flex items-center space-x-3 pt-1">
                <button
                  onClick={() => onSelectMovie(featuredMovie)}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-[#E2C285] text-black font-mono font-bold text-xs uppercase tracking-widest transition-all flex items-center space-x-2 active:scale-95 shadow-md"
                >
                  <span>Reserve Seats • ₱{ticketPrice}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenDetails(featuredMovie)}
                  className="px-4 py-3 bg-[var(--bg-surface-glass)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-strong)] font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-[var(--accent-brass)]" />
                  <span>Trailer</span>
                </button>
              </div>
            </div>

            {/* Right Spec Box on Desktop */}
            <div className="hidden lg:flex lg:col-span-4 justify-end relative z-10">
              <div className="w-64 p-5 bg-[var(--bg-surface-glass)] backdrop-blur-md border border-[var(--border-strong)] font-mono text-xs space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--accent-brass)] font-bold">
                    Room 01 Spec
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">SYSTEM:</span>
                    <span className="text-[var(--text-primary)] font-bold">4K DCI LASER</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">AUDIO:</span>
                    <span className="text-[var(--text-primary)] font-bold">DOLBY ATMOS 7.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">CAPACITY:</span>
                    <span className="text-[var(--text-primary)] font-bold">72 SEATS TOTAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 
        7-DAY HORIZONTAL DATE RAIL:
        Enables 1-tap switching between Today, Tomorrow, and upcoming dates without opening separate views.
      */}
      <section className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-[9.5px] uppercase tracking-widest text-[var(--accent-brass)] font-bold flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Select Exhibition Date</span>
          </span>
          {onSelectShowtimeQuick && (
            <button
              onClick={onSelectShowtimeQuick}
              className="text-[10px] text-[var(--accent-brass)] hover:underline flex items-center space-x-1 uppercase tracking-wider font-bold"
            >
              <span>Full Schedule View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          {dateOptions.map(({ dateStr, dayName, monthDay }) => {
            const isSelected = selectedDate === dateStr;
            const countForDate = showtimes.filter((st) => st.date === dateStr).length;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex-shrink-0 px-3 py-2 sm:px-4 sm:py-2.5 border transition-all text-center min-w-[76px] sm:min-w-[90px] font-mono ${
                  isSelected
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] border-[var(--text-primary)] font-bold shadow-sm'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-brass)]'
                }`}
              >
                <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-wider block opacity-85">
                  {dayName}
                </span>
                <span className="text-xs sm:text-sm font-bold block mt-0.5">
                  {monthDay}
                </span>
                <span
                  className={`text-[8px] sm:text-[9px] block mt-0.5 ${
                    isSelected ? 'text-[#C5A059] font-bold' : 'text-[var(--accent-brass)]'
                  }`}
                >
                  {countForDate} sessions
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Program Control Bar: Filter Tabs, Format Segmented Controls & Search */}
      <section className="space-y-3.5 pt-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
          <div>
            <span className="font-mono text-[9.5px] sm:text-xs uppercase tracking-[0.2em] text-[var(--accent-brass)] font-bold block mb-0.5">
              01 / Program Lineup
            </span>
            <h2 className="font-display text-lg sm:text-2xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
              Exhibitions & Timetables
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Tabs (Now Showing / Coming Soon) */}
            <div className="flex items-center border border-[var(--border-subtle)] p-0.5 bg-[var(--bg-surface)] font-mono text-[9px] sm:text-[10px]">
              <button
                onClick={() => setFilter('now')}
                className={`px-2.5 py-1 uppercase tracking-wider transition-all ${
                  filter === 'now'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Now Showing ({nowCount})
              </button>
              <button
                onClick={() => setFilter('coming')}
                className={`px-2.5 py-1 uppercase tracking-wider transition-all ${
                  filter === 'coming'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Coming Soon ({comingCount})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-1 uppercase tracking-wider transition-all hidden sm:inline-block ${
                  filter === 'all'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                All
              </button>
            </div>

            {/* Format Filter Segmented Controls */}
            <div className="flex items-center border border-[var(--border-subtle)] p-0.5 bg-[var(--bg-surface)] font-mono text-[9px] sm:text-[10px] overflow-x-auto scrollbar-none">
              {(['all', '4K Laser', 'Dolby Atmos 7.1', "Director's Cut"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-2.5 py-1 uppercase tracking-wider whitespace-nowrap transition-all ${
                    formatFilter === fmt
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {fmt === 'all' ? 'All Formats' : fmt}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-[var(--border-subtle)] p-0.5 bg-[var(--bg-surface)]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Poster Grid View"
                aria-label="Poster Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Compact List View"
                aria-label="Compact List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Input with Proportional Mobile Font & Clear Button */}
        <div className="relative max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search films, directors, genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-8 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-xs placeholder:text-[11px] sm:placeholder:text-xs font-mono focus:outline-none focus:border-[var(--accent-brass)] transition-colors"
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                showtimes={activeShowtimes}
                onSelectMovie={onSelectMovie}
                onOpenDetails={onOpenDetails}
                onSelectShowtimeSession={onSelectShowtimeSession}
                ticketPrice={ticketPrice}
              />
            ))}
          </div>
        ) : (
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
                    <span>{movie.isNowShowing ? 'Seats' : 'Soon'}</span>
                    {movie.isNowShowing && <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="py-16 px-4 text-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
          <Film className="w-8 h-8 text-[var(--accent-brass)] mx-auto" />
          <div className="space-y-1">
            <p className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              No Exhibitions Match Filter
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              No screenings found for this date or format. Reset your filters to view all scheduled films in Hall 01.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setFilter('all');
                setFormatFilter('all');
                setSearchTerm('');
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[var(--text-primary)] text-[var(--text-inverse)] hover:bg-[#C5A059] hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
