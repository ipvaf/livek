"use client"

import Link from "next/link"
import { LiveBanner } from "@/components/LiveBanner"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CreatorCard } from "@/components/CreatorCard"
import { categories, creators } from "@/lib/mock-data"

export default function Home() {
  const liveCreators = creators.filter(c => c.isLive)

  return (
    <div className="min-h-screen bg-background">
      <LiveBanner />
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-white border-b border-border py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <span className="live-dot h-2 w-2 rounded-full bg-live inline-block animate-pulse" />
              {liveCreators.length} creators live right now
            </div>
            <h1 className="text-5xl font-black text-foreground leading-tight mb-1">
              Find Who Is Live
            </h1>
            <p className="text-5xl font-black text-primary leading-tight mb-5 font-arabic">
              Right Now
            </p>
            <p className="text-foreground-muted text-lg mb-8 max-w-md leading-relaxed">
              Thousands of live auction creators are streaming right now on Instagram & TikTok — but nobody can find them. Livek is the one place to discover them all.
            </p>
            <div className="flex items-center gap-3 mb-10 flex-wrap">
              <Link href="/auctions" className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-colors">
                See Who&apos;s Live
              </Link>
              <Link href="/auth/signup" className="border border-border text-foreground font-semibold px-6 py-3 rounded-xl hover:border-primary hover:text-primary transition-colors">
                Register Your Account
              </Link>
            </div>
            {/* Trust badges */}
            <div className="flex items-center gap-6 flex-wrap">
              {["100% Free", "Real-time Data", "Verified Creators", "Worldwide"].map(badge => (
                <div key={badge} className="flex items-center gap-1.5 text-xs text-foreground-muted">
                  <span className="h-4 w-4 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-[10px]">✓</span>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Live Creators preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Live Right Now</h2>
              <Link href="/auctions" className="text-xs text-primary font-semibold hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {liveCreators.slice(0, 3).map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section className="bg-surface border-b border-border py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 flex-wrap">
          {[
            { icon: "📡", label: "Real-time Tracking" },
            { icon: "🔔", label: "Live Notifications" },
            { icon: "📱", label: "Instagram & TikTok" },
            { icon: "✓", label: "Verified Creators" },
            { icon: "🌍", label: "Worldwide" },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-2 text-sm text-foreground-muted">
              <span className="text-lg">{f.icon}</span>
              <span className="font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories + World Stats ── */}
      <section className="bg-white border-b border-border py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Categories */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-black text-foreground mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map(cat => (
                <Link key={cat.id} href={`/creators?category=${cat.slug}`} className="group block">
                  <div className="bg-surface border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all">
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <p className="font-semibold text-foreground text-sm">{cat.name}</p>
                    <p className="font-arabic text-xs text-foreground-muted">{cat.name_ar}</p>
                    <p className="text-xs text-foreground-muted mt-1">{cat.count} creators</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: World stats */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-foreground mb-6">Creators Around the World</h2>
            <div className="space-y-3">
              {[
                { region: "GCC & Middle East", count: 892, flag: "🌍" },
                { region: "North America", count: 425, flag: "🌎" },
                { region: "Europe", count: 312, flag: "🌍" },
                { region: "Asia", count: 268, flag: "🌏" },
                { region: "South America", count: 189, flag: "🌎" },
                { region: "Oceania", count: 276, flag: "🌏" },
              ].map(({ region, count, flag }) => (
                <div key={region} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">
                    {flag} {region}
                  </span>
                  <span className="font-bold text-primary text-sm">{count} live</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Top Creators ── */}
      <section className="bg-surface border-b border-border py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">Top Live Creators</h2>
            <Link href="/creators" className="text-sm text-primary font-semibold hover:underline">View all</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {creators.slice(0, 4).map(c => (
              <div key={c.id} className="shrink-0 w-64">
                <CreatorCard creator={c} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-white border-b border-border py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            How It Works
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4">
            Thousands of Lives. One Place.
          </h2>
          <p className="text-foreground-muted text-lg mb-14 max-w-2xl mx-auto">
            Every day, hundreds of creators go live on Instagram & TikTok to run auctions — cars, watches, sneakers, and more. The problem? Nobody can find them. Livek fixes that.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "📲",
                title: "Creators Go Live",
                desc: "Auction creators stream live on Instagram & TikTok every day — but their audiences are scattered and hard to reach.",
              },
              {
                step: "02",
                icon: "🗂️",
                title: "We List Them All",
                desc: "Livek tracks and lists every verified auction creator in one searchable directory — who they are, what they sell, and when they go live.",
              },
              {
                step: "03",
                icon: "🎯",
                title: "You Find & Join",
                desc: "Browse by category, platform, or country. Find the creator you want and jump straight into their live — no searching required.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative bg-surface border border-border rounded-2xl p-8 text-left">
                <span className="absolute top-6 right-6 text-4xl font-black text-border/60">{step}</span>
                <div className="text-4xl mb-5">{icon}</div>
                <h3 className="font-black text-foreground text-lg mb-3">{title}</h3>
                <p className="text-foreground-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link href="/auctions" className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-lg">
              See Who&apos;s Live Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Get the App ── */}
      <section className="bg-surface border-b border-border py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-black text-foreground mb-3">Get the App</h2>
          <p className="text-sm text-foreground-muted mb-8">Never miss a live auction — get notified the moment your favourite creator goes live.</p>
          <div className="bg-white border border-border rounded-2xl p-8">
            {/* QR placeholder */}
            <div className="h-32 w-32 bg-surface border border-border rounded-xl mx-auto mb-6 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-1 p-2 opacity-30">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`h-3 w-3 rounded-sm ${i % 3 === 0 ? 'bg-foreground' : 'bg-transparent'}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-foreground-muted mb-4">Scan to download on your phone</p>
            <div className="flex items-center gap-3 justify-center">
              <a href="#" className="flex items-center gap-2 bg-foreground text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                <span className="text-base">🍎</span> App Store
              </a>
              <a href="#" className="flex items-center gap-2 bg-foreground text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                <span className="text-base">▶️</span> Google Play
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
