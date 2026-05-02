'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import { ToastProvider } from '@/components/ui/Toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEmbed = pathname.startsWith('/embed');
  const isPublicProposal = pathname.includes('/public');

  // Embed and public views: no chrome
  if (isEmbed || isPublicProposal) {
    return (
      <ToastProvider>
        <div className={isEmbed ? 'embed-mode' : ''}>
          {children}
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <MobileNav />
          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
