import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Booking, SelectedConcession, ConcessionItem, User, SiteConfig } from './types/cinema';
import { CinemaStorage, getFormattedDate } from './services/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MovieList } from './components/MovieList';
import { ShowtimePicker } from './components/ShowtimePicker';
import { SeatMap } from './components/SeatMap';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { ConcessionsModal } from './components/ConcessionsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketModal } from './components/TicketModal';
import { MyTicketsModal } from './components/MyTicketsModal';
import { OriginalChartModal } from './components/OriginalChartModal';
import { ScheduleView } from './components/ScheduleView';
import { AdminPortal } from './components/admin/AdminPortal';
import { AuthModal } from './components/auth/AuthModal';

export const App: React.FC = () => {
  // Routing State: Check if path starts with /admin, hash #/admin, or ?portal=admin
  const checkIsAdmin = () => {
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash.startsWith('#/admin') ||
      window.location.search.includes('portal=admin')
    );
  };

  const [isAdminPortal, setIsAdminPortal] = useState<boolean>(checkIsAdmin);
  const [currentView, setCurrentView] = useState<'home' | 'schedule'>('home');
  const [bookingStep, setBookingStep] = useState<'catalog' | 'showtimes' | 'seats'>('catalog');

  // Domain & CMS Data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(CinemaStorage.getSiteConfig());

  // Patron Auth State
  const [currentPatron, setCurrentPatron] = useState<User | null>(CinemaStorage.getCurrentPatron());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Booking Flow State
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate(0));
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [selectedConcessions, setSelectedConcessions] = useState<SelectedConcession[]>([]);

  // Modals
  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null);
  const [isConcessionsOpen, setIsConcessionsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isMyTicketsOpen, setIsMyTicketsOpen] = useState(false);
  const [isOriginalChartOpen, setIsOriginalChartOpen] = useState(false);

  // Load data on mount & listen to popstate
  const refreshData = () => {
    setMovies(CinemaStorage.getMovies());
    setShowtimes(CinemaStorage.getShowtimes());
    setBookings(CinemaStorage.getBookings());
    setSiteConfig(CinemaStorage.getSiteConfig());
    setCurrentPatron(CinemaStorage.getCurrentPatron());
  };

  useEffect(() => {
    refreshData();

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

  // Portal Navigation
  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminPortal(true);
  };

  const navigateToCustomerSite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminPortal(false);
    refreshData();
  };

  // Handlers
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setBookingStep('showtimes');
    setSelectedSeats([]);
  };

  const handleSelectShowtime = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setBookingStep('seats');
    setSelectedSeats([]);
  };

  const handleToggleSeat = (seatId: number) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert('Maximum of 8 seats per booking transaction.');
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
    setIsConcessionsOpen(true);
  };

  const handleProceedToCheckout = () => {
    setIsConcessionsOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBookingSuccess = (booking: Booking) => {
    setIsCheckoutOpen(false);
    setConfirmedBooking(booking);
    refreshData();
    // Reset booking selection
    setSelectedSeats([]);
    setSelectedConcessions([]);
    setBookingStep('catalog');
  };

  const handleSelectSessionFromSchedule = (movie: Movie, showtime: Showtime) => {
    setSelectedMovie(movie);
    setSelectedDate(showtime.date);
    setSelectedShowtime(showtime);
    setCurrentView('home');
    setBookingStep('seats');
    setSelectedSeats([]);
  };

  const handleLogoutPatron = () => {
    CinemaStorage.setCurrentPatron(null);
    setCurrentPatron(null);
  };

  // ==========================================
  // IF ON DEDICATED ADMIN PORTAL (/admin)
  // ==========================================
  if (isAdminPortal) {
    return (
      <AdminPortal
        showtimes={showtimes}
        movies={movies}
        onRefreshData={refreshData}
        onExitToCustomerSite={navigateToCustomerSite}
      />
    );
  }

  // ==========================================
  // CUSTOMER-FACING BOOKING APPLICATION (/)
  // Patron Bookings (Filtered strictly to logged-in user; 0 if signed out)
  const patronBookings = currentPatron
    ? bookings.filter(
        (b) =>
          b.userId === currentPatron.id ||
          b.customer.email.toLowerCase() === currentPatron.email.toLowerCase()
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#060608] text-zinc-100 font-sans selection:bg-[#C5A059] selection:text-black">
      {/* Global Patron Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'home') setBookingStep('catalog');
        }}
        onOpenMyTickets={() => setIsMyTicketsOpen(true)}
        bookingCount={patronBookings.length}
        currentPatron={currentPatron}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogoutPatron={handleLogoutPatron}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-8">
        {currentView === 'schedule' ? (
          /* Daily Master Schedule View */
          <ScheduleView
            movies={movies}
            showtimes={showtimes}
            onSelectSession={handleSelectSessionFromSchedule}
          />
        ) : (
          /* Customer Booking Workflow */
          <>
            {bookingStep === 'catalog' && (
              <MovieList
                movies={movies}
                onSelectMovie={handleSelectMovie}
                onOpenDetails={(movie) => setDetailsMovie(movie)}
                onSelectShowtimeQuick={() => setCurrentView('schedule')}
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
                onProceedToCheckout={handleProceedToConcessions}
                onBackToShowtimes={() => setBookingStep('showtimes')}
                onOpenOriginalChart={() => setIsOriginalChartOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer with Discreet Staff Portal Link */}
      <Footer
        siteConfig={siteConfig}
        onOpenSeatReference={() => setIsOriginalChartOpen(true)}
        onNavigateToAdmin={navigateToAdmin}
      />

      {/* MODALS */}
      {/* Patron Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentPatron(user);
          refreshData();
        }}
      />

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={detailsMovie}
        onClose={() => setDetailsMovie(null)}
        onSelectMovie={(movie) => {
          setDetailsMovie(null);
          handleSelectMovie(movie);
        }}
      />

      {/* Concessions Modal */}
      <ConcessionsModal
        isOpen={isConcessionsOpen}
        onClose={() => setIsConcessionsOpen(false)}
        selectedConcessions={selectedConcessions}
        onUpdateQuantity={handleUpdateConcessionQuantity}
        onProceed={handleProceedToCheckout}
        ticketSubtotal={
          (selectedShowtime?.price || siteConfig.ticketPrice) * selectedSeats.length
        }
        seatCount={selectedSeats.length}
      />

      {/* Checkout Modal */}
      {selectedMovie && selectedShowtime && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          movie={selectedMovie}
          showtime={selectedShowtime}
          selectedSeats={selectedSeats}
          concessions={selectedConcessions}
          onBookingSuccess={handleBookingSuccess}
          currentPatron={currentPatron}
        />
      )}

      {/* Confirmed E-Ticket Modal */}
      <TicketModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />

      {/* Patron My Tickets Modal */}
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

      {/* Original Scanned Seats.jpg Blueprint Modal */}
      <OriginalChartModal
        isOpen={isOriginalChartOpen}
        onClose={() => setIsOriginalChartOpen(false)}
      />
    </div>
  );
};

export default App;
