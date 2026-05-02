import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Greenscape Pro - New Proposal',
  description: 'Create a new landscape proposal',
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="embed-mode min-h-screen bg-slate-950">
      {children}
    </div>
  );
}
