import { Movie, Showtime, TheaterSeat, ConcessionItem, Booking, User, SiteConfig } from '../types/cinema';

const STORAGE_KEYS = {
  MOVIES: 'shopbox_cinema_movies_v1',
  SHOWTIMES: 'shopbox_cinema_showtimes_v1',
  BOOKINGS: 'shopbox_cinema_bookings_v1',
  BLOCKED_SEATS: 'shopbox_cinema_blocked_seats_v1',
  USERS: 'shopbox_cinema_users_v2',
  CURRENT_PATRON: 'shopbox_cinema_patron_session_v2',
  CURRENT_ADMIN: 'shopbox_cinema_admin_session_v2',
  SITE_CONFIG: 'shopbox_cinema_config_v2',
  CONCESSIONS: 'shopbox_cinema_concessions_v2',
};

// Generate the 72 seats matching Seats.jpg with accessible and companion designations
export const THEATER_SEATS: TheaterSeat[] = (() => {
  const seats: TheaterSeat[] = [];
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  let seatNumber = 1;

  for (let r = 1; r <= 9; r++) {
    const rowLabel = rowLabels[r - 1];
    for (let c = 1; c <= 8; c++) {
      let category: TheaterSeat['category'] = 'standard';
      // Front row (Row A): Seats 1 & 8 wheelchair accessible, 2 & 7 companion
      if (r === 1) {
        if (c === 1 || c === 8) category = 'wheelchair';
        else if (c === 2 || c === 7) category = 'companion';
      }
      // Back row (Row I center): VIP couples
      else if (r === 9 && (c === 4 || c === 5)) {
        category = 'vip';
      }

      seats.push({
        id: seatNumber,
        row: r,
        rowLabel,
        col: c,
        block: c <= 4 ? 'left' : 'right',
        category,
      });
      seatNumber++;
    }
  }
  return seats;
})();

export const INITIAL_CONCESSIONS: ConcessionItem[] = [
  {
    id: 'c1',
    name: 'Shopbox Duo Combo',
    description: '1 Jumbo Popcorn (Butter or Caramel) + 2 Large Sodas (32oz)',
    category: 'combo',
    price: 320,
    imageUrl: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'c2',
    name: 'Cinema Solo Combo',
    description: '1 Large Popcorn + 1 Large Drink of your choice',
    category: 'combo',
    price: 240,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'c3',
    name: 'Classic Butter Popcorn (Large)',
    description: 'Freshly popped warm theater corn drenched in real butter',
    category: 'popcorn',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'c4',
    name: 'Gourmet Caramel Popcorn (Large)',
    description: 'Crispy sweet golden caramel glazed gourmet popcorn',
    category: 'popcorn',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'c5',
    name: 'Cheddar Cheese Popcorn (Large)',
    description: 'Savory rich cheddar cheese dust tossed fresh',
    category: 'popcorn',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1628172945281-70e28fbeeb4a?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'c6',
    name: 'Coca-Cola Fountain Drink (32oz)',
    description: 'Ice-cold refreshing Coca-Cola Original or Zero Sugar',
    category: 'drink',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'c7',
    name: 'Nachos Supreme with Warm Cheese',
    description: 'Crisp tortilla chips served with melted cheese and jalapeño salsa',
    category: 'snack',
    price: 190,
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&auto=format&fit=crop&q=60',
  },
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'mov-1',
    title: 'Dune: Part Two',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    durationMin: 166,
    rating: 'PG-13',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200SV.jpg',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    releaseDate: '2024-03-01',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    isNowShowing: true,
  },
  {
    id: 'mov-2',
    title: 'Interstellar: 10th Anniversary',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    durationMin: 169,
    rating: 'PG-13',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/rAiYTnrLEhk9T21qpmzqsd2v9zR.jpg',
    synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    releaseDate: '2014-11-07',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    isNowShowing: true,
  },
  {
    id: 'mov-3',
    title: 'Oppenheimer',
    genre: ['Biography', 'Drama', 'History'],
    durationMin: 180,
    rating: 'R-16',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    releaseDate: '2023-07-21',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    isNowShowing: true,
  },
  {
    id: 'mov-4',
    title: 'Inside Out 2',
    genre: ['Animation', 'Family', 'Comedy'],
    durationMin: 96,
    rating: 'G',
    posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xg270vgDCv4z43zQ79383637482.jpg',
    synopsis: "Teenager Riley's mind headquarters undergoes a sudden demolition to make room for unexpected new Emotions: Anxiety, Envy, Ennui, and Embarrassment.",
    director: 'Kelsey Mann',
    cast: ['Amy Poehler', 'Maya Hawke', 'Kensington Tallman', 'Liza Lapira'],
    releaseDate: '2024-06-14',
    trailerUrl: 'https://www.youtube.com/watch?v=LEjhY15eCx0',
    isNowShowing: true,
  },
  {
    id: 'mov-5',
    title: 'Spider-Man: Beyond the Spider-Verse',
    genre: ['Animation', 'Action', 'Adventure'],
    durationMin: 135,
    rating: 'PG',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    synopsis: 'The thrilling continuation of Miles Morales across the multiverse, facing down fate itself to save the people he loves most.',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    releaseDate: '2025-05-15',
    isNowShowing: false,
  },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  featuredMovieId: 'mov-1',
  heroHeadline: 'Exhibition in Hall 01',
  heroSubtitle: 'An intimate single-screen cinema experience with 4K laser projection and Dolby Atmos sound.',
  announcementText: 'Doors open 30 minutes prior to showtime • General admission ₱350 for all 72 seats',
  ticketPrice: 350,
  cinemaAddress: '4/f Shopbox Bldg. San Jose, Virac, Catanduanes, Philippines, 4800',
  cinemaPhone: '0938 592 4822',
  cinemaEmail: 'boxoffice@shopboxcinema.ph',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100088364273955',
  openingHours: 'Open Daily: 10:30 AM - 11:30 PM',
  adminSecurityKey: 'SHOPBOX-ADMIN-2026',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Auditorium Director',
    email: 'admin@shopboxcinema.ph',
    phone: '+63 917 888 0000',
    password: 'admin2026!',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-patron-1',
    name: 'Maria Santos',
    email: 'maria.santos@gmail.com',
    phone: '+63 917 123 4567',
    password: 'patron123',
    role: 'patron',
    createdAt: new Date().toISOString(),
  },
];

