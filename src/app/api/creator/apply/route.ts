import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    let handle = '', platform = 'instagram', profileUrl = '', category = '',
        country = '', followers = '', email = '', message = '', userId = ''

    const contentType = request.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      handle     = (body.handle     ?? '').trim().replace(/^@/, '')
      platform   = (body.platform   ?? 'instagram').trim()
      profileUrl = (body.profileUrl ?? '').trim()
      category   = (body.category   ?? '').trim()
      country    = (body.country    ?? '').trim()
      followers  = (body.followers  ?? '').toString().trim()
      email      = (body.email      ?? '').trim()
      message    = (body.message    ?? '').trim()
      userId     = (body.userId     ?? '').trim()
    } else {
      const form = await request.formData()
      handle     = ((form.get('handle')     as string) ?? '').trim().replace(/^@/, '')
      platform   = ((form.get('platform')   as string) ?? 'instagram').trim()
      profileUrl = ((form.get('profileUrl') as string) ?? '').trim()
      category   = ((form.get('category')   as string) ?? '').trim()
      country    = ((form.get('country')    as string) ?? '').trim()
      followers  = ((form.get('followers')  as string) ?? '').trim()
      email      = ((form.get('email')      as string) ?? '').trim()
      message    = ((form.get('message')    as string) ?? '').trim()
      userId     = ((form.get('userId')     as string) ?? '').trim()
    }

    // Validate required fields
    if (!handle || !category || !country || !email) {
      return NextResponse.json({ error: 'Handle, category, country, and email are required' }, { status: 400 })
    }
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (!['instagram', 'tiktok'].includes(platform)) {
      platform = 'instagram'
    }

    // Check for existing pending/approved submission with same handle
    const { data: existing } = await supabaseAdmin
      .from('creator_submissions')
      .select('id, status')
      .eq('handle', `@${handle}`)
      .in('status', ['pending', 'approved'])
      .maybeSingle()

    if (existing) {
      const msg = existing.status === 'approved'
        ? 'This handle is already listed on Livek'
        : 'A submission for this handle is already under review'
      return NextResponse.json({ error: msg }, { status: 409 })
    }

    const { error: insertError } = await supabaseAdmin
      .from('creator_submissions')
      .insert({
        handle: `@${handle}`,
        platform: platform as 'instagram' | 'tiktok',
        profile_url: profileUrl || null,
        category,
        country,
        followers: followers ? Number(followers) : null,
        email,
        message: message || null,
        user_id: userId || null,
      })

    if (insertError) {
      console.error('[creator/apply] insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[creator/apply] catch:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
