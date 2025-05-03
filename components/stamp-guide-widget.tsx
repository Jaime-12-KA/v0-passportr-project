"use client"
import { ChevronRight } from "lucide-react"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import Link from "next/link"

interface StampGuideWidgetProps {
  currentLanguage: string
}

const StampGuideWidget = ({ currentLanguage }: StampGuideWidgetProps) => {
  const totalStamps = 150
  const collectedStamps = 24

  // Sample stamp guide data
  const stampGuide = [
    { id: "cafe1", emoji: "☕", collected: true, category: "cafe" },
    { id: "bakery1", emoji: "🥐", collected: true, category: "food" },
    { id: "park1", emoji: "🌸", collected: true, category: "nature" },
    { id: "locked1", emoji: "🔒", collected: false, category: "unknown" },
    { id: "mountain1", emoji: "🏞", collected: true, category: "nature" },
    { id: "food1", emoji: "🍜", collected: true, category: "food" },
    { id: "art1", emoji: "🎨", collected: true, category: "culture" },
    { id: "locked2", emoji: "🔒", collected: false, category: "unknown" },
    { id: "locked3", emoji: "🔒", collected: false, category: "unknown" },
    { id: "locked4", emoji: "🔒", collected: false, category: "unknown" },
    { id: "locked5", emoji: "🔒", collected: false, category: "unknown" },
    { id: "locked6", emoji: "🔒", collected: false, category: "unknown" },
  ]

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="text-xl mr-2">🗺️</span>
          <h2 className="font-bold">
            {currentLanguage === "en" ? "Stamp Guide" : "스탬프 가이드"}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({collectedStamps} / {totalStamps})
            </span>
          </h2>
        </div>
        <Link href="/stamp-collection">
          <button
            className="text-sm text-brand-blue flex items-center"
            onClick={() => triggerHapticFeedback(hapticPatterns.light)}
          >
            {currentLanguage === "en" ? "View All" : "전체보기"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {stampGuide.slice(0, 12).map((item) => (
          <div
            key={item.id}
            className={`aspect-square flex items-center justify-center text-2xl border ${
              item.collected ? "border-brand-coral bg-white" : "border-gray-300 bg-gray-100"
            } rounded-md`}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-coral to-brand-yellow"
          style={{ width: `${(collectedStamps / totalStamps) * 100}%` }}
        ></div>
      </div>

      <div className="mt-3">
        <Link href="/stamp-collection">
          <button
            className="w-full py-2 bg-brand-coral text-white rounded-lg flex items-center justify-center"
            onClick={() => triggerHapticFeedback(hapticPatterns.medium)}
          >
            {currentLanguage === "en" ? "Check In & Collect Stamps" : "체크인 및 스탬프 수집"}
          </button>
        </Link>
      </div>
    </div>
  )
}

export default StampGuideWidget
