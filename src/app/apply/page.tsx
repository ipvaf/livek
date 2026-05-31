"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useAuth } from "@/contexts/AuthContext"
import { categories } from "@/lib/mock-data"
import { CheckCircle } from "lucide-react"

const COUNTRIES = [
  "Kuwait", "Saudi Arabia", "UAE", "Qatar", "Bahrain", "Oman",
  "Egypt", "Jordan", "Lebanon", "United States", "United Kingdom",
  "Germany", "France", "Turkey", "India", "Pakistan", "Other",
]

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.84 4.84 0 01-1.01-.06z" />
  </svg>
)

export default function ListAccountPage() {
  const { user } = useAuth()
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram")
  const [handle, setHandle] = useState("")
  const [profileUrl, setProfileUrl] = useState("")
  const [category, setCategory] = useState("")
  const [country, setCountry] = useState("")
  const [followers, setFollowers] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  // Pre-fill email once auth loads (user is null on first render)
  useEffect(() => {
    if (user?.email) setEmail(user.email)
  }, [user])

  const isValid = handle.trim() && category && country && email.includes("@")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setServerError("")

    const res = await fetch("/api/creator/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle,
        platform,
        profileUrl,
        category,
        country,
        followers,
        email,
        message,
        userId: user?.id ?? "",
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok || data.error) {
      setServerError(data.error ?? "Something went wrong — please try again")
      return
    }

    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {submitted ? (
        /* ── Success state ── */
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary-light mb-6">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-3">You&apos;re on the list!</h1>
          <p className="text-foreground-muted mb-2">
            Thanks for submitting <span className="font-semibold text-foreground">{handle.startsWith("@") ? handle : `@${handle}`}</span>.
          </p>
          <p className="text-foreground-muted mb-8">
            Our team will review your account and get back to you within{" "}
            <strong>48 hours</strong>. We&apos;ll email you at{" "}
            <span className="font-semibold text-foreground">{email}</span>.
          </p>
          {user ? (
            <a href="/profile" className="inline-block bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-colors">
              View My Profile
            </a>
          ) : (
            <a href="/" className="inline-block bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-colors">
              Back to Home
            </a>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left: value prop */}
          <div className="lg:pt-4">
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              Free · Takes 2 minutes
            </div>
            <h1 className="text-4xl font-black text-foreground leading-tight mb-3">
              List Your Account<br />on Livek
            </h1>
            <p className="font-arabic text-primary text-lg mb-6">سجّل حسابك على لايفك</p>
            <p className="text-foreground-muted text-base leading-relaxed mb-10 max-w-md">
              Thousands of people visit Livek every day looking for live creators.
              Get listed for free and grow your audience.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                { icon: "👁️", title: "More Visibility", desc: "Get discovered by buyers actively searching for what you sell" },
                { icon: "✅", title: "Verified Badge", desc: "Approved creators receive a verification badge on their profile" },
                { icon: "📊", title: "Profile Stats", desc: "Showcase your followers, rating, and live history" },
                { icon: "🔔", title: "Live Alerts", desc: "Followers get notified the moment you go live" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center text-xl shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{title}</p>
                    <p className="text-xs text-foreground-muted mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white border border-border rounded-2xl p-5 sm:p-8">
            {/* Logged-in banner */}
            {user && (
              <div className="mb-5 bg-primary-light border border-primary/20 text-primary text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="text-base">👤</span>
                <span>
                  Submitting as <strong>{user.user_metadata?.full_name || user.email}</strong> — your application will be linked to your account.
                </span>
              </div>
            )}

            <h2 className="font-black text-foreground text-xl mb-6">Your Information</h2>

            {serverError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Platform toggle */}
              <div>
                <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlatform("instagram")}
                    className={`flex items-center justify-center gap-2.5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
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
                    className={`flex items-center justify-center gap-2.5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
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
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted font-semibold text-sm">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={e => setHandle(e.target.value.replace("@", ""))}
                    placeholder="yourhandle"
                    required
                    className="w-full pl-8 pr-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Profile URL */}
              <div>
                <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">
                  Profile Link <span className="font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="url"
                  value={profileUrl}
                  onChange={e => setProfileUrl(e.target.value)}
                  placeholder={platform === "instagram" ? "https://instagram.com/yourhandle" : "https://tiktok.com/@yourhandle"}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>

              {/* Category + Country row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
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
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  >
                    <option value="">Select...</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Followers */}
              <div>
                <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">
                  Approximate Followers <span className="font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="number"
                  value={followers}
                  onChange={e => setFollowers(e.target.value)}
                  placeholder="e.g. 50000"
                  min={0}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>

              {/* Email — pre-filled & locked if logged in */}
              <div>
                <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  readOnly={!!user}
                  className={`w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
                    user ? "bg-surface text-foreground-muted cursor-default" : "text-foreground"
                  }`}
                />
                <p className="text-xs text-foreground-muted mt-1">
                  {user ? "Using your account email" : "We'll send your approval status here"}
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">
                  Anything else? <span className="font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us about your live sessions..."
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                {loading ? "Submitting..." : "Submit for Review"}
              </button>

              <p className="text-xs text-foreground-muted text-center">
                By submitting you agree to our Terms of Service. Listing is 100% free.
              </p>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
