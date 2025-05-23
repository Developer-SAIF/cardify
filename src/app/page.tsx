"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/contexts/profile-context';
import { Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();
  const { profile, loading } = useProfile();

  useEffect(() => {
    if (!loading) {
      if (profile) {
        router.replace('/dashboard');
      } else {
        // Stay on landing page or redirect to login, for now stay.
        // router.replace('/login'); 
      }
    }
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Cardify...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-primary">Welcome to Cardify</h1>
        <p className="mb-8 max-w-xl text-lg text-foreground/80">
          Your modern solution for digital business cards. Create, customize, and share your professional identity with ease.
        </p>
        <div className="space-x-4">
          <Button size="lg" onClick={() => router.push('/login')}>Get Started</Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/card/12345')}>View Demo Card</Button>
        </div>
        <p className="mt-10 text-sm text-muted-foreground">
          (For demo purposes, login with User ID: <strong>12345</strong>)
        </p>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Cardify. All rights reserved.
      </footer>
    </div>
  );
}
