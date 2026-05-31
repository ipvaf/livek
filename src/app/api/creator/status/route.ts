import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const email  = searchParams.get('email') ?? ''

  if (!userId) {
    return NextResponse.json({ submission: null, creator: null })
  }

  // Check for an approved creator linked to this user
  const { data: creator } = await supabaseAdmin
    .from('creators')
    .select('id, handle, platform, is_live, is_verified, status')
    .eq('user_id', userId)
    .maybeSingle()

  // Check for a submission linked to this user
  let { data: submission } = await supabaseAdmin
    .from('creator_submissions')
    .select('id, handle, platform, status, created_at, user_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fallback: find by email if no user_id match (e.g. submitted before account linked)
  if (!submission && email) {
    const { data: byEmail } = await supabaseAdmin
      .from('creator_submissions')
      .select('id, handle, platform, status, created_at, user_id')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (byEmail) {
      submission = byEmail
      // Silently link the submission to this user for future lookups
      if (!byEmail.user_id) {
        await supabaseAdmin
          .from('creator_submissions')
          .update({ user_id: userId })
          .eq('id', byEmail.id)
      }
    }
  }

  return NextResponse.json({ creator, submission })
}
