import React from 'react';
import { MapPin, Phone, Mail, Clock, Eye, ExternalLink, Shield } from 'lucide-react';
import { SiteConfig } from '../types/cinema';
import { BrandLogo } from '../context/ThemeContext';

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
  const address =
    siteConfig?.cinemaAddress ||
    '4/f Shopbox Bldg. San Jose, Virac, Catanduanes, Philippines, 4800';
  const phone = siteConfig?.cinemaPhone || '0938 592 4822';
  const email = siteConfig?.cinemaEmail || 'boxoffice@shopboxcinema.ph';
  const facebookUrl =
    siteConfig?.facebookUrl || 'https://www.facebook.com/profile.php?id=100088364273955';
  const openingHours = siteConfig?.openingHours || 'Open Daily: 10:30 AM - 11:30 PM';
  const ticketPrice = siteConfig?.ticketPrice || 350;

  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] mt-20 sm:mt-28 text-[var(--text-secondary)] pb-20 md:pb-0 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Top Technical Specs Ribbon */}
        <div className="pb-8 sm:pb-10 mb-10 sm:mb-12 border-b border-[var(--border-subtle)] grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between gap-4 text-[10px] sm:text-xs font-mono text-[var(--text-muted)]">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            <span className="text-[var(--text-primary)] font-bold">HALL 01 AUDITORIUM</span>
          </div>
          <div>PROJECTION: 4K DCI LASER</div>
          <div>AUDIO: DOLBY ATMOS 7.1</div>
          <div>CAPACITY: 72 RESERVED SEATS</div>
          <div className="text-[var(--accent-brass)] font-bold">FLAT RATE: ₱{ticketPrice}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <BrandLogo className="w-9 h-9" alt="Shopbox Cinema" />
              <div>
                <span className="font-display text-base font-extrabold tracking-[0.2em] text-[var(--text-primary)] uppercase block">
                  Shopbox Cinema
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-brass)] block">
                  Virac, Catanduanes • Independent Exhibition
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
              An intimate single-auditorium cinema dedicated to high-contrast laser projection,
              calibrated room acoustics, and reserved 72-seat theatrical exhibition in Catanduanes.
            </p>

            <div className="pt-1">
              <button
                onClick={onOpenSeatReference}
                className="inline-flex items-center space-x-2 text-xs font-mono text-[var(--accent-brass)] hover:underline underline-offset-4 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect 72-Seat Architectural Blueprint (Seats.jpg)</span>
              </button>
            </div>
          </div>

          {/* Location & Box Office */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-primary)] font-bold">
              01 / Box Office & Location
            </h4>
            <ul className="space-y-2.5 text-xs leading-relaxed text-[var(--text-secondary)]">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[var(--accent-brass)] shrink-0 mt-0.5" />
                <span className="text-[var(--text-primary)] font-medium">{address}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <span>{openingHours}</span>
              </li>
              <li className="pl-6 text-[11px] text-[var(--text-muted)] font-mono">
                Doors open 30 minutes prior to scheduled showtimes.
              </li>
            </ul>
          </div>

          {/* Contact & Inquiries */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-primary)] font-bold">
              02 / Inquiries & Social
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[var(--accent-brass)] shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-[var(--text-primary)] font-mono hover:text-[var(--accent-brass)] transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-[var(--text-primary)] transition-colors truncate"
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
                    className="inline-flex items-center space-x-2 text-[var(--text-primary)] hover:text-[var(--accent-brass)] transition-colors group"
                  >
                    <svg
                      className="w-4 h-4 fill-current shrink-0 text-[var(--accent-brass)]"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-mono text-[11px] underline underline-offset-4">
                      Official Facebook Page
                    </span>
                    <ExternalLink className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--accent-brass)] transition-colors shrink-0" />
                  </a>
                </li>
              )}
              <li className="pt-1 text-[11px] text-[var(--text-muted)] font-mono">
                Private auditorium buyouts & school screenings available.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">
          <p className="font-mono text-[11px]">
            © {new Date().getFullYear()} Shopbox Cinema • San Jose, Virac, Catanduanes.
          </p>
          <div className="flex items-center space-x-6 font-mono text-[11px]">
            <span>Hall 01 Exhibition System</span>
            <span>•</span>
            <button
              onClick={onNavigateToAdmin}
              className="inline-flex items-center space-x-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-brass)] uppercase font-semibold transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Staff & Box Office Terminal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
