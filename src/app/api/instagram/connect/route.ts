import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * GET /api/instagram/connect?userId=<creator_id>
 * Redirects the creator to Meta's OAuth page.
 * After approval, Meta redirects to /api/instagram/callback?code=...&state=<creatorId>
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const creatorId = searchParams.get('creatorId')

  if (!creatorId) {
    return NextResponse.json({ error: 'Missing creatorId' }, { status: 400 })
  }

  const appId     = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET // not used here but validated

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: 'META_APP_ID and META_APP_SECRET are not configured in Vercel environment variables' },
      { status: 500 }
    )
  }

  const baseUrl    = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://livek.vercel.app'
  const redirectUri = `${baseUrl}/api/instagram/callback`

  // Scopes needed: instagram_basic to read user ID + live_media
  const scopes = ['instagram_basic', 'instagram_manage_insights'].join(',')

  const oauthUrl = new URL('https://api.instagram.com/oauth/authorize')
  oauthUrl.searchParams.set('client_id', appId)
  oauthUrl.searchParams.set('redirect_uri', redirectUri)
  oauthUrl.searchParams.set('scope', scopes)
  oauthUrl.searchParams.set('response_type', 'code')
  oauthUrl.searchParams.set('state', creatorId) // carry creatorId through OAuth

  return NextResponse.redirect(oauthUrl.toString())
}
