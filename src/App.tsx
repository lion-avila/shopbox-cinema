import React, { useState, useEffect } from 'react';
import {
  Movie,
  Showtime,
  Booking,
  SelectedConcession,
  ConcessionItem,
  User,
  SiteConfig,
} from './types/cinema';
import { CinemaStorage, getFormattedDate } from './services/storage';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MovieList } from './components/MovieList';
import { ShowtimePicker } from './components/ShowtimePicker';
import { SeatMap } from './components/SeatMap';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { TicketModal } from './components/TicketModal';
import { MyTicketsModal } from './components/MyTicketsModal';
import { OriginalChartModal } from './components/OriginalChartModal';
import { ScheduleView } from './components/ScheduleView';
import { AdminPortal } from './components/admin/AdminPortal';
import { AuthModal } from './components/auth/AuthModal';
import { ConcessionsView } from './components/ConcessionsView';
import { PaymentCheckoutView } from './components/PaymentCheckoutView';
import { Check, ChevronRight } from 'lucide-react';

export const App: React.FC = () => {
  const checkIsAdmin = () => {
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash.startsWith('#/admin') ||
      window.location.search.includes('portal=admin')
    );
  };

  const [isAdminPortal, setIsAdminPortal] = useState<boolean>(checkIsAdmin);
  const [currentView, setCurrentView] = useState<'home' | 'schedule'>('home');
  const [bookingStep, setBookingStep] = useState<
    'catalog' | 'showtimes' | 'seats' | 'concessions' | 'payment'
  >('catalog');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Domain & CMS Data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(CinemaStorage.getSiteConfig());

  // Patron Auth State
  const [currentPatron, setCurrentPatron] = useState<User | null>(
    CinemaStorage.getCurrentPatron()
  );
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Booking Flow State
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate(0));
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [selectedConcessions, setSelectedConcessions] = useState<SelectedConcession[]>([]);

  // Modals
  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isMyTicketsOpen, setIsMyTicketsOpen] = useState(false);
  const [isOriginalChartOpen, setIsOriginalChartOpen] = useState(false);

  const refreshData = () => {
    setMovies(CinemaStorage.getMovies());
    setShowtimes(CinemaStorage.getShowtimes());
    setBookings(CinemaStorage.getBookings());
    setSiteConfig(CinemaStorage.getSiteConfig());
    setCurrentPatron(CinemaStorage.getCurrentPatron());
  };

  useEffect(() => {
    refreshData();
    setIsLoading(false);

    const handlePopState = () => {
      setIsAdminPortal(checkIsAdmin());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminPortal(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCustomerSite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminPortal(false);
    refreshData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setBookingStep('showtimes');
    setSelectedSeats([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectShowtime = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setBookingStep('seats');
    setSelectedSeats([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectSessionBooking = (movie: Movie, showtime: Showtime) => {
    setSelectedMovie(movie);
    setSelectedShowtime(showtime);
    setSelectedDate(showtime.date);
    setBookingStep('seats');
    setSelectedSeats([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSeat = (seatId: number) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleUpdateConcessionQuantity = (item: ConcessionItem, delta: number) => {
    setSelectedConcessions((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((c) => c.item.id !== item.id);
        }
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: newQty } : c
        );
      } else if (delta > 0) {
        return [...prev, { item, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleProceedToConcessions = () => {
    setBookingStep('concessions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = () => {
    setBookingStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (booking: Booking) => {
    setConfirmedBooking(booking);
    refreshData();
    setSelectedSeats([]);
    setSelectedConcessions([]);
    setBookingStep('catalog');
    sessionStorage.removeItem('shopbox_active_hold_v1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSessionFromSchedule = (movie: Movie, showtime: Showtime) => {
    setSelectedMovie(movie);
    setSelectedDate(showtime.date);
    setSelectedShowtime(showtime);
    setCurrentView('home');
    setBookingStep('seats');
    setSelectedSeats([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutPatron = () => {
    CinemaStorage.setCurrentPatron(null);
    setCurrentPatron(null);
  };

  const patronBookings = currentPatron
    ? bookings.filter(
        (b) =>
          b.userId === currentPatron.id ||
          b.customer.email.toLowerCase() === currentPatron.email.toLowerCase()
      )
    : [];

  return (
    <ThemeProvider>
      {isAdminPortal ? (
        <AdminPortal
          showtimes={showtimes}
          movies={movies}
          onRefreshData={refreshData}
          onExitToCustomerSite={navigateToCustomerSite}
        />
      ) : (
        <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans selection:bg-[#C5A059] selection:text-black transition-colors">
          {/* Global Patron Navigation */}
          <Navbar
            currentView={currentView}
            onNavigate={(view) => {
              setCurrentView(view);
              if (view === 'home') setBookingStep('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenMyTickets={() => setIsMyTicketsOpen(true)}
            bookingCount={patronBookings.length}
            currentPatron={currentPatron}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogoutPatron={handleLogoutPatron}
          />

          {/* Interactive 5-Step Booking Stepper Bar */}
          {currentView === 'home' && bookingStep !== 'catalog' && (
            <div className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between overflow-x-auto scrollbar-none font-mono text-[10px] sm:text-xs">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Step 01 */}
                  <button
                    onClick={() => setBookingStep('catalog')}
                    className="flex items-center space-x-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-brass)] transition-colors whitespace-nowrap"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>01 / Film</span>
                  </button>

                  <ChevronRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />

                  {/* Step 02 */}
                  <button
                    onClick={() => setBookingStep('showtimes')}
                    className={`flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
                      bookingStep === 'showtimes'
                        ? 'text-[var(--accent-brass)] font-bold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--accent-brass)]'
                    }`}
                  >
                    {bookingStep !== 'showtimes' ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    )}
                    <span>02 / Time</span>
                  </button>

                  <ChevronRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />

                  {/* Step 03 */}
                  <button
                    onClick={() => {
                      if (selectedShowtime) setBookingStep('seats');
                    }}
                    className={`flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
                      bookingStep === 'seats'
                        ? 'text-[var(--accent-brass)] font-bold'
                        : bookingStep === 'concessions' || bookingStep === 'payment'
                        ? 'text-[var(--text-secondary)] hover:text-[var(--accent-brass)]'
                        : 'text-[var(--text-muted)] opacity-60'
                    }`}
                  >
                    {bookingStep === 'concessions' || bookingStep === 'payment' ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    ) : bookingStep === 'seats' ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    ) : null}
                    <span>03 / Seats</span>
                  </button>

                  <ChevronRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />

                  {/* Step 04 */}
                  <button
                    onClick={() => {
                      if (selectedSeats.length > 0) setBookingStep('concessions');
                    }}
                    disabled={selectedSeats.length === 0}
                    className={`flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
                      bookingStep === 'concessions'
                        ? 'text-[var(--accent-brass)] font-bold'
                        : bookingStep === 'payment'
                        ? 'text-[var(--text-secondary)] hover:text-[var(--accent-brass)]'
                        : 'text-[var(--text-muted)] opacity-60'
                    }`}
                  >
                    {bookingStep === 'payment' ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    ) : bookingStep === 'concessions' ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    ) : null}
                    <span>04 / Bar</span>
                  </button>

                  <ChevronRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />

                  {/* Step 05 */}
                  <span
                    className={`flex items-center space-x-1.5 whitespace-nowrap ${
                      bookingStep === 'payment'
                        ? 'text-[var(--accent-brass)] font-bold'
                        : 'text-[var(--text-muted)] opacity-60'
                    }`}
                  >
                    {bookingStep === 'payment' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    )}
                    <span>05 / Payment</span>
                  </span>
                </div>

                {selectedMovie && (
                  <span className="hidden md:inline-block text-[var(--text-muted)] truncate max-w-[200px]">
                    {selectedMovie.title}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-12">
            {isLoading ? (
              <div className="space-y-8 animate-pulse">
                <div className="h-72 sm:h-96 bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="aspect-[2/3] bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                    />
                  ))}
                </div>
              </div>
            ) : currentView === 'schedule' ? (
              <ScheduleView
                movies={movies}
                showtimes={showtimes}
                onSelectSession={handleSelectSessionFromSchedule}
              />
            ) : (
              <>
                {bookingStep === 'catalog' && (
                  <MovieList
                    movies={movies}
                    showtimes={showtimes}
                    onSelectMovie={handleSelectMovie}
                    onOpenDetails={(movie) => setDetailsMovie(movie)}
                    onSelectShowtimeQuick={() => setCurrentView('schedule')}
                    onSelectShowtimeSession={handleDirectSessionBooking}
                    siteConfig={siteConfig}
                  />
                )}

                {bookingStep === 'showtimes' && selectedMovie && (
                  <ShowtimePicker
                    movie={selectedMovie}
                    showtimes={showtimes}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    selectedShowtime={selectedShowtime}
                    onSelectShowtime={handleSelectShowtime}
                    onBackToMovies={() => setBookingStep('catalog')}
                  />
                )}

                {bookingStep === 'seats' && selectedMovie && selectedShowtime && (
                  <SeatMap
                    movie={selectedMovie}
                    showtime={selectedShowtime}
                    selectedSeats={selectedSeats}
                    onToggleSeat={handleToggleSeat}
                    onClearSeats={() => setSelectedSeats([])}
                    onProceedToCheckout={handleProceedToConcessions}
                    onSkipToPayment={handleProceedToCheckout}
                    onBackToShowtimes={() => setBookingStep('showtimes')}
                    onOpenOriginalChart={() => setIsOriginalChartOpen(true)}
                  />
                )}

                {bookingStep === 'concessions' && selectedMovie && selectedShowtime && (
                  <ConcessionsView
                    movie={selectedMovie}
                    showtime={selectedShowtime}
                    selectedSeats={selectedSeats}
                    selectedConcessions={selectedConcessions}
                    onUpdateQuantity={handleUpdateConcessionQuantity}
                    onProceedToPayment={handleProceedToCheckout}
                    onBackToSeats={() => {
                      setBookingStep('seats');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onSkipToPayment={() => {
                      setSelectedConcessions([]);
                      handleProceedToCheckout();
                    }}
                  />
                )}

                {bookingStep === 'payment' && selectedMovie && selectedShowtime && (
                  <PaymentCheckoutView
                    movie={selectedMovie}
                    showtime={selectedShowtime}
                    selectedSeats={selectedSeats}
                    concessions={selectedConcessions}
                    onBookingSuccess={handleBookingSuccess}
                    onBackToConcessions={() => {
                      setBookingStep('concessions');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    currentPatron={currentPatron}
                  />
                )}
              </>
            )}
          </main>

          {/* Footer with Virac Location, Facebook Link & Staff Gateway */}
          <Footer
            siteConfig={siteConfig}
            onOpenSeatReference={() => setIsOriginalChartOpen(true)}
            onNavigateToAdmin={navigateToAdmin}
          />

          {/* MODALS */}
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onSuccess={(user) => {
              setCurrentPatron(user);
              refreshData();
            }}
          />

          <MovieDetailsModal
            movie={detailsMovie}
            onClose={() => setDetailsMovie(null)}
            onSelectMovie={(movie) => {
              setDetailsMovie(null);
              handleSelectMovie(movie);
            }}
          />

          <TicketModal
            booking={confirmedBooking}
            onClose={() => setConfirmedBooking(null)}
          />

          <MyTicketsModal
            isOpen={isMyTicketsOpen}
            onClose={() => setIsMyTicketsOpen(false)}
            currentPatron={currentPatron}
            onOpenAuth={() => {
              setIsMyTicketsOpen(false);
              setIsAuthOpen(true);
            }}
            onViewTicket={(b) => {
              setIsMyTicketsOpen(false);
              setConfirmedBooking(b);
            }}
          />

          <OriginalChartModal
            isOpen={isOriginalChartOpen}
            onClose={() => setIsOriginalChartOpen(false)}
          />
        </div>
      )}
    </ThemeProvider>
  );
};

export default App;
