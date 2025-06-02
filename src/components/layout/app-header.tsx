"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/contexts/profile-context";
import { LogOut, UserCircle } from "lucide-react";

export function AppHeader() {
  const { profile, logout } = useProfile();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center">
          <img
            src="/logo.png"
            alt="Porichoy Logo"
            className="h-20 w-20 object-contain"
          />
        </Link>
        <nav className="flex flex-1 items-center space-x-4 sm:justify-end">
          {profile ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/card/${profile.userId}`)}
                className="hidden sm:inline-flex"
              >
                View My Card
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push("/")}
            >
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
