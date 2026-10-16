import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Movie, Showtime, TheaterSeat } from '../types/cinema';
import { THEATER_SEATS, CinemaStorage, validateOrphanSeatGap } from '../services/storage';
import { useSeatHoldTimer } from '../hooks/useSeatHoldTimer';
import {
  Check,
  X,
  Lock,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Clock,
  Accessibility,
  Heart,
  Crown,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface SeatMapProps {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: number[];
  onToggleSeat: (seatId: number) => void;
  onClearSeats?: () => void;
  onProceedToCheckout: () => void;
  onBackToShowtimes: () => void;
  onOpenOriginalChart?: () => void;
  onSkipToPayment?: () => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  movie,
  showtime,
  selectedSeats,
  onToggleSeat,
  onClearSeats,
  onProceedToCheckout,
  onBackToShowtimes,
  onOpenOriginalChart,
  onSkipToPayment,
}) => {
  const { booked, blocked } = CinemaStorage.getOccupiedSeatsForShowtime(showtime.id);

  const isBooked = (id: number) => booked.includes(id);
  const isBlocked = (id: number) => blocked.includes(id);
  const isSelected = (id: number) => selectedSeats.includes(id);

  // 10-Minute Seat Hold Timer Engine
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const {
    formattedTime,
    isWarning: isTimerWarning,
    resetHold,
  } = useSeatHoldTimer(showtime.id, selectedSeats, () => {
    setShowExpiredModal(true);
  });

  const handleReselectAfterExpire = () => {
    setShowExpiredModal(false);
    if (onClearSeats) onClearSeats();
    resetHold();
  };

  // Orphan Gap Validation
  const orphanCheck = validateOrphanSeatGap(selectedSeats, booked, blocked);

  // Rows and layout
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const totalPrice = selectedSeats.length * showtime.price;
  const openCount = Math.max(0, 72 - (booked.length + blocked.length));
  const isMaxReached = selectedSeats.length >= 8;

  // Mobile Bottom Sheet expanded state
  const [isMobileSheetExpanded, setIsMobileSheetExpanded] = useState(false);

  // Interactive Canvas Pan & Zoom State
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(2.2, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => {
      const next = Math.max(0.85, +(prev - 0.25).toFixed(2));
      if (next <= 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1 && e.button !== 0) return;
    // Don't drag if clicking directly on a button
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...panOffset };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPanOffset({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch handlers for mobile pinch & pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1 && zoomScale > 1) {
      if ((e.target as HTMLElement).closest('button')) return;
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...panOffset };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      const ratio = currentDist / touchDistanceRef.current;
      setZoomScale((prev) => {
        const next = Math.min(2.2, Math.max(0.85, +(prev * ratio).toFixed(2)));
        return next;
      });
      touchDistanceRef.current = currentDist;
    } else if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      setPanOffset({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
    setIsDragging(false);
  };

  const getSeatRowLabel = (seatId: number) => {
    const found = THEATER_SEATS.find((s) => s.id === seatId);
    return found ? `${found.rowLabel}-${found.id}` : `#${seatId}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Session Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button
            onClick={onBackToShowtimes}
            className="p-2 border border-[var(--border-strong)] hover:border-[var(--accent-brass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
            title="Return to Showtimes"
            aria-label="Return to Showtimes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-base sm:text-xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight truncate">
                {movie.title}
              </h2>
              {showtime.format && (
                <span className="font-mono text-[10px] px-2 py-0.5 bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 font-bold uppercase tracking-widest shrink-0">
                  {showtime.format}
                </span>
              )}
              <span className="font-mono text-[10px] sm:text-xs px-2 py-0.5 bg-[var(--bg-elevated)] text-[var(--accent-brass)] border border-[var(--border-subtle)] font-bold shrink-0">
                ₱{showtime.price} / Seat
              </span>
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5 truncate">
              {showtime.hall} • {showtime.date} at {showtime.time} • {openCount} of 72 Seats Open
            </p>
          </div>
        </div>

        {/* Active Hold Countdown Badge (Always visible on mobile & desktop header) */}
        {selectedSeats.length > 0 && (
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
        )}
      </div>

      {/* Edge State: Max 8 Seats Warning */}
      {isMaxReached && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/40 text-amber-500 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Maximum reservation limit of 8 seats per order reached.</span>
          </div>
          <span className="text-[10px] uppercase font-bold">8 / 8 Selected</span>
        </div>
      )}

      {/* Edge State: Orphan Seat Gap Alert */}
      {orphanCheck.hasGap && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/40 text-rose-500 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Orphan Seat Notice:</strong> {orphanCheck.message}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold shrink-0 ml-2">Adjacency Rule</span>
        </div>
      )}

      {/* 2-Column Desktop Split View (65% Canvas, 35% Sticky Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Architectural Canvas (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden">
            {/* Top Canvas Toolbar (Zoom & Blueprint controls) */}
            <div className="px-3 sm:px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider hidden sm:inline">
                  Canvas Zoom:
                </span>
                <span className="text-[11px] font-bold text-[var(--text-primary)]">
                  {Math.round(zoomScale * 100)}%
                </span>
                {zoomScale !== 1 && (
                  <button
                    onClick={handleResetZoom}
                    className="p-1 hover:text-[var(--accent-brass)] text-[var(--text-muted)] transition-colors"
                    title="Reset to 100%"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 0.85}
                  className="p-1.5 border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 2.2}
                  className="p-1.5 border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                </button>
                {onOpenOriginalChart && (
                  <button
                    onClick={onOpenOriginalChart}
                    className="hidden sm:inline-block px-2.5 py-1 text-[10px] uppercase font-bold border border-[var(--border-subtle)] hover:border-[var(--accent-brass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors ml-2"
                  >
                    Original Blueprint
                  </button>
                )}
              </div>
            </div>

            {/* Canvas Interactive Viewport */}
            <div
              ref={canvasContainerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative p-3 sm:p-8 select-none touch-pan-x touch-pan-y ${
                zoomScale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
              }`}
              style={{ minHeight: '520px' }}
            >
              {/* Scalable Matrix Layer */}
              <div
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                  transformOrigin: 'top center',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
                className="w-full max-w-xl mx-auto"
              >
                {/* Concentric Curved Laser Screen Arc */}
                <div className="mb-6 sm:mb-8 text-center">
                  <div className="relative pb-2">
                    <div className="w-full h-8 sm:h-9 architectural-screen rounded-t-[120px] flex items-center justify-center relative overflow-hidden">
                      {/* Laser Projection Beam Ambient Glow */}
                      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#C5A059]/20 to-transparent pointer-events-none" />
                      <span className="font-mono text-[9px] sm:text-[11px] font-bold tracking-[0.45em] uppercase text-[var(--accent-brass)] pt-1 flex items-center justify-center space-x-2">
                        <Sparkles className="w-3 h-3 text-[#C5A059] opacity-70" />
                        <span>S C R E E N</span>
                        <Sparkles className="w-3 h-3 text-[#C5A059] opacity-70" />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-6 text-[10px] font-mono text-[var(--text-muted)] pt-1.5 border-t border-[var(--border-subtle)]">
                    <span>HALL 01 • 72 RECLINERS</span>
                    <span className="hidden sm:inline">PROJECTION: 4K LASER</span>
                  </div>
                </div>

                {/* Tactile Seat State Legend */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pb-5 mb-5 text-[9px] sm:text-[10px] font-mono text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-[var(--seat-available-bg)] border border-[var(--seat-available-border)] text-[8px] flex items-center justify-center font-bold">
                      •
                    </div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-[#C5A059] text-black font-bold flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-[var(--text-primary)] font-bold">Selected</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-[var(--seat-reserved-bg)] border border-[var(--seat-reserved-border)] text-[var(--seat-reserved-text)] flex items-center justify-center">
                      <X className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[var(--text-muted)]">Reserved</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-[var(--seat-accessible-bg)] border border-[var(--seat-accessible-border)] text-[var(--seat-accessible-text)] flex items-center justify-center">
                      <Accessibility className="w-2.5 h-2.5" />
                    </div>
                    <span>Wheelchair</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-[var(--seat-companion-bg)] border border-[var(--seat-companion-border)] text-[var(--seat-companion-text)] flex items-center justify-center">
                      <Heart className="w-2.5 h-2.5" />
                    </div>
                    <span>Companion</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-[var(--bg-canvas)] border border-[#C5A059] text-[#C5A059] flex items-center justify-center">
                      <Crown className="w-2.5 h-2.5" />
                    </div>
                    <span>VIP Row I</span>
                  </div>
                </div>

                {/* 72 SEATS ARCHITECTURAL MATRIX (9 ROWS × 8 SEATS) */}
                <div className="space-y-1 sm:space-y-1.5">
                  {/* Wing Column Headers */}
                  <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] pb-1 px-1">
                    <div className="w-5 sm:w-6 text-center">Row</div>
                    <div className="flex-1 text-center border-b border-[var(--border-subtle)] pb-0.5 mx-2">
                      Left Wing (Cols 1–4)
                    </div>
                    <div className="w-6 sm:w-10 text-center font-bold text-[#C5A059]">Aisle</div>
                    <div className="flex-1 text-center border-b border-[var(--border-subtle)] pb-0.5 mx-2">
                      Right Wing (Cols 5–8)
                    </div>
                    <div className="w-5 sm:w-6 text-center">Row</div>
                  </div>

                  {rows.map((rowNum) => {
                    const rowLabel = rowLetters[rowNum - 1];
                    const rowSeats = THEATER_SEATS.filter((s) => s.row === rowNum);
                    const leftBlock = rowSeats.filter((s) => s.block === 'left');
                    const rightBlock = rowSeats.filter((s) => s.block === 'right');

                    return (
                      <div
                        key={rowNum}
                        className="flex items-center justify-between group py-0.5 hover:bg-[var(--bg-elevated)]/30 transition-colors"
                      >
                        {/* Left Row Coordinate */}
                        <div className="w-5 sm:w-6 text-[11px] font-mono font-bold text-[var(--text-muted)] group-hover:text-[var(--accent-brass)] transition-colors text-center shrink-0">
                          {rowLabel}
                        </div>

                        {/* Left Wing (4 Seats) */}
                        <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 flex-1">
                          {leftBlock.map((seat) => renderSeatButton(seat))}
                        </div>

                        {/* Center Aisle */}
                        <div className="w-6 sm:w-10 flex items-center justify-center text-[7px] sm:text-[8px] font-mono tracking-widest text-[var(--text-muted)] uppercase shrink-0 select-none">
                          <span className="hidden sm:inline">AISLE</span>
                          <span className="sm:hidden">•</span>
                        </div>

                        {/* Right Wing (4 Seats) */}
                        <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 flex-1">
                          {rightBlock.map((seat) => renderSeatButton(seat))}
                        </div>

                        {/* Right Row Coordinate */}
                        <div className="w-5 sm:w-6 text-[11px] font-mono font-bold text-[var(--text-muted)] group-hover:text-[var(--accent-brass)] transition-colors text-center shrink-0">
                          {rowLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Rear Doors Landmark */}
                <div className="mt-8 pt-3 border-t border-[var(--border-subtle)] text-center text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-[0.25em]">
                  ▼ AUDITORIUM 01 DOORS • REAR ENTRANCE ▼
                </div>
              </div>

              {/* Mini-Map Radar (Visible when scaled or hovering on mobile) */}
              {zoomScale > 1.1 && (
                <div className="absolute bottom-3 left-3 p-2 bg-black/80 border border-[var(--border-strong)] rounded shadow-xl pointer-events-none hidden sm:block">
                  <div className="w-16 h-20 border border-[var(--border-subtle)] relative flex flex-col justify-between p-1 bg-[var(--bg-canvas)]">
                    <div className="h-1 w-full bg-[#C5A059]/50 rounded-t" />
                    <div className="text-[7px] font-mono text-center text-[var(--text-muted)]">HALL 01</div>
                    <div className="w-full text-center text-[6px] text-zinc-500 font-mono">DOORS</div>
                    {/* Viewport Frustum Box */}
                    <div
                      className="absolute border border-emerald-400 bg-emerald-400/20"
                      style={{
                        width: `${Math.max(20, 100 / zoomScale)}%`,
                        height: `${Math.max(20, 100 / zoomScale)}%`,
                        left: `${Math.min(80, Math.max(0, 50 - panOffset.x / 10))}%`,
                        top: `${Math.min(80, Math.max(0, 50 - panOffset.y / 10))}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Order Summary & Receipt (lg:col-span-4) */}
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

            {/* Active Hold Timer Box */}
            {selectedSeats.length > 0 && (
              <div
                className={`p-2.5 border flex items-center justify-between text-xs ${
                  isTimerWarning
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-500'
                    : 'bg-[#C5A059]/10 border-[#C5A059]/30 text-[#C5A059]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-bold">Seats Reserved For:</span>
                </div>
                <span className="text-sm font-extrabold tracking-wider">{formattedTime}</span>
              </div>
            )}

            {/* Selected Seats Chips */}
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
                <span className="uppercase tracking-wider font-bold">
                  Selected Seats ({selectedSeats.length}/8):
                </span>
                {selectedSeats.length > 0 && onClearSeats && (
                  <button
                    onClick={onClearSeats}
                    className="text-[10px] uppercase text-[var(--text-muted)] hover:text-rose-500 flex items-center space-x-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {[...selectedSeats]
                    .sort((a, b) => a - b)
                    .map((id) => (
                      <button
                        key={id}
                        onClick={() => onToggleSeat(id)}
                        title="Click to remove seat"
                        className="group px-2 py-1 bg-[#C5A059] hover:bg-rose-500 hover:text-white text-black font-mono text-[11px] font-bold flex items-center space-x-1 transition-colors"
                      >
                        <span>{getSeatRowLabel(id)}</span>
                        <X className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                      </button>
                    ))}
                </div>
              ) : (
                <div className="p-4 border border-dashed border-[var(--border-subtle)] text-center text-[11px] text-[var(--text-muted)]">
                  Tap any available recliner on the floor plan to begin selection.
                </div>
              )}
            </div>

            {/* Subtotal Calculation */}
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>
                  Ticket Admission ({selectedSeats.length} × ₱{showtime.price})
                </span>
                <span className="text-[var(--text-primary)] font-bold">
                  ₱{totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
                <span>Online Booking Fee</span>
                <span className="text-emerald-500 font-bold">FREE (₱0.00)</span>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-baseline justify-between text-sm">
                <span className="font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Total Due
                </span>
                <span className="text-xl font-extrabold text-[var(--accent-brass)]">
                  ₱{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 space-y-2">
              <button
                onClick={onProceedToCheckout}
                disabled={selectedSeats.length === 0 || orphanCheck.hasGap}
                className={`w-full py-3.5 text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center space-x-2 transition-all active:scale-98 ${
                  selectedSeats.length > 0 && !orphanCheck.hasGap
                    ? 'bg-[#C5A059] hover:bg-[#E2C285] text-black shadow-lg cursor-pointer'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed opacity-60'
                }`}
              >
                <span>Proceed to Refreshments</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onSkipToPayment && selectedSeats.length > 0 && !orphanCheck.hasGap && (
                <button
                  onClick={onSkipToPayment}
                  className="w-full py-2 text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border-subtle)] transition-colors"
                >
                  Skip Directly to Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Sheet (Visible on viewports < 1024px) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-surface-glass)] backdrop-blur-md border-t border-[var(--border-strong)] shadow-2xl safe-area-pb">
        {/* Toggle handle for expanding full receipt on mobile */}
        {selectedSeats.length > 0 && (
          <button
            onClick={() => setIsMobileSheetExpanded(!isMobileSheetExpanded)}
            className="w-full py-1 bg-[var(--bg-elevated)] flex items-center justify-center text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider"
          >
            <span className="mr-1">{isMobileSheetExpanded ? 'Collapse Receipt' : 'View Full Receipt'}</span>
            {isMobileSheetExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        )}

        {/* Expanded Sheet Content */}
        {isMobileSheetExpanded && selectedSeats.length > 0 && (
          <div className="p-4 border-b border-[var(--border-subtle)] max-h-48 overflow-y-auto space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Seats:</span>
              <div className="flex flex-wrap gap-1">
                {[...selectedSeats]
                  .sort((a, b) => a - b)
                  .map((id) => (
                    <span key={id} className="px-1.5 py-0.5 bg-[#C5A059] text-black font-bold text-[10px]">
                      {getSeatRowLabel(id)}
                    </span>
                  ))}
              </div>
            </div>
            {isTimerWarning && (
              <p className="text-[10px] text-rose-500 font-bold">
                ⚠️ Hold expiring soon ({formattedTime}). Complete your order to secure seats.
              </p>
            )}
          </div>
        )}

        {/* Collapsed Sticky Bar */}
        <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
              </span>
              {selectedSeats.length > 0 && (
                <span className="font-mono text-[10px] text-[var(--accent-brass)] font-bold">
                  ({formattedTime})
                </span>
              )}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[var(--accent-brass)] font-mono">
              ₱{totalPrice.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {selectedSeats.length > 0 && onClearSeats && (
              <button
                onClick={onClearSeats}
                className="p-2 border border-[var(--border-strong)] text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                title="Clear"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onProceedToCheckout}
              disabled={selectedSeats.length === 0 || orphanCheck.hasGap}
              className={`px-6 py-3 text-xs font-mono uppercase tracking-widest font-bold flex items-center space-x-2 transition-all active:scale-95 ${
                selectedSeats.length > 0 && !orphanCheck.hasGap
                  ? 'bg-[#C5A059] hover:bg-[#E2C285] text-black shadow-lg'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed opacity-60'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Hold Expired Modal */}
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
                Your 10-minute hold on these seats has expired. The seats have been released back to
                the general box office.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={handleReselectAfterExpire}
                className="w-full py-2.5 bg-[#C5A059] hover:bg-[#E2C285] text-black font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Reselect Seats
              </button>
              <button
                onClick={onBackToShowtimes}
                className="w-full py-2.5 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] text-xs uppercase tracking-wider transition-colors"
              >
                Back to Showtimes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* Render Individual Seat with WCAG 2.5.5 Touch Area (>=44x44px target) */
  function renderSeatButton(seat: TheaterSeat) {
    const bookedStatus = isBooked(seat.id);
    const blockedStatus = isBlocked(seat.id);
    const selected = isSelected(seat.id);
    const disabled = bookedStatus || blockedStatus;
    const isAccessible = seat.category === 'wheelchair';
    const isCompanion = seat.category === 'companion';
    const isVIP = seat.category === 'vip';

    return (
      <div
        key={seat.id}
        className="relative flex items-center justify-center min-w-[34px] min-h-[38px] sm:min-w-[44px] sm:min-h-[44px]"
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => onToggleSeat(seat.id)}
          aria-label={`Row ${seat.rowLabel} Seat ${seat.id}${
            isAccessible ? ' Wheelchair Space' : isCompanion ? ' Companion Seat' : isVIP ? ' VIP Recliner' : ''
          } - ${bookedStatus ? 'Reserved' : blockedStatus ? 'Held' : selected ? 'Selected' : 'Available'}`}
          title={`Row ${seat.rowLabel} • Seat #${seat.id}${
            isAccessible ? ' (Wheelchair Space)' : isCompanion ? ' (Companion Seat)' : isVIP ? ' (VIP Couple)' : ''
          } - ₱${showtime.price}`}
          className={`relative w-[30px] h-[30px] sm:w-[38px] sm:h-[38px] flex flex-col items-center justify-between p-0.5 sm:p-1 transition-all duration-150 select-none ${
            selected
              ? 'bg-[#C5A059] text-black font-bold ring-2 ring-[#C5A059] z-10 scale-[1.06] shadow-lg'
              : bookedStatus
              ? 'bg-[var(--seat-reserved-bg)] border border-[var(--seat-reserved-border)] text-[var(--seat-reserved-text)] cursor-not-allowed opacity-60'
              : blockedStatus
              ? 'bg-[var(--seat-reserved-bg)] border border-[var(--border-strong)] text-[var(--seat-reserved-text)] cursor-not-allowed opacity-75'
              : isAccessible
              ? 'bg-[var(--seat-accessible-bg)] text-[var(--seat-accessible-text)] border border-[var(--seat-accessible-border)] hover:border-[#C5A059]'
              : isCompanion
              ? 'bg-[var(--seat-companion-bg)] text-[var(--seat-companion-text)] border border-[var(--seat-companion-border)] hover:border-[#C5A059]'
              : isVIP
              ? 'bg-[var(--seat-available-bg)] text-[var(--text-primary)] border-2 border-[#C5A059]/70 hover:border-[#C5A059]'
              : 'bg-[var(--seat-available-bg)] text-[var(--seat-available-text)] border border-[var(--seat-available-border)] hover:border-[#C5A059] hover:text-[var(--accent-brass)] active:scale-95'
          }`}
        >
          {/* Seat Number Header */}
          <span
            className={`font-mono text-[9px] sm:text-[11px] leading-none ${
              selected ? 'text-black font-black' : 'font-semibold'
            }`}
          >
            {seat.id}
          </span>

          {/* Seat Category Emblem / Cushion pip */}
          <div className="flex items-center justify-center">
            {isAccessible && !selected && !bookedStatus && !blockedStatus && (
              <Accessibility className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
            )}
            {isCompanion && !selected && !bookedStatus && !blockedStatus && (
              <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
            )}
            {isVIP && !selected && !bookedStatus && !blockedStatus && (
              <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#C5A059]" />
            )}
            {!isAccessible && !isCompanion && !isVIP && !selected && !bookedStatus && !blockedStatus && (
              <div
                className={`w-3.5 sm:w-5 h-[2px] ${
                  selected ? 'bg-black/60' : 'bg-[#C5A059]/40'
                }`}
              />
            )}
          </div>

          {/* State Overlays */}
          {selected && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#C5A059]">
              <div className="flex flex-col items-center">
                <span className="font-mono text-[8px] sm:text-[9px] font-black text-black leading-none">
                  {seat.rowLabel}{seat.id}
                </span>
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3] text-black" />
              </div>
            </div>
          )}
          {bookedStatus && (
            <div className="absolute inset-0 flex items-center justify-center">
              <X className="w-3 h-3 opacity-60" />
            </div>
          )}
          {blockedStatus && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 opacity-60" />
            </div>
          )}
        </button>
      </div>
    );
  }
};
