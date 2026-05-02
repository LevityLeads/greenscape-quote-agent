import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
  title: 'Greenscape Pro QuoteBot',
  description: 'AI-powered proposal generator for premium landscape and hardscape design',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
