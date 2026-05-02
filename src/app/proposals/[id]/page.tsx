'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import StatusFlow from '@/components/proposal/StatusBadge';
import LineItemEditor from '@/components/proposal/LineItemEditor';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import type { Proposal, ProposalLineItem, ActivityLogEntry } from '@/types';

export default function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [lineItems, setLineItems] = useState<ProposalLineItem[]>([]);
  const [activity, setActivity] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [sending, setSending] = useState(false);
  const [savingItems, setSavingItems] = useState(false);
  const { addToast } = useToast();

  const fetchProposal = async () => {
    try {
      // Try fetching individual proposal first
      const detailRes = await fetch(`/api/proposals/${id}`);
      if (detailRes.ok) {
        const data = await detailRes.json();
        setProposal(data);
        setLineItems(data.line_items || []);
        setActivity(data.activity_log || []);
        return;
      }

      // Fallback to list API
      const res = await fetch(`/api/proposals?limit=100`);
      if (res.ok) {
        const data = await res.json();
        const found = (data.proposals || []).find((p: Proposal) => p.id === id);
        if (found) setProposal(found);
      }
    } catch (err) {
      console.error('Failed to fetch proposal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProposal(); }, [id]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      const res = await fetch(`/api/proposals/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setProposal(updated);
        addToast('Proposal approved', 'success');
      } else {
        const err = await res.json();
        addToast(err.error || 'Approval failed', 'error');
      }
    } catch {
      addToast('Failed to approve proposal', 'error');
    } finally {
      setApproving(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch(`/api/proposals/${id}/send`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setProposal(updated);
        addToast(updated.email_sent ? 'Proposal sent to client' : 'Proposal marked as sent (email not configured)', 'success');
      } else {
        const err = await res.json();
        addToast(err.error || 'Send failed', 'error');
      }
    } catch {
      addToast('Failed to send proposal', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleSaveLineItems = async (items: ProposalLineItem[]) => {
    setSavingItems(true);
    try {
      const res = await fetch(`/api/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line_items: items }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProposal(updated);
        setLineItems(items.map((item, i) => ({
          ...item,
          line_total: Math.round(Number(item.quantity) * Number(item.unit_price) * 100) / 100,
          sort_order: i,
        })));
        addToast('Line items saved', 'success');
      } else {
        const err = await res.json();
        addToast(err.error || 'Save failed', 'error');
      }
    } catch {
      addToast('Failed to save line items', 'error');
    } finally {
      setSavingItems(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-12 w-64 animate-shimmer rounded-lg" />
        <div className="h-64 animate-shimmer rounded-xl" />
        <div className="h-96 animate-shimmer rounded-xl" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-slate-200 mb-2">Proposal Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">This proposal may not exist or the database is not configured.</p>
        <Link href="/proposals">
          <Button variant="secondary">Back to Proposals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/proposals" className="text-slate-500 hover:text-slate-300 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-slate-100">{proposal.project_title}</h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <Badge status={proposal.status} />
            <span className="text-sm text-slate-500">{proposal.proposal_number}</span>
            <span className="text-sm text-slate-500">Created {formatDate(proposal.created_at)}</span>
            {proposal.ai_cost_cents > 0 && (
              <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded">
                AI cost: ${(proposal.ai_cost_cents / 100).toFixed(2)}
              </span>
            )}
          </div>
          <StatusFlow currentStatus={proposal.status} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/proposals/${id}/public`} target="_blank">
            <Button variant="ghost" size="sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View as Client
            </Button>
          </Link>

          {(proposal.status === 'draft' || proposal.status === 'review') && (
            <Button onClick={handleApprove} loading={approving}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Approve
            </Button>
          )}

          {proposal.status === 'approved' && (
            <Button onClick={handleSend} loading={sending}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Send to Client
            </Button>
          )}
        </div>
      </motion.div>

      {/* Client & Project Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Project Description</h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{proposal.project_description}</p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Client</h3>
          <div className="space-y-2 text-sm">
            <p className="text-slate-200 font-medium">{proposal.client_name || 'N/A'}</p>
            {proposal.client_email && <p className="text-slate-400">{proposal.client_email}</p>}
            {proposal.client_address && <p className="text-slate-400">{proposal.client_address}</p>}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">Timeline</h3>
            <p className="text-sm text-slate-400">{proposal.timeline_estimate || 'Not specified'}</p>
          </div>
        </Card>
      </div>

      {/* Scope of Work */}
      {proposal.scope_of_work && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Scope of Work</h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{proposal.scope_of_work}</p>
        </Card>
      )}

      {/* Line Items */}
      {lineItems.length > 0 && (
        <Card>
          <LineItemEditor
            items={lineItems}
            onSave={handleSaveLineItems}
            saving={savingItems}
          />
        </Card>
      )}

      {/* Financials */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Financial Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500">Subtotal</p>
            <p className="text-lg font-semibold text-slate-200">{formatCurrency(proposal.subtotal)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Tax ({(proposal.tax_rate * 100).toFixed(2)}%)</p>
            <p className="text-lg font-semibold text-slate-200">{formatCurrency(proposal.tax_amount)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(proposal.total)}</p>
          </div>
        </div>
      </Card>

      {/* AI Notes */}
      {proposal.ai_generation_notes && (
        <div className="bg-amber-900/10 border border-amber-800/30 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            AI Notes for Review
          </h3>
          <p className="text-sm text-slate-300 whitespace-pre-line">{proposal.ai_generation_notes}</p>
        </div>
      )}

      {/* Activity Log */}
      {activity.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Activity Log</h3>
          <div className="space-y-3">
            {activity.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-slate-300">
                    {entry.action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  <p className="text-xs text-slate-500">{formatDateTime(entry.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Warranty Terms</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{proposal.warranty_terms}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Payment Terms</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{proposal.payment_terms}</p>
        </Card>
      </div>
    </div>
  );
}
