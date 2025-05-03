"use client"

import { type FC, useState, useEffect, useCallback } from "react"
import {
  FaMapMarkerAlt,
  FaToriiGate,
  FaUtensils,
  FaRoute,
  FaCrown,
  FaCoffee,
  FaCalendarCheck,
  FaComments,
  FaMoon,
  FaTimes,
  FaBolt,
  FaStamp,
  FaMedal,
  FaAward,
  FaInfoCircle,
  FaHome,
  FaPassport,
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import type { JSX } from "react"
import Image from "next/image"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface AchievementsTabProps {
  currentLanguage: string
  onTabChange?: (tabName: string) => void // Make this prop optional
}

interface Badge {
  id: number
  name: string
  description: string
  icon: JSX.Element
  color: string
  type: "badge" | "achievement"
  category: string
  progress: string
  date: string
  unlocked: boolean
  tier?: number
  imageSrc?: string
}

interface StampDetailsProps {
  id: string
  name: string
  image: string
  date: string
  category: string
  isCollected: boolean
  description?: string
}

const AchievementsTab: FC<AchievementsTabProps> = ({ currentLanguage, onTabChange }) => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  // Changed default view to "achievements" instead of "badges"
  const [badgeView, setBadgeView] = useState("achievements")
  // Add state for the stamp details modal
  const [showStampDetailsModal, setShowStampDetailsModal] = useState(false)
  const [selectedStamp, setSelectedStamp] = useState<StampDetailsProps | null>(null)

  useEffect(() => {
    setIsVisible(true)

    // Clean up function to reset all states when component unmounts
    return () => {
      setIsVisible(false)
      setSelectedBadge(null)
      setShowInfoModal(false)
      setShowStampDetailsModal(false)
      setSelectedStamp(null)
    }
  }, [])

  // Translated badge names
  const getBadgeName = (englishName: string) => {
    if (currentLanguage === "en") return englishName

    const translations: Record<string, string> = {
      "Cafe Hopper": "카페 도장깨기",
      "Weekly Warrior": "꾸준한 탐험가",
      "Helpful Guide": "꿀팁러",
      "Night Explorer": "야행성 탐험가",
      "Seoul Explorer": "서울 탐험가",
      "Food Connoisseur": "음식 감정가",
      "Cultural Enthusiast": "문화 애호가",
      "Gyeongbokgung Palace": "경복궁",
      "Hongdae Street": "홍대 거리",
      "Bukchon Hanok Village": "북촌 한옥마을",
      "Gwangjang Market": "광장시장",
      "N Seoul Tower": "N 서울타워",
    }

    return translations[englishName] || englishName
  }

  // Get translated stamp descriptions
  const getStampDescription = (name: string) => {
    if (currentLanguage === "en") {
      switch (name) {
        case "Gyeongbokgung":
          return "Gyeongbokgung"
        case "Starbucks":
          return "Starbucks"
        case "Gwangjang":
          return "Gwangjang"
        case "Nanta Show":
          return "Nanta Show"
        case "N Tower Night":
          return "N Tower Night"
        default:
          return name
      }
    } else {
      // Korean translations
      switch (name) {
        case "Gyeongbokgung":
          return "경복궁"
        case "Starbucks":
          return "스타벅스"
        case "Gwangjang":
          return "광장시장"
        case "Nanta Show":
          return "난타 공연"
        case "N Tower Night":
          return "N서울타워 야경"
        default:
          return name
      }
    }
  }

  // Get translated date
  const getLocalizedDate = (date: string) => {
    if (currentLanguage === "en") return date

    // Simple translation for months
    return date.replace("May", "5월")
  }

  // Badge and achievement data
  const badgesData: Badge[] = [
    {
      id: 1,
      name: "Seoul Explorer",
      description: "Visited 25 different locations in Seoul",
      icon: <FaMapMarkerAlt className="text-brand-blue text-3xl" />,
      color: "sky-blue",
      type: "badge",
      category: "explorer",
      progress: "18/25",
      date: "In Progress",
      unlocked: false,
      imageSrc: "/images/My Badge Collection_Seoul Explorer.jpg",
    },
    {
      id: 2,
      name: "Food Connoisseur",
      description: "Tried 20 different local dishes",
      icon: <FaUtensils className="text-brand-blue text-3xl" />,
      color: "sunset-coral",
      type: "badge",
      category: "collector",
      progress: "12/20",
      date: "In Progress",
      unlocked: false,
      imageSrc: "/images/My Badge Collection_Food Connoisseur.jpg",
    },
    {
      id: 3,
      name: "Cultural Enthusiast",
      description: "Visited 15 cultural or historical sites",
      icon: <FaToriiGate className="text-brand-blue text-3xl" />,
      color: "deep-navy",
      type: "badge",
      category: "explorer",
      progress: "7/15",
      date: "In Progress",
      unlocked: false,
      imageSrc: "/images/My Badge Collection_Cultural Enthusiast.jpg",
    },
    {
      id: 4,
      name: "Night Explorer",
      description: "Checked in at 5 locations after sunset",
      icon: <FaMoon className="text-brand-blue text-3xl" />,
      color: "deep-navy",
      type: "badge",
      category: "explorer",
      progress: "5/5",
      date: "Earned 2 weeks ago",
      unlocked: true,
      imageSrc: "/images/My Badge Collection_Night Explorer.jpg",
    },
    {
      id: 5,
      name: "Cafe Hopper",
      description: "Visited 10 different cafes",
      icon: <FaCoffee className="text-brand-blue text-3xl" />,
      color: "sunset-coral",
      type: "badge",
      category: "collector",
      progress: "10/10",
      date: "Earned 3 days ago",
      unlocked: true,
      imageSrc: "/images/My Badge Collection_Cafe Hopper.jpg",
    },
    {
      id: 6,
      name: "Weekly Warrior",
      description: "Completed all weekly challenges for 4 consecutive weeks",
      icon: <FaCalendarCheck className="text-brand-blue text-3xl" />,
      color: "sunshine-yellow",
      type: "badge",
      category: "streak",
      progress: "4/4",
      date: "Earned 5 days ago",
      unlocked: true,
      imageSrc: "/images/My Badge Collection_Weekly Warrior.jpg",
    },
    {
      id: 7,
      name: "Helpful Guide",
      description: "Provided helpful answers to 15 community questions",
      icon: <FaComments className="text-brand-blue text-3xl" />,
      color: "sky-blue",
      type: "badge",
      category: "social",
      progress: "15/15",
      date: "Earned 1 week ago",
      unlocked: true,
    },
    {
      id: 8,
      name: "Gyeongbokgung Palace",
      description: "Visited the largest of the Five Grand Palaces",
      icon: <FaCrown className="text-brand-blue text-3xl" />,
      color: "deep-navy",
      type: "achievement",
      category: "explorer",
      progress: "1/1",
      date: "May 15, 2023",
      unlocked: true,
    },
    {
      id: 9,
      name: "Hongdae Street",
      description: "Explored the vibrant arts and music district",
      icon: <FaRoute className="text-brand-blue text-3xl" />,
      color: "sunset-coral",
      type: "achievement",
      category: "explorer",
      progress: "1/1",
      date: "May 18, 2023",
      unlocked: true,
    },
    {
      id: 10,
      name: "Bukchon Hanok Village",
      description: "Visited the traditional Korean village",
      icon: <FaHome className="text-brand-blue text-3xl" />,
      color: "sunshine-yellow",
      type: "achievement",
      category: "explorer",
      progress: "1/1",
      date: "May 20, 2023",
      unlocked: true,
    },
    {
      id: 11,
      name: "Gwangjang Market",
      description: "Explored the famous traditional market",
      icon: <FaUtensils className="text-brand-blue text-3xl" />,
      color: "sunset-coral",
      type: "achievement",
      category: "collector",
      progress: "1/1",
      date: "May 22, 2023",
      unlocked: true,
    },
    {
      id: 12,
      name: "N Seoul Tower",
      description: "Visited the iconic communication tower",
      icon: <FaMapMarkerAlt className="text-brand-blue text-3xl" />,
      color: "sky-blue",
      type: "achievement",
      category: "explorer",
      progress: "1/1",
      date: "May 25, 2023",
      unlocked: true,
    },
  ]

  // Stamp data for the achievements section
  const stampsData: StampDetailsProps[] = [
    {
      id: "gyeongbokgung",
      name: "Gyeongbokgung Palace",
      image: "/images/gyeongbokgung.jpeg",
      date: "May 15, 2023",
      category: "historical",
      isCollected: true,
      description:
        currentLanguage === "en"
          ? "The main royal palace of the Joseon dynasty, built in 1395."
          : "1395년에 지어진 조선 왕조의 주요 궁궐.",
    },
    {
      id: "hongdae",
      name: "Hongdae Street",
      image: "/images/hongdae.jpeg",
      date: "May 18, 2023",
      category: "entertainment",
      isCollected: true,
      description:
        currentLanguage === "en"
          ? "A vibrant area known for its youthful and artistic atmosphere."
          : "젊고 예술적인 분위기로 유명한 활기찬 지역.",
    },
    {
      id: "gwangjang",
      name: "Gwangjang Market",
      image: "/images/gwangjang.jpeg",
      date: "May 19, 2023",
      category: "food",
      isCollected: true,
      description:
        currentLanguage === "en"
          ? "One of the oldest and largest traditional markets in Seoul."
          : "서울에서 가장 오래되고 큰 전통 시장 중 하나.",
    },
    {
      id: "bukchon",
      name: "Bukchon Hanok Village",
      image: "/images/bukchon.jpeg",
      date: "May 20, 2023",
      category: "cultural",
      isCollected: true,
      description:
        currentLanguage === "en"
          ? "A traditional Korean village featuring hanok houses."
          : "한옥 주택이 있는 전통 한국 마을.",
    },
    {
      id: "nseoul",
      name: "N Seoul Tower",
      image: "/images/seoul.png",
      date: "May 21, 2023",
      category: "landmark",
      isCollected: true,
      description:
        currentLanguage === "en"
          ? "Iconic communication tower offering panoramic views of Seoul."
          : "서울의 파노라마 전망을 제공하는 상징적인 통신탑.",
    },
    {
      id: "nanta",
      name: "Nanta Show",
      image: "/images/Recent Stamps_Nanta Show.jpg",
      date: "May 22, 2023",
      category: "entertainment",
      isCollected: true,
      description:
        currentLanguage === "en"
          ? "A popular non-verbal performance that combines traditional Korean rhythms with modern kitchen tools."
          : "전통적인 한국 리듬과 현대적인 주방 도구를 결합한 인기 있는 비언어 공연.",
    },
    {
      id: "ntower-night",
      name: "N Tower Night",
      image: "/images/Recent Stamps_N Tower Night.jpg",
      date: "May 23, 2023",
      category: "landmark",
      isCollected: true,
      description:
        currentLanguage === "en"
          ? "The beautiful night view of Seoul from N Seoul Tower."
          : "N 서울타워에서 바라본 서울의 아름다운 야경.",
    },
  ]

  // Filter badges based on active category and type
  const filteredBadges = badgesData.filter((badge) => {
    // Remove category filtering, keep only type filtering
    const matchesType = badge.type === badgeView
    return matchesType
  })

  // Check if we should show stamps or badges
  const showingStamps = badgeView === "achievements"
  const hasItemsToShow = showingStamps ? stampsData.length > 0 : filteredBadges.length > 0

  // Handle "View in Passport" button click
  const handleViewInPassport = useCallback(() => {
    // Close any open modals first
    if (showStampDetailsModal) {
      setShowStampDetailsModal(false)
      setSelectedStamp(null)
    }

    if (showInfoModal) {
      setShowInfoModal(false)
    }

    if (selectedBadge) {
      setSelectedBadge(null)
    }

    // Trigger haptic feedback
    triggerHapticFeedback(hapticPatterns.medium)

    // Use a small delay to ensure modals are fully closed
    setTimeout(() => {
      if (typeof onTabChange === "function") {
        console.log("Navigating to passport tab from achievements")
        onTabChange("passport")
      } else {
        // Fallback: Try to find and click the passport tab button
        const passportTabButton = document.querySelector('.tab-btn[data-tab="passport"]') as HTMLElement
        if (passportTabButton) {
          passportTabButton.click()
        } else {
          console.log("Navigation to passport tab is not available")
        }
      }
    }, 50)
  }, [onTabChange, showStampDetailsModal, showInfoModal, selectedBadge])

  // Handle navigation to check-in tab
  const handleGoToCheckIn = useCallback(() => {
    if (typeof onTabChange === "function") {
      console.log("Navigating to check-in tab from achievements")
      triggerHapticFeedback(hapticPatterns.medium)
      onTabChange("check-in")
    } else {
      const checkInTabButton = document.querySelector('.tab-btn[data-tab="check-in"]') as HTMLElement
      if (checkInTabButton) {
        checkInTabButton.click()
      } else {
        console.log("Navigation to check-in tab is not available")
      }
    }
  }, [onTabChange])

  // Render badge details modal
  const renderBadgeDetails = () => {
    if (!selectedBadge) return null

    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedBadge(null)}
        >
          <motion.div
            className="bg-cloud-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{getBadgeName(selectedBadge.name)}</h3>
              <button className="text-stone-gray hover:text-deep-navy" onClick={() => setSelectedBadge(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              {selectedBadge.imageSrc ? (
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <Image
                    src={selectedBadge.imageSrc || "/placeholder.svg"}
                    alt={selectedBadge.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`w-24 h-24 rounded-full bg-${selectedBadge.color} flex items-center justify-center mb-4 relative overflow-hidden ${selectedBadge.type === "achievement" ? "achievement-icon" : "badge-icon"}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
                  {selectedBadge.icon}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
                </div>
              )}

              <p className="text-center text-stone-gray mb-4">{selectedBadge.description}</p>

              <div className="w-full bg-light-sand p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{currentLanguage === "en" ? "Progress" : "진행"}</span>
                  <span className="text-sm font-medium">{selectedBadge.progress}</span>
                </div>
                <div className="progress-bar mb-4">
                  <div
                    className={`progress-fill bg-${selectedBadge.color}`}
                    style={{
                      width: `${(Number.parseInt(selectedBadge.progress.split("/")[0]) / Number.parseInt(selectedBadge.progress.split("/")[1])) * 100}%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-sky-blue rounded-full flex items-center justify-center mr-2">
                      <FaBolt className="text-brand-blue text-xs" />
                    </div>
                    <span className="text-deep-navy">+{selectedBadge.type === "badge" ? "100" : "50"} XP</span>
                  </div>
                  {selectedBadge.type === "badge" && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-sunset-coral rounded-full flex items-center justify-center mr-2">
                        <FaAward className="text-brand-blue text-xs" />
                      </div>
                      <span className="text-deep-navy">{currentLanguage === "en" ? "Special Badge" : "특별 배지"}</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-stone-gray">{selectedBadge.date}</p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Render info modal explaining the difference between badges and achievements
  const renderInfoModal = () => (
    <AnimatePresence>
      {false && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowInfoModal(false)}
        >
          <motion.div
            className="bg-cloud-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {currentLanguage === "en" ? "Badges vs. Achievements" : "배지 vs. 업적"}
              </h3>
              <button className="text-stone-gray hover:text-deep-navy" onClick={() => setShowInfoModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-sky-blue rounded-full flex items-center justify-center mr-3 badge-icon flex-shrink-0">
                  <FaMedal className="text-brand-blue text-xl" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{currentLanguage === "en" ? "Badges" : "배지"}</h4>
                  <p className="text-sm text-stone-gray">
                    {currentLanguage === "en"
                      ? "Badges are earned through cumulative experiences or meeting specific criteria. They represent your titles and accolades as an explorer."
                      : "배지는 누적된 경험이나 특정 기준을 충족하여 획득합니다. 탐험가로서의 칭호와 업적을 나타냅니다."}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-sunset-coral rounded-full flex items-center justify-center mr-3 achievement-icon flex-shrink-0">
                  <FaStamp className="text-brand-blue text-xl" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{currentLanguage === "en" ? "Achievements" : "업적"}</h4>
                  <p className="text-sm text-stone-gray">
                    {currentLanguage === "en"
                      ? "Achievements are earned by checking in at specific locations or completing quests. They appear as stamps in your passport and mark your journey."
                      : "업적은 특정 장소에서 체크인하거나 퀘스트를 완료하여 획득합니다. 여권에 스탬프로 표시되며 여정을 기록합니다."}
                  </p>
                </div>
              </div>
            </div>

            <button
              className="w-full py-2 bg-sky-blue text-brand-blue rounded-lg"
              onClick={() => setShowInfoModal(false)}
            >
              {currentLanguage === "en" ? "Got it!" : "이해했습니다!"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Add a stamp details modal
  const renderStampDetailsModal = () => {
    if (!selectedStamp) return null

    return (
      <AnimatePresence>
        {showStampDetailsModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStampDetailsModal(false)}
          >
            <motion.div
              className="bg-cloud-white rounded-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{getBadgeName(selectedStamp.name)}</h3>
                <button
                  className="text-stone-gray hover:text-deep-navy"
                  onClick={() => setShowStampDetailsModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-light-sand">
                  <Image
                    src={selectedStamp.image || "/placeholder.svg"}
                    alt={selectedStamp.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-center text-stone-gray mb-4">{selectedStamp.description}</p>

                <div className="w-full bg-light-sand p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-sky-blue rounded-full flex items-center justify-center mr-2">
                        <FaStamp className="text-brand-blue text-xs" />
                      </div>
                      <span className="text-deep-navy">
                        {currentLanguage === "en" ? "Stamp Collected" : "스탬프 수집됨"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-sunset-coral rounded-full flex items-center justify-center mr-2">
                        <FaBolt className="text-brand-blue text-xs" />
                      </div>
                      <span className="text-deep-navy">+50 XP</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-gray">{selectedStamp.date}</p>
              </div>

              <button
                className="w-full py-2 bg-brand-blue text-cloud-white rounded-lg"
                onClick={() => {
                  setShowStampDetailsModal(false)
                  handleViewInPassport()
                }}
              >
                {currentLanguage === "en" ? "View in Passport" : "여권에서 보기"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <div id="achievements" className={`tab-content ${isVisible ? "active" : ""}`}>
      {renderBadgeDetails()}
      {renderInfoModal()}
      {renderStampDetailsModal()}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold serif-font">{currentLanguage === "en" ? "Achievements" : "업적"}</h2>
          <p className="text-stone-gray">
            {currentLanguage === "en"
              ? "Track your progress and unlock special rewards"
              : "진행 상황을 추적하고 특별한 보상을 해제하세요"}
          </p>
        </div>
        <div className="flex items-center">
          <button
            className="w-8 h-8 bg-light-sand rounded-full flex items-center justify-center mr-3 hover:bg-stone-gray hover:text-deep-navy transition-colors"
            onClick={() => {}}
          >
            <FaInfoCircle />
          </button>
          <div className="flex items-center bg-light-sand px-4 py-2 rounded-full">
            <span className="mr-2 font-medium whitespace-nowrap">{currentLanguage === "en" ? "Total:" : "총:"}</span>
            <span className="text-sky-blue font-bold">28/75</span>
          </div>
        </div>
      </div>

      <div className="premium-card p-6 stamp-catalog-container">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold serif-font">
            {currentLanguage === "en" ? "Stamp Catalog" : "스탬프 카탈로그"}
          </h3>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded-lg text-sm ${badgeView === "achievements" ? "bg-brand-blue text-cloud-white" : "bg-light-sand text-deep-navy"}`}
              onClick={() => setBadgeView("achievements")}
            >
              {currentLanguage === "en" ? "Achievements" : "업적"}
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-sm ${badgeView === "badge" ? "bg-brand-blue text-cloud-white" : "bg-light-sand text-deep-navy"}`}
              onClick={() => setBadgeView("badge")}
            >
              {currentLanguage === "en" ? "Badges" : "배지"}
            </button>
          </div>
        </div>

        <p className="text-sm text-stone-gray mb-4">
          {badgeView === "achievements"
            ? currentLanguage === "en"
              ? "Achievements are earned by checking in at specific locations"
              : "특정 장소에서 체크인하여 업적을 획득하세요"
            : currentLanguage === "en"
              ? "Badges are earned through completing special challenges"
              : "특별한 도전 과제를 완료하여 배지를 획득하세요"}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {showingStamps
            ? // Show stamps
              stampsData.map((stamp) => (
                <div
                  key={stamp.id}
                  className="stamp-item flex flex-col items-center cursor-pointer"
                  onClick={() => {
                    triggerHapticFeedback(hapticPatterns.light)
                    setSelectedStamp(stamp)
                    setShowStampDetailsModal(true)
                  }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 border-2 border-light-sand">
                    <Image
                      src={stamp.image || "/placeholder.svg"}
                      alt={stamp.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-center">{getBadgeName(stamp.name)}</p>
                  <p className="text-xs text-stone-gray text-center">{getLocalizedDate(stamp.date)}</p>
                </div>
              ))
            : // Show badges
              filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="stamp-item flex flex-col items-center cursor-pointer"
                  onClick={() => {
                    triggerHapticFeedback(hapticPatterns.light)
                    setSelectedBadge(badge)
                  }}
                >
                  {badge.imageSrc ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2">
                      <Image
                        src={badge.imageSrc || "/placeholder.svg"}
                        alt={badge.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-${badge.color} flex items-center justify-center mb-2 relative overflow-hidden ${badge.type === "achievement" ? "achievement-icon" : "badge-icon"}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
                      {badge.icon}
                    </div>
                  )}
                  <p className="text-xs sm:text-sm font-medium text-center">{getBadgeName(badge.name)}</p>
                  <p className="text-xs text-stone-gray text-center">{badge.progress}</p>
                </div>
              ))}
        </div>

        {!hasItemsToShow && (
          <div className="text-center py-8">
            <FaStamp className="text-stone-gray text-4xl mx-auto mb-3" />
            <h4 className="font-bold mb-2">
              {currentLanguage === "en" ? "No items found" : "항목을 찾을 수 없습니다"}
            </h4>
            <p className="text-sm text-stone-gray">
              {currentLanguage === "en" ? "Try changing your filter settings" : "필터 설정을 변경해 보세요"}
            </p>
          </div>
        )}

        {badgeView === "achievements" && (
          <div className="mt-6 flex justify-center">
            <button
              className="px-4 py-2 bg-brand-blue text-cloud-white rounded-lg flex items-center hover:bg-brand-blue/90 transition-colors"
              onClick={handleViewInPassport}
            >
              <FaPassport className="mr-2" />
              <span>{currentLanguage === "en" ? "View in Passport" : "여권에서 보기"}</span>
            </button>
          </div>
        )}

        {badgeView === "badge" && filteredBadges.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              className="px-4 py-2 bg-sunset-coral text-cloud-white rounded-lg flex items-center hover:bg-sunset-coral/90 transition-colors"
              onClick={handleGoToCheckIn}
            >
              <FaMapMarkerAlt className="mr-2" />
              <span>{currentLanguage === "en" ? "Check-in to earn more" : "더 많이 획득하려면 체크인하세요"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Achievement Statistics */}
      <div className="premium-card p-6 mt-6">
        <h3 className="text-xl font-bold serif-font mb-4">
          {currentLanguage === "en" ? "Achievement Statistics" : "업적 통계"}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-cloud-white p-4 rounded-lg text-center shadow-sm">
            <p className="text-sm text-stone-gray mb-1 whitespace-nowrap">
              {currentLanguage === "en" ? "Total Achievements" : "총 업적"}
            </p>
            <p className="text-2xl font-bold">
              28 <span className="text-stone-gray text-lg font-normal">/ 75</span>
            </p>
          </div>
          <div className="bg-cloud-white p-4 rounded-lg text-center shadow-sm">
            <p className="text-sm text-stone-gray mb-1 whitespace-nowrap">
              {currentLanguage === "en" ? "Completion Rate" : "완료율"}
            </p>
            <p className="text-2xl font-bold">37%</p>
          </div>
          <div className="bg-cloud-white p-4 rounded-lg text-center shadow-sm">
            <p className="text-sm text-stone-gray mb-1 whitespace-nowrap">
              {currentLanguage === "en" ? "XP from Achievements" : "업적 XP"}
            </p>
            <p className="text-2xl font-bold">3,450</p>
          </div>
          <div className="bg-cloud-white p-4 rounded-lg text-center shadow-sm">
            <p className="text-sm text-stone-gray mb-1 whitespace-nowrap">
              {currentLanguage === "en" ? "Badges Earned" : "획득 배지"}
            </p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementsTab
