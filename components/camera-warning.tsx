"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CameraOff, Shield, AlertTriangle } from "lucide-react"

export default function CameraWarning() {
  const [showWarning, setShowWarning] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes in seconds
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isActive, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleActivateSecurityMode = () => {
    setIsActive(true)
    setShowWarning(false)

    // Hiển thị fullscreen warning
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        console.log("Fullscreen not supported")
      })
    }

    // Thêm event listener để ngăn chặn việc rời khỏi trang
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = "Bạn đang trong chế độ bảo mật. Việc rời khỏi trang có thể vi phạm quy định."
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    // Cleanup sau 10 phút
    setTimeout(() => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          console.log("Exit fullscreen failed")
        })
      }
      setIsActive(false)
      setTimeRemaining(600)
    }, 600000) // 10 minutes
  }

  if (showWarning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-900 via-red-800 to-red-900 text-white p-4">
        <Card className="bg-white/10 backdrop-blur-sm border-red-500/50 p-8 text-center max-w-md">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Shield className="w-16 h-16 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Cảnh báo bảo mật</h1>
            <div className="space-y-4 text-white/90">
              <div className="flex items-center justify-center space-x-2 text-red-300">
                <CameraOff className="w-6 h-6" />
                <span className="font-semibold">Khu vực hạn chế camera</span>
              </div>
              <p className="text-sm leading-relaxed">
                Bạn đang truy cập vào khu vực bảo mật. Việc sử dụng camera trong 10 phút tới là bị cấm.
              </p>
              <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">Lưu ý quan trọng:</span>
                </div>
                <ul className="text-sm text-left space-y-1">
                  <li>• Không được mở ứng dụng camera</li>
                  <li>• Không được chụp ảnh hoặc quay video</li>
                  <li>• Không được rời khỏi trang web này</li>
                  <li>• Vi phạm có thể dẫn đến hậu quả pháp lý</li>
                </ul>
              </div>
            </div>
            <Button
              onClick={handleActivateSecurityMode}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
            >
              Tôi hiểu và đồng ý tuân thủ
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="text-center space-y-6">
          <div className="animate-pulse">
            <CameraOff className="w-24 h-24 text-red-500 mx-auto mb-4" />
          </div>
          <h1 className="text-3xl font-bold text-red-400">CHỂ ĐỘ BẢO MẬT ĐANG HOẠT ĐỘNG</h1>
          <div className="bg-red-900/50 rounded-lg p-6 border-2 border-red-500">
            <p className="text-xl mb-4">Camera bị vô hiệu hóa</p>
            <p className="text-4xl font-mono text-red-300">{formatTime(timeRemaining)}</p>
            <p className="text-sm text-red-200 mt-2">Thời gian còn lại</p>
          </div>
          <div className="text-sm text-gray-400 max-w-md">
            <p>Bạn đang trong khu vực bảo mật. Mọi hoạt động có thể được giám sát.</p>
            <p className="mt-2 text-red-300">⚠️ Không được rời khỏi trang này</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
