import React, { useState } from 'react';
import { CinemaStorage } from '../../services/storage';
import { User } from '../../types/cinema';
import { X, Mail, Lock, User as UserIcon, Phone, ArrowRight, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      const res = CinemaStorage.authenticateUser(email, password, 'patron');
      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Login failed.');
        return;
      }
      CinemaStorage.setCurrentPatron(res.user);
      onSuccess(res.user);
      onClose();
    } else {
      if (!name.trim() || !phone.trim()) {
        setErrorMsg('Please complete all fields.');
        return;
      }
      const res = CinemaStorage.registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: 'patron',
      });
      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Registration failed.');
        return;
      }
      CinemaStorage.setCurrentPatron(res.user);
      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        onSuccess(res.user!);
        onClose();
      }, 500);
    }
  };

  const handleQuickDemoLogin = () => {
    const res = CinemaStorage.authenticateUser('maria.santos@gmail.com', 'patron123', 'patron');
    if (res.success && res.user) {
      CinemaStorage.setCurrentPatron(res.user);
      onSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0c0c10] border border-white/15 shadow-2xl my-4 sm:my-8">
        {/* Header Tabs */}
        <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#C5A059] block">
              Patron Membership
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
              {mode === 'login' ? 'Sign In to Account' : 'Create Patron Account'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 border border-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-white/[0.08] font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-3 text-center uppercase tracking-wider transition-colors ${
              mode === 'login'
                ? 'bg-zinc-950 text-white font-bold border-b-2 border-[#C5A059]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-3 text-center uppercase tracking-wider transition-colors ${
              mode === 'signup'
                ? 'bg-zinc-950 text-white font-bold border-b-2 border-[#C5A059]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Maria Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-950 border border-white/10 text-white text-[16px] sm:text-xs font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
                  Mobile Number (+63)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    placeholder="0917 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-950 border border-white/10 text-white text-[16px] sm:text-xs font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-950 border border-white/10 text-white text-[16px] sm:text-xs font-mono focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-950 border border-white/10 text-white text-[16px] sm:text-xs font-mono focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 font-mono text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 font-mono text-xs flex items-center space-x-2">
              <Check className="w-3.5 h-3.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-zinc-100 hover:bg-[#C5A059] text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-colors active:scale-98"
            >
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {mode === 'login' && (
            <div className="pt-2 border-t border-white/[0.06] text-center font-mono text-[11px]">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="text-[#C5A059] hover:underline"
              >
                Quick Demo Login as Maria Santos
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
