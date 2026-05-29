import Image from "next/image"
import Link from "next/link"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string }>
}) {
  const params = await searchParams
  const error   = params?.error
  const created = params?.created

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-border rounded-2xl p-8 shadow-sm">

        <div className="text-center mb-6">
          <Image
            src="/logo-main.png"
            alt="Livek"
            width={110}
            height={33}
            className="h-8 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-black text-foreground">Welcome back</h1>
          <p className="text-sm text-foreground-muted mt-1">Log in to your Livek account</p>
        </div>

        {created && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            ✓ Account created! Log in below.
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {decodeURIComponent(error)}
          </div>
        )}

        <form method="POST" action="/api/auth/signin" className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              autoFocus
              autoComplete="email"
              className="w-full px-4 py-2.5 border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-xs text-foreground-muted mt-4">
          No account?{" "}
          <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
