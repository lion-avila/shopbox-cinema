import { MapPin, Phone, Mail, Clock, Eye, ExternalLink } from 'lucide-react';
import { SiteConfig } from '../types/cinema';

interface FooterProps {
  onOpenSeatReference: () => void;
  onNavigateToAdmin?: () => void;
  siteConfig?: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSeatReference,
  onNavigateToAdmin,
  siteConfig,
}) => {
  const address = siteConfig?.cinemaAddress || '4/f Shopbox Bldg. San Jose, Virac, Catanduanes, Philippines, 4800';
  const phone = siteConfig?.cinemaPhone || '0938 592 4822';
  const email = siteConfig?.cinemaEmail || 'boxoffice@shopboxcinema.ph';
  const facebookUrl = siteConfig?.facebookUrl || 'https://www.facebook.com/profile.php?id=100088364273955';
  const openingHours = siteConfig?.openingHours || 'Open Daily: 10:30 AM - 11:30 PM';
  const ticketPrice = siteConfig?.ticketPrice || 350;

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
          <div>TICKETS: ₱{ticketPrice} ALL SEATS</div>
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
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span className="text-zinc-300">
                  {address}
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{openingHours}</span>
              </li>
              <li className="pl-6 text-[11px] text-zinc-500 font-mono">
                Doors open 30 minutes prior to scheduled showtimes.
              </li>
            </ul>
          </div>

          {/* Contact & Inquiries */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-300">
              Inquiries & Social
            </h4>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-zinc-200 transition-colors"
                >
                  {email}
                </a>
              </li>
              {facebookUrl && (
                <li className="pt-1">
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-zinc-300 hover:text-[#C5A059] transition-colors group"
                  >
                    <svg
                      className="w-4 h-4 fill-current shrink-0 text-[#C5A059] group-hover:text-[#E2C285] transition-colors"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-mono text-[11px] underline underline-offset-4 decoration-white/20 group-hover:decoration-[#C5A059]">
                      Facebook Page
                    </span>
                    <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-[#C5A059] transition-colors shrink-0" />
                  </a>
                </li>
              )}
              <li className="pt-2 text-[11px] text-zinc-500 font-mono">
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
