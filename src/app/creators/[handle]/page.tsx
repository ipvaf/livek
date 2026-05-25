import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { creators } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.84 4.84 0 01-1.01-.06z" />
  </svg>
)

function formatFollowers(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M"
  if (n >= 1000) return (n / 1000).toFixed(0) + "K"
  return String(n)
}

export function generateStaticParams() {
  return creators.map(c => ({ handle: c.handle.replace("@", "") }))
}

export default function CreatorPage({ params }: { params: { handle: string } }) {
  const creator = creators.find(c => c.handle.replace("@", "") === params.handle)
  if (!creator) notFound()

  const isIG = creator.platform === "instagram"

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/creators" className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to creators
        </Link>

        {/* Profile card */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden mb-4">
          {/* Teal header banner */}
          <div className="h-28 bg-gradient-to-r from-primary to-[#0D9E91]" />

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-5">
              <div className="relative">
                <Image
                  src={creator.avatar}
                  alt={creator.displayName}
                  width={80}
                  height={80}
                  className="rounded-full ring-4 ring-white object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 h-7 w-7 rounded-full flex items-center justify-center text-white ${isIG ? "bg-instagram" : "bg-tiktok"}`}>
                  {isIG ? <InstagramIcon /> : <TikTokIcon />}
                </div>
              </div>

              {/* Platform badge + Join Live CTA */}
              <a
                href="#"
                className="flex items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-5 py-2.5 rounded-xl transition-colors"
              >
                Join Live
              </a>
            </div>

            {/* Name + verified + live */}
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-black text-foreground">{creator.displayName}</h1>
                {creator.verified && (
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full text-white ${isIG ? "bg-instagram" : "bg-tiktok"}`}>
                  {isIG ? "Instagram" : "TikTok"}
                </span>
                {creator.isLive && (
                  <div className="flex items-center gap-1 bg-red-50 text-live text-xs font-bold px-2.5 py-1 rounded-full">
                    <span className="live-dot h-1.5 w-1.5 rounded-full bg-live inline-block" />
                    LIVE
                  </div>
                )}
              </div>
              <p className="text-sm text-foreground-muted">{creator.handle} · {creator.flag} {creator.countryName}</p>
            </div>

            {/* Bio */}
            <p className="text-sm text-foreground-muted leading-relaxed mb-6">
              {creator.category} auction specialist with {formatFollowers(creator.followers)} followers.
              Trusted by thousands of buyers worldwide. Verified seller with a {creator.rating} star rating from {creator.reviewCount} reviews.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: "Followers", value: formatFollowers(creator.followers) },
                { label: "Rating", value: `${creator.rating}★` },
                { label: "Reviews", value: creator.reviewCount },
                { label: "Country", value: creator.flag },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface border border-border rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-foreground">{value}</p>
                  <p className="text-xs text-foreground-muted mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-primary-light border border-primary/20 text-primary rounded-full px-3 py-1 font-medium">
                {creator.category}
              </span>
              <span className="text-xs bg-surface border border-border text-foreground-muted rounded-full px-3 py-1">
                {creator.flag} {creator.countryName}
              </span>
            </div>
          </div>
        </div>

        {/* Info tip */}
        <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-sm text-primary">
          💡 <strong>How it works:</strong> This creator runs live auction sessions on {isIG ? "Instagram" : "TikTok"}.
          Head to their profile, follow them, and you&apos;ll get notified the moment they go live.
        </div>
      </div>

      <Footer />
    </div>
  )
}
