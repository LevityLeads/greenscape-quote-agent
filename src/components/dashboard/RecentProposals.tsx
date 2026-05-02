'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatRelativeTime } from '@/lib/format';
import type { Proposal } from '@/types';

interface RecentProposalsProps {
  proposals: Proposal[];
}

export default function RecentProposals({ proposals }: RecentProposalsProps) {
  if (proposals.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm">No proposals yet</p>
        <p className="text-slate-500 text-xs mt-1">Create your first AI-generated proposal</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="divide-y divide-slate-700/50">
        {proposals.map((proposal, i) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/proposals/${proposal.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-medium text-slate-200 truncate">{proposal.project_title}</p>
                  <Badge status={proposal.status} size="sm" />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{proposal.proposal_number}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>{proposal.client_name || 'No client'}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>{formatRelativeTime(proposal.created_at)}</span>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-semibold text-emerald-400">{formatCurrency(proposal.total)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
