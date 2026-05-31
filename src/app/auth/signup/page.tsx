"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { categories } from "@/lib/mock-data"

const COUNTRIES = [
  "Kuwait", "Saudi Arabia", "UAE", "Qatar", "Bahrain", "Oman",
  "Egypt", "Jordan", "Lebanon", "United States", "United Kingdom",
  "Germany", "France", "Turkey", "India", "Pakistan", "Other",
]

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.84 4.84 0 01-1.01-.06z" />
  </svg>
)

export default function SignupPage() {
  // Account fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Creator toggle
  const [isCreator, setIsCreator] = useState(false)

  // Creator fields
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram")
  const [handle, setHandle] = useState("")
  const [category, setCategory] = useState("")
  const [country, setCountry] = useState("")
  const [followers, setFollowers] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const creatorValid = !isCreator || (handle.trim() && category && country)
  const isValid = name.trim() && email.includes("@") && password.length >= 6 && creatorValid

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || loading) return
    setLoading(true)
    setError("")

    // 1. Create account (server-side — works even if Supabase CDN is blocked)
    const signupRes = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    const signupData = await signupRes.json()

    if (!signupRes.ok || signupData.error) {
      setError(signupData.error ?? "Something went wrong — please try again")
      setLoading(false)
      return
    }

    // Handle redirect-only case (no session obtained)
    if (signupData.redirect) {
      window.location.href = signupData.redirect
      return
    }

    // 2. Set session client-side
    if (signupData.accessToken && signupData.refreshToken) {
      await supabase.auth.setSession({
        access_token: signupData.accessToken,
        refresh_token: signupData.refreshToken,
      })
    }

    // 3. If creator, submit application linked to new account
    if (isCreator && handle.trim() && category && country) {
      await fetch("/api/creator/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle,
          platform,
          category,
          country,
          followers,
          email,
          userId: signupData.userId ?? "",
        }),
      })
      // Don't block signup if creator apply fails — they can reapply from profile
    }

    // 4. Go home
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl p-8 shadow-sm">

        <div className="text-center mb-6">
          <Image
            src="/logo-main.png"
            alt="Livek"
            width={110}
            height={33}
            className="h-8 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-black text-foreground">Create your account</h1>
          <p className="text-sm text-foreground-muted mt-1">Join Livek — it&apos;s free</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* ── Account info ── */}
          <div>
            <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
              autoFocus
              autoComplete="name"
              className="w-full px-4 py-2.5 border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
              className="w-full px-4 py-2.5 border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          {/* ── Creator toggle ── */}
          <button
            type="button"
            onClick={() => setIsCreator(v => !v)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
              isCreator
                ? "border-primary bg-primary-light"
                : "border-border bg-white hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎥</span>
              <div className="text-left">
                <p className={`text-sm font-bold leading-tight ${isCreator ? "text-primary" : "text-foreground"}`}>
                  I&apos;m a creator
                </p>
                <p className="text-xs text-foreground-muted">List my Instagram or TikTok account</p>
              </div>
            </div>
            {/* Checkmark circle */}
            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
              isCreator ? "border-primary bg-primary" : "border-border"
            }`}>
              {isCreator && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          {/* ── Creator fields (slide in when toggled) ── */}
          {isCreator && (
            <div className="space-y-3 border-l-2 border-primary/30 pl-4 ml-1">

              {/* Platform */}
              <div>
                <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlatform("instagram")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-xs transition-all ${
                      platform === "instagram"
                        ? "border-instagram bg-pink-50 text-instagram"
                        : "border-border text-foreground-muted hover:border-instagram/40"
                    }`}
                  >
                    <InstagramIcon /> Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform("tiktok")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-xs transition-all ${
                      platform === "tiktok"
                        ? "border-tiktok bg-gray-50 text-tiktok"
                        : "border-border text-foreground-muted hover:border-gray-400"
                    }`}
                  >
                    <TikTokIcon /> TikTok
                  </button>
                </div>
              </div>

              {/* Handle */}
              <div>
                <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">Your Handle</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted font-semibold text-sm">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={e => setHandle(e.target.value.replace("@", ""))}
                    placeholder="yourhandle"
                    className="w-full pl-8 pr-4 py-2.5 border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Category + Country */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  >
                    <option value="">Select...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">Country</label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  >
                    <option value="">Select...</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Followers */}
              <div>
                <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">
                  Followers <span className="font-normal normal-case text-foreground-muted">(optional)</span>
                </label>
                <input
                  type="number"
                  value={followers}
                  onChange={e => setFollowers(e.target.value)}
                  placeholder="e.g. 50000"
                  min={0}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed mt-1"
          >
            {loading
              ? (isCreator ? "Creating account..." : "Creating account...")
              : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-foreground-muted mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
