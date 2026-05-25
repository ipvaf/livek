import Link from "next/link"
import { Navbar } from "@/components/Navbar"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
        <div className="w-full max-w-sm bg-white border border-border rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-black">L</span>
            </div>
            <h1 className="text-xl font-black text-foreground">Welcome back</h1>
            <p className="text-sm text-foreground-muted mt-1">Log in to your Livek account</p>
          </div>

          <form className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2.5 border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2.5 border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            <button className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
              Log in
            </button>
          </form>

          <p className="text-center text-xs text-foreground-muted mt-4">
            No account?{" "}
            <Link href="/auth/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
