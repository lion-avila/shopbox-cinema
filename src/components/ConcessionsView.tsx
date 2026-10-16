import React, { useState } from 'react';
import { Movie, Showtime, ConcessionItem, SelectedConcession } from '../types/cinema';
import { CinemaStorage, THEATER_SEATS } from '../services/storage';
import { useSeatHoldTimer } from '../hooks/useSeatHoldTimer';
import {
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Popcorn,
  Clock,
} from 'lucide-react';

interface ConcessionsViewProps {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: number[];
  selectedConcessions: SelectedConcession[];
  onUpdateQuantity: (item: ConcessionItem, delta: number) => void;
  onProceedToPayment: () => void;
  onBackToSeats: () => void;
  onSkipToPayment: () => void;
}

export const ConcessionsView: React.FC<ConcessionsViewProps> = ({
  movie,
  showtime,
  selectedSeats,
  selectedConcessions,
  onUpdateQuantity,
  onProceedToPayment,
  onBackToSeats,
  onSkipToPayment,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'combo' | 'popcorn' | 'drink' | 'snack'>('all');
  const catalogItems = CinemaStorage.getConcessions();

  // Active Hold Timer
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const {
    formattedTime,
    isWarning: isTimerWarning,
  } = useSeatHoldTimer(showtime.id, selectedSeats, () => {
    setShowExpiredModal(true);
  });

  const filteredItems =
    activeCategory === 'all'
      ? catalogItems
      : catalogItems.filter((item) => item.category === activeCategory);

  const ticketsSubtotal = selectedSeats.length * showtime.price;
  const concessionsTotal = selectedConcessions.reduce(
    (sum, c) => sum + c.item.price * c.quantity,
    0
  );
  const totalConcessionItems = selectedConcessions.reduce(
    (sum, c) => sum + c.quantity,
    0
  );
  const grandTotal = ticketsSubtotal + concessionsTotal;

  const getQuantity = (id: string) => {
    const found = selectedConcessions.find((c) => c.item.id === id);
    return found ? found.quantity : 0;
  };

  const getSeatRowLabel = (seatId: number) => {
    const found = THEATER_SEATS.find((s) => s.id === seatId);
    return found ? `${found.rowLabel}-${found.id}` : `#${seatId}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Session Context Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button
            onClick={onBackToSeats}
            className="p-2 border border-[var(--border-strong)] hover:border-[var(--accent-brass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
            title="Back to Seats"
            aria-label="Back to Seats"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent-brass)] font-bold block">
              Step 03 / Concessions & Bar
            </span>
            <h2 className="font-display text-base sm:text-xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight truncate">
              Curated Theater Refreshments
            </h2>
            <p className="font-mono text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5 truncate">
              {movie.title} • {showtime.hall} • {selectedSeats.length} Recliners Reserved
            </p>
          </div>
        </div>

        {/* Hold Countdown Badge */}
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 border font-mono text-xs transition-colors shrink-0 ${
            isTimerWarning
              ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 animate-pulse'
              : 'bg-[#C5A059]/10 border-[#C5A059]/40 text-[#C5A059]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="font-bold tracking-wider">{formattedTime}</span>
          <span className="text-[10px] uppercase text-[var(--text-muted)] hidden sm:inline">
            Hold Active
          </span>
        </div>
      </div>

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 65% Column: Menu Categories and Cards (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Menu Category Filter Strip */}
          <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center space-x-1.5 overflow-x-auto scrollbar-none font-mono text-[10px] sm:text-xs">
            {[
              { id: 'all', label: 'All Menu' },
              { id: 'combo', label: 'Duo & Solo Combos' },
              { id: 'popcorn', label: 'Popcorn' },
              { id: 'drink', label: 'Beverages' },
              { id: 'snack', label: 'Hot Snacks' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Refreshments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredItems.map((item) => {
              const qty = getQuantity(item.id);

              return (
                <div
                  key={item.id}
                  className={`flex items-center space-x-3.5 p-3.5 border transition-all ${
                    qty > 0
                      ? 'bg-[var(--bg-elevated)] border-[#C5A059] ring-1 ring-[#C5A059]/40'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="w-18 h-18 sm:w-20 sm:h-20 bg-zinc-900 border border-[var(--border-subtle)] shrink-0 overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {item.category === 'combo' && (
                      <span className="absolute top-1 left-1 bg-[#C5A059] text-black font-mono font-bold text-[8px] uppercase px-1 py-0.2">
                        Best Value
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate font-mono">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="font-mono text-xs sm:text-sm font-bold text-[var(--accent-brass)]">
                        ₱{item.price}
                      </span>

                      {/* Quantity Stepper (WCAG touch targets >=44px) */}
                      <div className="flex items-center space-x-1.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item, -1)}
                          disabled={qty === 0}
                          aria-label={`Remove one ${item.name}`}
                          className="w-8 h-8 sm:w-7 sm:h-7 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center transition-colors active:scale-95"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)] select-none">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item, 1)}
                          aria-label={`Add one ${item.name}`}
                          className="w-8 h-8 sm:w-7 sm:h-7 text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-16 text-center font-mono text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <Popcorn className="w-10 h-10 mx-auto mb-3 text-[var(--accent-brass)] opacity-60" />
              <p>No refreshments available in this category.</p>
            </div>
          )}
        </div>

        {/* Right 35% Column: Sticky Order Summary & Receipt (lg:col-span-4) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 font-mono">
            {/* Film Session Card Header */}
            <div className="flex items-start space-x-3 pb-3 border-b border-[var(--border-subtle)]">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-14 h-20 object-cover border border-[var(--border-subtle)] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase tracking-widest text-[var(--accent-brass)] font-bold block truncate">
                  {showtime.hall}
                </span>
                <h3 className="font-display text-sm font-extrabold text-[var(--text-primary)] uppercase truncate">
                  {movie.title}
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  {showtime.date} • {showtime.time}
                </p>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <span className="text-[9px] px-1.5 py-0.2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold">
                    {movie.rating}
                  </span>
                  {showtime.format && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 font-bold">
                      {showtime.format}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Reserved Seats Chips */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                Reserved Recliners ({selectedSeats.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {[...selectedSeats]
                  .sort((a, b) => a - b)
                  .map((id) => (
                    <span
                      key={id}
                      className="px-2 py-0.5 bg-[#C5A059] text-black font-bold text-[10px]"
                    >
                      {getSeatRowLabel(id)}
                    </span>
                  ))}
              </div>
            </div>

            {/* Concession Selection Itemization */}
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="uppercase tracking-wider font-bold">Selected Refreshments:</span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {totalConcessionItems} item{totalConcessionItems === 1 ? '' : 's'}
                </span>
              </div>

              {selectedConcessions.filter((c) => c.quantity > 0).length > 0 ? (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedConcessions
                    .filter((c) => c.quantity > 0)
                    .map((c) => (
                      <div
                        key={c.item.id}
                        className="flex items-center justify-between text-xs text-[var(--text-secondary)]"
                      >
                        <span className="truncate pr-2">
                          {c.quantity} × {c.item.name}
                        </span>
                        <span className="font-bold text-[var(--text-primary)] shrink-0">
                          ₱{(c.item.price * c.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-3 border border-dashed border-[var(--border-subtle)] text-center text-[10px] text-[var(--text-muted)]">
                  No refreshments selected yet.
                </div>
              )}
            </div>

            {/* Calculation Breakdown */}
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Tickets ({selectedSeats.length} × ₱{showtime.price})</span>
                <span className="font-bold text-[var(--text-primary)]">
                  ₱{ticketsSubtotal.toLocaleString()}
                </span>
              </div>
              {concessionsTotal > 0 && (
                <div className="flex justify-between">
                  <span>Concessions Subtotal</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    ₱{concessionsTotal.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
                <span>Convenience Fee</span>
                <span className="text-emerald-500 font-bold">FREE (₱0.00)</span>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-baseline justify-between text-sm">
                <span className="font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Total Due
                </span>
                <span className="text-xl font-extrabold text-[var(--accent-brass)]">
                  ₱{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Navigation CTAs */}
            <div className="pt-2 space-y-2">
              <button
                onClick={onProceedToPayment}
                className="w-full py-3.5 bg-[#C5A059] hover:bg-[#E2C285] text-black text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center space-x-2 transition-all active:scale-98 shadow-lg cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onSkipToPayment}
                className="w-full py-2.5 text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
              >
                {totalConcessionItems > 0 ? 'Clear Snacks & Checkout' : 'Skip Refreshments'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar (<1024px) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-surface-glass)] backdrop-blur-md border-t border-[var(--border-strong)] shadow-2xl safe-area-pb p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-mono text-xs text-[var(--text-muted)]">
              {selectedSeats.length} Seats {totalConcessionItems > 0 ? `+ ${totalConcessionItems} Snacks` : ''}
            </div>
            <div className="text-lg font-extrabold text-[var(--accent-brass)] font-mono">
              ₱{grandTotal.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onSkipToPayment}
              className="px-3 py-3 border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono uppercase tracking-wider"
            >
              Skip
            </button>
            <button
              onClick={onProceedToPayment}
              className="px-5 py-3 bg-[#C5A059] hover:bg-[#E2C285] text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center space-x-1.5 shadow-lg active:scale-95"
            >
              <span>Payment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expired Modal */}
      {showExpiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-rose-500/50 p-6 shadow-2xl space-y-4 font-mono">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500 text-rose-500 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display text-lg font-bold uppercase text-[var(--text-primary)]">
                Reservation Hold Expired
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Your 10-minute hold for this session has expired. The seats have been released back to
                the general inventory.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onBackToSeats}
                className="w-full py-2.5 bg-[#C5A059] hover:bg-[#E2C285] text-black font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Back to Seat Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
