import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { BidBox } from "@/components/BidBox"
import { LiveAuctionCard } from "@/components/LiveAuctionCard"
import { liveAuctions, mockBidHistory } from "@/lib/mock-data"
import { formatKWD, formatTimeAgo } from "@/lib/utils"
import { ArrowLeft, MapPin, Star } from "lucide-react"

export function generateStaticParams() {
  return liveAuctions.map(a => ({ id: a.id }))
}

export default async function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auction = liveAuctions.find(a => a.id === id)
  if (!auction) notFound()

  const related = liveAuctions.filter(a => a.categorySlug === auction.categorySlug && a.id !== auction.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/auctions" className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to auctions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative h-80 rounded-2xl overflow-hidden bg-border">
              <Image src={auction.imageUrl} alt={auction.title} fill className="object-cover" />
              {auction.isLive && (
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-live text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-white inline-block animate-pulse" />
                  LIVE
                </div>
              )}
            </div>

            {/* Title & meta */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1">{auction.category}</p>
              <h1 className="text-2xl font-black text-foreground mb-1">{auction.title}</h1>
              <p className="font-arabic text-sm text-foreground-muted mb-4">{auction.title_ar}</p>

              <div className="flex items-center gap-4 flex-wrap text-xs text-foreground-muted mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {auction.location}
                </span>
                <span>Condition: <strong className="text-foreground">{auction.condition}</strong></span>
                <span>Starting: <strong className="text-foreground">{formatKWD(auction.startingPrice)}</strong></span>
              </div>

              <p className="text-sm text-foreground-muted leading-relaxed">{auction.description}</p>
            </div>

            {/* Bid history */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-4">Bid History</h2>
              <div className="space-y-4">
                {mockBidHistory.map(bid => (
                  <div key={bid.id} className="flex items-center gap-3">
                    <Image
                      src={bid.bidderAvatar}
                      alt={bid.bidderName}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{bid.bidderName}</p>
                      <p className="text-xs text-foreground-muted">{formatTimeAgo(bid.createdAt)}</p>
                    </div>
                    <p className="font-bold text-primary text-sm">{formatKWD(bid.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {/* Bid box */}
            <BidBox auction={auction} />

            {/* Seller card */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-3">Seller</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                  <span className="font-bold text-primary text-sm">{auction.sellerName[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{auction.sellerName}</p>
                  <div className="flex items-center gap-1 text-xs text-foreground-muted">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {auction.sellerRating} · {auction.sellerSales} sales
                  </div>
                </div>
              </div>
              <Link href={`/creators/${auction.creator.handle.replace("@", "")}`} className="block w-full text-center text-sm font-semibold text-primary border border-primary rounded-xl py-2 hover:bg-primary-light transition-colors">
                View Creator Profile
              </Link>
            </div>

            {/* Trust badges */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-3">Buyer Protection</h3>
              <ul className="space-y-2 text-xs text-foreground-muted">
                {["Verified seller", "Secure payment", "Authenticity guarantee", "Dispute resolution"].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-[10px]">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related auctions */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black text-foreground mb-5">Related Auctions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(a => <LiveAuctionCard key={a.id} auction={a} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
