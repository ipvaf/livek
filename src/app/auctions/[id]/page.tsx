import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CreatorCard } from "@/components/CreatorCard"
import { liveAuctions, creators } from "@/lib/mock-data"
import { ArrowLeft, Eye } from "lucide-react"

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.84 4.84 0 01-1.01-.06z" />
  </svg>
)

export function generateStaticParams() {
  return liveAuctions.map(a => ({ id: a.id }))
}

export default async function LiveSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = liveAuctions.find(a => a.id === id)
  if (!session) notFound()

  const creator = session.creator
  const isIG = session.platform === "instagram"

  // Other creators in the same category (excluding this one's creator)
  const relatedCreators = creators
    .filter(c => c.category === session.category && c.id !== creator.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/auctions" className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Live Now
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Session visual */}
          <div className="lg:col-span-2 space-y-5">

            {/* Thumbnail */}
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-border">
              <Image src={session.imageUrl} alt={session.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* LIVE / Offline badge */}
              {session.isLive ? (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-live text-white text-sm font-bold px-3 py-1 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-white inline-block animate-pulse" />
                  LIVE
                </div>
              ) : (
                <div className="absolute top-3 left-3 bg-black/60 text-white/80 text-sm font-medium px-3 py-1 rounded-full">
                  Offline
                </div>
              )}

              {/* Viewers */}
              {session.isLive && session.viewers && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  <Eye className="h-4 w-4" />
                  {session.viewers >= 1000
                    ? (session.viewers / 1000).toFixed(1) + "K"
                    : session.viewers}{" "}
                  watching
                </div>
              )}

              {/* Creator info overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <Image
                  src={creator.avatar}
                  alt={creator.displayName}
                  width={44}
                  height={44}
                  className="rounded-full ring-2 ring-white object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-white text-sm">{creator.displayName}</p>
                    {creator.verified && (
                      <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-white/70 text-xs">{creator.handle}</p>
                </div>
              </div>
            </div>

            {/* Session info */}
            <div className="bg-white border border-border rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wide bg-primary-light px-2.5 py-1 rounded-full">
                  {session.category}
                </span>
                <span className="text-xs text-foreground-muted">{creator.flag} {creator.countryName}</span>
              </div>
              <h1 className="text-xl font-black text-foreground mb-1">{session.title}</h1>
              <p className="font-arabic text-sm text-foreground-muted mb-4">{session.title_ar}</p>
              <p className="text-sm text-foreground-muted leading-relaxed">{session.description}</p>
            </div>
          </div>

          {/* Right: Watch CTA + Creator */}
          <div className="space-y-4">

            {/* Watch Live CTA */}
            <div className="bg-white border border-border rounded-2xl p-4 sm:p-6 text-center">
              {session.isLive ? (
                <>
                  <div className="flex items-center justify-center gap-1.5 text-live font-bold text-sm mb-3">
                    <span className="h-2 w-2 rounded-full bg-live animate-pulse inline-block" />
                    Streaming Live Now
                  </div>
                  <a
                    href="#"
                    className={`flex items-center justify-center gap-2.5 w-full text-white font-bold py-3.5 rounded-xl transition-opacity hover:opacity-90 text-sm ${isIG ? "bg-instagram" : "bg-tiktok"}`}
                  >
                    {isIG ? <InstagramIcon /> : <TikTokIcon />}
                    Watch on {isIG ? "Instagram" : "TikTok"}
                  </a>
                  {session.viewers && (
                    <p className="text-xs text-foreground-muted mt-3 flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3" />
                      {session.viewers.toLocaleString()} people watching right now
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-foreground-muted mb-3">This creator is currently offline. Follow them to get notified when they go live.</p>
                  <a
                    href="#"
                    className={`flex items-center justify-center gap-2.5 w-full text-white font-bold py-3.5 rounded-xl transition-opacity hover:opacity-90 text-sm ${isIG ? "bg-instagram" : "bg-tiktok"}`}
                  >
                    {isIG ? <InstagramIcon /> : <TikTokIcon />}
                    Follow on {isIG ? "Instagram" : "TikTok"}
                  </a>
                </>
              )}
            </div>

            {/* Creator card */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground text-sm mb-4">About the Creator</h3>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={creator.avatar}
                  alt={creator.displayName}
                  width={48}
                  height={48}
                  className="rounded-full ring-2 ring-border object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-foreground text-sm">{creator.displayName}</p>
                    {creator.verified && (
                      <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-foreground-muted">{creator.handle}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                <div className="bg-surface rounded-lg p-2.5">
                  <p className="font-bold text-foreground text-sm">
                    {creator.followers >= 1000000
                      ? (creator.followers / 1000000).toFixed(1) + "M"
                      : (creator.followers / 1000).toFixed(0) + "K"}
                  </p>
                  <p className="text-xs text-foreground-muted">Followers</p>
                </div>
                <div className="bg-surface rounded-lg p-2.5">
                  <p className="font-bold text-foreground text-sm">{creator.rating}★</p>
                  <p className="text-xs text-foreground-muted">{creator.reviewCount} reviews</p>
                </div>
              </div>
              <Link
                href={`/creators/${creator.handle.replace("@", "")}`}
                className="block w-full text-center text-sm font-semibold text-primary border border-primary/40 bg-primary-light hover:bg-primary hover:text-white rounded-xl py-2.5 transition-colors"
              >
                View Full Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Related creators in same category */}
        {relatedCreators.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl font-black text-foreground mb-5">
              More {session.category} Creators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedCreators.map(c => (
                <CreatorCard key={c.id} creator={c} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
