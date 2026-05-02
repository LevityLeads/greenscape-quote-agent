'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { formatDate, formatPhoneNumber } from '@/lib/format';
import type { Client } from '@/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchClients() {
      try {
        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        const res = await fetch(`/api/clients${params}`);
        if (res.ok) {
          const data = await res.json();
          setClients(data.clients || []);
        }
      } catch (err) {
        console.error('Failed to fetch clients:', err);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchClients, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Clients</h1>
        <p className="text-sm text-slate-400 mt-1">{clients.length} clients in directory</p>
      </div>

      <Input
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl animate-shimmer" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm mb-1">No clients found</p>
          <p className="text-slate-500 text-xs">Clients are created automatically when you generate proposals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-slate-200">{client.name}</p>
                    {client.email && (
                      <p className="text-xs text-slate-400 truncate">{client.email}</p>
                    )}
                    {client.phone && (
                      <p className="text-xs text-slate-500">{formatPhoneNumber(client.phone)}</p>
                    )}
                    {client.address && (
                      <p className="text-xs text-slate-500 truncate">{client.address}, {client.city}, {client.state} {client.zip}</p>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      {client.hoa_required && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400">HOA</span>
                      )}
                      <span className="text-[10px] text-slate-600">Added {formatDate(client.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
