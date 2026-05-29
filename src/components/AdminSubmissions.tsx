"use client"

import { useState } from "react"
import { approveSubmission, rejectSubmission, deleteSubmission } from "@/app/admin/actions"

type Submission = {
  id: string
  handle: string
  platform: "instagram" | "tiktok"
  profile_url: string | null
  category: string
  country: string
  followers: number | null
  email: string
  message: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
}

type Filter = "pending" | "approved" | "rejected" | "all"

export function AdminSubmissions({ submissions }: { submissions: Submission[] }) {
  const [filter, setFilter] = useState<Filter>("pending")
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = submissions.filter(s => filter === "all" || s.status === filter)

  async function handleApprove(id: string) {
    setLoading(`approve-${id}`)
    await approveSubmission(id)
    window.location.reload()
  }

  async function handleReject(id: string) {
    setLoading(`reject-${id}`)
    await rejectSubmission(id)
    window.location.reload()
  }

  async function handleDelete(id: string, handle: string) {
    if (!confirm(`Permanently delete submission from ${handle}?`)) return
    setLoading(`delete-${id}`)
    await deleteSubmission(id)
    window.location.reload()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-black text-foreground text-lg">Creator Submissions</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {(["pending", "all", "approved", "rejected"] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all capitalize ${
                filter === f
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-foreground-muted border-border hover:border-primary/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-2xl">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold text-foreground mb-1">No {filter} submissions</p>
          <p className="text-sm text-foreground-muted">Share the listing link to get your first creators</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(s => (
            <div
              key={s.id}
              className="bg-white border border-border rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  {/* Badges row */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      s.platform === "instagram"
                        ? "bg-pink-50 text-pink-600"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {s.platform === "instagram" ? "Instagram" : "TikTok"}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      s.status === "pending"  ? "bg-amber-50 text-amber-600" :
                      s.status === "approved" ? "bg-green-50 text-green-600" :
                                                "bg-red-50 text-red-500"
                    }`}>
                      {s.status}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {new Date(s.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Handle */}
                  <h3 className="font-black text-foreground text-base mb-2">{s.handle}</h3>

                  {/* Details */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-foreground-muted mb-2">
                    <span>📂 {s.category}</span>
                    <span>🌍 {s.country}</span>
                    {s.followers && (
                      <span>👥 {s.followers.toLocaleString()} followers</span>
                    )}
                    <span>✉️ {s.email}</span>
                  </div>

                  {/* Profile URL */}
                  {s.profile_url && (
                    <a
                      href={s.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline block mb-2"
                    >
                      🔗 {s.profile_url}
                    </a>
                  )}

                  {/* Message */}
                  {s.message && (
                    <p className="text-xs text-foreground-muted bg-surface rounded-lg px-3 py-2 mt-2">
                      &ldquo;{s.message}&rdquo;
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {/* Approve — show for pending and rejected */}
                  {(s.status === "pending" || s.status === "rejected") && (
                    <button
                      onClick={() => handleApprove(s.id)}
                      disabled={!!loading}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-40 min-w-[100px]"
                    >
                      {loading === `approve-${s.id}` ? "..." : "✓ Approve"}
                    </button>
                  )}

                  {/* Reject — show only for pending */}
                  {s.status === "pending" && (
                    <button
                      onClick={() => handleReject(s.id)}
                      disabled={!!loading}
                      className="bg-white hover:bg-red-50 text-red-500 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-40 border border-red-200 min-w-[100px]"
                    >
                      {loading === `reject-${s.id}` ? "..." : "✕ Reject"}
                    </button>
                  )}

                  {/* Delete — always available */}
                  <button
                    onClick={() => handleDelete(s.id, s.handle)}
                    disabled={!!loading}
                    className="bg-white text-foreground-muted hover:text-red-500 text-xs font-semibold px-5 py-2 rounded-xl transition-colors disabled:opacity-40 border border-border hover:border-red-200 min-w-[100px]"
                  >
                    {loading === `delete-${s.id}` ? "..." : "🗑 Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
