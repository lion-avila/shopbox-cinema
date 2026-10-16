export interface Movie {
  id: string;
  title: string;
  genre: string[];
  durationMin: number;
  rating: string; // e.g. 'PG-13', 'R-16', 'G'
  posterUrl: string;
  backdropUrl: string;
  synopsis: string;
  director: string;
  cast: string[];
  releaseDate: string;
  trailerUrl?: string;
  isNowShowing: boolean;
}

export type ExhibitionFormat = '4K Laser' | 'Dolby Atmos 7.1' | "Director's Cut";

export interface Showtime {
  id: string;
  movieId: string;
  date: string; // YYYY-MM-DD
  time: string; // "11:30 AM", "02:15 PM", etc.
  price: number; // 350 PHP
  hall: string; // "Hall 1 (Main Theater)"
  format?: ExhibitionFormat;
}

export type SeatStatus = 'available' | 'selected' | 'reserved' | 'blocked';
export type SeatCategory = 'standard' | 'wheelchair' | 'companion' | 'vip';

export interface TheaterSeat {
  id: number; // 1 to 72 matching Seats.jpg
  row: number; // 1 to 9 (or Row A to I)
  rowLabel: string; // A through I
  col: number; // 1 to 8
  block: 'left' | 'right'; // Left (1-4) or Right (5-8)
  category?: SeatCategory;
}

export interface ConcessionItem {
  id: string;
  name: string;
  description: string;
  category: 'popcorn' | 'drink' | 'combo' | 'snack';
  price: number;
  imageUrl: string;
}

export interface SelectedConcession {
  item: ConcessionItem;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // stored hashed or plain for local demo
  role: 'patron' | 'admin' | 'staff';
  createdAt: string;
}

export interface SiteConfig {
  featuredMovieId: string;
  heroHeadline: string;
  heroSubtitle: string;
  announcementText: string;
  ticketPrice: number; // global ticket price in PHP
  cinemaAddress: string;
  cinemaPhone: string;
  cinemaEmail: string;
  facebookUrl?: string;
  openingHours: string;
  adminSecurityKey: string; // Master Key required to sign up new admin
}

export interface Booking {
  id: string;
  referenceCode: string; // e.g. SBC-82914
  userId?: string; // linked patron account if logged in
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  showtimeId: string;
  showtimeDate: string;
  showtimeTime: string;
  hall: string;
  seats: number[]; // e.g. [21, 22]
  ticketPrice: number;
  customer: CustomerInfo;
  concessions: SelectedConcession[];
  totalAmount: number;
  paymentMethod: 'GCash' | 'Maya' | 'Credit/Debit Card' | 'Cash at Box Office';
  paymentStatus: 'paid' | 'pending';
  status: 'confirmed' | 'checked-in' | 'cancelled';
  createdAt: string;
  checkedInAt?: string;
  cancelledAt?: string;
}
