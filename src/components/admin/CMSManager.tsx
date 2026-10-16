import React, { useState } from 'react';
import { Movie, SiteConfig } from '../../types/cinema';
import { CinemaStorage } from '../../services/storage';
import { Sparkles, Save, Check, DollarSign, MapPin } from 'lucide-react';

interface CMSManagerProps {
  movies: Movie[];
  onRefreshData: () => void;
}

export const CMSManager: React.FC<CMSManagerProps> = ({ movies, onRefreshData }) => {
  const [config, setConfig] = useState<SiteConfig>(CinemaStorage.getSiteConfig());
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    CinemaStorage.saveSiteConfig(config);
    onRefreshData();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl font-mono text-xs">
      {/* Top Banner Notice */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] block">
            Content Management System
          </span>
          <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">
            Hero Section, Global Pricing & Cinema Info
          </h3>
          <p className="text-zinc-400 text-xs mt-1 font-light">
            Changes made here take effect immediately across the public booking site.
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold uppercase tracking-widest flex items-center space-x-2 transition-all active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>Site configuration and pricing updated successfully!</span>
        </div>
      )}

      {/* Hero Section Configuration */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] space-y-5">
        <h4 className="font-bold uppercase tracking-wider text-white text-sm flex items-center space-x-2 border-b border-white/[0.06] pb-3">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Hero Section Settings</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">
              Featured Film in Hero Spotlight
            </label>
            <select
              value={config.featuredMovieId}
              onChange={(e) => setConfig({ ...config, featuredMovieId: e.target.value })}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            >
              {movies.map((m) => (
                <option key={m.id} value={m.id} className="bg-zinc-950 text-white">
                  {m.title} ({m.rating} • {m.durationMin} mins)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">
              Custom Hero Headline
            </label>
            <input
              type="text"
              required
              value={config.heroHeadline}
              onChange={(e) => setConfig({ ...config, heroHeadline: e.target.value })}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">
              Announcement Banner Text
            </label>
            <input
              type="text"
              value={config.announcementText}
              onChange={(e) => setConfig({ ...config, announcementText: e.target.value })}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">
              Hero Subtitle / Description Override
            </label>
            <textarea
              rows={2}
              value={config.heroSubtitle}
              onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>
      </div>

      {/* Global Ticket Pricing */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] space-y-4">
        <h4 className="font-bold uppercase tracking-wider text-white text-sm flex items-center space-x-2 border-b border-white/[0.06] pb-3">
          <DollarSign className="w-4 h-4 text-[#C5A059]" />
          <span>General Admission Ticket Price</span>
        </h4>

        <div className="max-w-xs space-y-2">
          <label className="text-zinc-400 uppercase text-[10px] block">
            Flat Rate Ticket Price (Philippine Peso ₱)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₱</span>
            <input
              type="number"
              min={100}
              max={2000}
              required
              value={config.ticketPrice}
              onChange={(e) => setConfig({ ...config, ticketPrice: Number(e.target.value) })}
              className="w-full pl-8 pr-3 py-2.5 bg-zinc-950 border border-white/10 text-white text-base font-bold focus:outline-none focus:border-zinc-500"
            />
          </div>
          <p className="text-[11px] text-zinc-400 font-light">
            This applies as the standard general admission fee across all 72 seats in Hall 01.
          </p>
        </div>
      </div>

      {/* Cinema Information & Hours */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] space-y-4">
        <h4 className="font-bold uppercase tracking-wider text-white text-sm flex items-center space-x-2 border-b border-white/[0.06] pb-3">
          <MapPin className="w-4 h-4 text-[#C5A059]" />
          <span>Cinema Location & Inquiries</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">
              Auditorium Location Address
            </label>
            <input
              type="text"
              value={config.cinemaAddress}
              onChange={(e) => setConfig({ ...config, cinemaAddress: e.target.value })}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">
              Box Office Phone Number
            </label>
            <input
              type="text"
              value={config.cinemaPhone}
              onChange={(e) => setConfig({ ...config, cinemaPhone: e.target.value })}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">
              Contact / Inquiries Email
            </label>
            <input
              type="email"
              value={config.cinemaEmail}
              onChange={(e) => setConfig({ ...config, cinemaEmail: e.target.value })}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">
              Auditorium Operating Hours
            </label>
            <input
              type="text"
              value={config.openingHours}
              onChange={(e) => setConfig({ ...config, openingHours: e.target.value })}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">
              Official Facebook Page URL
            </label>
            <input
              type="url"
              placeholder="https://www.facebook.com/..."
              value={config.facebookUrl || ''}
              onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500 font-mono text-xs"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
