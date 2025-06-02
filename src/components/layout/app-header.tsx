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
      <div className="w-full flex items-center h-16 px-4 sm:px-8">
        {/* Logo with left padding, always left-aligned */}
        <Link href="/" className="flex items-center pl-4 sm:pl-8 lg:pl-12">
          <img
            src="/logo.png"
            alt="Porichoy Logo"
            className="h-14 w-14 object-contain"
          />
        </Link>
        {/* Spacer to push menu to the right */}
        <div className="flex-1" />
        {/* Menu, right-aligned with right padding */}
        <nav className="flex items-center space-x-2 pr-2 sm:pr-4">
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
