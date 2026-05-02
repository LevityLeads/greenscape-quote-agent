'use client';

import { useEffect } from 'react';
import SiteWalkForm from '@/components/site-walk/SiteWalkForm';

export default function EmbedPage() {
  // Notify parent window of completion
  const handleComplete = (proposalId: string) => {
    // PostMessage to parent for iframe communication
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'greenscape-proposal-complete',
          proposalId,
        },
        '*',
      );
    }
  };

  useEffect(() => {
    // Notify parent that embed is loaded
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'greenscape-embed-loaded' }, '*');
    }
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c4-4 8-7.5 8-12S16.4 2 12 2 4 5.5 4 10s4 8 8 12z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100">Greenscape Pro</h1>
          <p className="text-[10px] text-emerald-500 uppercase tracking-wider">New Proposal</p>
        </div>
      </div>

      <SiteWalkForm onComplete={handleComplete} />
    </div>
  );
}
