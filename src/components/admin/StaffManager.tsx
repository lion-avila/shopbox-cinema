import React, { useState } from 'react';
import { User, SiteConfig } from '../../types/cinema';
import { CinemaStorage } from '../../services/storage';
import { Shield, KeyRound, Plus, Trash2, Check, Lock } from 'lucide-react';

interface StaffManagerProps {
  onRefreshData: () => void;
}

export const StaffManager: React.FC<StaffManagerProps> = ({ onRefreshData }) => {
  const [config, setConfig] = useState<SiteConfig>(CinemaStorage.getSiteConfig());
  const [newKey, setNewKey] = useState(config.adminSecurityKey);
  const [keySuccess, setKeySuccess] = useState(false);

  // New staff form state
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState<'admin' | 'staff'>('staff');
  const [staffMsg, setStaffMsg] = useState('');

  const users = CinemaStorage.getUsers().filter((u) => u.role === 'admin' || u.role === 'staff');

  const handleUpdateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    const updated = { ...config, adminSecurityKey: newKey.trim() };
    CinemaStorage.saveSiteConfig(updated);
    setConfig(updated);
    onRefreshData();
    setKeySuccess(true);
    setTimeout(() => setKeySuccess(false), 3000);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim() || !staffPassword.trim()) return;

    const res = CinemaStorage.registerUser({
      name: staffName.trim(),
      email: staffEmail.trim(),
      phone: staffPhone.trim() || '+63 900 000 0000',
      password: staffPassword.trim(),
      role: staffRole,
    });

    if (!res.success) {
      alert(res.message || 'Failed to create staff account.');
      return;
    }

    setStaffMsg(`Staff account for ${staffName} created successfully.`);
    setStaffName('');
    setStaffEmail('');
    setStaffPhone('');
    setStaffPassword('');
    onRefreshData();
    setTimeout(() => setStaffMsg(''), 3000);
  };

  const handleDeleteStaff = (u: User) => {
    if (confirm(`Remove staff access for "${u.name}" (${u.email})?`)) {
      CinemaStorage.deleteUser(u.id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl font-mono text-xs">
      {/* Master Security Key Configuration */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-zinc-900 border border-white/10 text-[#C5A059] flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">
              Master Admin Security Access Key
            </h3>
            <p className="text-zinc-400 text-[11px] font-light">
              This secret passphrase is required for anyone registering on the Admin Portal.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateKey} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              required
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#C5A059]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            Update Security Key
          </button>
        </form>

        {keySuccess && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center space-x-2">
            <Check className="w-3.5 h-3.5" />
            <span>Master Admin Security Key updated. Share this key only with authorized staff.</span>
          </div>
        )}
      </div>

      {/* Staff User Management */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-white text-sm flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#C5A059]" />
              <span>Provision New Staff Account</span>
            </h4>
            <p className="text-zinc-400 text-[11px] mt-0.5">
              Directly grant administrative credentials without using the registration form.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateStaff} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Santos"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">Role / Permissions</label>
            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value as any)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-zinc-500"
            >
              <option value="staff">Box Office Staff (Admissions & Counter)</option>
              <option value="admin">Super Admin (Full CMS, Schedule & Pricing)</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">Staff Email</label>
            <input
              type="email"
              required
              placeholder="staff@shopboxcinema.ph"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={staffPassword}
              onChange={(e) => setStaffPassword(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Staff Member</span>
            </button>
          </div>
        </form>

        {staffMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center space-x-2">
            <Check className="w-3.5 h-3.5" />
            <span>{staffMsg}</span>
          </div>
        )}

        {/* Existing Staff List */}
        <div className="pt-4 space-y-3">
          <h5 className="font-bold uppercase tracking-wider text-zinc-300 text-xs">
            Active Staff Directory ({users.length})
          </h5>

          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="p-3 bg-zinc-950 border border-white/[0.04] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{u.name}</span>
                    <span className="px-1.5 py-0.2 bg-zinc-900 border border-white/10 text-[9px] uppercase font-bold text-[#C5A059]">
                      {u.role}
                    </span>
                  </div>
                  <span className="text-zinc-400 text-[10px]">{u.email}</span>
                </div>

                {users.length > 1 && (
                  <button
                    onClick={() => handleDeleteStaff(u)}
                    className="p-1.5 border border-rose-900/40 text-rose-400 hover:bg-rose-950 transition-colors"
                    title="Remove Staff"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
