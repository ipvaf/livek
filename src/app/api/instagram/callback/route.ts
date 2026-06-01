import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * GET /api/instagram/callback?code=...&state=<creatorId>
 * Meta redirects here after the creator approves the app.
 * Uses NEW Instagram Business Login (not deprecated Basic Display API).
 *
 * 1. Exchange code for short-lived token
 * 2. Fetch Instagram user ID from /me (Business Login returns it differently)
 * 3. Exchange for long-lived token (60 days)
 * 4. Store token + user ID in creators table
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code      = searchParams.get('code')
  const creatorId = searchParams.get('state')
  const error     = searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://livek.vercel.app'

  if (error || !code || !creatorId) {
    console.error('[instagram/callback] OAuth denied or missing params:', { error, code: !!code, creatorId })
    return NextResponse.redirect(`${baseUrl}/profile?instagram_error=1`)
  }

  const appId       = process.env.META_APP_ID!
  const appSecret   = process.env.META_APP_SECRET!
  const redirectUri = `${baseUrl}/api/instagram/callback`

  try {
    // Step 1: Exchange authorization code for short-lived token
    // Token endpoint is the same for both old and new Instagram Login
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     appId,
        client_secret: appSecret,
        grant_type:    'authorization_code',
        redirect_uri:  redirectUri,
        code,
      }),
    })
    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      console.error('[instagram/callback] token exchange failed:', tokenData)
      return NextResponse.redirect(`${baseUrl}/profile?instagram_error=1`)
    }

    const shortToken = tokenData.access_token

    // Step 2: Get Instagram User ID
    // Business Login returns user_id in the token response (same field as Basic Display)
    // Fallback: fetch from Graph API /me endpoint
    let igUserId: string = tokenData.user_id?.toString() ?? ''
    if (!igUserId) {
      const meRes  = await fetch(`https://graph.instagram.com/me?fields=id&access_token=${shortToken}`)
      const meData = await meRes.json()
      igUserId     = meData.id ?? ''
    }

    if (!igUserId) {
      console.error('[instagram/callback] could not determine Instagram user ID')
      return NextResponse.redirect(`${baseUrl}/profile?instagram_error=1`)
    }

    // Step 3: Exchange short-lived token for long-lived token (60-day expiry)
    const longTokenRes  = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`
    )
    const longTokenData = await longTokenRes.json()
    const longToken     = longTokenData.access_token ?? shortToken
    const expiresIn     = longTokenData.expires_in   ?? 5184000 // 60 days default

    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    // Step 4: Save to creators table
    const { error: dbError } = await supabaseAdmin
      .from('creators')
      .update({
        instagram_user_id:          igUserId,
        instagram_access_token:     longToken,
        instagram_token_expires_at: expiresAt,
      })
      .eq('id', creatorId)

    if (dbError) {
      console.error('[instagram/callback] DB update failed:', dbError)
      return NextResponse.redirect(`${baseUrl}/profile?instagram_error=1`)
    }

    return NextResponse.redirect(`${baseUrl}/profile?instagram_connected=1`)
  } catch (err) {
    console.error('[instagram/callback]', err)
    return NextResponse.redirect(`${baseUrl}/profile?instagram_error=1`)
  }
}
