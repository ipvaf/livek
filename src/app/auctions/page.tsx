"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { LiveAuctionCard } from "@/components/LiveAuctionCard"
import { mockAuctions, mockCategories } from "@/lib/mock-data"

type SortOption = "ending_soon" | "price_asc" | "price_desc" | "most_bids"
type StatusFilter = "all" | "active" | "ending_soon"

export default function AuctionsPage() {
  const [categorySlug, setCategorySlug] = useState<string>("all")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [sort, setSort] = useState<SortOption>("ending_soon")

  const filtered = useMemo(() => {
    let result = [...mockAuctions]

    // Category filter
    if (categorySlug !== "all") {
      result = result.filter(a => a.categorySlug === categorySlug || a.category.toLowerCase() === categorySlug.toLowerCase())
    }

    // Status filter
    if (status !== "all") {
      result = result.filter(a => a.status === status)
    }

    // Price filter
    if (minPrice) result = result.filter(a => a.currentBid >= Number(minPrice))
    if (maxPrice) result = result.filter(a => a.currentBid <= Number(maxPrice))

    // Sort
    switch (sort) {
      case "ending_soon":
        result.sort((a, b) => a.endTime.getTime() - b.endTime.getTime())
        break
      case "price_asc":
        result.sort((a, b) => a.currentBid - b.currentBid)
        break
      case "price_desc":
        result.sort((a, b) => b.currentBid - a.currentBid)
        break
      case "most_bids":
        result.sort((a, b) => b.bidsCount - a.bidsCount)
        break
    }

    return result
  }, [categorySlug, status, minPrice, maxPrice, sort])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-border rounded-2xl p-5 sticky top-20">
              <h3 className="font-bold text-foreground mb-4">Filters</h3>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={categorySlug === "all"}
                      onChange={() => setCategorySlug("all")}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">All Categories</span>
                  </label>
                  {mockCategories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={categorySlug === cat.slug}
                        onChange={() => setCategorySlug(cat.slug)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-foreground">
                        {cat.icon} {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">Status</h4>
                <div className="space-y-2">
                  {(["all", "active", "ending_soon"] as StatusFilter[]).map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={status === s}
                        onChange={() => setStatus(s)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-foreground capitalize">
                        {s === "all" ? "All" : s === "active" ? "Active" : "Ending Soon"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">Price Range (KWD)</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                onClick={() => { setCategorySlug("all"); setStatus("all"); setMinPrice(""); setMaxPrice(""); }}
                className="w-full text-xs text-foreground-muted hover:text-live transition-colors py-1"
              >
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-sm text-foreground-muted">
                <span className="font-semibold text-foreground">{filtered.length}</span> auctions found
              </p>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="text-sm border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ending_soon">Ending Soon</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="most_bids">Most Bids</option>
              </select>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(auction => (
                  <LiveAuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="text-4xl mb-3">🔍</p>
                <h3 className="font-bold text-foreground mb-1">No auctions found</h3>
                <p className="text-sm text-foreground-muted">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
