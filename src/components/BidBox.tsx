"use client"

import { useState } from "react"
import { Auction } from "@/lib/mock-data"
import { formatKWD } from "@/lib/utils"
import { CountdownTimer } from "@/components/CountdownTimer"

export function BidBox({ auction }: { auction: Auction }) {
  const [bidAmount, setBidAmount] = useState<string>("")

  const minBid = auction.currentBid + 10

  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <div className="mb-4">
        <p className="text-xs text-foreground-muted uppercase tracking-wide font-semibold mb-1">Current Bid</p>
        <p className="text-3xl font-black text-primary">{formatKWD(auction.currentBid)}</p>
        <p className="text-xs text-foreground-muted mt-1">{auction.bidsCount} bids placed</p>
      </div>

      {/* Countdown */}
      <div className="bg-surface rounded-xl p-4 mb-4 text-center">
        <p className="text-xs text-foreground-muted mb-1">Auction ends in</p>
        <CountdownTimer endTime={auction.endTime} variant="large" />
      </div>

      {/* Bid input */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-foreground-muted mb-1">
          Your Bid (min. {formatKWD(minBid)})
        </label>
        <input
          type="number"
          value={bidAmount}
          onChange={e => setBidAmount(e.target.value)}
          placeholder={String(minBid)}
          min={minBid}
          step={10}
          className="w-full px-4 py-3 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>

      <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors text-sm">
        Place Bid
      </button>

      <p className="text-xs text-foreground-muted text-center mt-3">
        Starting price: {formatKWD(auction.startingPrice)}
      </p>
    </div>
  )
}
