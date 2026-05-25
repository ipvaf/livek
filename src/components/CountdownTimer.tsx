"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  timeLeft?: string
  endTime?: Date
  variant?: "default" | "large" | "compact"
}

function parseTimeLeft(timeLeft: string): { h: number; m: number; s: number } {
  const parts = timeLeft.split(":").map(Number)
  if (parts.length === 3) return { h: parts[0], m: parts[1], s: parts[2] }
  if (parts.length === 2) return { h: 0, m: parts[0], s: parts[1] }
  return { h: 0, m: 0, s: parts[0] }
}

function getRemaining(endTime: Date): { h: number; m: number; s: number; expired: boolean } {
  const diff = endTime.getTime() - Date.now()
  if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true }
  const totalSeconds = Math.floor(diff / 1000)
  return {
    h: Math.floor(totalSeconds / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60,
    expired: false,
  }
}

export function CountdownTimer({ timeLeft, endTime, variant = "default" }: CountdownTimerProps) {
  const [time, setTime] = useState<{ h: number; m: number; s: number; expired?: boolean }>(() => {
    if (endTime) {
      const r = getRemaining(endTime)
      return { h: r.h, m: r.m, s: r.s, expired: r.expired }
    }
    if (timeLeft) return parseTimeLeft(timeLeft)
    return { h: 0, m: 0, s: 0 }
  })

  useEffect(() => {
    if (!endTime) return
    const interval = setInterval(() => {
      const r = getRemaining(endTime)
      setTime({ h: r.h, m: r.m, s: r.s, expired: r.expired })
    }, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  const totalMinutes = time.h * 60 + time.m
  const isUrgent = totalMinutes < 5 && !time.expired

  const pad = (n: number) => String(n).padStart(2, "0")
  const display = time.expired ? "Ended" : `${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`

  const colorClass = isUrgent ? "text-live" : "text-primary"

  if (variant === "compact") {
    return (
      <span className={`font-mono text-xs font-bold ${colorClass}`}>
        {display}
      </span>
    )
  }

  if (variant === "large") {
    return (
      <div className={`font-mono text-3xl font-black tracking-wider ${colorClass}`}>
        {display}
      </div>
    )
  }

  return (
    <span className={`font-mono text-sm font-bold ${colorClass}`}>
      {display}
    </span>
  )
}
