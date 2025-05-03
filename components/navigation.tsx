"use client"

import type { FC } from "react"
import { FaPassport, FaMapMarkerAlt, FaTasks, FaUser, FaHistory } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import { useEffect } from "react"

interface NavigationProps {
  activeTab: string
  onTabChange: (tabName: string) => void
  currentLanguage: string
}

const Navigation: FC<NavigationProps> = ({ activeTab, onTabChange, currentLanguage }) => {
  const handleTabChange = (tabName: string) => {
    // Trigger haptic feedback on tab change
    triggerHapticFeedback(hapticPatterns.light)
    console.log("Navigation tab change to:", tabName)

    // Ensure the body doesn't have any classes that might interfere with pointer events
    document.body.classList.remove("modal-open")

    // Reset any potential z-index or pointer-event issues
    document.querySelectorAll(".tab-content").forEach((tab) => {
      ;(tab as HTMLElement).style.zIndex = ""
      ;(tab as HTMLElement).style.pointerEvents = ""
    })

    // Call the parent's onTabChange function
    onTabChange(tabName)

    // Update localStorage
    localStorage.setItem("activeTab", tabName)
  }

  useEffect(() => {
    // Your existing tab handling logic
    // ...
  }, [activeTab]) // Make sure activeTab is in the dependency array

  return (
    <nav className="mb-6 sm:mb-10 border-b border-light-gray">
      <div className="flex w-full justify-between px-1">
        <button
          className={`tab-btn flex flex-col items-center hover-effect ${activeTab === "passport" ? "active" : ""}`}
          onClick={() => handleTabChange("passport")}
          data-tab="passport"
          style={{ cursor: "pointer" }} // Explicitly set cursor style
        >
          {/* 항상 FaPassport 아이콘 사용 */}
          <FaPassport
            className={`text-xl sm:text-2xl mb-1 ${activeTab === "passport" ? "text-brand-blue" : "text-gray-500"}`}
          />
          <span className="text-xs sm:text-sm">{currentLanguage === "en" ? "Passport" : "여권"}</span>
        </button>
        {/* Other tab buttons with similar enhancements */}
        <button
          className={`tab-btn flex flex-col items-center hover-effect ${activeTab === "check-in" ? "active" : ""}`}
          onClick={() => handleTabChange("check-in")}
          data-tab="check-in"
          style={{ cursor: "pointer" }}
        >
          <FaMapMarkerAlt
            className={`text-xl sm:text-2xl mb-1 ${activeTab === "check-in" ? "text-brand-blue" : "text-gray-500"}`}
          />
          <span className="text-xs sm:text-sm">{currentLanguage === "en" ? "Check-in" : "체크인"}</span>
        </button>
        <button
          className={`tab-btn flex flex-col items-center hover-effect ${activeTab === "timeline" ? "active" : ""}`}
          onClick={() => handleTabChange("timeline")}
          data-tab="timeline"
          style={{ cursor: "pointer" }}
        >
          <FaHistory
            className={`text-xl sm:text-2xl mb-1 ${activeTab === "timeline" ? "text-brand-blue" : "text-gray-500"}`}
          />
          <span className="text-xs sm:text-sm">{currentLanguage === "en" ? "Timeline" : "타임라인"}</span>
        </button>
        <button
          className={`tab-btn flex flex-col items-center hover-effect ${activeTab === "challenges" ? "active" : ""}`}
          onClick={() => handleTabChange("challenges")}
          data-tab="challenges"
          style={{ cursor: "pointer" }}
        >
          <FaTasks
            className={`text-xl sm:text-2xl mb-1 ${activeTab === "challenges" ? "text-brand-blue" : "text-gray-500"}`}
          />
          <span className="text-xs sm:text-sm">{currentLanguage === "en" ? "Exploration Note" : "탐험노트"}</span>
        </button>
        <button
          className={`tab-btn flex flex-col items-center hover-effect ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => handleTabChange("profile")}
          data-tab="profile"
          style={{ cursor: "pointer" }}
        >
          <FaUser
            className={`text-xl sm:text-2xl mb-1 ${activeTab === "profile" ? "text-brand-blue" : "text-gray-500"}`}
          />
          <span className="text-xs sm:text-sm">{currentLanguage === "en" ? "Profile" : "프로필"}</span>
        </button>
      </div>
    </nav>
  )
}

export default Navigation
