"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { mockCategories } from "@/lib/mock-data"
import { formatKWD } from "@/lib/utils"

const STEPS = ["Item Details", "Auction Settings", "Upload Photos", "Review & Publish"]

export default function SellPage() {
  const [step, setStep] = useState(0)

  // Step 1
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState("")

  // Step 2
  const [startingPrice, setStartingPrice] = useState("")
  const [reservePrice, setReservePrice] = useState("")
  const [duration, setDuration] = useState("24")

  const canNext = () => {
    if (step === 0) return title.trim() && description.trim() && category && condition
    if (step === 1) return startingPrice && Number(startingPrice) > 0
    if (step === 2) return true
    return false
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-foreground mb-2">List an Auction</h1>
        <p className="text-foreground-muted text-sm mb-8">Sell your items through live auctions on Instagram & TikTok</p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? "bg-primary text-white" :
                i === step ? "bg-primary text-white ring-2 ring-primary/30" :
                "bg-surface border border-border text-foreground-muted"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-primary" : "text-foreground-muted"}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-border rounded-2xl p-8">
          {/* Step 1: Item Details */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-bold text-foreground text-lg mb-4">Item Details</h2>
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. 2021 Mercedes G63 AMG"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your item in detail..."
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                >
                  <option value="">Select a category</option>
                  {mockCategories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">Condition</label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                >
                  <option value="">Select condition</option>
                  <option>New with box</option>
                  <option>New sealed</option>
                  <option>Used - Excellent</option>
                  <option>Used - Very Good</option>
                  <option>Used - Good</option>
                  <option>Pre-owned - Mint</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Auction Settings */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-bold text-foreground text-lg mb-4">Auction Settings</h2>
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">Starting Price (KWD)</label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={e => setStartingPrice(e.target.value)}
                  placeholder="e.g. 100"
                  min={1}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
                {startingPrice && Number(startingPrice) > 0 && (
                  <p className="text-xs text-foreground-muted mt-1">= {formatKWD(Number(startingPrice))}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">Reserve Price (KWD) <span className="font-normal normal-case">(optional)</span></label>
                <input
                  type="number"
                  value={reservePrice}
                  onChange={e => setReservePrice(e.target.value)}
                  placeholder="Minimum price to sell"
                  min={0}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">Duration</label>
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                >
                  <option value="1">1 hour</option>
                  <option value="6">6 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                  <option value="72">3 days</option>
                  <option value="168">7 days</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Upload Photos */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-bold text-foreground text-lg mb-4">Upload Photos</h2>
              <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <div className="text-5xl mb-3">📸</div>
                <p className="font-semibold text-foreground text-sm mb-1">Drag & drop photos here</p>
                <p className="text-xs text-foreground-muted mb-4">PNG, JPG, WEBP up to 10MB each</p>
                <button className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-xl transition-colors">
                  Browse Files
                </button>
              </div>
              <p className="text-xs text-foreground-muted">Add up to 10 photos. First photo will be the main image.</p>
            </div>
          )}

          {/* Step 4: Review & Publish */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-bold text-foreground text-lg mb-4">Review & Publish</h2>
              <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Title</span>
                  <span className="font-semibold text-foreground">{title || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Category</span>
                  <span className="font-semibold text-foreground">{category || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Condition</span>
                  <span className="font-semibold text-foreground">{condition || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Starting Price</span>
                  <span className="font-semibold text-primary">{startingPrice ? formatKWD(Number(startingPrice)) : "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Duration</span>
                  <span className="font-semibold text-foreground">{duration}h</span>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors">
                Publish Auction
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className={`flex gap-3 mt-8 ${step === 0 ? "justify-end" : "justify-between"}`}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-5 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:border-primary transition-colors"
              >
                Previous
              </button>
            )}
            {step < STEPS.length - 1 && (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
