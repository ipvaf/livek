import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? ''

    let name = '', email = '', password = ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      name     = (body.name     ?? '').trim()
      email    = (body.email    ?? '').trim()
      password = (body.password ?? '').trim()
    } else {
      const form = await request.formData()
      name     = ((form.get('name')     as string) ?? '').trim()
      email    = ((form.get('email')    as string) ?? '').trim()
      password = ((form.get('password') as string) ?? '').trim()
    }

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Create user via admin API (bypasses browser network restrictions)
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    })

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    // Sign in server-side to get session tokens + user id
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: sessionData, error: signInError } = await client.auth.signInWithPassword({ email, password })

    if (signInError || !sessionData?.session) {
      // Account created but couldn't get session — redirect to login
      return NextResponse.json({ ok: true, redirect: '/auth/login?created=1' })
    }

    return NextResponse.json({
      ok: true,
      userId: sessionData.session.user.id,
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
    })
  } catch (err) {
    console.error('[auth/signup]', err)
    return NextResponse.json({ error: 'Something went wrong — please try again' }, { status: 500 })
  }
}
