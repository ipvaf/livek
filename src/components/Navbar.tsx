"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Search, Globe } from "lucide-react"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <div className="leading-none">
            <span className="font-black text-foreground text-base">livek</span>
            <span className="font-arabic text-primary text-xs ml-1">لايفك</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-foreground-muted">
          <Link href="/auctions" className="hover:text-foreground transition-colors">Live Now</Link>
          <Link href="/creators" className="hover:text-foreground transition-colors">Creators</Link>
          <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
        </nav>

        {/* Right */}
        <div className="hidden lg:flex items-center gap-2">
          <button className="p-2 text-foreground-muted hover:text-foreground transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground px-2 py-1.5 transition-colors">
            <Globe className="h-4 w-4" />
            EN
          </button>
          <Link href="/sell" className="text-sm font-semibold text-primary border border-primary/30 bg-primary-light hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-all">
            List Account
          </Link>
          <Link href="/auth/login" className="text-sm font-medium text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-border">
            Log in
          </Link>
          <Link href="/auth/signup" className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-1.5 rounded-lg transition-colors">
            Sign Up
          </Link>
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
          <div className="pt-2 flex gap-2">
            <Link href="/auth/login" className="flex-1 text-center border border-border rounded-lg py-2 text-foreground text-sm" onClick={() => setOpen(false)}>Log in</Link>
            <Link href="/auth/signup" className="flex-1 text-center bg-primary text-white rounded-lg py-2 text-sm" onClick={() => setOpen(false)}>Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  )
}
