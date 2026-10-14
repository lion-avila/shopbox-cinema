import React, { useEffect, useState, useRef } from 'react';
import { Booking } from '../types/cinema';
import QRCode from 'qrcode';
import { 
  Printer, 
  Check, 
  X, 
  Calendar, 
  Clock 
} from 'lucide-react';

interface TicketModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (booking) {
      QRCode.toDataURL(
        JSON.stringify({
          ref: booking.referenceCode,
          movie: booking.movieTitle,
          seats: booking.seats,
          date: booking.showtimeDate,
          time: booking.showtimeTime,
          hall: booking.hall,
          name: booking.customer.name,
        }),
        {
          width: 180,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        }
      )
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR:', err));
    }
  }, [booking]);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-8 space-y-4">
        {/* Top Controls */}
        <div className="flex items-center justify-between no-print font-mono text-xs">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Check className="w-4 h-4 stroke-[3]" />
            <span className="uppercase tracking-wider">Admission Confirmed</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 border border-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* E-TICKET CARD (Printable) */}
        <div
          ref={ticketRef}
          className="printable-ticket bg-[#111116] border border-white/20 text-white relative shadow-2xl"
        >
          {/* Header Banner */}
          <div className="bg-white text-black p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                <img
                  src="/assets/logo-black.svg"
                  alt="Shopbox Cinema"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base uppercase tracking-[0.15em] leading-tight">
                  Shopbox Cinema
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                  Hall 01 • 72-Seat Single Screen
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 block">
                Booking Ref
              </span>
              <span className="font-mono font-black text-sm tracking-wider">
                {booking.referenceCode}
              </span>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-6">
            {/* Movie Title & Info */}
            <div className="flex space-x-4 items-center">
              <div className="w-14 h-20 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden">
                <img
                  src={booking.moviePoster}
                  alt={booking.movieTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C5A059] block">
                  Official Admission Pass
                </span>
                <h2 className="font-display text-lg font-bold text-white uppercase leading-tight">
                  {booking.movieTitle}
                </h2>
                <p className="font-mono text-xs text-zinc-400">{booking.hall}</p>
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-zinc-950 border border-white/[0.08] font-mono text-xs">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Screening Date</span>
                  <span className="font-bold text-white">{booking.showtimeDate}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Showtime</span>
                  <span className="font-bold text-white">{booking.showtimeTime}</span>
                </div>
              </div>
            </div>

            {/* SEATS PILLS */}
            <div className="p-4 bg-zinc-950 border border-white/[0.08] text-center space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 block">
                Authorized Seats ({booking.seats.length})
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {booking.seats.map((seatId) => (
                  <span
                    key={seatId}
                    className="px-3 py-1 bg-white text-black font-mono font-bold text-xs tracking-wider"
                  >
                    SEAT #{seatId}
                  </span>
                ))}
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="relative py-1 flex items-center justify-center">
              <div className="w-full border-b border-dashed border-white/20" />
              <div className="absolute -left-9 w-6 h-6 rounded-full bg-[#060608]" />
              <div className="absolute -right-9 w-6 h-6 rounded-full bg-[#060608]" />
            </div>

            {/* Customer & Scannable QR */}
            <div className="flex items-center justify-between gap-4 pt-1 font-mono text-xs">
              <div className="space-y-1.5">
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Patron</span>
                  <span className="font-bold text-white">{booking.customer.name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Total Paid</span>
                  <span className="text-zinc-300">
                    ₱{booking.totalAmount.toLocaleString()} ({booking.paymentMethod})
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Admission Status</span>
                  <span className="text-emerald-400 uppercase font-bold text-[10px]">
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="w-24 h-24 p-1.5 bg-white shrink-0 flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Admission QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-200 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Ticket Footer Note */}
          <div className="p-3 bg-black text-center font-mono text-[9px] text-zinc-400 uppercase tracking-widest border-t border-white/[0.06]">
            Present at Hall 01 doors for barcode scanning & admission.
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 no-print font-mono text-xs">
          <button
            onClick={handlePrint}
            className="py-3 px-4 border border-white/20 hover:border-white text-white font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ticket</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <span>Close / Browse</span>
          </button>
        </div>
      </div>
    </div>
  );
};
