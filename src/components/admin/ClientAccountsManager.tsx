import React, { useState } from 'react';
import { User, Booking } from '../../types/cinema';
import { CinemaStorage } from '../../services/storage';
import { Users, Search, Key, Trash2, Check, X } from 'lucide-react';

interface ClientAccountsManagerProps {
  onRefreshData: () => void;
}

export const ClientAccountsManager: React.FC<ClientAccountsManagerProps> = ({ onRefreshData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatronBookings, setSelectedPatronBookings] = useState<{ patron: User; bookings: Booking[] } | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const users = CinemaStorage.getUsers().filter((u) => u.role === 'patron');
  const allBookings = CinemaStorage.getBookings();

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.phone.toLowerCase().includes(term)
    );
  });

  const getPatronStats = (patron: User) => {
    const bookings = allBookings.filter(
      (b) => b.userId === patron.id || b.customer.email.toLowerCase() === patron.email.toLowerCase()
    );
    const totalSpend = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      count: bookings.length,
      spend: totalSpend,
      bookings,
    };
  };

  const handleResetPassword = (patron: User) => {
    const newPass = prompt(`Enter new password for ${patron.name}:`);
    if (newPass && newPass.trim().length >= 4) {
      CinemaStorage.updateUser(patron.id, { password: newPass.trim() });
      setFeedbackMsg(`Password for ${patron.name} has been updated.`);
      onRefreshData();
      setTimeout(() => setFeedbackMsg(''), 3000);
    } else if (newPass !== null) {
      alert('Password must be at least 4 characters.');
    }
  };

  const handleDeleteUser = (patron: User) => {
    if (confirm(`Are you sure you want to delete patron account "${patron.name}" (${patron.email})?`)) {
      CinemaStorage.deleteUser(patron.id);
      setFeedbackMsg(`Patron account for ${patron.name} was removed.`);
      onRefreshData();
      setTimeout(() => setFeedbackMsg(''), 3000);
    }
  };

  const handleViewTickets = (patron: User) => {
    const { bookings } = getPatronStats(patron);
    setSelectedPatronBookings({ patron, bookings });
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header & Search */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] block">
            Auditorium Patron Directory
          </span>
          <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">
            Registered Client Accounts ({users.length})
          </h3>
          <p className="text-zinc-400 text-xs mt-1 font-light">
            Monitor patron accounts, ticket purchasing history, and manage credentials.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search patron name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-zinc-500"
          />
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center space-x-2">
          <Check className="w-3.5 h-3.5" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Patrons Table */}
      <div className="bg-[#0c0c10] border border-white/[0.08] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-zinc-950 text-zinc-400 text-[10px] uppercase tracking-wider">
              <th className="p-4">Patron Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Mobile</th>
              <th className="p-4 text-center">Bookings</th>
              <th className="p-4 text-right">Lifetime Spend</th>
              <th className="p-4 text-center">Registered</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((patron) => {
                const stats = getPatronStats(patron);
                const regDate = new Date(patron.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr key={patron.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{patron.name}</span>
                    </td>
                    <td className="p-4 text-zinc-300">{patron.email}</td>
                    <td className="p-4 text-zinc-400">{patron.phone}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleViewTickets(patron)}
                        className="px-2 py-0.5 bg-zinc-900 hover:bg-[#C5A059] hover:text-black border border-white/10 text-white font-bold transition-colors"
                      >
                        {stats.count} Tickets
                      </button>
                    </td>
                    <td className="p-4 text-right font-bold text-white">
                      ₱{stats.spend.toLocaleString()}
                    </td>
                    <td className="p-4 text-center text-zinc-400">{regDate}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleResetPassword(patron)}
                        className="p-1.5 border border-white/10 text-zinc-300 hover:text-white hover:border-white transition-colors"
                        title="Reset Patron Password"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(patron)}
                        className="p-1.5 border border-rose-900/40 text-rose-400 hover:bg-rose-950 transition-colors"
                        title="Delete Patron Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-400">
                  No patron accounts match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Patron Tickets Modal */}
      {selectedPatronBookings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0c0c10] border border-white/20 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] uppercase text-[#C5A059] block">Order History</span>
                <h4 className="font-display text-lg font-bold text-white uppercase">
                  {selectedPatronBookings.patron.name} ({selectedPatronBookings.patron.email})
                </h4>
              </div>
              <button
                onClick={() => setSelectedPatronBookings(null)}
                className="p-1.5 border border-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {selectedPatronBookings.bookings.length > 0 ? (
                selectedPatronBookings.bookings.map((b) => (
                  <div key={b.id} className="p-3 bg-zinc-950 border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{b.referenceCode}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.2 ${
                          b.status === 'confirmed' ? 'bg-emerald-950 text-emerald-400' :
                          b.status === 'checked-in' ? 'bg-blue-950 text-blue-400' : 'bg-rose-950 text-rose-400'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-zinc-300 font-bold mt-0.5">{b.movieTitle}</p>
                      <p className="text-zinc-400 text-[10px]">
                        {b.showtimeDate} • {b.showtimeTime} • Seats: {b.seats.join(', ')}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-white block">₱{b.totalAmount.toLocaleString()}</span>
                      <span className="text-zinc-400 text-[10px]">{b.paymentMethod}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center text-zinc-400">No bookings on record for this patron.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
