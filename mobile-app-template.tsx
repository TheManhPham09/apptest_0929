"use client"

// Template để chuyển đổi sang React Native
import { useState } from "react"

// Đây là template để chuyển đổi sang React Native
const MobileAppTemplate = () => {
  const [timeLeft, setTimeLeft] = useState(5526)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [cameraBlocked, setCameraBlocked] = useState(false)

  // Logic này sẽ được chuyển đổi sang React Native
  const blockCameraForTenMinutes = async () => {
    // Trong React Native:
    // import { Camera } from 'react-native-camera';
    // const permission = await request(PERMISSIONS.IOS.CAMERA);

    setCameraBlocked(true)

    // Giữ camera session trong 10 phút
    setTimeout(() => {
      setCameraBlocked(false)
    }, 600000) // 10 minutes
  }

  return (
    <div className="mobile-app-container">
      {/* Giao diện này sẽ được chuyển đổi sang React Native Views */}
      <div className="status-bar">
        <span>14:23</span>
        <span>4G 62%</span>
      </div>

      <div className="main-content">
        <h1>V24040025(Phạm Thế Mạnh)</h1>

        <div className="qr-card">
          <div className="header">将二维码对准扫描器刷码出场</div>

          <div className="content">
            <div className="timestamp">{currentTime.toLocaleString()}</div>

            <div className="qr-code">{/* QR Code component */}</div>

            <button>刷新二维码</button>

            <div className="status">
              <div className="active-text">已生效</div>
              <div className="timer">{/* formatTime(timeLeft) */}</div>
            </div>
          </div>
        </div>

        <div className="security-notice">
          尊敬的员工您好，您已进入企业涉密区域，出于企业安全考虑，您的手机摄像头将被禁止拍摄，感谢您的配合。
        </div>

        {cameraBlocked && <div className="camera-blocked-indicator">📷 Camera đã bị khóa</div>}
      </div>
    </div>
  )
}

export default MobileAppTemplate
