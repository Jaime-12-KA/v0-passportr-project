"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, ChevronRight } from "lucide-react"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import Image from "next/image"
import Link from "next/link"
import StampUnlockedModal from "./modals/stamp-unlocked-modal"

interface StampCollectionPreviewProps {
  currentLanguage: string
}

const StampCollectionPreview = ({ currentLanguage }: StampCollectionPreviewProps) => {
  const [showStampModal, setShowStampModal] = useState(false)
  const [selectedStamp, setSelectedStamp] = useState<any>(null)

  // Sample stamp data
  const recentStamps = [
    {
      id: "seongsu-cafe",
      name: "Seongsu Hidden Café",
      nameKr: "성수동 숨겨진 카페",
      image: "/images/seoul-cafe-hopping.png",
      rarity: 4,
      description: "A vintage roastery café with aromatic beans and a secret stamp!",
      descriptionKr: "향긋한 원두향이 가득한 빈티지 로스터리 카페의 비밀 스탬프!",
      location: "Seongsu-dong, Seoul",
      category: "cafe",
      date: "Today",
    },
    {
      id: "namsan-tower",
      name: "N Seoul Tower",
      nameKr: "N 서울타워",
      image: "/images/seoul-landmark.png",
      rarity: 3,
      description: "The iconic tower offering panoramic views of Seoul!",
      descriptionKr: "서울의 파노라마 전망을 제공하는 상징적인 타워!",
      location: "Namsan Mountain, Seoul",
      category: "landmark",
      date: "Yesterday",
    },
    {
      id: "night-hike",
      name: "Night Hiking Explorer",
      nameKr: "야간 하이킹 탐험가",
      image: "/images/night-owl.png",
      rarity: 5,
      description: "For the brave souls who conquered the mountain under the stars!",
      descriptionKr: "별빛 아래 산을 정복한 용감한 영혼들을 위한 스탬프!",
      location: "Bukhansan, Seoul",
      category: "activity",
      date: "3 days ago",
    },
    {
      id: "street-food",
      name: "Street Food Master",
      nameKr: "길거리 음식 마스터",
      image: "/images/seoul-street-food.png",
      rarity: 3,
      description: "Tried all the delicious street foods in this vibrant market!",
      descriptionKr: "활기찬 시장에서 모든 맛있는 길거리 음식을 시도했습니다!",
      location: "Gwangjang Market, Seoul",
      category: "food",
      date: "Last week",
    },
  ]

  const handleStampClick = (stamp: any) => {
    triggerHapticFeedback(hapticPatterns.medium)
    setSelectedStamp(stamp)
    setShowStampModal(true)
  }

  const renderRarityStars = (rarity: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star key={i} className={`w-3 h-3 ${i < rarity ? "text-brand-yellow fill-brand-yellow" : "text-gray-300"}`} />,
      )
    }
    return stars
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{currentLanguage === "en" ? "Recent Stamps" : "최근 스탬프"}</h2>
        <Link href="/stamp-pokedex">
          <button
            className="text-sm text-brand-blue flex items-center"
            onClick={() => triggerHapticFeedback(hapticPatterns.light)}
          >
            {currentLanguage === "en" ? "View All" : "전체보기"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {recentStamps.map((stamp) => (
          <motion.div
            key={stamp.id}
            className="border border-gray-200 rounded-lg p-3 cursor-pointer"
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStampClick(stamp)}
          >
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-coral mr-2">
                <Image
                  src={stamp.image || "/placeholder.svg"}
                  alt={stamp.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-sm line-clamp-1">
                  {currentLanguage === "en" ? stamp.name : stamp.nameKr}
                </h3>
                <div className="flex">{renderRarityStars(stamp.rarity)}</div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{stamp.location}</span>
              <span>{stamp.date}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <div className="text-sm">
          <span className="font-medium">24</span>
          <span className="text-gray-500 ml-1">{currentLanguage === "en" ? "collected" : "수집됨"}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium">150</span>
          <span className="text-gray-500 ml-1">{currentLanguage === "en" ? "total" : "전체"}</span>
        </div>
      </div>

      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-coral to-brand-yellow" style={{ width: "16%" }}></div>
      </div>

      {/* Stamp Unlocked Modal */}
      <StampUnlockedModal
        isOpen={showStampModal}
        onClose={() => setShowStampModal(false)}
        stamp={selectedStamp}
        currentLanguage={currentLanguage}
      />
    </div>
  )
}

export default StampCollectionPreview
