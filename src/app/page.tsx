"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/contexts/profile-context";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { profile, loading } = useProfile();

  useEffect(() => {
    if (!loading) {
      if (profile) {
        router.replace("/dashboard");
      }
    }
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Porichoy...</p>
      </div>
    );
  }

  // If user is not logged in, show the login form
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center text-center">
        <img
          src="/logo.png"
          alt="Porichoy Logo"
          className="h-[200px] w-[200px] object-contain"
        />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Access Your Porichoy</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Try User ID: <strong>12345</strong> to log into the demo account.
        <br />
        Or,{" "}
        <a href="/card/12345" className="underline hover:text-primary">
          view the demo card directly
        </a>
        .
      </p>
    </div>
  );
}
