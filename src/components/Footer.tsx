import { MapPin, Phone, Mail, Clock, Eye } from 'lucide-react';

interface FooterProps {
  onOpenSeatReference: () => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSeatReference, onNavigateToAdmin }) => {
  return (
    <footer className="bg-[#050507] border-t border-white/[0.08] mt-32 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Technical Specs Ribbon */}
        <div className="pb-12 mb-12 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-6 text-xs font-mono text-zinc-400">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            <span className="text-zinc-300">HALL 01 AUDITORIUM</span>
          </div>
          <div>PROJECTION: 4K DCI LASER</div>
          <div>AUDIO: DOLBY ATMOS 7.1 SURROUND</div>
          <div>CAPACITY: EXACTLY 72 RESERVED SEATS</div>
          <div>TICKETS: ₱350 ALL SEATS</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/15 p-1.5 flex items-center justify-center">
                <img
                  src="/assets/logo-white.svg"
                  alt="Shopbox Cinema"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display text-base font-extrabold tracking-[0.2em] text-white uppercase">
                Shopbox Cinema
              </span>
            </div>

            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              An independent, single-auditorium cinema committed to pristine projection,
              immersive acoustics, and an intimate screening culture. Limited to 72 seats per presentation.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenSeatReference}
                className="inline-flex items-center space-x-2 text-xs font-mono text-[#C5A059] hover:text-[#E2C285] transition-colors border-b border-[#C5A059]/40 pb-0.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Original 72-Seat Architectural Sheet (Seats.jpg)</span>
              </button>
            </div>
          </div>

          {/* Location & Box Office */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-300">
              Box Office & Location
            </h4>
            <ul className="space-y-3 text-xs leading-relaxed text-zinc-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>Shopbox Center, Level 1 Auditorium<br />Metro Manila, Philippines</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Doors Open 30 Minutes Prior to Showtime</span>
              </li>
            </ul>
          </div>

          {/* Contact & Inquiries */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-300">
              Inquiries
            </h4>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>+63 (2) 8888-SHOP</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>boxoffice@shopboxcinema.ph</span>
              </li>
              <li className="pt-2 text-[11px] text-zinc-400 font-mono">
                Private theater buyouts available upon request.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} Shopbox Cinema. All rights reserved.</p>
          <div className="flex items-center space-x-6 font-mono text-[11px] text-zinc-400">
            <span>Independent Film Exhibition Platform</span>
            <span>•</span>
            <button
              onClick={onNavigateToAdmin}
              className="text-zinc-400 hover:text-zinc-200 uppercase transition-colors"
            >
              Staff Portal Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
