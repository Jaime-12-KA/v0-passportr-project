"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaTimes,
  FaMapMarkerAlt,
  FaUtensils,
  FaCamera,
  FaLandmark,
  FaHiking,
  FaTrophy,
  FaCheck,
  FaUndo,
  FaClock,
  FaShoppingBag,
} from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface Challenge {
  id: string
  title: {
    en: string
    kr: string
  }
  description: {
    en: string
    kr: string
  }
  image: string
  progress: number
  totalSteps: number
  reward: {
    en: string
    kr: string
  }
  category: string
  difficulty: "easy" | "medium" | "hard"
  expiresIn?: number
  isNew?: boolean
  isCompleted?: boolean
  // 새로 추가된 필드
  requiredItems?: {
    en: string[]
    kr: string[]
  }
  estimatedTime?: {
    en: string
    kr: string
  }
  badgeImage?: string // Add this line for badge images
}

interface ChallengeDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  challenge: Challenge
  currentLanguage: string
  onCompleteChallenge: () => void
  onResetChallenge: () => void
}

const ChallengeDetailsModal: React.FC<ChallengeDetailsModalProps> = ({
  isOpen,
  onClose,
  challenge,
  currentLanguage,
  onCompleteChallenge,
  onResetChallenge,
}) => {
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false)

  // 기본 준비물 및 예상 시간 설정 (challenge에 없는 경우)
  const defaultRequiredItems = {
    "seoul-street-food": {
      en: ["Comfortable shoes", "Cash (some vendors don't accept cards)", "Water bottle", "Hand sanitizer"],
      kr: ["편안한 신발", "현금 (일부 가게는 카드를 받지 않음)", "물병", "손 소독제"],
    },
    "seoul-historical-sites": {
      en: ["Comfortable shoes", "Camera", "Sun hat", "Water bottle", "Guide book or app"],
      kr: ["편안한 신발", "카메라", "햇빛 모자", "물병", "가이드북 또는 앱"],
    },
    "capture-landmarks": {
      en: ["Camera or smartphone", "Extra battery", "Tripod (optional)", "Weather-appropriate clothing"],
      kr: ["카메라 또는 스마트폰", "여분의 배터리", "삼각대 (선택사항)", "날씨에 맞는 의복"],
    },
    "cafe-hopping": {
      en: ["Smartphone for photos", "Notebook", "Comfortable shoes", "Appetite for desserts"],
      kr: ["사진용 스마트폰", "노트북", "편안한 신발", "디저트를 위한 식욕"],
    },
    "seoul-bakery-pilgrimage": {
      en: ["Appetite", "Cash and cards", "Reusable bag for takeaways", "Camera"],
      kr: ["식욕", "현금 및 카드", "포장용 재사용 가방", "카메라"],
    },
    "seoul-dullegil-conquest": {
      en: ["Hiking shoes", "Backpack", "Water bottle", "Snacks", "First aid kit", "Weather-appropriate clothing"],
      kr: ["등산화", "배낭", "물병", "간식", "응급 처치 키트", "날씨에 맞는 의복"],
    },
    "bangkok-food-tour": {
      en: ["Comfortable shoes", "Cash (small bills)", "Antacids", "Water bottle", "Hand sanitizer"],
      kr: ["편안한 신발", "현금 (소액권)", "제산제", "물병", "손 소독제"],
    },
  }

  const defaultEstimatedTime = {
    "seoul-street-food": {
      en: "3-4 hours",
      kr: "3-4시간",
    },
    "seoul-historical-sites": {
      en: "Full day (6-8 hours)",
      kr: "하루 종일 (6-8시간)",
    },
    "capture-landmarks": {
      en: "1-2 days",
      kr: "1-2일",
    },
    "cafe-hopping": {
      en: "Half day (3-4 hours)",
      kr: "반나절 (3-4시간)",
    },
    "seoul-bakery-pilgrimage": {
      en: "Half day (3-4 hours)",
      kr: "반나절 (3-4시간)",
    },
    "seoul-dullegil-conquest": {
      en: "Multiple days (1-2 hours per section)",
      kr: "여러 날 (구간당 1-2시간)",
    },
    "bangkok-food-tour": {
      en: "Full day (6-8 hours)",
      kr: "하루 종일 (6-8시간)",
    },
  }

  // Get icon based on category
  const getCategoryIcon = () => {
    switch (challenge.category) {
      case "food":
        return <FaUtensils className="text-white" />
      case "culture":
        return <FaLandmark className="text-white" />
      case "photography":
        return <FaCamera className="text-white" />
      case "nature":
        return <FaHiking className="text-white" />
      default:
        return <FaMapMarkerAlt className="text-white" />
    }
  }

  // Get color based on category
  const getCategoryColor = () => {
    switch (challenge.category) {
      case "food":
        return "bg-orange-500"
      case "culture":
        return "bg-purple-500"
      case "photography":
        return "bg-blue-500"
      case "nature":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Handle complete challenge
  const handleCompleteChallenge = () => {
    setShowCompletionAnimation(true)

    // Trigger haptic feedback
    triggerHapticFeedback(hapticPatterns.success)

    // Wait for animation to complete before calling onCompleteChallenge
    setTimeout(() => {
      onCompleteChallenge()
      onClose()
    }, 2000)
  }

  // Handle reset challenge
  const handleResetChallenge = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    onResetChallenge()
  }

  // 준비물 및 예상 시간 가져오기
  const getRequiredItems = () => {
    if (challenge.requiredItems) return challenge.requiredItems
    return (
      defaultRequiredItems[challenge.id as keyof typeof defaultRequiredItems] || {
        en: ["Comfortable shoes", "Camera", "Water bottle"],
        kr: ["편안한 신발", "카메라", "물병"],
      }
    )
  }

  const getEstimatedTime = () => {
    if (challenge.estimatedTime) return challenge.estimatedTime
    return (
      defaultEstimatedTime[challenge.id as keyof typeof defaultEstimatedTime] || {
        en: "2-3 hours",
        kr: "2-3시간",
      }
    )
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-cloud-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Completion Animation */}
          {showCompletionAnimation && (
            <motion.div
              className="absolute inset-0 bg-brand-blue bg-opacity-90 z-10 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <FaTrophy className="text-6xl text-yellow-400 mb-4" />
              </motion.div>
              <motion.h3
                className="text-2xl font-bold text-white mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentLanguage === "en" ? "Exploration Completed!" : "탐험 완료!"}
              </motion.h3>
              <motion.p
                className="text-white text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {currentLanguage === "en"
                  ? `You've earned: ${challenge.reward.en}`
                  : `획득한 보상: ${challenge.reward.kr}`}
              </motion.p>
            </motion.div>
          )}

          {/* Header Image */}
          <div className="relative h-48">
            <img
              src={challenge.image || "/placeholder.svg"}
              alt={currentLanguage === "en" ? challenge.title.en : challenge.title.kr}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white"
              onClick={onClose}
            >
              <FaTimes />
            </button>

            {/* Category Badge */}
            <div className="absolute top-2 left-2 flex items-center">
              <div className={`w-8 h-8 rounded-full ${getCategoryColor()} flex items-center justify-center`}>
                {getCategoryIcon()}
              </div>
              <span className="ml-2 text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                {currentLanguage === "en"
                  ? challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)
                  : challenge.category === "food"
                    ? "음식"
                    : challenge.category === "culture"
                      ? "문화"
                      : challenge.category === "photography"
                        ? "사진"
                        : "자연"}
              </span>
            </div>

            {/* Title */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white">
                {currentLanguage === "en" ? challenge.title.en : challenge.title.kr}
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Description */}
            <div className="mb-4">
              <h4 className="font-bold mb-2">{currentLanguage === "en" ? "Description" : "설명"}</h4>
              <p className="text-stone-gray">
                {currentLanguage === "en" ? challenge.description.en : challenge.description.kr}
              </p>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">{currentLanguage === "en" ? "Progress" : "진행 상황"}</h4>
                <span className="text-sm text-stone-gray">
                  {challenge.progress}/{challenge.totalSteps}
                </span>
              </div>
              <div className="h-2 bg-light-sand rounded-full overflow-hidden">
                <div
                  className={`h-full ${challenge.isCompleted ? "bg-green-500" : "bg-brand-blue"}`}
                  style={{ width: `${(challenge.progress / challenge.totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Required Items - 새로 추가된 섹션 */}
            <div className="mb-4">
              <h4 className="font-bold mb-2">{currentLanguage === "en" ? "What to Bring" : "준비물"}</h4>
              <div className="bg-light-sand p-3 rounded-lg">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center mr-3 flex-shrink-0">
                    <FaShoppingBag className="text-white" />
                  </div>
                  <div>
                    <ul className="list-disc list-inside text-sm text-stone-gray">
                      {getRequiredItems()[currentLanguage === "en" ? "en" : "kr"].map((item, index) => (
                        <li key={index} className="mb-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Time - 새로 추가된 섹션 */}
            <div className="mb-4">
              <h4 className="font-bold mb-2">{currentLanguage === "en" ? "Estimated Time" : "예상 소요시간"}</h4>
              <div className="bg-light-sand p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-coral flex items-center justify-center mr-3">
                    <FaClock className="text-white" />
                  </div>
                  <p className="font-medium">
                    {currentLanguage === "en" ? getEstimatedTime().en : getEstimatedTime().kr}
                  </p>
                </div>
              </div>
            </div>

            {/* Reward */}
            <div className="mb-6">
              <h4 className="font-bold mb-2">{currentLanguage === "en" ? "Reward" : "보상"}</h4>
              <div className="flex items-center bg-light-sand p-3 rounded-lg">
                {challenge.badgeImage ? (
                  <img
                    src={challenge.badgeImage || "/placeholder.svg"}
                    alt="Badge"
                    className="w-10 h-10 mr-3 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center mr-3">
                    <FaTrophy className="text-deep-navy" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{currentLanguage === "en" ? challenge.reward.en : challenge.reward.kr}</p>
                  <p className="text-xs text-stone-gray">
                    {currentLanguage === "en"
                      ? challenge.isCompleted
                        ? "Already earned"
                        : "Complete the exploration to earn"
                      : challenge.isCompleted
                        ? "이미 획득함"
                        : "탐험을 완료하여 획득하세요"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {challenge.isCompleted ? (
                <button
                  className="flex-1 py-2 border border-stone-gray text-stone-gray rounded-lg flex items-center justify-center hover:bg-stone-gray hover:text-white transition-colors"
                  onClick={handleResetChallenge}
                >
                  <FaUndo className="mr-2" />
                  {currentLanguage === "en" ? "Reset Exploration" : "탐험 초기화"}
                </button>
              ) : (
                <button
                  className="flex-1 py-2 bg-brand-blue text-white rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-colors"
                  onClick={handleCompleteChallenge}
                >
                  <FaCheck className="mr-2" />
                  {currentLanguage === "en" ? "Mark as Complete" : "완료로 표시"}
                </button>
              )}
              <button
                className="flex-1 py-2 border border-brand-coral text-brand-coral rounded-lg hover:bg-brand-coral hover:text-white transition-colors"
                onClick={onClose}
              >
                {currentLanguage === "en" ? "Close" : "닫기"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ChallengeDetailsModal
