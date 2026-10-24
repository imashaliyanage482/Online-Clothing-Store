'use client';

import React, { useState } from 'react';
import CustomerHeader from '@/components/customer/CustomerHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Plus, MapPin, Trash2, Edit2 } from 'lucide-react';

export default function CustomerAddressesPage() {
  const [addresses] = useState([
    {
      id: 'addr-1',
      title: 'Primary Residence',
      recipientName: 'Jane Doe',
      streetAddress: '742 Evergreen Terrace',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '+1 555-0144',
      isDefault: true,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CustomerHeader
          title="Saved Addresses"
          subtitle="Manage shipping locations for accelerated checkout."
        />
      </div>

      <div className="flex justify-end">
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-900" />
                <span className="font-bold text-sm text-slate-900">{addr.title}</span>
              </div>
              {addr.isDefault && <Badge variant="success">Default</Badge>}
            </div>

            <div className="text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-800">{addr.recipientName}</p>
              <p>{addr.streetAddress}, {addr.apartment}</p>
              <p>{addr.city}, {addr.state} {addr.postalCode}</p>
              <p>{addr.country}</p>
              <p className="mt-1 text-slate-400">Tel: {addr.phone}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 text-xs">
              <button className="text-slate-600 hover:text-slate-900 flex items-center gap-1">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button className="text-rose-600 hover:text-rose-700 flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
