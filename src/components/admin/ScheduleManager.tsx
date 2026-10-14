import React, { useState } from 'react';
import { Showtime, Movie } from '../../types/cinema';
import { CinemaStorage, getFormattedDate } from '../../services/storage';
import { Calendar, Plus, Trash2, AlertCircle, Check } from 'lucide-react';

interface ScheduleManagerProps {
  showtimes: Showtime[];
  movies: Movie[];
  onRefreshData: () => void;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  showtimes,
  movies,
  onRefreshData,
}) => {
  const [selectedMovieId, setSelectedMovieId] = useState<string>(movies[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate(0));
  const [timeInput, setTimeInput] = useState<string>('01:30 PM');
  const [priceInput, setPriceInput] = useState<number>(350);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleAddShowtime = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Check for overlap on same date and time in Hall 1
    const conflict = showtimes.find(
      (st) => st.date === selectedDate && st.time.trim() === timeInput.trim()
    );

    if (conflict) {
      const conflictMovie = movies.find((m) => m.id === conflict.movieId);
      setErrorMsg(
        `Conflict: Hall 01 is already playing "${conflictMovie?.title}" on ${selectedDate} at ${timeInput}. Shopbox only has 1 theater room!`
      );
      return;
    }

    const newShowtime: Showtime = {
      id: `st-${selectedDate}-${Date.now()}`,
      movieId: selectedMovieId,
      date: selectedDate,
      time: timeInput.trim(),
      price: priceInput,
      hall: 'Hall 1 (Main Theater)',
    };

    const updated = [...showtimes, newShowtime];
    CinemaStorage.saveShowtimes(updated);
    onRefreshData();
    setSuccessMsg('Session successfully scheduled in Hall 01.');

    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteShowtime = (id: string) => {
    if (confirm('Delete this exhibition session from the schedule?')) {
      const updated = showtimes.filter((st) => st.id !== id);
      CinemaStorage.saveShowtimes(updated);
      onRefreshData();
    }
  };

  // Group showtimes by date
  const groupedShowtimes = showtimes.reduce<Record<string, Showtime[]>>((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedShowtimes).sort();

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Add Showtime Form */}
      <div className="p-6 sm:p-8 bg-[#0c0c10] border border-white/[0.08] space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-zinc-900 border border-white/10 text-white flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">
              Schedule New Exhibition Session (Hall 01)
            </h3>
            <p className="text-zinc-400 text-[11px]">
              Single auditorium operations: ensure screenings do not conflict.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddShowtime} className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="text-zinc-400 uppercase tracking-wider text-[10px] mb-1 block">Film</label>
            <select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-zinc-500"
            >
              {movies.map((m) => (
                <option key={m.id} value={m.id} className="bg-zinc-950 text-white">
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-zinc-400 uppercase tracking-wider text-[10px] mb-1 block">Date</label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 uppercase tracking-wider text-[10px] mb-1 block">Time Slot</label>
            <input
              type="text"
              required
              placeholder="e.g. 03:30 PM"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 uppercase tracking-wider text-[10px] mb-1 block">Ticket Price (PHP)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                required
                value={priceInput}
                onChange={(e) => setPriceInput(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-zinc-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold uppercase tracking-wider text-xs shrink-0 transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        </form>

        {errorMsg && (
          <div className="flex items-center space-x-2 p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center space-x-2 p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Showtimes List Grouped by Date */}
      <div className="space-y-6">
        <h3 className="font-bold uppercase tracking-[0.2em] text-zinc-300 text-xs">
          Auditorium 01 Master Schedule
        </h3>

        {sortedDates.map((dateStr) => {
          const sessions = groupedShowtimes[dateStr];

          return (
            <div
              key={dateStr}
              className="p-5 bg-[#0c0c10] border border-white/[0.08] space-y-3"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="font-bold text-white text-xs flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{dateStr}</span>
                </span>
                <span className="text-zinc-400 text-[11px]">
                  {sessions.length} Session{sessions.length > 1 ? 's' : ''} in Hall 01
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sessions.map((st) => {
                  const movie = movies.find((m) => m.id === st.movieId);

                  return (
                    <div
                      key={st.id}
                      className="p-3 bg-zinc-950 border border-white/[0.06] flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-bold text-white text-xs block truncate max-w-[180px]">
                          {movie?.title || 'Unknown Film'}
                        </span>
                        <div className="flex items-center space-x-2 text-[11px] text-zinc-400 mt-0.5">
                          <span className="text-[#C5A059] font-bold">{st.time}</span>
                          <span>•</span>
                          <span>₱{st.price}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteShowtime(st.id)}
                        className="p-1.5 border border-rose-900/40 text-rose-400 hover:bg-rose-950 transition-colors"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
