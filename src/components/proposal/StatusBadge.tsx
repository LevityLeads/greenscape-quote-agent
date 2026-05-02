'use client';

import type { ProposalStatus } from '@/types';
import { PROPOSAL_STATUS_CONFIG } from '@/types';

const statusFlow: ProposalStatus[] = ['draft', 'review', 'approved', 'sent', 'signed'];

interface StatusFlowProps {
  currentStatus: ProposalStatus;
}

export default function StatusFlow({ currentStatus }: StatusFlowProps) {
  const currentIndex = statusFlow.indexOf(currentStatus);
  const isTerminal = currentStatus === 'rejected' || currentStatus === 'expired';

  return (
    <div className="flex items-center gap-1">
      {statusFlow.map((status, i) => {
        const isActive = i <= currentIndex && !isTerminal;
        const isCurrent = status === currentStatus;
        const config = PROPOSAL_STATUS_CONFIG[status];

        return (
          <div key={status} className="flex items-center">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold transition-all ${
                isCurrent
                  ? `${config.bgColor} ${config.color} ring-2 ring-current/20`
                  : isActive
                  ? 'bg-emerald-800/30 text-emerald-500'
                  : 'bg-slate-800 text-slate-600'
              }`}
              title={config.label}
            >
              {isActive && i < currentIndex ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {i < statusFlow.length - 1 && (
              <div className={`w-6 h-0.5 ${isActive && i < currentIndex ? 'bg-emerald-700' : 'bg-slate-800'}`} />
            )}
          </div>
        );
      })}

      {isTerminal && (
        <div className="ml-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${PROPOSAL_STATUS_CONFIG[currentStatus].bgColor} ${PROPOSAL_STATUS_CONFIG[currentStatus].color}`}>
            {PROPOSAL_STATUS_CONFIG[currentStatus].label}
          </span>
        </div>
      )}
    </div>
  );
}
