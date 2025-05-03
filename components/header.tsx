"use client"

import type React from "react"

import { useState } from "react"
import { FaCog, FaGlobe, FaBell } from "react-icons/fa"
import Image from "next/image"
import { handleImageError } from "@/utils/image-utils"

interface HeaderProps {
  currentLanguage: string
  onSwitchLanguage: (lang: string) => void
  onShowNotification: (text: string) => void
  onTabChange: (tabName: string) => void
  onOpenSettings: () => void
}

const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onSwitchLanguage,
  onShowNotification,
  onTabChange,
  onOpenSettings,
}) => {
  const [showLanguageOptions, setShowLanguageOptions] = useState(false)

  const toggleLanguageOptions = () => {
    setShowLanguageOptions(!showLanguageOptions)
  }

  const handleLanguageChange = (lang: string) => {
    onSwitchLanguage(lang)
    setShowLanguageOptions(false)
  }

  return (
    <header className="flex justify-between items-center mb-4 sm:mb-6">
      {/* 로고 */}
      <div className="flex items-center h-10 sm:h-12">
        <div
          className="relative h-8 cursor-pointer"
          onClick={() => onTabChange("passport")}
          role="button"
          tabIndex={0}
          aria-label={currentLanguage === "en" ? "Go to passport" : "여권으로 이동"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onTabChange("passport")
            }
          }}
        >
          <Image
            src="/images/logo-new.png"
            alt="Passportr Logo"
            width={120}
            height={48}
            priority
            onError={(e) => handleImageError(e, "/abstract-geometric-logo.png")}
            style={{ objectFit: "contain" }}
            className="transition-opacity duration-300"
          />
        </div>
      </div>

      {/* 우측 아이콘들 */}
      <div className="flex items-center">
        {/* 언어 선택 */}
        <div className="relative mr-3">
          <button
            onClick={toggleLanguageOptions}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-light-sand text-deep-navy hover:bg-gray-200 transition-colors"
            aria-label={currentLanguage === "en" ? "Change language" : "언어 변경"}
          >
            <FaGlobe />
          </button>

          {showLanguageOptions && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-50 py-2">
              <button
                onClick={() => handleLanguageChange("en")}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  currentLanguage === "en" ? "font-bold text-brand-blue" : ""
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange("kr")}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  currentLanguage === "kr" ? "font-bold text-brand-blue" : ""
                }`}
              >
                한국어
              </button>
            </div>
          )}
        </div>

        {/* 알림 버튼 */}
        <button
          onClick={() =>
            onShowNotification(currentLanguage === "en" ? "No new notifications" : "새로운 알림이 없습니다")
          }
          className="flex items-center justify-center w-8 h-8 rounded-full bg-light-sand text-deep-navy hover:bg-gray-200 transition-colors mr-3"
          aria-label={currentLanguage === "en" ? "Notifications" : "알림"}
        >
          <FaBell />
        </button>

        {/* 설정 버튼 */}
        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-light-sand text-deep-navy hover:bg-gray-200 transition-colors"
          aria-label={currentLanguage === "en" ? "Settings" : "설정"}
        >
          <FaCog />
        </button>
      </div>
    </header>
  )
}

export default Header
