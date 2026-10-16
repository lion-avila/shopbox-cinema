import React from 'react';
import { X, Check } from 'lucide-react';

interface OriginalChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalChartModal: React.FC<OriginalChartModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl my-8">
        <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-brass)] font-bold block">
              Architectural Seating Plan
            </span>
            <h3 className="font-display text-xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
              Original Floor Plan Reference (Seats.jpg)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 flex flex-col items-center">
          <div className="max-w-md w-full bg-white p-2 shadow-2xl border border-[var(--border-strong)]">
            <img
              src="/seats.jpg"
              alt="Official Seat Arrangement (Seats.jpg)"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="mt-8 p-5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)] max-w-lg w-full space-y-3">
            <div className="flex items-center space-x-2 text-[var(--text-primary)] font-bold uppercase tracking-wider">
              <Check className="w-4 h-4 text-[var(--accent-brass)]" />
              <span>100% Floor Plan Accuracy Specification</span>
            </div>
            <ul className="space-y-1.5 text-[var(--text-secondary)] text-[11px] leading-relaxed">
              <li>• Screen positioned centrally at the top of the room.</li>
              <li>• Left Section: 4 seats per row (Seats 1–4, 9–12, ..., 65–68).</li>
              <li>• Central walking aisle dividing the auditorium into two equal wings.</li>
              <li>• Right Section: 4 seats per row (Seats 5–8, 13–16, ..., 69–72).</li>
              <li>• Total capacity: Exactly 72 reserved fabric theater seats in Hall 01.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
