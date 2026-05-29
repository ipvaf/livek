import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin@123"
const ADMIN_SECRET = "50abf54fbf44b3d2479c30964a0f73b53523b869a97038fd2ad77707aa4669c1"

export async function POST(request: NextRequest) {
  try {
    let username = ""
    let password = ""

    const contentType = request.headers.get("content-type") ?? ""

    if (contentType.includes("application/json")) {
      const body = await request.json()
      username = (body.username ?? "").trim()
      password = (body.password ?? "").trim()
    } else {
      // Standard HTML form POST (application/x-www-form-urlencoded)
      const formData = await request.formData()
      username = ((formData.get("username") as string) ?? "").trim()
      password = ((formData.get("password") as string) ?? "").trim()
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL("/admin/login?error=1", request.url), { status: 303 })
    }

    // Set cookie + redirect in ONE response — no client-side timing issues
    const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 })
    response.cookies.set("admin_token", ADMIN_SECRET, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    })
    return response
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url))
  }
}
