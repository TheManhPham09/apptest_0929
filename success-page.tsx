"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface SuccessPageProps {
  userName: string
  visitStatus?: {
    currentCount: number
    limit: number
    canAccess: boolean
    remainingVisits: number
  }
}

export default function SuccessPage({ userName, visitStatus }: SuccessPageProps) {
  const [timeLeft, setTimeLeft] = useState(5526) // Bắt đầu từ 1 tiếng 32 phút 6 giây (1*3600 + 32*60 + 6 = 5526 giây)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCheckmark, setShowCheckmark] = useState(false) // State để chuyển đổi hình ảnh
  const [tapCount, setTapCount] = useState(0) // Đếm số lần chạm
  const [tapTimer, setTapTimer] = useState<NodeJS.Timeout | null>(null) // Timer để reset tap count
  const [checkmarkTime, setCheckmarkTime] = useState<Date | null>(null) // Thời gian khi chuyển sang checkmark

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope)
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error)
          })
      })
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setTimeLeft((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    // --- BẮT ĐẦU KHU VỰC CÓ THỂ CHỈNH SỬA ĐỊNH DẠNG THỜI GIAN ---
    // Hiển thị thời gian theo định dạng giờ:phút:giây với 2 chữ số cho mỗi phần (01:32:06)
    // Thay đổi padStart cho hours từ không có thành có để hiển thị 2 chữ số
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    // --- KẾT THÚC KHU VỰC CÓ THỂ CHỈNH SỬA ĐỊNH DẠNG THỜI GIAN ---
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

  // Format thời gian thực tế (chỉ giờ:phút:giây)
  const formatRealTime = (date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  // Xử lý chạm vào hình ảnh QR
  const handleQRImageTap = () => {
    console.log(`[DEBUG] QR image tapped. Current tap count: ${tapCount + 1}`)

    // Xóa timer cũ nếu có
    if (tapTimer) {
      clearTimeout(tapTimer)
    }

    const newTapCount = tapCount + 1

    if (newTapCount >= 3) {
      // Chạm đủ 3 lần, chuyển đổi hình ảnh
      const newShowCheckmark = !showCheckmark
      setShowCheckmark(newShowCheckmark)

      // Lưu thời gian khi chuyển sang checkmark
      if (newShowCheckmark) {
        setCheckmarkTime(new Date())
      } else {
        setCheckmarkTime(null)
      }

      setTapCount(0)
      console.log(`[DEBUG] Switching image. Show checkmark: ${newShowCheckmark}`)
    } else {
      // Chưa đủ 3 lần, cập nhật tap count và đặt timer
      setTapCount(newTapCount)

      // Đặt timer 2 giây để reset tap count nếu không chạm tiếp
      const timer = setTimeout(() => {
        console.log("[DEBUG] Tap timer expired, resetting tap count")
        setTapCount(0)
      }, 2000)

      setTapTimer(timer)
    }
  }

  // Xử lý click button refresh khi ở chế độ checkmark
  const handleRefreshClick = () => {
    if (showCheckmark) {
      // Chuyển về chế độ QR
      setShowCheckmark(false)
      setCheckmarkTime(null)
      console.log("[DEBUG] Refreshing back to QR mode")
    }
  }

  return (
    <div
      className="text-white relative overflow-hidden"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // --- BẮT ĐẦU KHU VỰC CÓ THỂ CHỈNH SỬA KÍCH THƯỚC MÀN HÌNH ---
        // Điều chỉnh kích thước cho iPhone 15 (393px x 852px)
        maxWidth: "414px",
        minHeight: "896px",
        // --- KẾT THÚC KHU VỰC CÓ THỂ CHỈNH SỬA KÍCH THƯỚC MÀN HÌNH ---
        margin: "0 auto",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full py-0 px-0 mx-0">
        <div className="text-center pb-3.5 pt-3.5">
          <h1 className="text-lg font-medium text-[#E0E0C0] text-[rgba(253,229,181,1)]">{userName}</h1>
        </div>
        {/* QR Card - Positioned higher */}
        <div className="flex-none mb-0 px-12 py-1">
          <div
            className="relative max-w-xs mx-auto rounded-2xl overflow-hidden shadow-2xl h-auto w-auto"
            style={{
              backgroundImage: "url('/card-background.png')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              paddingTop: "10%",
              paddingBottom: "2%",
            }}
          >
            {/* Khu vực màu vàng - GIỮ NGUYÊN KÍCH THƯỚC */}
            <div className="absolute top-0 left-0 right-0 text-center py-5 px-5">
              <p className="text-white font-medium mt-[2px] border-0 tracking-widest">
                {showCheckmark ? "您的设备已符合安全规范" : "将二维码对准扫描器刷码出场"}
              </p>
            </div>

            <div className="px-6 text-center text-black pb-0 leading-3 mx-0 pl-0 pr-0 pt-0">
              <div className="font-mono border-0 px-0 tracking-normal mt-14 mb-px text-base text-[rgba(0,0,0,0.92)]">
                {formatDateTime(currentTime)}
              </div>

              {/* Khu vực màu trắng - KÍCH THƯỚC CỐ ĐỊNH THEO QR CODE */}
              <div className="flex justify-center mb-4">
                <div
                  className="bg-white rounded-lg cursor-pointer transition-transform active:scale-95 relative"
                  onClick={handleQRImageTap}
                  style={{
                    // KÍCH THƯỚC CỐ ĐỊNH - không thay đổi theo nội dung
                    width: "240px", // Kích thước cố định
                    height: "240px", // Kích thước cố định
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3px",
                  }}
                >
                  {/* CHỈ THAY ĐỔI HÌNH ẢNH BÊN TRONG */}
                  {showCheckmark ? (
                    // Checkmark nhỏ hơn 3 lần, căn giữa trong container cố định
                    <img
                      src="/checkmark-icon.jpg"
                      alt="Success Checkmark"
                      style={{
                        width: "120px", // 1/3 của 240px
                        height: "120px", // 1/3 của 240px
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    // QR code đầy đủ kích thước container
                    <img
                      src="/qr-code.png"
                      alt="QR Code"
                      style={{
                        width: "240px", // 240px - 16px padding
                        height: "240px", // 240px - 16px padding
                        objectFit: "contain",
                      }}
                    />
                  )}

                  {showCheckmark && (
                    <div
                      className="absolute text-center"
                      style={{
                        // === KHU VỰC CÓ THỂ ĐIỀU CHỈNH VỊ TRÍ ===
                        // Thay đổi các giá trị này để di chuyển text:

                        // VỊ TRÍ DỌC (top):
                        top: "190px", // Hiện tại: dưới checkmark
                        // top: "130px",     // Gần checkmark hơn
                        // top: "180px",     // Xa checkmark hơn
                        // top: "200px",     // Rất xa checkmark

                        // VỊ TRÍ NGANG (left):
                        left: "49%", // Căn giữa
                        // left: "20px",     // Bên trái
                        // right: "20px",    // Bên phải (thay left bằng right)

                        transform: "translateX(-50%)", // Căn giữa chính xác khi dùng left: 50%
                        // transform: "none", // Bỏ căn giữa nếu dùng left/right cố định

                        zIndex: 10, // Đảm bảo hiển thị trên cùng
                        // === KẾT THÚC KHU VỰC ĐIỀU CHỈNH ===
                      }}
                    >
                      {/* Text "进场成功" */}
                      <div className="font-medium text-lg mb-1 text-[rgba(92,92,92,1)]">进场成功</div>
                      {/* Thời gian hiển thị */}
                      <div className="font-mono font-normal tracking-normal text-[rgba(92,92,92,1)] text-sm">
                        {checkmarkTime ? formatRealTime(checkmarkTime) : formatRealTime(currentTime)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!showCheckmark && (
                <Button
                  variant="ghost"
                  className="hover:text-gray-800 p-0 h-auto font-normal tracking-normal leading-3 mb-1.5 text-[rgba(92,92,92,1)]"
                  onClick={handleRefreshClick}
                >
                  刷新二维码
                </Button>
              )}

              <div className="space-y-2 leading-7">
                {!showCheckmark && (
                  // Khi ở chế độ QR: hiển thị text nháy và timer
                  <>
                    <div className="text-green-500 font-normal text-lg blink-text leading-3">已生效</div>
                    <div className="text-green-500 font-mono font-normal text-lg border-0 opacity-100">
                      {formatTime(timeLeft)}
                    </div>
                  </>
                )}

                {showCheckmark && (
                  <div className="mt-6">
                    <Button
                      variant="ghost"
                      className="hover:text-green-700 p-0 h-auto font-normal font-mono text-sm text-[rgba(92,92,92,1)]"
                      onClick={handleRefreshClick}
                    >
                      刷新二维码
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Text - Positioned at bottom */}
        <div className="flex-1 flex items-end pb-8">
          <div className="px-4 text-center w-full h-px border-0">
            <p className="text-[#E0E0C0] text-sm leading-relaxed px-4 py-1 text-left">
              尊敬的员工您好，您已进入企业涉密区域，出于企业安全考虑，您的手机摄像头将被禁止拍摄，感谢您的配合
              {visitStatus ? `（还可访问 ${visitStatus.remainingVisits} 次）` : ""}。
            </p>
          </div>
        </div>
      </div>

      {/* Debug info for tap count (chỉ hiển thị trong development) */}
      {process.env.NODE_ENV === "development" && tapCount > 0 && (
        <div className="fixed top-20 right-4 z-50 bg-blue-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
          <p className="font-bold text-blue-300">TAP DEBUG:</p>
          <p>Taps: {tapCount}/3</p>
          <p>Mode: {showCheckmark ? "Checkmark" : "QR Code"}</p>
          <p>Container: 240x240px (Fixed)</p>
          {checkmarkTime && <p>Switch Time: {formatRealTime(checkmarkTime)}</p>}
        </div>
      )}

      <style jsx>{`
        @keyframes blink {
          0%, 30% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .blink-text {
          animation: blink 1.5s infinite;
        }
      `}</style>
    </div>
  )
}
