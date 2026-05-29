import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminSubmissions } from '@/components/AdminSubmissions'
import { AdminCreators } from '@/components/AdminCreators'
import { AdminLogoutButton } from '@/components/AdminLogoutButton'

export const dynamic = 'force-dynamic'

const ADMIN_SECRET = "50abf54fbf44b3d2479c30964a0f73b53523b869a97038fd2ad77707aa4669c1"

export default async function AdminPage() {
  // Auth check
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token || token !== ADMIN_SECRET) {
    redirect('/admin/login')
  }

  // Fetch data
  const { data: submissions } = await supabaseAdmin
    .from('creator_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: creators } = await supabaseAdmin
    .from('creators')
    .select('id, handle, display_name, platform, is_live, status, created_at')
    .order('created_at', { ascending: false })

  const allSubs  = submissions ?? []
  const pending  = allSubs.filter(s => s.status === 'pending').length
  const approved = allSubs.filter(s => s.status === 'approved').length
  const rejected = allSubs.filter(s => s.status === 'rejected').length

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-main.png"
              alt="Livek لايفك"
              width={100}
              height={30}
              className="h-8 w-auto object-contain"
            />
            <span className="text-foreground-muted text-sm">/ admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
              ← Back to site
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total',    value: allSubs.length,         color: 'text-foreground', bg: 'bg-white' },
            { label: 'Pending',  value: pending,                 color: 'text-amber-600',  bg: 'bg-amber-50' },
            { label: 'Approved', value: approved,                color: 'text-green-600',  bg: 'bg-green-50' },
            { label: 'Rejected', value: rejected,                color: 'text-red-500',    bg: 'bg-red-50' },
            { label: 'Creators', value: (creators ?? []).length, color: 'text-primary',    bg: 'bg-primary-light' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} border border-border rounded-2xl p-5`}>
              <p className={`text-3xl font-black ${color} mb-1`}>{value}</p>
              <p className="text-xs text-foreground-muted font-semibold uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* Submissions */}
        <AdminSubmissions submissions={allSubs as Parameters<typeof AdminSubmissions>[0]['submissions']} />

        {/* Creators */}
        <div className="mt-10">
          <h2 className="font-black text-foreground text-lg mb-5">
            Creators ({(creators ?? []).length})
          </h2>
          <AdminCreators creators={(creators ?? []) as Parameters<typeof AdminCreators>[0]['creators']} />
        </div>

      </div>
    </div>
  )
}
