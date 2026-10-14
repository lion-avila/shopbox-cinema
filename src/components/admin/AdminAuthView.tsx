import React, { useState } from 'react';
import { CinemaStorage } from '../../services/storage';
import { User } from '../../types/cinema';
import { Shield, KeyRound, Mail, Lock, User as UserIcon, Phone, ArrowRight, ArrowLeft, AlertTriangle, Check } from 'lucide-react';

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
      // Validate Admin Security Access Key
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#060608] px-4 py-12 font-sans selection:bg-[#C5A059] selection:text-black">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-xl bg-white/5 p-2 overflow-hidden shadow-2xl border border-white/20 flex items-center justify-center">
            <img
              src="/assets/logo-white.svg"
              alt="Shopbox Cinema"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold uppercase tracking-[0.2em] text-white">
              Shopbox Cinema
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-[#C5A059] mt-0.5">
              Auditorium 01 • Staff & Box Office Gateway
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-[#0c0c10] border border-white/[0.1] shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 border-b border-white/[0.08] font-mono text-xs pb-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`pb-2.5 uppercase tracking-wider transition-colors ${
                mode === 'login'
                  ? 'text-white font-bold border-b-2 border-[#C5A059]'
                  : 'text-zinc-500 hover:text-zinc-300'
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
                  ? 'text-white font-bold border-b-2 border-[#C5A059]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Key-Guarded Signup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {mode === 'signup' && (
              <>
                {/* Security Access Key Input */}
                <div className="p-3 bg-amber-950/20 border border-amber-800/40 space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#C5A059] font-bold text-[11px] uppercase">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Admin Security Access Key Required</span>
                  </div>
                  <p className="text-zinc-400 text-[10px]">
                    To prevent unauthorized access, administrative registration requires the master key.
                  </p>
                  <input
                    type="password"
                    required
                    placeholder="Enter Security Access Key..."
                    value={securityKey}
                    onChange={(e) => setSecurityKey(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                    Staff Member Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe (Theater Manager)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                    Direct Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+63 917 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@shopboxcinema.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                <Check className="w-3.5 h-3.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{mode === 'login' ? 'Authenticate Staff Access' : 'Create Admin Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-white/[0.06] font-mono text-[11px] text-zinc-400 space-y-2">
            <div className="flex items-center justify-between">
              <span>Default Super Admin:</span>
              <button
                type="button"
                onClick={handleQuickSuperAdmin}
                className="text-[#C5A059] hover:underline uppercase text-[10px] font-bold"
              >
                Auto-Fill
              </button>
            </div>
            <p className="text-[10px] text-zinc-400">
              admin@shopboxcinema.ph / admin2026!
            </p>
            <p className="text-[10px] text-zinc-400">
              Master Access Key: <span className="text-zinc-300 font-bold">{siteConfig.adminSecurityKey}</span>
            </p>
          </div>
        </div>

        {/* Exit back to customer site */}
        <div className="text-center font-mono text-xs">
          <button
            onClick={onExitToCustomerSite}
            className="text-zinc-400 hover:text-white transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Booking Site</span>
          </button>
        </div>
      </div>
    </div>
  );
};
