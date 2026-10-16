import React, { useState } from 'react';
import { Movie, Showtime, SelectedConcession, CustomerInfo, Booking, User as UserType } from '../types/cinema';
import { CinemaStorage } from '../services/storage';
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  User as UserIcon, 
  Mail, 
  Phone, 
  X, 
  Loader2,
  Lock
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  showtime: Showtime;
  selectedSeats: number[];
  concessions: SelectedConcession[];
  onBookingSuccess: (booking: Booking) => void;
  currentPatron?: UserType | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  movie,
  showtime,
  selectedSeats,
  concessions,
  onBookingSuccess,
  currentPatron,
}) => {
  if (!isOpen) return null;

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: currentPatron?.name || '',
    email: currentPatron?.email || '',
    phone: currentPatron?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<
    'GCash' | 'Maya' | 'Credit/Debit Card' | 'Cash at Box Office'
  >('GCash');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const ticketsSubtotal = selectedSeats.length * showtime.price;
  const concessionsSubtotal = concessions.reduce(
    (sum, c) => sum + c.item.price * c.quantity,
    0
  );
  const totalAmount = ticketsSubtotal + concessionsSubtotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setErrorMessage('Please provide your name, email, and mobile number.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const referenceCode = `SBC-${randomSuffix}`;

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        referenceCode,
        userId: currentPatron?.id,
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.posterUrl,
        showtimeId: showtime.id,
        showtimeDate: showtime.date,
        showtimeTime: showtime.time,
        hall: showtime.hall,
        seats: [...selectedSeats].sort((a, b) => a - b),
        ticketPrice: showtime.price,
        customer,
        concessions: concessions.filter((c) => c.quantity > 0),
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash at Box Office' ? 'pending' : 'paid',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      CinemaStorage.saveBooking(newBooking);
      setIsProcessing(false);
      onBookingSuccess(newBooking);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl my-4 sm:my-8">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[var(--accent-brass)] font-bold block">
              04 / Reservation Checkout
            </span>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight">
              Order Confirmation
            </h3>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 sm:p-2 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Order Summary Box */}
          <div className="p-3.5 sm:p-5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3 font-mono text-xs">
            <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="min-w-0 pr-2">
                <h4 className="font-display text-xs sm:text-sm font-bold text-[var(--text-primary)] uppercase truncate">{movie.title}</h4>
                <p className="text-[var(--text-secondary)] text-[10px] sm:text-[11px] mt-0.5 truncate">
                  {showtime.hall} • {showtime.date} at {showtime.time}
                </p>
              </div>
              <span className="text-[var(--accent-brass)] font-bold text-[10px] sm:text-[11px] shrink-0">₱{showtime.price} / Seat</span>
            </div>

            <div className="space-y-2 pt-1 text-[var(--text-secondary)]">
              <div className="flex justify-between text-[11px] sm:text-xs">
                <span>
                  Reserved Seats ({selectedSeats.length}): {selectedSeats.sort((a, b) => a - b).join(', ')}
                </span>
                <span className="font-bold text-[var(--text-primary)]">₱{ticketsSubtotal.toLocaleString()}</span>
              </div>

              {concessions.map(
                (c) =>
                  c.quantity > 0 && (
                    <div key={c.item.id} className="flex justify-between text-[11px] sm:text-xs text-[var(--text-secondary)]">
                      <span>
                        {c.quantity} × {c.item.name}
                      </span>
                      <span className="text-[var(--text-primary)] font-semibold">
                        ₱{(c.item.price * c.quantity).toLocaleString()}
                      </span>
                    </div>
                  )
              )}

              <div className="pt-2 sm:pt-3 border-t border-[var(--border-subtle)] flex justify-between text-xs sm:text-sm font-bold">
                <span className="text-[var(--text-primary)] uppercase tracking-wider">Total Due</span>
                <span className="text-[var(--accent-brass)] text-sm sm:text-base">₱{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold">
              Patron Information
            </h4>

            <div className="space-y-2.5 sm:space-y-3">
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  required
                  placeholder="Full Legal Name"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-[16px] sm:text-xs font-mono focus:outline-none focus:border-[var(--accent-brass)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-[16px] sm:text-xs font-mono focus:outline-none focus:border-[var(--accent-brass)]"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number (+63)"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-[16px] sm:text-xs font-mono focus:outline-none focus:border-[var(--accent-brass)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold">
              Payment Method
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'GCash', label: 'GCash', icon: Wallet },
                { id: 'Maya', label: 'Maya', icon: Wallet },
                { id: 'Credit/Debit Card', label: 'Card', icon: CreditCard },
                { id: 'Cash at Box Office', label: 'Box Office Cash', icon: Banknote },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = paymentMethod === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id as any)}
                    className={`p-2 sm:p-3 border flex flex-col items-center justify-center space-y-1 transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] border-[var(--text-primary)] font-bold'
                        : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="font-mono text-[10px] sm:text-[11px] truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/40 text-rose-500 font-mono text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#C5A059] hover:bg-[#E2C285] text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 shadow-md"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing Reservation...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize & Issue E-Ticket • ₱{totalAmount.toLocaleString()}</span>
                </>
              )}
            </button>
            <p className="font-mono text-[10px] text-center text-[var(--text-muted)] mt-2 uppercase tracking-wider">
              Guaranteed single-theater reservation • Hall 01 • 72 seats
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
