import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * GET /api/cron/check-live
 * Called every minute by Vercel Cron.
 * Checks all creators with a connected Instagram account and updates is_live.
 */
export async function GET(request: NextRequest) {
  // Protect the endpoint — only Vercel cron can call this
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all creators with a connected Instagram account
  const { data: creators, error } = await supabaseAdmin
    .from('creators')
    .select('id, handle, is_live, instagram_user_id, instagram_access_token')
    .not('instagram_user_id', 'is', null)
    .not('instagram_access_token', 'is', null)
    .eq('status', 'approved')

  if (error || !creators?.length) {
    return NextResponse.json({ ok: true, checked: 0 })
  }

  const results = await Promise.allSettled(
    creators.map(async creator => {
      // Check if creator is currently live on Instagram
      const url = `https://graph.instagram.com/${creator.instagram_user_id}/live_media?fields=id,status&access_token=${creator.instagram_access_token}`
      const res = await fetch(url)
      const data = await res.json()

      // live_media returns an array; if data.data has items → currently live
      const isLiveNow = Array.isArray(data?.data) && data.data.length > 0

      // Only update DB if status changed
      if (isLiveNow !== creator.is_live) {
        await supabaseAdmin
          .from('creators')
          .update({ is_live: isLiveNow })
          .eq('id', creator.id)
      }

      return { handle: creator.handle, is_live: isLiveNow }
    })
  )

  const summary = results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<{ handle: string; is_live: boolean }>).value)

  return NextResponse.json({ ok: true, checked: summary.length, creators: summary })
}
