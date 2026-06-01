import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Allow up to 5 minutes for Apify scraping (Vercel Pro cron limit)
export const maxDuration = 300

/**
 * GET /api/cron/check-live
 * Called every minute by Vercel Cron.
 * Uses Apify to scrape Instagram profiles and detect live status.
 * Works for ALL account types (personal, creator, business) — no OAuth needed.
 */
export async function GET(request: NextRequest) {
  // Protect the endpoint — only Vercel cron can call this
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.APIFY_TOKEN) {
    return NextResponse.json({ error: 'APIFY_TOKEN not configured' }, { status: 500 })
  }

  // Fetch all approved Instagram creators
  const { data: creators, error } = await supabaseAdmin
    .from('creators')
    .select('id, handle, is_live, platform')
    .eq('status', 'approved')
    .eq('platform', 'instagram')

  if (error || !creators?.length) {
    return NextResponse.json({ ok: true, checked: 0, message: 'No Instagram creators found' })
  }

  // Build Instagram profile URLs for all creators
  const profileUrls = creators.map(c =>
    `https://www.instagram.com/${c.handle.replace(/^@/, '')}/`
  )

  // Run Apify Instagram scraper for all profiles in one batch
  // run-sync-get-dataset-items: starts the actor and waits for results in one request
  const apifyRes = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_TOKEN}&timeout=270`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        directUrls: profileUrls,
        resultsType: 'details',
        maxItems: creators.length,
      }),
    }
  )

  if (!apifyRes.ok) {
    const errText = await apifyRes.text()
    console.error('[check-live] Apify error:', errText)
    return NextResponse.json({ ok: false, error: 'Apify request failed', detail: errText }, { status: 500 })
  }

  const profiles = await apifyRes.json() as Array<Record<string, unknown>>

  // Build a username → isLive lookup map
  // Check multiple possible fields — log first profile to verify field names in Vercel logs
  if (profiles.length > 0) {
    console.log('[check-live] Sample Apify profile fields:', Object.keys(profiles[0]))
  }

  const liveMap = new Map<string, boolean>()
  for (const profile of profiles) {
    const username = ((profile.username ?? profile.ownerUsername) as string ?? '').toLowerCase()
    if (!username) continue

    const isLive = Boolean(
      profile.isLive ||
      profile.live ||
      profile.hasLiveMedia ||
      (profile.liveVideoStatus === 'active')
    )
    liveMap.set(username, isLive)
  }

  // Update DB only for creators whose live status has changed
  const updates = await Promise.allSettled(
    creators.map(async creator => {
      const handle = creator.handle.replace(/^@/, '').toLowerCase()
      const isLiveNow = liveMap.get(handle) ?? false

      if (isLiveNow !== creator.is_live) {
        await supabaseAdmin
          .from('creators')
          .update({ is_live: isLiveNow })
          .eq('id', creator.id)
        console.log(`[check-live] ${creator.handle}: ${creator.is_live} → ${isLiveNow}`)
      }

      return { handle: creator.handle, is_live: isLiveNow }
    })
  )

  const summary = updates
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<{ handle: string; is_live: boolean }>).value)

  return NextResponse.json({ ok: true, checked: summary.length, creators: summary })
}
