"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Search, Globe, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

function UserMenu({ name, email, onSignOut }: { name: string; email: string; onSignOut: () => void }) {
  const [open, setOpen] = useState(false)
  const initial = (name || email).charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 hover:bg-surface border border-transparent hover:border-border transition-all"
      >
        <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-black">{initial}</span>
        </div>
        <span className="text-sm font-semibold text-foreground max-w-[100px] truncate">{name || email}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground truncate">{name || "My Account"}</p>
              <p className="text-xs text-foreground-muted truncate">{email}</p>
            </div>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-surface transition-colors"
            >
              <User className="h-4 w-4 text-foreground-muted" />
              My Profile
            </Link>
            <button
              onClick={() => { setOpen(false); onSignOut() }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

  const displayName = user?.user_metadata?.full_name || ""
  const email = user?.email || ""

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-main.png"
            alt="Livek لايفك"
            width={120}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-foreground-muted">
          <Link href="/auctions" className="hover:text-foreground transition-colors">Live Now</Link>
          <Link href="/creators" className="hover:text-foreground transition-colors">Creators</Link>
          <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
        </nav>

        {/* Right — desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <button className="p-2 text-foreground-muted hover:text-foreground transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground px-2 py-1.5 transition-colors">
            <Globe className="h-4 w-4" />
            EN
          </button>
          <Link
            href="/sell"
            className="text-sm font-semibold text-primary border border-primary/30 bg-primary-light hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-all"
          >
            List Account
          </Link>

          {loading ? (
            // Skeleton while session loads
            <div className="h-8 w-20 rounded-full bg-surface animate-pulse" />
          ) : user ? (
            <UserMenu name={displayName} email={email} onSignOut={signOut} />
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-border"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-1.5 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden p-1.5 text-foreground-muted" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-3 space-y-1 text-sm font-medium">
          <Link href="/auctions" className="block py-2 text-foreground-muted hover:text-primary" onClick={() => setOpen(false)}>Live Now</Link>
          <Link href="/creators" className="block py-2 text-foreground-muted hover:text-primary" onClick={() => setOpen(false)}>Creators</Link>
          <Link href="/#how-it-works" className="block py-2 text-foreground-muted hover:text-primary" onClick={() => setOpen(false)}>How It Works</Link>
          <Link href="/sell" className="block py-2 text-primary font-semibold hover:text-primary-hover" onClick={() => setOpen(false)}>List Your Account</Link>

          {!loading && (
            <div className="pt-2 border-t border-border">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 py-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-xs font-black">
                        {(displayName || email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{displayName || "My Account"}</p>
                      <p className="text-xs text-foreground-muted">{email}</p>
                    </div>
                  </div>
                  <Link href="/profile" className="block py-2 text-foreground-muted hover:text-primary" onClick={() => setOpen(false)}>My Profile</Link>
                  <button
                    onClick={() => { setOpen(false); signOut() }}
                    className="block w-full text-left py-2 text-red-500 hover:text-red-600"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link href="/auth/login" className="flex-1 text-center border border-border rounded-lg py-2 text-foreground text-sm" onClick={() => setOpen(false)}>Log in</Link>
                  <Link href="/auth/signup" className="flex-1 text-center bg-primary text-white rounded-lg py-2 text-sm" onClick={() => setOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
