import React, { useState } from 'react';
import { CinemaStorage } from '../../services/storage';
import { User } from '../../types/cinema';
import { Shield, KeyRound, Mail, Lock, User as UserIcon, Phone, ArrowRight, ArrowLeft, AlertTriangle, Check } from 'lucide-react';
import { BrandLogo, ThemeToggle } from '../../context/ThemeContext';

interface AdminAuthViewProps {
  onSuccess: (admin: User) => void;
  onExitToCustomerSite: () => void;
}

export const AdminAuthView: React.FC<AdminAuthViewProps> = ({
  onSuccess,
  onExitToCustomerSite,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const siteConfig = CinemaStorage.getSiteConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      const res = CinemaStorage.authenticateUser(email, password, 'admin');
      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Access denied: Invalid credentials.');
        return;
      }
      CinemaStorage.setCurrentAdmin(res.user);
      onSuccess(res.user);
    } else {
      if (securityKey.trim() !== siteConfig.adminSecurityKey.trim()) {
        setErrorMsg(
          'Security Violation: Invalid Admin Security Access Key. Public registration is prohibited.'
        );
        return;
      }

      if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Please complete all fields.');
        return;
      }

      const res = CinemaStorage.registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: 'admin',
      });

      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Administrator registration failed.');
        return;
      }

      CinemaStorage.setCurrentAdmin(res.user);
      setSuccessMsg('Administrative credentials established successfully.');
      setTimeout(() => {
        onSuccess(res.user!);
      }, 700);
    }
  };

  const handleQuickSuperAdmin = () => {
    setEmail('admin@shopboxcinema.ph');
    setPassword('admin2026!');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-canvas)] px-4 py-12 font-sans selection:bg-[#C5A059] selection:text-black relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <BrandLogo
            className="w-14 h-14 mx-auto"
            alt="Shopbox Cinema"
          />
          <div>
            <h1 className="font-display text-xl font-extrabold uppercase tracking-[0.2em] text-[var(--text-primary)]">
              Shopbox Cinema
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-brass)] mt-0.5 font-bold">
              Auditorium 01 • Staff & Box Office Gateway
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 border-b border-[var(--border-subtle)] font-mono text-xs pb-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`pb-2.5 uppercase tracking-wider transition-colors ${
                mode === 'login'
                  ? 'text-[var(--text-primary)] font-bold border-b-2 border-[#C5A059]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Staff Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`pb-2.5 uppercase tracking-wider transition-colors ${
                mode === 'signup'
                  ? 'text-[var(--text-primary)] font-bold border-b-2 border-[#C5A059]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Key-Guarded Signup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {mode === 'signup' && (
              <>
                <div className="p-3 bg-[var(--bg-elevated)] border border-[#C5A059]/40 space-y-1.5">
                  <div className="flex items-center space-x-2 text-[var(--accent-brass)] font-bold text-[11px] uppercase">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Admin Security Access Key Required</span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-[10px]">
                    To prevent unauthorized access, administrative registration requires the master key.
                  </p>
                  <input
                    type="password"
                    required
                    placeholder="Enter Security Access Key..."
                    value={securityKey}
                    onChange={(e) => setSecurityKey(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--accent-brass)]"
                  />
                </div>

                <div>
                  <label className="text-[var(--text-secondary)] font-bold uppercase text-[10px] block mb-1">
                    Staff Member Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe (Theater Manager)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-brass)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[var(--text-secondary)] font-bold uppercase text-[10px] block mb-1">
                    Direct Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="tel"
                      required
                      placeholder="+63 917 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-brass)]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[var(--text-secondary)] font-bold uppercase text-[10px] block mb-1">
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  placeholder="admin@shopboxcinema.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-brass)]"
                />
              </div>
            </div>

            <div>
              <label className="text-[var(--text-secondary)] font-bold uppercase text-[10px] block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-brass)]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/40 text-rose-500 text-xs font-semibold flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-3.5 h-3.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#C5A059] hover:bg-[#E2C285] text-black font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-98 shadow-md"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{mode === 'login' ? 'Authenticate Staff Access' : 'Create Admin Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-secondary)] space-y-2">
            <div className="flex items-center justify-between">
              <span>Default Super Admin:</span>
              <button
                type="button"
                onClick={handleQuickSuperAdmin}
                className="text-[var(--accent-brass)] hover:underline uppercase text-[10px] font-bold"
              >
                Auto-Fill
              </button>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              admin@shopboxcinema.ph / admin2026!
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">
              Master Access Key: <span className="text-[var(--text-primary)] font-bold">{siteConfig.adminSecurityKey}</span>
            </p>
          </div>
        </div>

        {/* Exit back to customer site */}
        <div className="text-center font-mono text-xs">
          <button
            onClick={onExitToCustomerSite}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Booking Site</span>
          </button>
        </div>
      </div>
    </div>
  );
};
