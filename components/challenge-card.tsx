"use client"

import type React from "react"
import { FaCheck, FaChevronRight, FaMedal, FaClock, FaStar } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import { handleImageError, normalizeImagePath } from "@/utils/image-utils"
import Image from "next/image"

interface ChallengeCardProps {
  challenge: {
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
    isCustom?: boolean
    badgeImage?: string
  }
  currentLanguage: string
  onCompleteChallenge: () => void
  onResetChallenge: () => void
  onViewDetails: (id: string) => void
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  currentLanguage,
  onCompleteChallenge,
  onResetChallenge,
  onViewDetails,
}) => {
  const { id, title, description, image, progress, totalSteps, reward, expiresIn, isNew, isCompleted, isCustom } =
    challenge

  const progressPercent = (progress / totalSteps) * 100
  const normalizedImagePath = normalizeImagePath(image)

  // 디버깅을 위한 로그 추가
  console.log(`Challenge card image path: ${image} -> ${normalizedImagePath}`)

  const handleCardClick = () => {
    triggerHapticFeedback(hapticPatterns.light)
    onViewDetails(id)
  }

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCompleted) {
      onResetChallenge()
    } else {
      onCompleteChallenge()
    }
  }

  const fallbackImageUrl = `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(
    currentLanguage === "en" ? title.en : title.kr,
  )}`

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md p-4"
      onClick={handleCardClick}
    >
      <div className="flex">
        {/* 작은 이미지 (왼쪽) */}
        <div className="relative flex-shrink-0 mr-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            <Image
              src={normalizedImagePath || "/placeholder.svg"}
              alt={currentLanguage === "en" ? title.en : title.kr}
              width={80}
              height={80}
              onError={(e) => handleImageError(e, fallbackImageUrl)}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
          {isNew && (
            <div className="absolute top-1 left-1 bg-brand-blue text-white text-xs px-1.5 py-0.5 rounded-full text-[10px]">
              {currentLanguage === "en" ? "NEW" : "신규"}
            </div>
          )}
          {isCustom && (
            <div className="absolute top-1 right-1 bg-brand-coral text-white text-xs p-1 rounded-full">
              <FaStar className="text-[10px]" />
            </div>
          )}
        </div>

        {/* 제목과 설명 (오른쪽) */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-deep-navy">{currentLanguage === "en" ? title.en : title.kr}</h3>
          </div>

          <p className="text-sm text-stone-gray mb-2 line-clamp-2">
            {currentLanguage === "en" ? description.en : description.kr}
          </p>

          {expiresIn && (
            <div className="text-sunset-coral text-xs flex items-center mb-1">
              <FaClock className="mr-1" />
              {expiresIn} {currentLanguage === "en" ? "days" : "일"}
            </div>
          )}

          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-stone-gray">
                {currentLanguage === "en" ? "Progress" : "진행 상황"}: {progress}/{totalSteps}
              </span>
              <span className="text-xs text-stone-gray">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-blue rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            {challenge.badgeImage ? (
              <div className="flex items-center">
                <Image
                  src={challenge.badgeImage || "/placeholder.svg"}
                  alt={currentLanguage === "en" ? challenge.reward.en : challenge.reward.kr}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span className="font-medium">
                  {currentLanguage === "en" ? challenge.reward.en : challenge.reward.kr}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sunshine-yellow rounded-full flex items-center justify-center mr-2">
                  <FaMedal className="text-deep-navy text-sm" />
                </div>
                <span className="font-medium">{currentLanguage === "en" ? reward.en : reward.kr}</span>
              </div>
            )}

            <div className="flex items-center">
              <button
                className={`w-7 h-7 rounded-full flex items-center justify-center mr-2 ${
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                }`}
                onClick={handleCompleteClick}
                aria-label={
                  isCompleted
                    ? currentLanguage === "en"
                      ? "Reset exploration"
                      : "탐험 초기화"
                    : currentLanguage === "en"
                      ? "Complete exploration"
                      : "탐험 완료"
                }
              >
                <FaCheck className="text-white text-xs" />
              </button>
              <button
                className="w-7 h-7 bg-light-sand rounded-full flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails(id)
                }}
                aria-label={currentLanguage === "en" ? "View details" : "상세 보기"}
              >
                <FaChevronRight className="text-deep-navy text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeCard
