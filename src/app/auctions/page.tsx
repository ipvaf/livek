"use client"

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
        <div className="mb-8">
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

        {/* Creator grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
