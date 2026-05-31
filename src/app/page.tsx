import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CreatorCard } from "@/components/CreatorCard"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { Creator } from "@/lib/mock-data"

export const dynamic = "force-dynamic"

function dbRowToCreator(row: Record<string, unknown>): Creator {
  return {
    id: row.id as string,
    handle: row.handle as string,
    displayName: row.display_name as string,
    platform: row.platform as "instagram" | "tiktok",
    followers: (row.followers as number) ?? 0,
    country: (row.country as string) ?? "",
    flag: (row.flag as string) ?? "🌍",
    countryName: (row.country_name as string) ?? "",
    category: (row.category as string) ?? "",
    verified: (row.is_verified as boolean) ?? false,
    isLive: (row.is_live as boolean) ?? false,
    viewers: (row.viewers as number) ?? undefined,
    avatar: (row.avatar_url as string) ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.handle}`,
    rating: (row.rating as number) ?? 0,
    reviewCount: (row.review_count as number) ?? 0,
  }
}

export default async function Home() {
  // Fetch live creators from DB
  const { data: liveRows } = await supabaseAdmin
    .from("creators")
    .select("*")
    .eq("status", "approved")
    .eq("is_live", true)
    .order("viewers", { ascending: false, nullsFirst: false })
    .limit(3)

  const { count: liveCount } = await supabaseAdmin
    .from("creators")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved")
    .eq("is_live", true)

  const liveCreators: Creator[] = (liveRows ?? []).map(dbRowToCreator)
  const totalLive = liveCount ?? 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Live banner */}
      {totalLive > 0 && (
        <div className="bg-primary text-white text-xs font-semibold py-2 text-center flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white inline-block animate-pulse" />
          {totalLive} creator{totalLive !== 1 ? "s" : ""} live right now
        </div>
      )}

      <Navbar />

      {/* ── Hero ── */}
      <section className="flex-1 bg-white px-4 py-10 lg:py-14 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <span className="h-2 w-2 rounded-full bg-live inline-block animate-pulse" />
              {totalLive > 0 ? `${totalLive} creator${totalLive !== 1 ? "s" : ""} live right now` : "Live creator discovery"}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-1">
              Find Who Is Live
            </h1>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary leading-tight mb-6">
              Right Now
            </p>

            <p className="text-foreground-muted text-lg mb-8 max-w-md leading-relaxed">
              Thousands of creators are streaming live right now on Instagram & TikTok — but nobody can find them. Livek is the one place to discover them all.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
              <Link
                href="/creators"
                className="bg-primary hover:bg-primary-hover text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-base text-center"
              >
                See Who&apos;s Live
              </Link>
              <Link
                href="/auth/signup"
                className="border border-border text-foreground font-semibold px-7 py-3.5 rounded-xl hover:border-primary hover:text-primary transition-colors text-base text-center"
              >
                Register Your Account
              </Link>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              {["100% Free", "Real-time Data", "Verified Creators", "Worldwide"].map(badge => (
                <div key={badge} className="flex items-center gap-1.5 text-xs text-foreground-muted">
                  <span className="h-4 w-4 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-[10px]">✓</span>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Live creator cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground text-base">Live Right Now</h2>
              <Link href="/creators" className="text-xs text-primary font-semibold hover:underline">
                View all
              </Link>
            </div>
            {liveCreators.length > 0 ? (
              <div className="flex flex-col gap-4">
                {liveCreators.map(creator => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-2xl p-8 text-center">
                <p className="text-3xl mb-3">📡</p>
                <p className="font-bold text-foreground text-sm mb-1">No one is live yet</p>
                <p className="text-xs text-foreground-muted mb-4">Be the first creator to go live on Livek</p>
                <Link href="/apply" className="inline-block text-xs font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
                  Apply as Creator
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-surface border-t border-border py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-5">
            How It Works
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4">
            Thousands of Lives. One Place.
          </h2>
          <p className="text-foreground-muted text-base mb-12 max-w-2xl mx-auto leading-relaxed">
            Every day, creators go live on Instagram & TikTok — selling cars, watches, sneakers, and more. The problem? Nobody can find them. Livek fixes that.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-12">
            {[
              { step: "01", icon: "📲", title: "Creators Go Live", desc: "Creators stream live on Instagram & TikTok daily — but their audiences are scattered and hard to find." },
              { step: "02", icon: "🗂️", title: "We List Them All", desc: "Livek tracks every verified creator in one searchable directory — who they are, what they sell, when they go live." },
              { step: "03", icon: "🎯", title: "You Find & Join", desc: "Browse by category, platform, or country. Find the creator you want and jump straight into their live." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative bg-white border border-border rounded-2xl p-7 text-left">
                <span className="absolute top-5 right-5 text-3xl font-black text-border/50">{step}</span>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-black text-foreground text-base mb-2">{title}</h3>
                <p className="text-foreground-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/creators"
            className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
          >
            See Who&apos;s Live Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
