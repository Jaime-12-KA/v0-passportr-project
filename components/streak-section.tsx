"use client"

import type { FC } from "react"
import { FaFire, FaShieldAlt } from "react-icons/fa"

interface StreakSectionProps {
  currentLanguage: string
}

const StreakSection: FC<StreakSectionProps> = ({ currentLanguage }) => {
  // Generate calendar day elements with circular icons instead of text
  const generateCalendarDays = () => {
    const days = ["M", "T", "W", "T", "F", "S", "S"]
    const elements = []

    // Active streak days (14 days)
    for (let i = 0; i < 14; i++) {
      elements.push(
        <div key={`active-${i}`} className="flex flex-col items-center">
          <div className="text-xs text-stone-gray mb-1">{days[i % 7]}</div>
          <div className="w-8 h-8 rounded-full bg-sky-blue flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>,
      )
    }

    // Inactive days
    for (let i = 0; i < 7; i++) {
      elements.push(
        <div key={`inactive-${i}`} className="flex flex-col items-center">
          <div className="text-xs text-stone-gray mb-1">{days[i % 7]}</div>
          <div className="w-8 h-8 rounded-full bg-stone-gray bg-opacity-30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-stone-gray"></div>
          </div>
        </div>,
      )
    }

    return elements
  }

  return (
    <div className="bg-light-sand rounded-xl p-6 mb-12">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold serif-font">
            {currentLanguage === "en" ? "Current Streak" : "현재 연속 기록"}
          </h3>
          <p className="text-stone-gray">
            {currentLanguage === "en" ? "You're on a roll! Keep it up!" : "연속 기록 중입니다! 계속 유지하세요!"}
          </p>
        </div>
        <div className="flex items-center">
          <div className="bg-sky-blue w-12 h-12 rounded-full flex items-center justify-center mr-3">
            <FaFire className="text-brand-blue text-lg" />
          </div>
          <div>
            <p className="text-sm text-stone-gray">{currentLanguage === "en" ? "Current Streak" : "현재 연속"}</p>
            <p className="text-2xl font-bold">{currentLanguage === "en" ? "14 Days" : "14일"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">{generateCalendarDays()}</div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-stone-gray mb-1">
            {currentLanguage === "en" ? "Streak Protection" : "연속 기록 보호"}
          </p>
          <div className="flex">
            <div className="w-8 h-8 bg-sunset-coral rounded-full flex items-center justify-center mr-1">
              <FaShieldAlt className="text-brand-blue text-xs" />
            </div>
            <div className="w-8 h-8 bg-sunset-coral rounded-full flex items-center justify-center mr-1">
              <FaShieldAlt className="text-brand-blue text-xs" />
            </div>
            <div className="w-8 h-8 bg-sunset-coral rounded-full flex items-center justify-center">
              <FaShieldAlt className="text-brand-blue text-xs" />
            </div>
          </div>
        </div>
        <div>{/* Empty div for layout */}</div>
      </div>
    </div>
  )
}

export default StreakSection
