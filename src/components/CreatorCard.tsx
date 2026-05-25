import Link from "next/link"
import Image from "next/image"
import { Creator } from "@/lib/mock-data"

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.84 4.84 0 01-1.01-.06z" />
  </svg>
)

function formatFollowers(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M"
  if (n >= 1000) return (n / 1000).toFixed(0) + "K"
  return String(n)
}

export function CreatorCard({ creator }: { creator: Creator }) {
  const isIG = creator.platform === "instagram"
  const handle = creator.handle.replace("@", "")

  return (
    <div className="bg-white border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200">
      {/* Avatar + platform badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <Image
            src={creator.avatar}
            alt={creator.displayName}
            width={56}
            height={56}
            className="rounded-full object-cover ring-2 ring-border"
          />
          <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-white ${isIG ? "bg-instagram" : "bg-tiktok"}`}>
            {isIG ? <InstagramIcon /> : <TikTokIcon />}
          </div>
        </div>

        {creator.isLive && creator.viewers ? (
          <div className="flex items-center gap-1 bg-red-50 text-live text-xs font-bold px-2 py-1 rounded-full">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-live inline-block" />
            {creator.viewers >= 1000 ? (creator.viewers / 1000).toFixed(1) + "K" : creator.viewers} live
          </div>
        ) : (
          <span className="text-xs text-foreground-muted bg-surface border border-border px-2 py-1 rounded-full">Offline</span>
        )}
      </div>

      {/* Name + handle */}
      <div className="mb-2">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="font-bold text-foreground text-sm">{creator.displayName}</p>
          {creator.verified && (
            <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <p className="text-xs text-foreground-muted">{creator.handle}</p>
      </div>

      {/* Flag + country */}
      <p className="text-xs text-foreground-muted mb-3">
        {creator.flag} {creator.countryName}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-foreground-muted border-t border-border pt-3 mb-4">
        <span>{formatFollowers(creator.followers)} followers</span>
        <div className="flex items-center gap-0.5 text-amber-500">
          <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-semibold text-foreground">{creator.rating}</span>
          <span className="text-foreground-muted ml-0.5">({creator.reviewCount})</span>
        </div>
      </div>

      {/* Join Live button */}
      <Link
        href={`/creators/${handle}`}
        className="block w-full text-center bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2 rounded-xl transition-colors"
      >
        Join Live
      </Link>
    </div>
  )
}
