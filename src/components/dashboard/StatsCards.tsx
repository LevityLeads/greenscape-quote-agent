'use client';

import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/format';
import type { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Proposals This Month',
      value: stats.proposalsThisMonth.toString(),
      sub: `${stats.proposalsThisQuarter} this quarter`,
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'from-emerald-500/20 to-emerald-600/5',
      iconBg: 'bg-emerald-600/20 text-emerald-400',
    },
    {
      label: 'Pipeline Revenue',
      value: formatCurrency(stats.pipelineRevenue),
      sub: 'Draft + sent proposals',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-blue-500/20 to-blue-600/5',
      iconBg: 'bg-blue-600/20 text-blue-400',
    },
    {
      label: 'Win Rate',
      value: stats.totalSent > 0 ? `${Math.round((stats.totalSigned / stats.totalSent) * 100)}%` : '0%',
      sub: `${stats.totalSigned} signed / ${stats.totalSent} sent`,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-amber-500/20 to-amber-600/5',
      iconBg: 'bg-amber-600/20 text-amber-400',
    },
    {
      label: 'Avg Generation Time',
      value: stats.averageGenerationTime > 0 ? `${stats.averageGenerationTime}s` : 'N/A',
      sub: 'AI proposal generation',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-purple-500/20 to-purple-600/5',
      iconBg: 'bg-purple-600/20 text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className={`bg-gradient-to-br ${card.color} border border-slate-700/50 rounded-xl p-5`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold text-slate-100">{card.value}</p>
              <p className="text-xs text-slate-500">{card.sub}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${card.iconBg}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={card.icon} />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
