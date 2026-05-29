import Image from "next/image"

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = !!params?.error

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-white border border-border rounded-2xl p-8 w-full max-w-sm shadow-sm">

        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo-main.png"
            alt="Livek لايفك"
            width={120}
            height={36}
            className="h-9 w-auto object-contain"
          />
        </div>

        <h1 className="text-xl font-black text-foreground mb-1">Admin Login</h1>
        <p className="text-sm text-foreground-muted mb-6">Restricted access — Livek team only</p>

        <form method="POST" action="/api/admin/login" className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              autoFocus
              autoComplete="username"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          {hasError && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              Invalid username or password
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}
