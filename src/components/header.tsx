"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types";

type NavigationItem = {
  name: string;
  href: string;
};

type UserMenuProps = {
  user: User;
  signOut: () => void;
};

type MobileMenuProps = {
  navigation: NavigationItem[];
  user: User | null;
  signOut: () => void;
  closeMobileMenu: () => void;
};

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = useMemo<NavigationItem[]>(
    () => [
      { name: "Home", href: "/" },
      { name: "Developers", href: "/developers" },
      { name: "Blogs", href: "/blogs" },
    ],
    []
  );

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">DevHub</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 ml-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} signOut={signOut} />
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <MobileMenu
          navigation={navigation}
          user={user}
          signOut={signOut}
          closeMobileMenu={closeMobileMenu}
        />
      )}
    </header>
  );
}

function UserMenu({ user, signOut }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || ""} alt={user.name || "User"} />
            <AvatarFallback>{getInitials(user.name || "U")}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.id}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/blogs/new">New Blog Post</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({
  navigation,
  user,
  signOut,
  closeMobileMenu,
}: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <div className="space-y-1 px-4 pb-3 pt-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block rounded-md px-3 py-2 text-base font-medium ${
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={closeMobileMenu}
          >
            {item.name}
          </Link>
        ))}
        {!user ? (
          <>
            <Link
              href="/auth/signin"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={closeMobileMenu}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={closeMobileMenu}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              href={`/profile/${user.id}`}
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={closeMobileMenu}
            >
              Profile
            </Link>
            <Link
              href="/blogs/new"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={closeMobileMenu}
            >
              New Blog Post
            </Link>
            <button
              className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                signOut();
                closeMobileMenu();
              }}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
