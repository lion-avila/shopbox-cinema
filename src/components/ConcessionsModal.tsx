import React, { useState } from 'react';
import { ConcessionItem, SelectedConcession } from '../types/cinema';
import { CinemaStorage } from '../services/storage';
import { Plus, Minus, ArrowRight, X, Popcorn } from 'lucide-react';

interface ConcessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedConcessions: SelectedConcession[];
  onUpdateQuantity: (item: ConcessionItem, delta: number) => void;
  onProceed: () => void;
  ticketSubtotal: number;
  seatCount: number;
}

export const ConcessionsModal: React.FC<ConcessionsModalProps> = ({
  isOpen,
  onClose,
  selectedConcessions,
  onUpdateQuantity,
  onProceed,
  ticketSubtotal,
  seatCount,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'combo' | 'popcorn' | 'drink' | 'snack'>('all');

  if (!isOpen) return null;

  const catalogItems = CinemaStorage.getConcessions();

  const filteredItems =
    activeCategory === 'all'
      ? catalogItems
      : catalogItems.filter((item) => item.category === activeCategory);

  const concessionsTotal = selectedConcessions.reduce(
    (sum, c) => sum + c.item.price * c.quantity,
    0
  );

  const grandTotal = ticketSubtotal + concessionsTotal;

  const getQuantity = (id: string) => {
    const found = selectedConcessions.find((c) => c.item.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl my-4 sm:my-8">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[var(--accent-brass)] font-bold block">
              03 / Concessions & Bar Menu
            </span>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
              Curated Theater Refreshments
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close concessions menu"
            className="p-2 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Strip */}
        <div className="px-4 sm:px-6 py-2.5 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] flex items-center space-x-1.5 overflow-x-auto scrollbar-none font-mono text-[10px] sm:text-xs">
          {[
            { id: 'all', label: 'All Menu' },
            { id: 'combo', label: 'Combos' },
            { id: 'popcorn', label: 'Popcorn' },
            { id: 'drink', label: 'Drinks' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1 uppercase tracking-wider transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Refreshments Grid */}
        <div className="p-4 sm:p-6 max-h-[55vh] overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {filteredItems.map((item) => {
                const qty = getQuantity(item.id);

                return (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-3.5 p-3.5 border transition-colors ${
                      qty > 0
                        ? 'bg-[var(--bg-elevated)] border-[#C5A059]'
                        : 'bg-[var(--bg-canvas)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="w-16 h-16 bg-zinc-900 border border-[var(--border-subtle)] shrink-0 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] truncate font-mono">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[var(--accent-brass)]">
                          ₱{item.price}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center space-x-2 bg-[var(--bg-surface)] border border-[var(--border-strong)] p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item, -1)}
                            disabled={qty === 0}
                            aria-label={`Remove ${item.name}`}
                            className="w-6 h-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-mono text-xs font-bold text-[var(--text-primary)]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item, 1)}
                            aria-label={`Add ${item.name}`}
                            className="w-6 h-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center font-mono text-xs text-[var(--text-muted)]">
              <Popcorn className="w-8 h-8 mx-auto mb-2 text-[var(--accent-brass)]" />
              <p>No items in this category.</p>
            </div>
          )}
        </div>

        {/* Footer Summary & Continue */}
        <div className="p-4 sm:p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto font-mono text-xs">
            <div className="text-[var(--text-muted)]">
              {seatCount} Ticket{seatCount > 1 ? 's' : ''} (₱{ticketSubtotal.toLocaleString()})
              {concessionsTotal > 0 && ` + Refreshments (₱${concessionsTotal.toLocaleString()})`}
            </div>
            <div className="text-base font-extrabold text-[var(--text-primary)] mt-0.5">
              Total Due: <span className="text-[var(--accent-brass)]">₱{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onProceed}
              className="flex-1 sm:flex-initial px-4 py-3 border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono uppercase tracking-wider transition-colors"
            >
              {concessionsTotal > 0 ? 'Continue' : 'Skip Snacks'}
            </button>
            <button
              type="button"
              onClick={onProceed}
              className="flex-1 sm:flex-initial px-6 py-3 bg-[#C5A059] hover:bg-[#E2C285] text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