export function getFormattedDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateDefaultShowtimes(ticketPrice = 350): Showtime[] {
  const showtimes: Showtime[] = [];
  const times: Array<{ time: string; movieId: string; format: Showtime['format'] }> = [
    { time: '11:00 AM', movieId: 'mov-4', format: 'Dolby Atmos 7.1' },
    { time: '02:00 PM', movieId: 'mov-1', format: '4K Laser' },
    { time: '05:45 PM', movieId: 'mov-2', format: '4K Laser' },
    { time: '09:15 PM', movieId: 'mov-3', format: "Director's Cut" },
  ];

  for (let i = 0; i < 7; i++) {
    const dateStr = getFormattedDate(i);
    times.forEach((slot, index) => {
      showtimes.push({
        id: `st-${dateStr}-${index + 1}`,
        movieId: slot.movieId,
        date: dateStr,
        time: slot.time,
        price: ticketPrice,
        hall: 'Hall 1 (Main Theater)',
        format: slot.format,
      });
    });
  }
  return showtimes;
}

function generateDefaultBookings(showtimes: Showtime[]): Booking[] {
  if (showtimes.length === 0) return [];
  const first = showtimes[0];
  const second = showtimes[1];

  return [
    {
      id: 'b-init-1',
      referenceCode: 'SBC-98124',
      userId: 'usr-patron-1',
      movieId: first.movieId,
      movieTitle: 'Inside Out 2',
      moviePoster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      showtimeId: first.id,
      showtimeDate: first.date,
      showtimeTime: first.time,
      hall: 'Hall 1 (Main Theater)',
      seats: [21, 22, 23],
      ticketPrice: 350,
      customer: {
        name: 'Maria Santos',
        email: 'maria.santos@gmail.com',
        phone: '+63 917 123 4567',
      },
      concessions: [{ item: INITIAL_CONCESSIONS[0], quantity: 1 }],
      totalAmount: 350 * 3 + 320,
      paymentMethod: 'GCash',
      paymentStatus: 'paid',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'b-init-2',
      referenceCode: 'SBC-73619',
      movieId: second.movieId,
      movieTitle: 'Dune: Part Two',
      moviePoster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      showtimeId: second.id,
      showtimeDate: second.date,
      showtimeTime: second.time,
      hall: 'Hall 1 (Main Theater)',
      seats: [37, 38],
      ticketPrice: 350,
      customer: {
        name: 'Juan Dela Cruz',
        email: 'juan.delacruz@outlook.com',
        phone: '+63 928 987 6543',
      },
      concessions: [
        { item: INITIAL_CONCESSIONS[2], quantity: 2 },
        { item: INITIAL_CONCESSIONS[5], quantity: 2 },
      ],
      totalAmount: 350 * 2 + 160 * 2 + 90 * 2,
      paymentMethod: 'Maya',
      paymentStatus: 'paid',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  ];
}

export const CinemaStorage = {
  // Site Configuration & CMS
  getSiteConfig(): SiteConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.SITE_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(DEFAULT_SITE_CONFIG));
      return DEFAULT_SITE_CONFIG;
    }
    try {
      const parsed = JSON.parse(raw);
      // Migrate if old placeholder address was stored in user's browser
      if (!parsed.facebookUrl || (parsed.cinemaAddress && parsed.cinemaAddress.includes('Metro Manila'))) {
        const updated: SiteConfig = {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          cinemaAddress: (!parsed.cinemaAddress || parsed.cinemaAddress.includes('Metro Manila'))
            ? DEFAULT_SITE_CONFIG.cinemaAddress
            : parsed.cinemaAddress,
          cinemaPhone: (!parsed.cinemaPhone || parsed.cinemaPhone.includes('8888-SHOP'))
            ? DEFAULT_SITE_CONFIG.cinemaPhone
            : parsed.cinemaPhone,
          facebookUrl: parsed.facebookUrl || DEFAULT_SITE_CONFIG.facebookUrl,
        };
        localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(updated));
        return updated;
      }
      return { ...DEFAULT_SITE_CONFIG, ...parsed };
    } catch {
      return DEFAULT_SITE_CONFIG;
    }
  },

  saveSiteConfig(config: SiteConfig) {
    localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(config));
  },

  // User Accounts
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  registerUser(user: Omit<User, 'id' | 'createdAt'>): { success: boolean; message?: string; user?: User } {
    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return { success: true, user: newUser };
  },

  authenticateUser(email: string, password: string, requiredRole?: 'patron' | 'admin'): { success: boolean; message?: string; user?: User } {
    const users = this.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, message: 'Invalid email address or password.' };
    }

    if (requiredRole === 'admin' && found.role !== 'admin' && found.role !== 'staff') {
      return { success: false, message: 'Unauthorized: This account does not possess administrative credentials.' };
    }

    return { success: true, user: found };
  },

  getCurrentPatron(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_PATRON);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentPatron(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PATRON, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PATRON);
    }
  },

  getCurrentAdmin(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentAdmin(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    }
  },

  updateUser(userId: string, updates: Partial<User>) {
    const users = this.getUsers().map((u) => (u.id === userId ? { ...u, ...updates } : u));
    this.saveUsers(users);

    const currentPatron = this.getCurrentPatron();
    if (currentPatron?.id === userId) {
      this.setCurrentPatron({ ...currentPatron, ...updates });
    }
    const currentAdmin = this.getCurrentAdmin();
    if (currentAdmin?.id === userId) {
      this.setCurrentAdmin({ ...currentAdmin, ...updates });
    }
  },

  deleteUser(userId: string) {
    const users = this.getUsers().filter((u) => u.id !== userId);
    this.saveUsers(users);
  },

  // Movies
  getMovies(): Movie[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MOVIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
      return INITIAL_MOVIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MOVIES;
    }
  },

  saveMovies(movies: Movie[]) {
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  },

  // Showtimes
  getShowtimes(): Showtime[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SHOWTIMES);
    if (!raw) {
      const config = this.getSiteConfig();
      const defaults = generateDefaultShowtimes(config.ticketPrice);
      localStorage.setItem(STORAGE_KEYS.SHOWTIMES, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch {
      const config = this.getSiteConfig();
      return generateDefaultShowtimes(config.ticketPrice);
    }
  },

  saveShowtimes(showtimes: Showtime[]) {
    localStorage.setItem(STORAGE_KEYS.SHOWTIMES, JSON.stringify(showtimes));
  },

  // Concessions
  getConcessions(): ConcessionItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONCESSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONCESSIONS, JSON.stringify(INITIAL_CONCESSIONS));
      return INITIAL_CONCESSIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CONCESSIONS;
    }
  },

  saveConcessions(items: ConcessionItem[]) {
    localStorage.setItem(STORAGE_KEYS.CONCESSIONS, JSON.stringify(items));
  },

  // Bookings
  getBookings(): Booking[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      const showtimes = this.getShowtimes();
      const defaults = generateDefaultBookings(showtimes);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveBooking(booking: Booking) {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  updateBookingStatus(referenceCode: string, status: 'confirmed' | 'checked-in' | 'cancelled'): boolean {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.referenceCode.toUpperCase() === referenceCode.toUpperCase());
    if (index !== -1) {
      bookings[index].status = status;
      if (status === 'checked-in') {
        bookings[index].checkedInAt = new Date().toISOString();
      } else if (status === 'cancelled') {
        bookings[index].cancelledAt = new Date().toISOString();
      }
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      return true;
    }
    return false;
  },

  cancelBooking(referenceCode: string): boolean {
    return this.updateBookingStatus(referenceCode, 'cancelled');
  },

  deleteBooking(referenceCode: string) {
    const bookings = this.getBookings().filter(
      (b) => b.referenceCode.toUpperCase() !== referenceCode.toUpperCase()
    );
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  // Blocked / House Hold Seats
  getBlockedSeats(): Record<string, number[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOCKED_SEATS);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },

  toggleBlockedSeat(showtimeId: string, seatId: number): boolean {
    const blockedMap = this.getBlockedSeats();
    const current = blockedMap[showtimeId] || [];
    let isNowBlocked = false;

    if (current.includes(seatId)) {
      blockedMap[showtimeId] = current.filter(id => id !== seatId);
      isNowBlocked = false;
    } else {
      blockedMap[showtimeId] = [...current, seatId];
      isNowBlocked = true;
    }

    localStorage.setItem(STORAGE_KEYS.BLOCKED_SEATS, JSON.stringify(blockedMap));
    return isNowBlocked;
  },

  // Returns occupied seats (cancelled bookings do not count)
  getOccupiedSeatsForShowtime(showtimeId: string): { booked: number[]; blocked: number[] } {
    const bookings = this.getBookings().filter(b => b.showtimeId === showtimeId && b.status !== 'cancelled');
    const bookedSeats = bookings.flatMap(b => b.seats);
    const blockedMap = this.getBlockedSeats();
    const blockedSeats = blockedMap[showtimeId] || [];

    return {
      booked: Array.from(new Set(bookedSeats)),
      blocked: Array.from(new Set(blockedSeats)),
    };
  },

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.MOVIES);
    localStorage.removeItem(STORAGE_KEYS.SHOWTIMES);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.BLOCKED_SEATS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PATRON);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    localStorage.removeItem(STORAGE_KEYS.SITE_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.CONCESSIONS);
    window.location.reload();
  },
};

