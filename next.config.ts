import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Supabase image domains if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // Ensure server actions work for proposal generation
  serverExternalPackages: ['@anthropic-ai/sdk', '@sendgrid/mail'],
};

export default nextConfig;
