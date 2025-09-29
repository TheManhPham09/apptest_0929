"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface AccessLimiterProps {
  children: React.ReactNode
}

interface VisitStatus {
  currentCount: number
  limit: number
  canAccess: boolean
  remainingVisits: number
  lastVisitDate: string
}

export default function AccessLimiter({ children }: AccessLimiterProps) {
  const [visitStatus, setVisitStatus] = useState<VisitStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeUntilReset, setTimeUntilReset] = useState("")

  useEffect(() => {
    checkAccess()
  }, [])

  useEffect(() => {
    // Cập nhật thời gian còn lại đến ngày mới
    const updateTimeUntilReset = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeUntilReset(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }

    updateTimeUntilReset()
    const interval = setInterval(updateTimeUntilReset, 1000)

    return () => clearInterval(interval)
  }, [])

  const getStorageKey = () => {
    const today = new Date().toISOString().split("T")[0]
    return `visit_data_${today}`
  }

  const getVisitData = (): VisitStatus => {
    const today = new Date().toISOString().split("T")[0]
    const storageKey = getStorageKey()

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const data = JSON.parse(stored)
        // Kiểm tra nếu là cùng ngày
        if (data.lastVisitDate === today) {
          console.log("[DEBUG] Found existing data for today:", data)
          return data
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    }

    // Nếu không có dữ liệu hoặc là ngày mới, khởi tạo mới
    const newData: VisitStatus = {
      currentCount: 0,
      limit: 9999999999,
      canAccess: true,
      remainingVisits: 999999999,
      lastVisitDate: today,
    }

    console.log("[DEBUG] Creating new data for today:", newData)

    try {
      localStorage.setItem(storageKey, JSON.stringify(newData))
      // Xóa dữ liệu của các ngày cũ
      cleanOldData()
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }

    return newData
  }

  const cleanOldData = () => {
    const today = new Date().toISOString().split("T")[0]
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("visit_data_") && !key.includes(today)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
      console.log(`[DEBUG] Removed old data: ${key}`)
    })
  }

  const updateVisitData = (newData: VisitStatus) => {
    const storageKey = getStorageKey()
    try {
      localStorage.setItem(storageKey, JSON.stringify(newData))
      console.log(`[DEBUG] Updated localStorage:`, newData)
    } catch (error) {
      console.error("Error updating localStorage:", error)
    }
  }

  const checkAccess = () => {
    try {
      console.log("[DEBUG] Checking access...")

      // Lấy dữ liệu từ localStorage
      const visitData = getVisitData()
      console.log("[DEBUG] Current visit data:", visitData)

      setVisitStatus(visitData)

      // Nếu có thể truy cập, tăng counter
      if (visitData.canAccess && visitData.currentCount < visitData.limit) {
        console.log("[DEBUG] Incrementing visit counter...")

        // Cập nhật dữ liệu client-side
        const newCount = visitData.currentCount + 1
        const updatedData: VisitStatus = {
          ...visitData,
          currentCount: newCount,
          canAccess: newCount < visitData.limit,
          remainingVisits: Math.max(0, visitData.limit - newCount),
        }

        updateVisitData(updatedData)
        setVisitStatus(updatedData)

        console.log(`[DEBUG] Updated count: ${newCount}/${visitData.limit}`)
      }
    } catch (error) {
      console.error("Error checking access:", error)
      // Fallback: create default data if there's an error
      const fallbackData: VisitStatus = {
        currentCount: 1,
        limit: 9999999999,
        canAccess: true,
        remainingVisits: 9999999998,
        lastVisitDate: new Date().toISOString().split("T")[0],
      }
      setVisitStatus(fallbackData)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900">
        <div className="text-white text-lg">Checking access permissions...</div>
      </div>
    )
  }

  // Debug info (chỉ hiển thị trong development)
  const showDebug = process.env.NODE_ENV === "development"

  if (!visitStatus?.canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 text-white p-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 text-center max-w-md">
          <div className="space-y-6">
            <div className="text-6xl">🚫</div>
            <h1 className="text-2xl font-bold text-white">Access Limited</h1>
            <div className="space-y-3 text-white/90">
              <p>Daily access limit has been reached</p>
              <p className="text-lg font-mono">
                Used: <span className="text-red-400">{visitStatus?.currentCount || 0}</span>/{visitStatus?.limit || 10}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-white/70 mb-2">Time until reset:</p>
              <p className="text-2xl font-mono text-green-400">{timeUntilReset}</p>
            </div>
            <p className="text-sm text-white/60">System will automatically reset access count at 00:00 tomorrow</p>

            {/* Debug info */}
            {showDebug && (
              <div className="bg-red-900/20 rounded-lg p-3 text-xs text-left">
                <p className="text-red-300 font-bold mb-2">DEBUG INFO:</p>
                <pre className="text-red-200">
                  {JSON.stringify(
                    {
                      visitStatus,
                      storageKey: getStorageKey(),
                      localStorage: typeof window !== "undefined" ? localStorage.getItem(getStorageKey()) : "N/A",
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-0 px-0 py-0 my-0 tracking-normal leading-7 font-medium">
      {/* Debug panel (chỉ hiển thị trong development) */}
      {showDebug && visitStatus && (
        <div className="fixed top-4 left-4 z-50 bg-red-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs max-w-xs">
          <p className="font-bold text-red-300">DEBUG:</p>
          <p>
            Count: {visitStatus.currentCount}/{visitStatus.limit}
          </p>
          <p>Can Access: {visitStatus.canAccess ? "YES" : "NO"}</p>
          <p>Remaining: {visitStatus.remainingVisits}</p>
          <p>Date: {visitStatus.lastVisitDate}</p>
          <p>Storage: {getStorageKey()}</p>
        </div>
      )}

      {React.cloneElement(children as React.ReactElement, { visitStatus })}
    </div>
  )
}
