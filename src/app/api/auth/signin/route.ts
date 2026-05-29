import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    let email = '', password = ''

    const contentType = request.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      email    = (body.email    ?? '').trim()
      password = (body.password ?? '').trim()
    } else {
      const form = await request.formData()
      email    = ((form.get('email')    as string) ?? '').trim()
      password = ((form.get('password') as string) ?? '').trim()
    }

    if (!email || !password) {
      const msg = encodeURIComponent('Email and password are required')
      return NextResponse.redirect(new URL(`/auth/login?error=${msg}`, request.url), { status: 303 })
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await client.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      const msg = encodeURIComponent(error?.message ?? 'Invalid email or password')
      return NextResponse.redirect(new URL(`/auth/login?error=${msg}`, request.url), { status: 303 })
    }

    // Pass session tokens to client via /auth/session
    const url = new URL('/auth/session', request.url)
    url.searchParams.set('at', data.session.access_token)
    url.searchParams.set('rt', data.session.refresh_token)
    url.searchParams.set('to', '/')
    return NextResponse.redirect(url, { status: 303 })
  } catch (err) {
    const msg = encodeURIComponent('Something went wrong — please try again')
    return NextResponse.redirect(new URL(`/auth/login?error=${msg}`, request.url))
  }
}
