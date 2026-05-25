"use client"

import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CreatorCard } from "@/components/CreatorCard"
import { creators } from "@/lib/mock-data"

export default function LiveNowPage() {
  // Live creators first (sorted by viewers desc), then offline
  const sorted = [...creators].sort((a, b) => {
    if (a.isLive && !b.isLive) return -1
    if (!a.isLive && b.isLive) return 1
    return (b.viewers ?? 0) - (a.viewers ?? 0)
  })

  const liveCount = creators.filter(c => c.isLive).length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-foreground">Live Now</h1>
              <div className="flex items-center gap-1.5 bg-red-50 text-live text-sm font-bold px-3 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-live animate-pulse inline-block" />
                {liveCount} live
              </div>
            </div>
            <p className="text-foreground-muted text-sm">
              Auction creators streaming right now on Instagram & TikTok
            </p>
          </div>

          {/* Are you a creator? CTA */}
          <Link
            href="/sell"
            className="shrink-0 flex items-center gap-2 bg-primary-light border border-primary/30 text-primary text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all"
          >
            <span>📡</span>
            List Your Account
          </Link>
        </div>

        {/* Creator grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-14 bg-gradient-to-r from-primary to-[#0D9E91] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-black text-xl mb-1">Are you an auction creator?</h3>
            <p className="text-white/80 text-sm">Get listed on Livek and reach thousands of buyers. It&apos;s free.</p>
          </div>
          <Link
            href="/sell"
            className="shrink-0 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-primary-light transition-colors text-sm"
          >
            List Your Account →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
