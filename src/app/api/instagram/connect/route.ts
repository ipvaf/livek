import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * GET /api/instagram/connect?creatorId=<creator_id>
 * Redirects the creator to Meta's Instagram Business Login OAuth page.
 * Uses the NEW Instagram Login product (not deprecated Basic Display API).
 * After approval, Meta redirects to /api/instagram/callback?code=...&state=<creatorId>
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const creatorId = searchParams.get('creatorId')

  if (!creatorId) {
    return NextResponse.json({ error: 'Missing creatorId' }, { status: 400 })
  }

  const appId     = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET // validated but not used in redirect

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: 'META_APP_ID and META_APP_SECRET are not configured in Vercel environment variables' },
      { status: 500 }
    )
  }

  const baseUrl     = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://livek.vercel.app'
  const redirectUri = `${baseUrl}/api/instagram/callback`

  // New Instagram Business Login scopes
  // instagram_business_basic: read profile + media (includes live_media)
  // instagram_business_manage_messages: required by the use case (even if unused)
  const scopes = [
    'instagram_business_basic',
    'instagram_business_manage_messages',
    'instagram_business_content_publish',
  ].join(',')

  // NEW auth URL — www.instagram.com (not deprecated api.instagram.com)
  const oauthUrl = new URL('https://www.instagram.com/oauth/authorize')
  oauthUrl.searchParams.set('client_id', appId)
  oauthUrl.searchParams.set('redirect_uri', redirectUri)
  oauthUrl.searchParams.set('scope', scopes)
  oauthUrl.searchParams.set('response_type', 'code')
  oauthUrl.searchParams.set('state', creatorId) // carry creatorId through OAuth flow

  return NextResponse.redirect(oauthUrl.toString())
}
