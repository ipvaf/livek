import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo", display: "swap" })

export const metadata: Metadata = {
  title: "Livek | Discover Live Auctions on Instagram & TikTok",
  description: "Livek helps you discover live auctions happening right now on Instagram and TikTok.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
