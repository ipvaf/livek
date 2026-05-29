"use client"

import Link from "next/link"
import { LiveBanner } from "@/components/LiveBanner"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CreatorCard } from "@/components/CreatorCard"
import { creators } from "@/lib/mock-data"

export default function Home() {
  const liveCreators = creators.filter(c => c.isLive)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LiveBanner />
      <Navbar />

      {/* ── Hero ── */}
      <section className="flex-1 bg-white px-4 py-10 lg:py-14 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <span className="h-2 w-2 rounded-full bg-live inline-block animate-pulse" />
              {liveCreators.length} creators live right now
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
                href="/auctions"
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
              <Link href="/auctions" className="text-xs text-primary font-semibold hover:underline">
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {liveCreators.slice(0, 3).map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
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
              {
                step: "01",
                icon: "📲",
                title: "Creators Go Live",
                desc: "Creators stream live on Instagram & TikTok daily — but their audiences are scattered and hard to find.",
              },
              {
                step: "02",
                icon: "🗂️",
                title: "We List Them All",
                desc: "Livek tracks every verified creator in one searchable directory — who they are, what they sell, when they go live.",
              },
              {
                step: "03",
                icon: "🎯",
                title: "You Find & Join",
                desc: "Browse by category, platform, or country. Find the creator you want and jump straight into their live.",
              },
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
            href="/auctions"
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
