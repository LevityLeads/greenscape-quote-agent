'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentProposals from '@/components/dashboard/RecentProposals';
import Button from '@/components/ui/Button';
import type { DashboardStats, Proposal } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    proposalsThisMonth: 0,
    proposalsThisQuarter: 0,
    pipelineRevenue: 0,
    averageGenerationTime: 0,
    winRate: 0,
    totalSigned: 0,
    totalSent: 0,
  });
  const [recentProposals, setRecentProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/proposals?limit=10');
        if (res.ok) {
          const data = await res.json();
          setRecentProposals(data.proposals || []);
          setStats(data.stats || stats);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Welcome back, Marcus. Here is your proposal pipeline.</p>
        </motion.div>
        <Link href="/new">
          <Button size="lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl animate-shimmer" />
          ))}
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}

      {/* Recent Proposals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">Recent Proposals</h2>
          <Link href="/proposals" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg animate-shimmer" />
            ))}
          </div>
        ) : (
          <RecentProposals proposals={recentProposals} />
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Create Proposal',
              description: 'Start from site walk notes',
              href: '/new',
              icon: 'M12 4v16m8-8H4',
              color: 'from-emerald-600/20 to-emerald-700/5 hover:from-emerald-600/30',
            },
            {
              title: 'View Pricing',
              description: 'Browse and edit pricing database',
              href: '/pricing',
              icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
              color: 'from-blue-600/20 to-blue-700/5 hover:from-blue-600/30',
            },
            {
              title: 'Manage Clients',
              description: 'View client directory',
              href: '/clients',
              icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
              color: 'from-purple-600/20 to-purple-700/5 hover:from-purple-600/30',
            },
          ].map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link href={action.href}>
                <div className={`bg-gradient-to-br ${action.color} border border-slate-700/50 rounded-xl p-5 transition-all duration-200 group`}>
                  <div className="flex items-center gap-3 mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-white transition-colors">
                      <path d={action.icon} />
                    </svg>
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{action.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
