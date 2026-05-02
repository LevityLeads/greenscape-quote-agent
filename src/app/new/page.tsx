'use client';

import { useRouter } from 'next/navigation';
import SiteWalkForm from '@/components/site-walk/SiteWalkForm';

export default function NewProposalPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto">
      <SiteWalkForm
        onComplete={(proposalId) => {
          router.push(`/proposals/${proposalId}`);
        }}
      />
    </div>
  );
}
