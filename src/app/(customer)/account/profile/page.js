'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/customer/CustomerHeader';
import {
  User,
  MapPin,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Phone,
  Mail,
  Home,
} from 'lucide-react';

export default function CustomerProfilePage() {
  const { user, refreshUser } = useAuth();

  // Personal Information
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Shipping Address
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Western Province');
  const [postalCode, setPostalCode] = useState('');

  // Security Credentials
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');

      // Parse address if string or object
      if (user.address) {
        if (typeof user.address === 'object') {
          setStreetAddress(user.address.street || '');
          setCity(user.address.city || '');
          setProvince(user.address.province || 'Western Province');
          setPostalCode(user.address.postalCode || '');
        } else if (typeof user.address === 'string') {
          setStreetAddress(user.address);
        }
      }
    }
  }, [user]);

  const handleSaveProfileAndAddress = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const addressString = [streetAddress, city, province, postalCode].filter(Boolean).join(', ');

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          address: addressString,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update personal details.');
      }

      if (refreshUser) await refreshUser();
      setSuccessMessage('Your profile details have been updated successfully.');
      setTimeout(() => setSuccessMessage(''), 4500);
    } catch (err) {
      setErrorMessage(err.message || 'Error updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match. Please verify.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setSuccessMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(''), 4500);
    } catch (err) {
      setErrorMessage(err.message || 'Error updating password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 text-[#252525] max-w-4xl">
      <CustomerHeader
        title="My Profile & Settings"
        subtitle="Manage your personal identity, delivery addresses, and sign-in security in one place."
      />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-xs shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* ── SECTION 1 & 2: PERSONAL DETAILS & DELIVERY ADDRESS ── */}
      <form onSubmit={handleSaveProfileAndAddress} className="space-y-6">
        {/* Personal Identity Card */}
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-[#B69A7A]/25 mb-5">
            <div className="p-2.5 bg-[#F5F0E8] border border-[#B69A7A]/30 rounded-xl text-[#252525]">
              <User className="w-5 h-5 text-[#B69A7A]" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#252525]">
                Personal Identity
              </h2>
              <p className="text-xs text-[#252525]/70">Your client profile details used for orders and invoices.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#252525] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-3.5 pr-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252525] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-3.5 pr-4 py-2.5 bg-[#F5F0E8]/70 text-xs text-[#252525]/70 rounded-xl border border-[#B69A7A]/25 cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-[#252525]/50 mt-1 block">Account primary identifier.</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#252525] mb-1.5">
                Contact Phone Number
              </label>
              <div className="relative max-w-sm">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full pl-3.5 pr-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
                />
              </div>
              <span className="text-[10px] text-[#252525]/50 mt-1 block">
                Used by courier for parcel delivery confirmation calls.
              </span>
            </div>
          </div>

          <div className="pt-5 border-t border-[#B69A7A]/25 mt-6 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#252525] hover:bg-[#3d3d3d] text-[#FAF7F2] rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {savingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {savingProfile ? 'Saving Details...' : 'Save Profile Details'}
            </button>
          </div>
        </div>
      </form>

      {/* ── SECTION 3: SECURITY & PASSWORD CREDENTIALS ── */}
      <form onSubmit={handleUpdatePassword} className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-[#B69A7A]/25 mb-5">
          <div className="p-2.5 bg-[#F5F0E8] border border-[#B69A7A]/30 rounded-xl text-[#252525]">
            <Shield className="w-5 h-5 text-[#B69A7A]" />
          </div>
          <div>
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#252525]">
              Security & Password
            </h2>
            <p className="text-xs text-[#252525]/70">Change your sign-in password to keep your account safe.</p>
          </div>
        </div>

        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-[#252525] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#252525] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252525] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#B69A7A]/25 flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#252525] hover:bg-[#3d3d3d] text-[#FAF7F2] rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {savingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {savingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
