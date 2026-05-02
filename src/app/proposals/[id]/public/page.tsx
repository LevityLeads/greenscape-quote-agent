'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '@/lib/format';
import { COMPANY } from '@/lib/constants';
import type { Proposal } from '@/types';

export default function PublicProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposal() {
      try {
        const res = await fetch(`/api/proposals?limit=100`);
        if (res.ok) {
          const data = await res.json();
          const found = (data.proposals || []).find((p: Proposal) => p.id === id);
          if (found) {
            setProposal(found);
          }
        }
      } catch (err) {
        console.error('Failed to fetch proposal:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProposal();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center animate-pulse-glow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 animate-spin" style={{ animationDuration: '2s' }}>
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-200 mb-2">Proposal Not Found</h2>
          <p className="text-slate-400 text-sm">This proposal may have expired or does not exist.</p>
        </div>
      </div>
    );
  }

  // Group line items by category (from proposal data)
  const groupedItems: Record<string, Array<{ category: string; name: string; description: string; unit: string; quantity: number; unit_price: number; line_total: number }>> = {};

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(5,150,105,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(5,150,105,0.2) 0%, transparent 50%)',
        }} />

        <div className="relative max-w-4xl mx-auto px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c4-4 8-7.5 8-12S16.4 2 12 2 4 5.5 4 10s4 8 8 12z" />
                <path d="M12 12V8" />
                <path d="M12 12l3 3" />
                <path d="M12 12l-3 3" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{COMPANY.name}</h2>
              <p className="text-xs text-emerald-400 tracking-wider uppercase">{COMPANY.tagline}</p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
          >
            {proposal.project_title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 text-sm text-slate-300"
          >
            <span>Proposal #{proposal.proposal_number}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>Prepared for {proposal.client_name}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>{formatDate(proposal.created_at)}</span>
          </motion.div>

          {/* Total Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="mt-8 inline-flex items-center gap-3 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-4"
          >
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Project Total</p>
              <p className="text-3xl font-bold text-emerald-400">{formatCurrency(proposal.total)}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Project Visualization */}
        {proposal.render_image && (
          <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Your Vision</h2>
            <div className="relative overflow-hidden rounded-2xl border border-emerald-800/30 shadow-2xl shadow-emerald-950/30">
              <img
                src={proposal.render_image}
                alt={`Visualization of ${proposal.project_title}`}
                className="w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent px-6 py-5">
                <p className="text-lg font-semibold text-white">{proposal.project_title}</p>
                <p className="text-sm text-emerald-300/80 mt-0.5">Conceptual visualization</p>
              </div>
            </div>
            <p className="text-xs italic text-slate-500 mt-3">
              *Visualization for illustrative purposes. Final designs will be based on actual site photos and measurements.
            </p>
          </motion.section>
        )}

        {/* Project Description */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Project Overview</h2>
          <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line">{proposal.project_description}</p>
        </motion.section>

        {/* Scope of Work */}
        {proposal.scope_of_work && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Scope of Work</h2>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{proposal.scope_of_work}</p>
            </div>
          </motion.section>
        )}

        {/* Timeline */}
        {proposal.timeline_estimate && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Estimated Timeline</h2>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{proposal.timeline_estimate}</p>
            </div>
          </motion.section>
        )}

        {/* Financial Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Investment Summary</h2>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-200 font-medium">{formatCurrency(proposal.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Arizona TPT ({(proposal.tax_rate * 100).toFixed(2)}%)</span>
                <span className="text-slate-200 font-medium">{formatCurrency(proposal.tax_amount)}</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-100">Total Investment</span>
                <span className="text-2xl font-bold text-emerald-400">{formatCurrency(proposal.total)}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Terms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Payment Terms</h2>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
              <p className="text-xs text-slate-400 leading-relaxed">{proposal.payment_terms}</p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Warranty</h2>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
              <p className="text-xs text-slate-400 leading-relaxed">{proposal.warranty_terms}</p>
            </div>
          </motion.section>
        </div>

        {/* Expiry Notice */}
        {proposal.expires_at && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center py-4"
          >
            <p className="text-xs text-slate-500">
              This proposal is valid until {formatDate(proposal.expires_at)}. Pricing may change after this date.
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="border-t border-slate-800 pt-8 pb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c4-4 8-7.5 8-12S16.4 2 12 2 4 5.5 4 10s4 8 8 12z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{COMPANY.name}</p>
                <p className="text-xs text-slate-500">{COMPANY.tagline}</p>
              </div>
            </div>
            <div className="text-xs text-slate-500 text-center sm:text-right space-y-0.5">
              <p>{COMPANY.location} | {COMPANY.phone}</p>
              <p>{COMPANY.license}</p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
