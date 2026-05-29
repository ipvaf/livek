import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    let name = '', email = '', password = ''

    const contentType = request.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      name     = (body.name     ?? '').trim()
      email    = (body.email    ?? '').trim()
      password = (body.password ?? '').trim()
    } else {
      // Native HTML form POST
      const form = await request.formData()
      name     = ((form.get('name')     as string) ?? '').trim()
      email    = ((form.get('email')    as string) ?? '').trim()
      password = ((form.get('password') as string) ?? '').trim()
    }

    if (!name || !email || !password) {
      const msg = encodeURIComponent('All fields are required')
      return NextResponse.redirect(new URL(`/auth/signup?error=${msg}`, request.url), { status: 303 })
    }

    if (password.length < 6) {
      const msg = encodeURIComponent('Password must be at least 6 characters')
      return NextResponse.redirect(new URL(`/auth/signup?error=${msg}`, request.url), { status: 303 })
    }

    // Create user via admin API (bypasses browser network restrictions)
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    })

    if (createError) {
      const msg = encodeURIComponent(createError.message)
      return NextResponse.redirect(new URL(`/auth/signup?error=${msg}`, request.url), { status: 303 })
    }

    // Sign in server-side to get session tokens
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: sessionData } = await client.auth.signInWithPassword({ email, password })

    if (sessionData?.session) {
      // Pass tokens to client via the login page (JS path) or redirect home
      const url = new URL('/auth/session', request.url)
      url.searchParams.set('at', sessionData.session.access_token)
      url.searchParams.set('rt', sessionData.session.refresh_token)
      url.searchParams.set('to', '/')
      return NextResponse.redirect(url, { status: 303 })
    }

    // Fallback — account created, ask them to log in
    return NextResponse.redirect(new URL('/auth/login?created=1', request.url), { status: 303 })
  } catch (err) {
    const msg = encodeURIComponent('Something went wrong — please try again')
    return NextResponse.redirect(new URL(`/auth/signup?error=${msg}`, request.url))
  }
}
