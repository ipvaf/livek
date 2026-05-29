"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Suspense } from "react"

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")

    if (code) {
      // PKCE flow: exchange code for session
      supabase.auth.exchangeCodeForSession(code).then(() => {
        router.push("/")
      })
    } else {
      // Implicit flow: Supabase already handles it via hash fragment
      supabase.auth.getSession().then(({ data: { session } }) => {
        router.push(session ? "/" : "/auth/login")
      })
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-foreground-muted">Signing you in...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <CallbackHandler />
    </Suspense>
  )
}
