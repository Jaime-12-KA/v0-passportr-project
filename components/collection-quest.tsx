"use client"

import { type FC, useState } from "react"
import {
  FaLock,
  FaUtensils,
  FaLandmark,
  FaMapMarkerAlt,
  FaMoon,
  FaTheaterMasks,
  FaFish,
  FaCookieBite,
  FaStore,
  FaPalette,
  FaWater,
  FaConciergeBell,
  FaInfoCircle,
  FaChevronRight,
  FaTrophy,
  FaBolt,
} from "react-icons/fa"
import CollectionViewModal from "./modals/collection-view-modal"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface CollectionQuestProps {
  title: string
  progress: string
  progressPercent: number
  stamps: number
  totalStamps: number
  color: string
  currentLanguage: string
}

const CollectionQuest: FC<CollectionQuestProps> = ({
  title,
  progress,
  progressPercent,
  stamps,
  totalStamps,
  color,
  currentLanguage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  // Generate stamp icons dynamically with React icons
  const getStampIcon = (index: number) => {
    // Different icons based on collection type
    if (title.includes("Street Food") || title.includes("길거리 음식")) {
      return <FaUtensils className="text-white text-lg" />
    } else if (title.includes("Historical") || title.includes("역사 유적지")) {
      return <FaLandmark className="text-white text-lg" />
    } else if (title.includes("Busan Taste") || title.includes("부산 맛과 멋")) {
      // 부산 맛과 멋 컬렉션의 아이콘
      const busan_icons = [
        <FaFish key="fish" />,
        <FaCookieBite key="cookie" />,
        <FaStore key="store" />,
        <FaPalette key="palette" />,
        <FaWater key="water" />,
        <FaUtensils key="utensils" />,
        <FaConciergeBell key="bell" />,
      ]
      return busan_icons[index % busan_icons.length]
    } else if (title.includes("Night Explorer") || title.includes("야행성 탐험가")) {
      return <FaMoon className="text-white text-lg" />
    } else if (title.includes("Culture") || title.includes("문화")) {
      return <FaTheaterMasks className="text-white text-lg" />
    } else if (title.includes("Bangkok Taste") || title.includes("방콕 맛과 멋")) {
      return <FaMapMarkerAlt className="text-white text-lg" />
    } else {
      // Default icon
      return <FaMapMarkerAlt className="text-white text-lg" />
    }
  }

  // Get stamp name based on collection type and index
  const getStampName = (index: number): string => {
    if (title.includes("Street Food") || title.includes("길거리 음식")) {
      const locations = [
        currentLanguage === "en" ? "Gwangjang Market" : "광장시장",
        currentLanguage === "en" ? "Myeongdong Street" : "명동 거리",
        currentLanguage === "en" ? "Tongin Market" : "통인시장",
        currentLanguage === "en" ? "Namdaemun Market" : "남대문시장",
        currentLanguage === "en" ? "Hongdae Food Street" : "홍대 푸드 스트리트",
        currentLanguage === "en" ? "Dongdaemun Night Market" : "동대문 야시장",
        currentLanguage === "en" ? "Yeouido Night Market" : "여의도 야시장",
        currentLanguage === "en" ? "Gangnam Street Food" : "강남 길거리 음식",
      ]
      return index < locations.length
        ? locations[index]
        : `${currentLanguage === "en" ? "Location" : "장소"} ${index + 1}`
    } else if (title.includes("Historical") || title.includes("역사 유적지")) {
      const locations = [
        currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁",
        currentLanguage === "en" ? "Changdeokgung Palace" : "창덕������",
        currentLanguage === "en" ? "Bukchon Hanok Village" : "북촌 한옥마을",
        currentLanguage === "en" ? "Deoksugung Palace" : "덕수궁",
        currentLanguage === "en" ? "Jongmyo Shrine" : "종묘",
        currentLanguage === "en" ? "Seoul City Wall" : "서울 성곽",
      ]
      return index < locations.length
        ? locations[index]
        : `${currentLanguage === "en" ? "Location" : "장소"} ${index + 1}`
    } else if (title.includes("Busan Taste") || title.includes("부산 맛과 멋")) {
      const locations = [
        currentLanguage === "en" ? "Jagalchi Market" : "자갈치 시장",
        currentLanguage === "en" ? "BIFF Square" : "BIFF 광장",
        currentLanguage === "en" ? "Gukje Market" : "국제시장",
        currentLanguage === "en" ? "Gamcheon Culture Village" : "감천문화마을",
        currentLanguage === "en" ? "Huinnyeoul Culture Village" : "흰여울문화마을",
        currentLanguage === "en" ? "Dwaeji Gukbap" : "돼지국밥",
        currentLanguage === "en" ? "Bupyeong Kkangtong Night Market" : "부평깡통야시장",
      ]
      return index < locations.length
        ? locations[index]
        : `${currentLanguage === "en" ? "Location" : "장소"} ${index + 1}`
    } else if (title.includes("Bangkok Taste & Style") || title.includes("방콕 맛과 멋")) {
      const locations = [
        currentLanguage === "en" ? "Wat Arun (Temple of Dawn)" : "왓 아룬 (새벽 사원)",
        currentLanguage === "en" ? "Grand Palace" : "왕궁",
        currentLanguage === "en" ? "Chatuchak Weekend Market" : "짜뚜짝 주말 시장",
        currentLanguage === "en" ? "Khao San Road" : "카오산 로드",
        currentLanguage === "en" ? "Chinatown (Yaowarat)" : "차이나타운 (야오와랏)",
        currentLanguage === "en" ? "Chao Phraya River Cruise" : "차오프라야 강 크루즈",
        currentLanguage === "en" ? "Jim Thompson House" : "짐 톰슨 하우스",
      ]
      return index < locations.length
        ? locations[index]
        : `${currentLanguage === "en" ? "Location" : "장소"} ${index + 1}`
    }

    return `${currentLanguage === "en" ? "Location" : "장소"} ${index + 1}`
  }

  const handleOpenModal = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setIsModalOpen(true)
  }

  const handleToggleExpand = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setIsExpanded(!isExpanded)
  }

  // Calculate reward based on total stamps
  const calculateReward = () => {
    return totalStamps * 50 // 50 XP per stamp
  }

  // Determine the grid layout based on total stamps and expanded state
  const gridCols = totalStamps <= 4 ? "grid-cols-2" : "grid-cols-4"

  // Get the icon for the collection
  const getCollectionIcon = () => {
    if (title.includes("Street Food") || title.includes("길거리 음식")) {
      return <FaUtensils className="text-white" />
    } else if (title.includes("Historical") || title.includes("역사 유적지")) {
      return <FaLandmark className="text-white" />
    } else if (title.includes("Bangkok Taste") || title.includes("방콕 맛과 멋")) {
      return <FaMapMarkerAlt className="text-white" />
    } else {
      return <FaMapMarkerAlt className="text-white" />
    }
  }

  // Get the color class for the collection
  const getColorClass = () => {
    if (color === "sunset-coral") return "bg-sunset-coral"
    if (color === "sky-blue") return "bg-sky-blue"
    if (color === "sunshine-yellow") return "bg-sunshine-yellow"
    return "bg-sky-blue"
  }

  // Get the XP reward based on the collection
  const getXpReward = () => {
    if (title.includes("Street Food") || title.includes("길거리 음식")) {
      return 400
    } else if (title.includes("Historical") || title.includes("역사 유적지")) {
      return 300
    } else if (title.includes("Bangkok Taste") || title.includes("방콕 맛과 멋")) {
      return 350
    }
    return calculateReward()
  }

  return (
    <>
      <CollectionViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        progress={progress}
        progressPercent={progressPercent}
        stamps={stamps}
        totalStamps={totalStamps}
        color={color}
        currentLanguage={currentLanguage}
      />

      <div className="bg-white rounded-lg overflow-hidden border border-light-sand shadow-sm">
        {/* Header with title and progress */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${getColorClass()} flex items-center justify-center mr-2`}>
                {getCollectionIcon()}
              </div>
              <h4 className="font-bold">{title}</h4>
            </div>
            <span
              className="text-sm font-medium px-2 py-1 rounded-full bg-opacity-10"
              style={{ backgroundColor: `var(--${color})`, color: `var(--${color})` }}
            >
              {progress}
            </span>
          </div>

          {/* Progress bar */}
          <div className="progress-bar h-2 mb-2 bg-light-sand bg-opacity-50 rounded-full overflow-hidden">
            <div
              className={`progress-fill h-full rounded-full`}
              style={{ width: `${progressPercent}%`, backgroundColor: `var(--${color})` }}
            />
          </div>

          {/* Progress text */}
          <div className="flex justify-between items-center text-xs text-stone-gray mb-2">
            <span>{currentLanguage === "en" ? "Progress" : "진행"}</span>
            <span>{progressPercent}%</span>
          </div>
        </div>

        {/* Stamps section */}
        <div className="px-4 pt-2 pb-4">
          <div className="grid grid-cols-4 gap-2 mb-2">
            {/* Completed stamps */}
            {Array.from({ length: Math.min(4, stamps) }).map((_, i) => (
              <div key={`stamp-${i}`} className="relative">
                <div
                  className={`stamp w-12 h-12 mx-auto flex items-center justify-center rounded-full shadow-sm relative overflow-hidden`}
                  style={{ backgroundColor: `var(--${color})` }}
                >
                  {getStampIcon(i)}
                </div>
              </div>
            ))}

            {/* Locked stamps (only show up to 4 in the preview) */}
            {Array.from({ length: Math.min(4, totalStamps - stamps) }).map((_, i) => (
              <div key={`locked-${i}`} className="relative">
                <div className="stamp w-12 h-12 badge-locked mx-auto rounded-full shadow-sm relative overflow-hidden">
                  <div className="w-full h-full bg-stone-gray bg-opacity-50 flex items-center justify-center">
                    <FaLock className="text-cloud-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show all stamps link */}
          <div className="flex justify-center mb-4">
            <button className="text-sky-blue text-sm flex items-center hover:underline" onClick={handleToggleExpand}>
              {currentLanguage === "en" ? "Show all stamps" : "모든 스탬프 보기"}
              <FaChevronRight className="ml-1 text-xs" />
            </button>
          </div>

          {/* Rewards section */}
          <div className="bg-light-sand bg-opacity-50 p-3 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FaTrophy className="text-sunshine-yellow mr-2" />
                <span className="text-sm font-medium">{currentLanguage === "en" ? "Rewards" : "보상"}</span>
              </div>
              <div className="flex items-center">
                <FaBolt className="text-sky-blue mr-1" />
                <span className="text-sm font-medium">+{getXpReward()} XP</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <button
              className={`flex-1 py-2.5 text-cloud-white font-medium rounded-lg hover:bg-opacity-90 transition-colors btn-effect flex items-center justify-center`}
              onClick={handleOpenModal}
              style={{ backgroundColor: `var(--${color})` }}
            >
              {currentLanguage === "en" ? "View Collection" : "컬렉션 보기"}
            </button>
            <button
              className="w-10 h-10 bg-light-sand flex items-center justify-center rounded-lg hover:bg-stone-gray hover:text-white transition-colors"
              onClick={handleOpenModal}
              aria-label={currentLanguage === "en" ? "More information" : "더 많은 정보"}
            >
              <FaInfoCircle />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CollectionQuest
