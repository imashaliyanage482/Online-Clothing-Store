'use client';

import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-lg">
      <AdminHeader
        title="Admin Profile"
        description="Review your operational privileges and security credentials."
      />

      <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-4 shadow-sm">
        <Input label="Name" defaultValue={user?.name || 'Admin'} disabled />
        <Input label="Email" defaultValue={user?.email || 'admin14@gmail.ik'} disabled />
        <Input label="Security Role" defaultValue="Full Store Operations (SUPER_ADMIN)" disabled />
        <div className="pt-2">
          <Button variant="outline">Change Admin Password</Button>
        </div>
      </div>
    </div>
  );
}
