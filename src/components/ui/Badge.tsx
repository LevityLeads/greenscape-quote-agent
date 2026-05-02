'use client';

import type { ProposalStatus } from '@/types';
import { PROPOSAL_STATUS_CONFIG } from '@/types';

interface BadgeProps {
  status: ProposalStatus;
  size?: 'sm' | 'md';
}

export default function Badge({ status, size = 'md' }: BadgeProps) {
  const config = PROPOSAL_STATUS_CONFIG[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${config.bgColor} ${config.color} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'signed' || status === 'approved' ? 'bg-emerald-400' : status === 'review' ? 'bg-amber-400' : status === 'sent' ? 'bg-blue-400' : status === 'rejected' || status === 'expired' ? 'bg-red-400' : 'bg-slate-400'}`} />
      {config.label}
    </span>
  );
}
