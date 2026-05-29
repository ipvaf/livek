"use client"

export function AdminLogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-foreground-muted hover:text-red-500 transition-colors"
    >
      Log out
    </button>
  )
}