/**
 * Validates that the patron's current seat selection does not leave an isolated single empty seat (orphan gap)
 * in any row or wing block next to their newly selected seats.
 */
export function validateOrphanSeatGap(
  selectedIds: number[],
  bookedIds: number[],
  blockedIds: number[]
): { hasGap: boolean; orphanSeat?: TheaterSeat; message?: string } {
  if (selectedIds.length === 0) return { hasGap: false };

  const occupiedSet = new Set([...bookedIds, ...blockedIds, ...selectedIds]);
  const previouslyOccupiedSet = new Set([...bookedIds, ...blockedIds]);

  for (const seat of THEATER_SEATS) {
    // Check if this seat is currently available (not selected and not previously booked/blocked)
    if (!occupiedSet.has(seat.id)) {
      // Find its adjacent neighbor(s) within the same block (Left: 1-4, Right: 5-8)
      const sameBlockSeats = THEATER_SEATS.filter(
        (s) => s.row === seat.row && s.block === seat.block
      );
      
      const leftNeighbor = sameBlockSeats.find((s) => s.col === seat.col - 1);
      const rightNeighbor = sameBlockSeats.find((s) => s.col === seat.col + 1);

      const isLeftOccupied = !leftNeighbor || occupiedSet.has(leftNeighbor.id);
      const isRightOccupied = !rightNeighbor || occupiedSet.has(rightNeighbor.id);

      // It is an orphan gap if both adjacent sides in the block are occupied
      if (isLeftOccupied && isRightOccupied) {
        // Was it already an orphan before the user's selection?
        const wasLeftOccupied = !leftNeighbor || previouslyOccupiedSet.has(leftNeighbor.id);
        const wasRightOccupied = !rightNeighbor || previouslyOccupiedSet.has(rightNeighbor.id);

        if (!(wasLeftOccupied && wasRightOccupied)) {
          // This orphan was created directly by the user's selection!
          return {
            hasGap: true,
            orphanSeat: seat,
            message: `Seat ${seat.rowLabel}${seat.col} (Seat #${seat.id}) would be left as an isolated single seat. Please choose adjacent seats.`,
          };
        }
      }
    }
  }

  return { hasGap: false };
}

