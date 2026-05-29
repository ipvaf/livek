"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"

type CreatorStatus = {
  creator: {
    id: string
    handle: string
    platform: string
    is_live: boolean
    is_verified: boolean
    status: string
  } | null
  submission: {
    id: string
    handle: string
    platform: string
    status: string
    created_at: string
  } | null
}

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")
  const [creatorStatus, setCreatorStatus] = useState<CreatorStatus | null>(null)
  const [creatorLoading, setCreatorLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  // Populate display name from user metadata
  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || "")
    }
  }, [user])

  // Fetch creator status
  useEffect(() => {
    if (!user) return
    fetch(`/api/creator/status?userId=${user.id}`)
      .then(r => r.json())
      .then(data => setCreatorStatus(data))
      .catch(() => setCreatorStatus({ creator: null, submission: null }))
      .finally(() => setCreatorLoading(false))
  }, [user])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    setSaveMsg("")

    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName.trim() },
    })

    setSaving(false)
    setSaveMsg(error ? "Failed to save — try again" : "Saved ✓")
    setTimeout(() => setSaveMsg(""), 3000)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const name = user.user_metadata?.full_name || user.email || "User"
  const email = user.email || ""
  const initial = name.charAt(0).toUpperCase()
  const joinDate = new Date(user.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  })

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-primary to-[#0D9E91]" />
          <div className="px-6 pb-6 -mt-8">
            <div className="h-16 w-16 rounded-full bg-primary border-4 border-white flex items-center justify-center mb-3 shadow-sm">
              <span className="text-2xl font-black text-white">{initial}</span>
            </div>
            <h1 className="text-xl font-black text-foreground">{name}</h1>
            <p className="text-sm text-foreground-muted">{email}</p>
            <p className="text-xs text-foreground-muted mt-1">Member since {joinDate}</p>
          </div>
        </div>

        {/* Creator Status Card */}
        <div className="bg-white border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-black text-foreground text-lg mb-4">Creator Status</h2>

          {creatorLoading ? (
            <div className="h-16 bg-surface rounded-xl animate-pulse" />
          ) : creatorStatus?.creator ? (
            /* ── Approved creator ── */
            <div className="flex items-center justify-between gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600 font-black text-sm">✓ Active Creator</span>
                  {creatorStatus.creator.is_verified && (
                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Verified</span>
                  )}
                  {creatorStatus.creator.is_live && (
                    <span className="flex items-center gap-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
                      <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground font-semibold">{creatorStatus.creator.handle}</p>
                <p className="text-xs text-foreground-muted capitalize">{creatorStatus.creator.platform}</p>
              </div>
              <Link
                href="/creators"
                className="text-xs font-semibold text-primary hover:underline shrink-0"
              >
                View profile →
              </Link>
            </div>
          ) : creatorStatus?.submission ? (
            /* ── Has a submission ── */
            <div>
              {creatorStatus.submission.status === 'pending' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 bg-amber-400 rounded-full animate-pulse" />
                    <span className="text-amber-700 font-bold text-sm">Under Review</span>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    Your application for <strong className="text-foreground">{creatorStatus.submission.handle}</strong> is being reviewed.
                    We&apos;ll notify you at <strong className="text-foreground">{email}</strong> within 48 hours.
                  </p>
                </div>
              )}
              {creatorStatus.submission.status === 'rejected' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 font-bold text-sm mb-1">Application Not Approved</p>
                  <p className="text-sm text-foreground-muted mb-3">
                    Your application for <strong className="text-foreground">{creatorStatus.submission.handle}</strong> was not approved.
                    You can submit a new application.
                  </p>
                  <Link
                    href="/sell"
                    className="inline-block text-xs font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Reapply
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* ── No submission ── */
            <div className="flex items-center justify-between gap-4 p-4 bg-surface border border-border rounded-xl">
              <div>
                <p className="font-bold text-foreground text-sm mb-0.5">Not a creator yet</p>
                <p className="text-xs text-foreground-muted">Apply to list your Instagram or TikTok account on Livek.</p>
              </div>
              <Link
                href="/sell"
                className="shrink-0 text-xs font-bold bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl transition-colors"
              >
                Apply Now
              </Link>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-black text-foreground text-lg mb-5">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground-muted bg-surface cursor-not-allowed"
              />
              <p className="text-xs text-foreground-muted mt-1">Email cannot be changed</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {saveMsg && (
                <span className={`text-sm font-semibold ${saveMsg.startsWith("Failed") ? "text-red-500" : "text-green-600"}`}>
                  {saveMsg}
                </span>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-bold text-foreground-muted uppercase tracking-wide mb-3">
              Session
            </h3>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-semibold transition-colors border border-red-200 hover:border-red-300 px-4 py-2 rounded-xl hover:bg-red-50"
            >
              Log out of Livek
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
