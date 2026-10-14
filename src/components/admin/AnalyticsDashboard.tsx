import React from 'react';
import { Movie } from '../../types/cinema';
import { CinemaStorage } from '../../services/storage';
import { TrendingUp } from 'lucide-react';

interface AnalyticsDashboardProps {
  movies: Movie[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ movies }) => {
  const bookings = CinemaStorage.getBookings().filter((b) => b.status !== 'cancelled');
  const showtimes = CinemaStorage.getShowtimes();

  // Metrics
  const totalTicketsSold = bookings.reduce((sum, b) => sum + b.seats.length, 0);
  const ticketRevenue = bookings.reduce((sum, b) => sum + b.seats.length * b.ticketPrice, 0);
  const concessionsRevenue = bookings.reduce((sum, b) => {
    const concTotal = b.concessions.reduce((cSum, c) => cSum + c.item.price * c.quantity, 0);
    return sum + concTotal;
  }, 0);
  const totalGrossRevenue = ticketRevenue + concessionsRevenue;

  // Occupancy rate calculation (total capacity = showtimes count * 72)
  const totalCapacity = showtimes.length * 72;
  const occupancyRate = totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;

  // Movie performance leaderboard
  const movieStats = movies.map((movie) => {
    const movieBookings = bookings.filter((b) => b.movieId === movie.id);
    const ticketsCount = movieBookings.reduce((sum, b) => sum + b.seats.length, 0);
    const revenue = movieBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      movie,
      ticketsCount,
      revenue,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Payment method breakdown
  const paymentCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.paymentMethod] = (acc[b.paymentMethod] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#0c0c10] border border-white/[0.08] flex flex-col justify-between space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">Total Gross Revenue</span>
          <div className="flex items-baseline space-x-1">
            <span className="font-display text-3xl font-extrabold text-[#C5A059]">
              ₱{totalGrossRevenue.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400">Box Office + Concessions</span>
        </div>

        <div className="p-5 bg-[#0c0c10] border border-white/[0.08] flex flex-col justify-between space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">Tickets Issued</span>
          <div className="flex items-baseline space-x-1">
            <span className="font-display text-3xl font-extrabold text-white">
              {totalTicketsSold}
            </span>
            <span className="text-zinc-400 text-xs">seats</span>
          </div>
          <span className="text-[10px] text-emerald-400">₱{ticketRevenue.toLocaleString()} Ticket Gross</span>
        </div>

        <div className="p-5 bg-[#0c0c10] border border-white/[0.08] flex flex-col justify-between space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">Snacks & Concessions</span>
          <div className="flex items-baseline space-x-1">
            <span className="font-display text-3xl font-extrabold text-white">
              ₱{concessionsRevenue.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400">Bar & snacks upsell total</span>
        </div>

        <div className="p-5 bg-[#0c0c10] border border-white/[0.08] flex flex-col justify-between space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">Auditorium Occupancy</span>
          <div className="flex items-baseline space-x-1">
            <span className="font-display text-3xl font-extrabold text-white">
              {occupancyRate}%
            </span>
          </div>
          <span className="text-[10px] text-zinc-400">Across {showtimes.length} sessions (72 seats/hall)</span>
        </div>
      </div>

      {/* Top Movies & Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Grossing Movies */}
        <div className="lg:col-span-2 p-6 bg-[#0c0c10] border border-white/[0.08] space-y-4">
          <h4 className="font-bold uppercase tracking-wider text-white text-sm flex items-center space-x-2 border-b border-white/[0.06] pb-3">
            <TrendingUp className="w-4 h-4 text-[#C5A059]" />
            <span>Film Exhibition Leaderboard</span>
          </h4>

          <div className="space-y-3">
            {movieStats.map((item, idx) => (
              <div key={item.movie.id} className="p-3 bg-zinc-950 border border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-zinc-500 w-4">#{idx + 1}</span>
                  <div className="w-8 h-12 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden">
                    <img src={item.movie.posterUrl} alt={item.movie.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white truncate max-w-xs">{item.movie.title}</h5>
                    <p className="text-zinc-400 text-[10px]">{item.ticketsCount} seats reserved</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#C5A059] block">₱{item.revenue.toLocaleString()}</span>
                  <span className="text-zinc-500 text-[9px] uppercase">Box Office Total</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channels */}
        <div className="p-6 bg-[#0c0c10] border border-white/[0.08] space-y-4">
          <h4 className="font-bold uppercase tracking-wider text-white text-sm border-b border-white/[0.06] pb-3">
            Payment Channels
          </h4>

          <div className="space-y-3">
            {Object.entries(paymentCounts).map(([method, count]) => (
              <div key={method} className="p-3 bg-zinc-950 border border-white/[0.04] flex items-center justify-between">
                <span className="font-bold text-white">{method}</span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-white/10 text-zinc-300 font-bold">
                  {count} transaction{count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
