"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaChevronLeft, FaMapMarkerAlt, FaBell } from "react-icons/fa"

interface PermissionsRequestProps {
  onNext: () => void
  onBack: () => void
  permissionsGranted: {
    location: boolean
    notifications: boolean
  }
  onPermissionUpdate: (permission: "location" | "notifications", granted: boolean) => void
  currentLanguage: string
  translations: {
    en: any
    kr: any
  }
}

export default function PermissionsRequest({
  onNext,
  onBack,
  permissionsGranted,
  onPermissionUpdate,
  currentLanguage,
  translations,
}: PermissionsRequestProps) {
  const [currentPermission, setCurrentPermission] = useState<"location" | "notifications">("location")

  // 언어에 따른 텍스트 가져오기
  const t = translations[currentLanguage as keyof typeof translations].permissions

  const handlePermissionResponse = (permission: "location" | "notifications", granted: boolean) => {
    onPermissionUpdate(permission, granted)

    if (permission === "location") {
      setCurrentPermission("notifications")
    } else {
      onNext()
    }
  }

  const permissionData = {
    location: {
      title: currentLanguage === "en" ? "Enable location services" : "위치 서비스 활성화",
      description:
        currentLanguage === "en"
          ? "Auto-record your city check-ins and discover nearby places to explore"
          : "자동으로 도시 체크인을 기록하고<br />주변의 탐험할 장소를 발견하세요",
      icon: <FaMapMarkerAlt className="text-4xl text-brand-blue" />,
    },
    notifications: {
      title: currentLanguage === "en" ? "Stay in the loop" : "최신 정보 받기",
      description:
        currentLanguage === "en"
          ? "Get notified when you earn a new stamp or complete a collection"
          : "새로운 스탬프를 획득하거나 컬렉션을<br />완성했을 때 알림을 받으세요",
      icon: <FaBell className="text-4xl text-sunset-coral" />,
    },
  }

  return (
    <div className="h-full w-full bg-cloud-white flex flex-col">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center">
          <FaChevronLeft className="text-deep-navy" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPermission}
            className="w-full max-w-md bg-white rounded-xl shadow-sm p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-light-sand flex items-center justify-center mb-6">
                {permissionData[currentPermission].icon}
              </div>
              <h2 className="text-xl font-bold text-deep-navy mb-2">{permissionData[currentPermission].title}</h2>
              <p
                className="text-stone-gray"
                dangerouslySetInnerHTML={{ __html: permissionData[currentPermission].description }}
              ></p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handlePermissionResponse(currentPermission, true)}
                className="w-full py-3 bg-sunset-coral text-white rounded-lg font-medium shadow-sm hover:bg-sunset-coral/90 transition-colors"
              >
                {currentLanguage === "en" ? "Allow" : "허용"}
              </button>
              <button
                onClick={() => handlePermissionResponse(currentPermission, false)}
                className="w-full py-3 bg-light-sand text-deep-navy rounded-lg font-medium hover:bg-light-sand/70 transition-colors"
              >
                {currentLanguage === "en" ? "Maybe later" : "나중에 하기"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
