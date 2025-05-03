"use client"

import type React from "react"

import { useState, type FC } from "react"
import { FaTimes, FaCog } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  currentLanguage: string
  onSwitchLanguage: (lang: string) => void
  distanceUnit: string
  setDistanceUnit: (unit: string) => void
  selectedTheme: string
  setSelectedTheme: (theme: string) => void
  badgeDisplayMode: string
  setBadgeDisplayMode: (mode: string) => void
}

interface Theme {
  id: string
  name: {
    en: string
    kr: string
  }
  color: string
  secondaryColor: string
  accentColor: string
  backgroundPattern?: string
}

const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSwitchLanguage,
  distanceUnit,
  setDistanceUnit,
  selectedTheme,
  setSelectedTheme,
  badgeDisplayMode,
  setBadgeDisplayMode,
}) => {
  const [activeTab, setActiveTab] = useState("preferences")

  // Define themes
  const themes: Theme[] = [
    {
      id: "default",
      name: {
        en: "Default",
        kr: "기본",
      },
      color: "#1E88E5",
      secondaryColor: "#FF5252",
      accentColor: "#FFB300",
    },
    {
      id: "sunset",
      name: {
        en: "Sunset",
        kr: "일몰",
      },
      color: "#FF5252",
      secondaryColor: "#2c3e50",
      accentColor: "#FFB300",
      backgroundPattern: "linear-gradient(135deg, rgba(255, 126, 103, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
    },
    {
      id: "royal",
      name: {
        en: "Royal",
        kr: "왕실",
      },
      color: "#FFB300",
      secondaryColor: "#2c3e50",
      accentColor: "#5da9e9",
      backgroundPattern: "radial-gradient(circle at 30% 30%, rgba(255, 218, 99, 0.15) 0%, rgba(255, 255, 255, 0) 70%)",
    },
    {
      id: "midnight",
      name: {
        en: "Midnight",
        kr: "자정",
      },
      color: "#2c3e50",
      secondaryColor: "#5da9e9",
      accentColor: "#FF7E67",
      backgroundPattern:
        "linear-gradient(45deg, rgba(44, 62, 80, 0.1) 25%, transparent 25%, transparent 50%, rgba(44, 62, 80, 0.1) 50%, rgba(44, 62, 80, 0.1) 75%, transparent 75%, transparent)",
    },
  ]

  // Apply theme function
  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId)
    if (!theme) return

    // Apply theme colors
    document.documentElement.style.setProperty("--brand-blue", theme.color)
    document.documentElement.style.setProperty("--brand-coral", theme.secondaryColor)
    document.documentElement.style.setProperty("--brand-yellow", theme.accentColor)

    // Save theme to localStorage
    localStorage.setItem("selectedTheme", themeId)

    // Update state
    setSelectedTheme(themeId)

    // Trigger haptic feedback
    triggerHapticFeedback(hapticPatterns.medium)
  }

  // Handle language toggle
  const handleLanguageToggle = () => {
    onSwitchLanguage(currentLanguage === "en" ? "kr" : "en")
    triggerHapticFeedback(hapticPatterns.light)
  }

  // Handle distance unit change
  const handleDistanceUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistanceUnit(e.target.value)
    triggerHapticFeedback(hapticPatterns.light)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        style={{ height: "var(--app-height, 100vh)" }}
      >
        <motion.div
          className="bg-cloud-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          style={{ maxHeight: "calc(var(--app-height, 100vh) - 32px)" }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-light-sand">
            <div className="flex items-center">
              <FaCog className="text-brand-blue mr-2" />
              <h2 className="text-xl font-bold">{currentLanguage === "en" ? "Settings" : "설정"}</h2>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-light-sand transition-colors"
              onClick={onClose}
            >
              <FaTimes className="text-stone-gray" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-light-sand">
            <button
              className={`flex items-center px-4 py-3 relative ${activeTab === "preferences" ? "text-brand-blue" : "text-stone-gray"}`}
              onClick={() => setActiveTab("preferences")}
            >
              <span>{currentLanguage === "en" ? "Preferences" : "환경설정"}</span>
              {activeTab === "preferences" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue"
                  layoutId="activeTabIndicator"
                />
              )}
            </button>
            <button
              className={`flex items-center px-4 py-3 relative ${activeTab === "account" ? "text-brand-blue" : "text-stone-gray"}`}
              onClick={() => setActiveTab("account")}
            >
              <span>{currentLanguage === "en" ? "Account" : "계정"}</span>
              {activeTab === "account" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue"
                  layoutId="activeTabIndicator"
                />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(var(--app-height, 100vh) - 200px)" }}>
            {activeTab === "preferences" && (
              <div>
                <div className="mb-6">
                  <h4 className="font-bold mb-3">{currentLanguage === "en" ? "Language" : "언어"}</h4>
                  <div className="flex">
                    <button
                      className={`px-4 py-2 rounded-l-lg ${
                        currentLanguage === "en" ? "bg-brand-blue text-cloud-white" : "bg-light-sand text-deep-navy"
                      }`}
                      onClick={handleLanguageToggle}
                    >
                      English
                    </button>
                    <button
                      className={`px-4 py-2 rounded-r-lg ${
                        currentLanguage === "kr" ? "bg-brand-blue text-cloud-white" : "bg-light-sand text-deep-navy"
                      }`}
                      onClick={handleLanguageToggle}
                    >
                      한국어
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold mb-3">{currentLanguage === "en" ? "Distance Units" : "거리 단위"}</h4>
                  <select
                    className="w-full p-3 bg-light-sand rounded-lg border border-light-sand focus:outline-none focus:border-brand-blue"
                    value={distanceUnit}
                    onChange={handleDistanceUnitChange}
                  >
                    <option value="km">{currentLanguage === "en" ? "Kilometers (km)" : "킬로미터 (km)"}</option>
                    <option value="mi">{currentLanguage === "en" ? "Miles (mi)" : "마일 (mi)"}</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-bold mb-3">{currentLanguage === "en" ? "Notifications" : "알림"}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm">{currentLanguage === "en" ? "Push Notifications" : "푸시 알림"}</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-stone-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue toggle-switch"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm">
                        {currentLanguage === "en" ? "Email Notifications" : "이메일 알림"}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-stone-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue toggle-switch"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm">
                        {currentLanguage === "en" ? "In-App Notifications" : "앱 내 알림"}
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-stone-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue toggle-switch"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold mb-3">{currentLanguage === "en" ? "Account Information" : "계정 정보"}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-stone-gray">{currentLanguage === "en" ? "Email" : "이메일"}</label>
                      <p className="font-medium">jaime.sung@example.com</p>
                    </div>
                    <div>
                      <label className="text-sm text-stone-gray">
                        {currentLanguage === "en" ? "Member Since" : "가입일"}
                      </label>
                      <p className="font-medium">May 10, 2023</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">{currentLanguage === "en" ? "Account Actions" : "계정 작업"}</h4>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-light-sand text-deep-navy rounded-lg hover:bg-stone-gray hover:text-white transition-colors">
                      {currentLanguage === "en" ? "Change Password" : "비밀번호 변경"}
                    </button>
                    <button className="w-full px-4 py-2 bg-brand-blue text-cloud-white rounded-lg hover:bg-opacity-90 transition-colors">
                      {currentLanguage === "en" ? "Edit Profile" : "프로필 편집"}
                    </button>
                    <button className="w-full px-4 py-2 border border-brand-coral text-brand-coral rounded-lg hover:bg-brand-coral hover:text-white transition-colors">
                      {currentLanguage === "en" ? "Delete Account" : "계정 삭제"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-light-sand">
            <button
              className="w-full py-2 bg-brand-blue text-cloud-white rounded-lg hover:bg-opacity-90 transition-colors"
              onClick={onClose}
            >
              {currentLanguage === "en" ? "Close" : "닫기"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default SettingsModal
