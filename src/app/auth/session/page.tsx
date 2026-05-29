"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Suspense } from "react"

function SessionInit() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const at  = searchParams.get("at")
    const rt  = searchParams.get("rt")
    const to  = searchParams.get("to") ?? "/"

    if (at && rt) {
      supabase.auth.setSession({ access_token: at, refresh_token: rt }).then(() => {
        window.location.href = to
      })
    } else {
      window.location.href = to
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-foreground-muted">Signing you in...</p>
      </div>
    </div>
  )
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <SessionInit />
    </Suspense>
  )
}
