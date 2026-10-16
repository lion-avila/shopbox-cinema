import React, { useState } from 'react';
import {
  Movie,
  Showtime,
  SelectedConcession,
  CustomerInfo,
  Booking,
  User as UserType,
} from '../types/cinema';
import { CinemaStorage, THEATER_SEATS } from '../services/storage';
import { useSeatHoldTimer } from '../hooks/useSeatHoldTimer';
import {
  CreditCard,
  Wallet,
  Banknote,
  QrCode,
  User as UserIcon,
  Mail,
  Phone,
  ArrowLeft,
  Loader2,
  Lock,
  Clock,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface PaymentCheckoutViewProps {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: number[];
  concessions: SelectedConcession[];
  onBookingSuccess: (booking: Booking) => void;
  onBackToConcessions: () => void;
  currentPatron?: UserType | null;
}

type PaymentMethodType = 'GCash' | 'Maya' | 'QR Ph' | 'Cash at Box Office' | 'Credit/Debit Card';

export const PaymentCheckoutView: React.FC<PaymentCheckoutViewProps> = ({
  movie,
  showtime,
  selectedSeats,
  concessions,
  onBookingSuccess,
  onBackToConcessions,
  currentPatron,
}) => {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: currentPatron?.name || '',
    email: currentPatron?.email || '',
    phone: currentPatron?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('GCash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  // Dynamic reference generated on mount
  const [referenceCode] = useState(() => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    return `SBC-${randomSuffix}`;
  });

  // Active Hold Timer
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const { formattedTime, isWarning: isTimerWarning } = useSeatHoldTimer(
    showtime.id,
    selectedSeats,
    () => {
      setShowExpiredModal(true);
    }
  );

  const ticketsSubtotal = selectedSeats.length * showtime.price;
  const concessionsSubtotal = concessions.reduce(
    (sum, c) => sum + c.item.price * c.quantity,
    0
  );
  const totalAmount = ticketsSubtotal + concessionsSubtotal;

  const getSeatRowLabel = (seatId: number) => {
    const found = THEATER_SEATS.find((s) => s.id === seatId);
    return found ? `${found.rowLabel}-${found.id}` : `#${seatId}`;
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setErrorMessage('Please provide your complete name, email address, and mobile number.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      const normalizedPaymentMethod =
        paymentMethod === 'QR Ph'
          ? 'GCash'
          : paymentMethod;

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
        paymentMethod: normalizedPaymentMethod,
        paymentStatus: paymentMethod === 'Cash at Box Office' ? 'pending' : 'paid',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      CinemaStorage.saveBooking(newBooking);
      setIsProcessing(false);
      onBookingSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button
            onClick={onBackToConcessions}
            disabled={isProcessing}
            className="p-2 border border-[var(--border-strong)] hover:border-[var(--accent-brass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 disabled:opacity-40"
            title="Back to Concessions"
            aria-label="Back to Concessions"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent-brass)] font-bold block">
              Step 04 / Final Checkout
            </span>
            <h2 className="font-display text-base sm:text-xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight truncate">
              Order Authorization & Payment
            </h2>
            <p className="font-mono text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5 truncate">
              Virac Hall 01 • Ref: {referenceCode} • Instant E-Ticket Issuance
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
            Hold Remaining
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Patron Info & Payment Tabs (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Patron Information Card */}
            <div className="p-4 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--text-primary)]">
                  01 / Patron Details
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {currentPatron ? 'Auto-filled from Account' : 'Guest Checkout'}
                </span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] text-[var(--text-secondary)] block mb-1">
                    Full Legal Name (For Box Office Verification) *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Juan Dela Cruz"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-xs font-mono focus:outline-none focus:border-[var(--accent-brass)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] text-[var(--text-secondary)] block mb-1">
                      Email Address (E-Ticket Delivery) *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="email"
                        required
                        placeholder="juan@example.ph"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-xs font-mono focus:outline-none focus:border-[var(--accent-brass)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[var(--text-secondary)] block mb-1">
                      Philippine Mobile Number (+63) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="tel"
                        required
                        placeholder="0917 123 4567"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-xs font-mono focus:outline-none focus:border-[var(--accent-brass)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-4 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--text-primary)]">
                  02 / Select Payment Gateway
                </span>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
              </div>

              {/* Segmented Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'GCash', label: 'GCash', icon: Wallet, highlight: 'E-Wallet' },
                  { id: 'Maya', label: 'Maya', icon: Wallet, highlight: 'E-Wallet' },
                  { id: 'QR Ph', label: 'QR Ph', icon: QrCode, highlight: 'Universal' },
                  { id: 'Credit/Debit Card', label: 'Card', icon: CreditCard, highlight: 'Visa/MC' },
                  { id: 'Cash at Box Office', label: 'Box Office Cash', icon: Banknote, highlight: 'Virac 4/F' },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = paymentMethod === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id as any)}
                      className={`p-3 border flex flex-col items-center justify-center space-y-1.5 transition-all text-center min-h-[64px] active:scale-95 ${
                        isSelected
                          ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold shadow-md'
                          : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] leading-tight block truncate w-full">
                        {opt.label}
                      </span>
                      <span
                        className={`text-[8.5px] uppercase tracking-wider block ${
                          isSelected ? 'text-black/80 font-bold' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {opt.highlight}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic QR Ph / GCash / Maya Panel */}
              {(paymentMethod === 'GCash' || paymentMethod === 'Maya' || paymentMethod === 'QR Ph') && (
                <div className="p-4 sm:p-5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] rounded-sm space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Simulated SVG QR Ph Code */}
                    <div className="p-3 bg-white rounded border border-zinc-300 shadow-sm flex flex-col items-center shrink-0">
                      <div className="text-[9px] font-bold text-blue-900 tracking-widest uppercase mb-1">
                        QR Ph • UNIVERSAL
                      </div>
                      <svg
                        className="w-40 h-40"
                        viewBox="0 0 160 160"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="160" height="160" fill="white" />
                        {/* Corner Finder 1 */}
                        <rect x="12" y="12" width="40" height="40" fill="black" />
                        <rect x="20" y="20" width="24" height="24" fill="white" />
                        <rect x="26" y="26" width="12" height="12" fill="black" />
                        {/* Corner Finder 2 */}
                        <rect x="108" y="12" width="40" height="40" fill="black" />
                        <rect x="116" y="20" width="24" height="24" fill="white" />
                        <rect x="122" y="26" width="12" height="12" fill="black" />
                        {/* Corner Finder 3 */}
                        <rect x="12" y="108" width="40" height="40" fill="black" />
                        <rect x="20" y="116" width="24" height="24" fill="white" />
                        <rect x="26" y="122" width="12" height="12" fill="black" />
                        {/* Data Matrix Dots Pattern */}
                        <rect x="60" y="16" width="8" height="8" fill="black" />
                        <rect x="76" y="16" width="8" height="8" fill="black" />
                        <rect x="68" y="28" width="8" height="8" fill="black" />
                        <rect x="84" y="28" width="8" height="8" fill="black" />
                        <rect x="60" y="44" width="8" height="8" fill="black" />
                        <rect x="76" y="44" width="8" height="8" fill="black" />
                        <rect x="92" y="44" width="8" height="8" fill="black" />
                        <rect x="16" y="60" width="8" height="8" fill="black" />
                        <rect x="28" y="68" width="8" height="8" fill="black" />
                        <rect x="44" y="60" width="8" height="8" fill="black" />
                        <rect x="60" y="68" width="16" height="16" fill="#C5A059" />
                        <rect x="84" y="60" width="8" height="8" fill="black" />
                        <rect x="100" y="68" width="8" height="8" fill="black" />
                        <rect x="116" y="60" width="8" height="8" fill="black" />
                        <rect x="132" y="68" width="8" height="8" fill="black" />
                        <rect x="16" y="76" width="8" height="8" fill="black" />
                        <rect x="36" y="84" width="8" height="8" fill="black" />
                        <rect x="68" y="92" width="8" height="8" fill="black" />
                        <rect x="84" y="84" width="8" height="8" fill="black" />
                        <rect x="108" y="76" width="8" height="8" fill="black" />
                        <rect x="124" y="84" width="8" height="8" fill="black" />
                        <rect x="140" y="76" width="8" height="8" fill="black" />
                        <rect x="60" y="108" width="8" height="8" fill="black" />
                        <rect x="76" y="116" width="8" height="8" fill="black" />
                        <rect x="92" y="108" width="8" height="8" fill="black" />
                        <rect x="108" y="116" width="8" height="8" fill="black" />
                        <rect x="124" y="108" width="8" height="8" fill="black" />
                        <rect x="68" y="132" width="8" height="8" fill="black" />
                        <rect x="84" y="140" width="8" height="8" fill="black" />
                        <rect x="100" y="132" width="8" height="8" fill="black" />
                        <rect x="116" y="140" width="8" height="8" fill="black" />
                        <rect x="132" y="132" width="8" height="8" fill="black" />
                      </svg>
                      <span className="text-[8px] font-mono text-zinc-600 mt-1 uppercase font-bold">
                        Scan with GCash / Maya
                      </span>
                    </div>

                    {/* QR Details & Deep Link Actions */}
                    <div className="flex-1 space-y-3 text-xs w-full">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase text-[var(--accent-brass)] font-bold block">
                          Merchant: Shopbox Cinema (Virac, Catanduanes)
                        </span>
                        <div className="text-base font-extrabold text-[var(--text-primary)]">
                          Amount Due: ₱{totalAmount.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Scan using any BSP-supervised mobile banking or e-wallet app, or tap
                          Authorize below for direct checkout simulation.
                        </p>
                      </div>

                      <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                        <div>
                          <span className="text-[9px] uppercase text-[var(--text-muted)] block">
                            Payment Reference Code:
                          </span>
                          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                            {referenceCode}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyReference}
                          className="px-2.5 py-1 text-[10px] uppercase font-bold border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] flex items-center space-x-1 transition-colors"
                        >
                          {copiedRef ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[10px] text-[var(--text-muted)] flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Instant automated clearance upon authorization.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash at Box Office Informational Panel */}
              {paymentMethod === 'Cash at Box Office' && (
                <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-strong)] space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-[var(--accent-brass)] font-bold">
                    <Building2 className="w-4 h-4" />
                    <span>In-Person Box Office Settlement (Virac Branch)</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Please proceed to <strong>4/F Shopbox Bldg., San Jose, Virac, Catanduanes</strong> to settle your payment. Your recliner seats will be held under reservation reference <strong>{referenceCode}</strong>.
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Tickets unpaid 30 minutes before showtime will be subject to release.
                  </p>
                </div>
              )}

              {/* Credit / Debit Card Mock Form */}
              {paymentMethod === 'Credit/Debit Card' && (
                <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-strong)] space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] text-[var(--text-secondary)] block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4123 4567 8901 2345"
                      defaultValue="4123 •••• •••• 8829"
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[var(--text-secondary)] block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        defaultValue="12/28"
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-secondary)] block mb-1">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        defaultValue="888"
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/40 text-rose-500 font-mono text-xs font-semibold">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Final Receipt (lg:col-span-4) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 font-mono">
              {/* Film Details */}
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

              {/* Reserved Recliners */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                  Confirmed Seats ({selectedSeats.length}):
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

              {/* Concessions Itemization */}
              {concessions.filter((c) => c.quantity > 0).length > 0 && (
                <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
                    Concessions:
                  </span>
                  {concessions
                    .filter((c) => c.quantity > 0)
                    .map((c) => (
                      <div
                        key={c.item.id}
                        className="flex justify-between text-[11px] text-[var(--text-secondary)]"
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
              )}

              {/* Final Breakdown */}
              <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5 text-xs text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Tickets ({selectedSeats.length} × ₱{showtime.price})</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    ₱{ticketsSubtotal.toLocaleString()}
                  </span>
                </div>
                {concessionsSubtotal > 0 && (
                  <div className="flex justify-between">
                    <span>Concessions Subtotal</span>
                    <span className="font-bold text-[var(--text-primary)]">
                      ₱{concessionsSubtotal.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
                  <span>Box Office Fee</span>
                  <span className="text-emerald-500 font-bold">FREE (₱0.00)</span>
                </div>
                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-baseline justify-between text-sm">
                  <span className="font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Total Due
                  </span>
                  <span className="text-xl font-extrabold text-[var(--accent-brass)]">
                    ₱{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#C5A059] hover:bg-[#E2C285] text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 shadow-xl cursor-pointer"
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
                <p className="text-[10px] text-center text-[var(--text-muted)]">
                  Shopbox Cinema Virac • Hall 01 • Guaranteed Reservation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-surface-glass)] backdrop-blur-md border-t border-[var(--border-strong)] shadow-2xl safe-area-pb p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] text-[var(--text-muted)]">
                {paymentMethod} • Ref: {referenceCode}
              </div>
              <div className="text-lg font-extrabold text-[var(--accent-brass)] font-mono">
                ₱{totalAmount.toLocaleString()}
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#E2C285] text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Hold Expired Modal */}
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
                onClick={onBackToConcessions}
                className="w-full py-2.5 bg-[#C5A059] hover:bg-[#E2C285] text-black font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Return to Refreshments & Seats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
