"use client"

import Link from "next/link"
import Image from "next/image"
import { LiveBanner } from "@/components/LiveBanner"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { LiveAuctionCard } from "@/components/LiveAuctionCard"
import { CreatorCard } from "@/components/CreatorCard"
import { liveAuctions, trendingAuctions, categories, creators } from "@/lib/mock-data"

export default function Home() {
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
              <span className="live-dot h-2 w-2 rounded-full bg-primary inline-block" />
              12,458 live auctions right now
            </div>
            <h1 className="text-5xl font-black text-foreground leading-tight mb-1">
              Discover Live Auctions
            </h1>
            <p className="text-5xl font-black text-primary leading-tight mb-5 font-arabic">
              Happening Right Now
            </p>
            <p className="text-foreground-muted text-lg mb-8 max-w-md leading-relaxed">
              Find the best live auction sellers on Instagram & TikTok — cars, watches, sneakers, and more. Real-time bids, verified sellers, worldwide.
            </p>
            <div className="flex items-center gap-3 mb-10 flex-wrap">
              <Link href="/auctions" className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Explore Auctions
              </Link>
              <Link href="/auth/signup" className="border border-border text-foreground font-semibold px-6 py-3 rounded-xl hover:border-primary hover:text-primary transition-colors">
                Register Your Account
              </Link>
            </div>
            {/* Trust badges */}
            <div className="flex items-center gap-6 flex-wrap">
              {["100% Free", "Real-time Alerts", "Verified Sellers", "Worldwide"].map(badge => (
                <div key={badge} className="flex items-center gap-1.5 text-xs text-foreground-muted">
                  <span className="h-4 w-4 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-[10px]">✓</span>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Live Auctions preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Live Auctions Now</h2>
              <Link href="/auctions" className="text-xs text-primary font-semibold hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {liveAuctions.slice(0, 3).map(auction => (
                <LiveAuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section className="bg-surface border-b border-border py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 flex-wrap">
          {[
            { icon: "🤖", label: "AI Recommendations" },
            { icon: "🔔", label: "Live Notifications" },
            { icon: "📱", label: "Multi-Platform" },
            { icon: "✓", label: "Premium Verified" },
            { icon: "💬", label: "24/7 Support" },
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
            <h2 className="text-2xl font-black text-foreground mb-6">Browse Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map(cat => (
                <Link key={cat.id} href={`/auctions?category=${cat.slug}`} className="group block">
                  <div className="bg-surface border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all">
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <p className="font-semibold text-foreground text-sm">{cat.name}</p>
                    <p className="font-arabic text-xs text-foreground-muted">{cat.name_ar}</p>
                    <p className="text-xs text-foreground-muted mt-1">{cat.count} auctions</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: World stats */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-foreground mb-6">Auctions Around the World</h2>
            <div className="space-y-3">
              {[
                { region: "North America", count: 425, flag: "🌎" },
                { region: "Europe", count: 312, flag: "🌍" },
                { region: "Asia", count: 268, flag: "🌏" },
                { region: "South America", count: 189, flag: "🌎" },
                { region: "Africa", count: 205, flag: "🌍" },
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
            <h2 className="text-2xl font-black text-foreground">Top Auction Creators</h2>
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

      {/* ── Trending Auctions ── */}
      <section className="bg-white border-b border-border py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">Trending Auctions</h2>
            <Link href="/auctions" className="text-sm text-primary font-semibold hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {trendingAuctions.map(auction => (
              <LiveAuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Picks + App Download ── */}
      <section className="bg-surface border-b border-border py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: AI Picks */}
          <div>
            <h2 className="text-2xl font-black text-foreground mb-6">AI Picks For You</h2>
            <div className="space-y-4">
              {liveAuctions.slice(0, 3).map(auction => (
                <Link key={auction.id} href={`/auctions/${auction.id}`} className="flex items-center gap-4 bg-white border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                  <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden">
                    <Image src={auction.imageUrl} alt={auction.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm line-clamp-1">{auction.title}</p>
                    <p className="text-xs text-foreground-muted">{auction.creator.handle}</p>
                    {auction.viewers && (
                      <p className="text-xs text-live font-semibold">{auction.viewers.toLocaleString()} watching</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Get the App */}
          <div>
            <h2 className="text-2xl font-black text-foreground mb-6">Get the App</h2>
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              {/* QR placeholder */}
              <div className="h-32 w-32 bg-surface border border-border rounded-xl mx-auto mb-6 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-1 p-2 opacity-30">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`h-3 w-3 rounded-sm ${Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'}`} />
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
        </div>
      </section>

      <Footer />
    </div>
  )
}
