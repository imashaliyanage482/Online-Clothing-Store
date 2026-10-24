'use client';

import React, { useState } from 'react';
import CustomerHeader from '@/components/customer/CustomerHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AccountSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg('New passwords do not match.');
      return;
    }
    setMsg('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <CustomerHeader
        title="Security & Credentials"
        subtitle="Update your sign-in password and manage active logins."
      />

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg">
        {msg && (
          <div className="mb-4 p-3 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit">Update Password</Button>
        </form>
      </div>
    </div>
  );
}
