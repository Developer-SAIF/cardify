"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/contexts/profile-context';
import { AppHeader } from '@/components/layout/app-header';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { profile, loading } = useProfile();

  useEffect(() => {
    if (!loading && !profile) {
      router.replace('/login');
    }
  }, [profile, loading, router]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
