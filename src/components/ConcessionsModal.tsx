import React from 'react';
import { ConcessionItem, SelectedConcession } from '../types/cinema';
import { INITIAL_CONCESSIONS } from '../services/storage';
import { Plus, Minus, ArrowRight, X } from 'lucide-react';

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
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0c0c10] border border-white/15 shadow-2xl my-4 sm:my-8">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#C5A059] block">
              Concessions & Bar
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
              Curated Theater Snacks & Drinks
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 border border-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Snacks Grid */}
        <div className="p-3.5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INITIAL_CONCESSIONS.map((item) => {
              const qty = getQuantity(item.id);

              return (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-zinc-950 border border-white/[0.06] hover:border-zinc-700 transition-colors"
                >
                  <div className="w-16 h-16 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale-[15%]"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate font-mono">{item.name}</h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-light">
                      {item.description}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">
                        ₱{item.price}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 bg-black border border-white/10 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item, -1)}
                          disabled={qty === 0}
                          className="w-5 h-5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-mono text-xs font-bold text-white">
                          {qty}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item, 1)}
                          className="w-5 h-5 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
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
        </div>

        {/* Footer Summary & Buttons */}
        <div className="p-6 border-t border-white/[0.08] bg-[#08080a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto font-mono text-xs">
            <div className="text-zinc-400">
              {seatCount} Ticket{seatCount > 1 ? 's' : ''} (₱{ticketSubtotal.toLocaleString()})
              {concessionsTotal > 0 && ` + Concessions (₱${concessionsTotal.toLocaleString()})`}
            </div>
            <div className="text-base font-bold text-white mt-0.5">
              Total: ₱{grandTotal.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onProceed}
              className="flex-1 sm:flex-initial px-5 py-3 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
            >
              {concessionsTotal > 0 ? 'Skip Extra Snacks' : 'No Snacks'}
            </button>
            <button
              onClick={onProceed}
              className="flex-1 sm:flex-initial px-6 py-3 bg-zinc-100 hover:bg-[#C5A059] text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
