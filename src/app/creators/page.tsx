"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CreatorCard } from "@/components/CreatorCard"
import { creators } from "@/lib/mock-data"

type Filter = "all" | "instagram" | "tiktok" | "verified"

export default function CreatorsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  const filtered = useMemo(() => {
    return creators.filter(c => {
      if (filter === "instagram" && c.platform !== "instagram") return false
      if (filter === "tiktok" && c.platform !== "tiktok") return false
      if (filter === "verified" && !c.verified) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          c.displayName.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.countryName.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [filter, search])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-border py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black text-foreground mb-2">Creator Directory</h1>
          <p className="text-foreground-muted mb-8">Browse all verified live auction creators on Instagram and TikTok</p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search creators, categories, countries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
        </div>
      </section>

      {/* Filter pills */}
      <section className="bg-white border-b border-border sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto">
          {(["all", "instagram", "tiktok", "verified"] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all capitalize ${
                filter === f
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-foreground-muted border-border hover:border-primary/40 hover:text-primary"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-sm text-foreground-muted mb-6">
          <span className="font-semibold text-foreground">{filtered.length}</span> creators found
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(c => <CreatorCard key={c.id} creator={c} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="font-bold text-foreground mb-1">No creators found</h3>
            <p className="text-sm text-foreground-muted">Try a different search or filter</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
