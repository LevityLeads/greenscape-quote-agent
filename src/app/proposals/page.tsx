'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Proposal, ProposalStatus } from '@/types';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'In Review', value: 'review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Sent', value: 'sent' },
  { label: 'Signed', value: 'signed' },
  { label: 'Rejected', value: 'rejected' },
];

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchProposals() {
      try {
        const url = filter ? `/api/proposals?status=${filter}` : '/api/proposals';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProposals(data.proposals || []);
        }
      } catch (err) {
        console.error('Failed to fetch proposals:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Proposals</h1>
          <p className="text-sm text-slate-400 mt-1">{proposals.length} total proposals</p>
        </div>
        <Link href="/new">
          <Button>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((sf) => (
          <button
            key={sf.value}
            onClick={() => setFilter(sf.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === sf.value
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-300 border border-slate-700'
            }`}
          >
            {sf.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg animate-shimmer" />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm mb-1">No proposals found</p>
          <p className="text-slate-500 text-xs">
            {filter ? 'Try a different filter or ' : ''}
            <Link href="/new" className="text-emerald-400 hover:underline">create your first proposal</Link>
          </p>
        </div>
      ) : (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-700/50">
            <div className="col-span-4">Project</div>
            <div className="col-span-2">Client</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-2 text-right">Date</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-700/30">
            {proposals.map((proposal, i) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/proposals/${proposal.id}`}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-4 hover:bg-slate-800/40 transition-colors items-center"
                >
                  <div className="sm:col-span-4">
                    <p className="text-sm font-medium text-slate-200 truncate">{proposal.project_title}</p>
                    <p className="text-xs text-slate-500">{proposal.proposal_number}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-slate-300 truncate">{proposal.client_name || 'N/A'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <Badge status={proposal.status as ProposalStatus} size="sm" />
                  </div>
                  <div className="sm:col-span-2 text-right">
                    <p className="text-sm font-semibold text-emerald-400">{formatCurrency(proposal.total)}</p>
                  </div>
                  <div className="sm:col-span-2 text-right">
                    <p className="text-xs text-slate-500">{formatDate(proposal.created_at)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
