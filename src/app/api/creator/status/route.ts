import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ submission: null, creator: null })
  }

  // Check for an approved creator linked to this user
  const { data: creator } = await supabaseAdmin
    .from('creators')
    .select('id, handle, platform, is_live, is_verified, status')
    .eq('user_id', userId)
    .maybeSingle()

  // Check for a pending/rejected submission linked to this user
  const { data: submission } = await supabaseAdmin
    .from('creator_submissions')
    .select('id, handle, platform, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ creator, submission })
}
