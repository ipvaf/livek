import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { creatorId, accessToken } = await request.json()

    if (!creatorId || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify the access token → get user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Confirm this creator belongs to this user
    const { data: creator } = await supabaseAdmin
      .from('creators')
      .select('id, is_live, user_id')
      .eq('id', creatorId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!creator) {
      return NextResponse.json({ error: 'Creator not found or not owned by you' }, { status: 403 })
    }

    const newLive = !creator.is_live

    await supabaseAdmin
      .from('creators')
      .update({ is_live: newLive })
      .eq('id', creatorId)

    return NextResponse.json({ ok: true, is_live: newLive })
  } catch (err) {
    console.error('[creator/toggle-live]', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
