"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/application/hooks/use-auth";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <img src="/logo.svg" alt="" className="h-7 w-7" />
          <span>
            <span className="text-primary">Spike</span>
            <span className="text-muted-foreground">Clip</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>

          {mounted && !isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    {user.plan === "free" ? `${user.analysesUsed}/${user.analysesLimit}` : user.plan}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
                  <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          <Link
            href="/dashboard"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </Link>

          {mounted && !isLoading && (
            <>
              {user ? (
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{user.name || user.email}</span>
                    <Badge variant="secondary" className="text-xs">
                      {user.plan === "free" ? `${user.analysesUsed}/${user.analysesLimit}` : user.plan}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t">
                  <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setMobileOpen(false);
              }}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 mr-2" />
              ) : (
                <Moon className="h-4 w-4 mr-2" />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
