"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { LiveAuctionCard } from "@/components/LiveAuctionCard"
import { liveAuctions } from "@/lib/mock-data"
import { formatKWD } from "@/lib/utils"

type Tab = "bids" | "auctions" | "won" | "settings"

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("bids")

  const tabs: { id: Tab; label: string }[] = [
    { id: "bids", label: "My Bids" },
    { id: "auctions", label: "My Auctions" },
    { id: "won", label: "Won Items" },
    { id: "settings", label: "Settings" },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-primary to-[#0D9E91]" />
          <div className="px-6 pb-5 -mt-8">
            <div className="h-16 w-16 rounded-full bg-primary-light border-4 border-white flex items-center justify-center mb-3">
              <span className="text-2xl font-black text-primary">U</span>
            </div>
            <h1 className="text-xl font-black text-foreground">Your Name</h1>
            <p className="text-sm text-foreground-muted">user@email.com</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 shrink-0 text-sm font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${
                tab === t.id ? "bg-primary text-white" : "text-foreground-muted hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "bids" && (
          <div>
            <h2 className="font-bold text-foreground mb-4">My Active Bids</h2>
            <div className="space-y-3">
              {liveAuctions.slice(0, 3).map(auction => (
                <div key={auction.id} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-lg overflow-hidden relative shrink-0">
                    <img src={auction.imageUrl} alt={auction.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm line-clamp-1">{auction.title}</p>
                    <p className="text-xs text-foreground-muted">Your bid: <span className="font-bold text-primary">{formatKWD(auction.currentBid - 200)}</span></p>
                    <p className="text-xs text-foreground-muted">Current: <span className="font-semibold text-foreground">{formatKWD(auction.currentBid)}</span></p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    auction.currentBid > auction.startingPrice + 200 ? "bg-red-50 text-live" : "bg-green-50 text-green-700"
                  }`}>
                    {auction.currentBid > auction.startingPrice + 200 ? "Outbid" : "Winning"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "auctions" && (
          <div>
            <h2 className="font-bold text-foreground mb-4">My Listed Auctions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveAuctions.slice(3, 6).map(auction => (
                <LiveAuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </div>
        )}

        {tab === "won" && (
          <div>
            <h2 className="font-bold text-foreground mb-4">Won Items</h2>
            <div className="space-y-3">
              {liveAuctions.slice(6, 9).map(auction => (
                <div key={auction.id} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-lg overflow-hidden shrink-0">
                    <img src={auction.imageUrl} alt={auction.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm line-clamp-1">{auction.title}</p>
                    <p className="text-xs text-foreground-muted">Won for: <span className="font-bold text-primary">{formatKWD(auction.currentBid)}</span></p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-700">Won</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-bold text-foreground mb-5">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">Display Name</label>
                <input
                  type="text"
                  defaultValue="Your Name"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  defaultValue="user@email.com"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">New Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
              <button className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
