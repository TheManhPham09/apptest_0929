"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function Component() {
  const [timeLeft, setTimeLeft] = useState(293) // 04:53 in seconds
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full"></div>
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-3 text-white font-medium">
        <div className="text-lg font-semibold">14:23</div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <span className="text-sm ml-1">4G</span>
          <div className="ml-2 px-2 py-1 bg-white/20 rounded text-xs font-bold">62</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-white/90">V24040025(Phạm Thế Mạnh)</h1>
        </div>

        {/* QR Code Card */}
        <Card className="bg-white text-black rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 text-center">
            <p className="text-white font-medium text-base">将二维码对准扫描器刷码出场</p>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            {/* Timestamp */}
            <div className="text-sm text-gray-600 mb-4 font-mono">{formatDateTime(currentTime)}</div>

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=240&width=240"
                  alt="QR Code"
                  className="w-60 h-60 object-contain"
                  style={{
                    filter: "contrast(100%) brightness(0%)",
                    background: `url("data:image/svg+xml,%3Csvg width='240' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='qr' width='8' height='8' patternUnits='userSpaceOnUse'%3E%3Crect width='4' height='4' fill='%23000'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23000'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='240' height='240' fill='url(%23qr)'/%3E%3Crect x='20' y='20' width='40' height='40' fill='%23000'/%3E%3Crect x='180' y='20' width='40' height='40' fill='%23000'/%3E%3Crect x='20' y='180' width='40' height='40' fill='%23000'/%3E%3C/svg%3E") center/contain no-repeat`,
                  }}
                />
              </div>
            </div>

            {/* Refresh Button */}
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800 mb-4 p-0 h-auto font-normal">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新二维码
            </Button>

            {/* Status */}
            <div className="space-y-2">
              <div className="text-green-600 font-semibold text-lg">已生效</div>
              <div className="text-green-600 font-mono text-xl font-bold">{formatTime(timeLeft)}</div>
            </div>
          </div>
        </Card>

        {/* Bottom Text */}
        <div className="mt-8 px-4 text-center">
          <p className="text-white/80 text-sm leading-relaxed">
            尊敬的员工您好，您已进入企业涉密区域，出于企业安全考虑，您的手机摄像头将被禁止拍摄，感谢您的配合。
          </p>
        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="w-32 h-1 bg-white/60 rounded-full"></div>
      </div>
    </div>
  )
}
