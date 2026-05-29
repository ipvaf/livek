"use client"

import { useState } from "react"
import { toggleCreatorLive, deleteCreator } from "@/app/admin/actions"

type Creator = {
  id: string
  handle: string
  display_name: string
  platform: string
  is_live: boolean
  status: string
  created_at: string
}

export function AdminCreators({ creators }: { creators: Creator[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = creators.filter(c =>
    c.handle.toLowerCase().includes(search.toLowerCase()) ||
    c.platform.toLowerCase().includes(search.toLowerCase())
  )

  async function handleToggleLive(id: string, isLive: boolean) {
    setLoading(`live-${id}`)
    await toggleCreatorLive(id, isLive)
    window.location.reload()
  }

  async function handleDelete(id: string, handle: string) {
    if (!confirm(`Remove ${handle} from creators? This cannot be undone.`)) return
    setLoading(`del-${id}`)
    await deleteCreator(id)
    window.location.reload()
  }

  if (creators.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-border rounded-2xl">
        <p className="text-4xl mb-3">👤</p>
        <p className="font-bold text-foreground">No creators yet</p>
        <p className="text-sm text-foreground-muted mt-1">Approve submissions above to add creators</p>
      </div>
    )
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search creators..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              {["Handle", "Platform", "Status", "Live", "Added", ""].map((h, i) => (
                <th
                  key={i}
                  className="text-left px-4 py-3 text-xs font-semibold text-foreground-muted uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm text-foreground-muted">
                  No creators match &ldquo;{search}&rdquo;
                </td>
              </tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-surface transition-colors">
                <td className="px-4 py-3 font-semibold text-foreground">{c.handle}</td>
                <td className="px-4 py-3 text-foreground-muted capitalize">{c.platform}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    c.status === "approved"
                      ? "bg-green-50 text-green-600"
                      : "bg-amber-50 text-amber-600"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleLive(c.id, c.is_live)}
                    disabled={loading === `live-${c.id}`}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 ${
                      c.is_live
                        ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                        : "bg-surface text-foreground-muted border-border hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    }`}
                  >
                    {loading === `live-${c.id}` ? "..." : c.is_live ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse inline-block" />
                        End Live
                      </>
                    ) : "Go Live"}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-foreground-muted whitespace-nowrap">
                  {new Date(c.created_at).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short",
                  })}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(c.id, c.handle)}
                    disabled={!!loading}
                    className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors disabled:opacity-40"
                  >
                    {loading === `del-${c.id}` ? "..." : "Remove"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
