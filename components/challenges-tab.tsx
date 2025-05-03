"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { FaBook, FaUtensils, FaCamera, FaLandmark, FaHiking, FaFilter, FaPlus } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import ChallengeCard from "./challenge-card"
import ChallengeLeaderboard from "./challenge-leaderboard"
import CreateExplorationModal from "./modals/create-exploration-modal"

interface ChallengesTabProps {
  currentLanguage: string
  onOpenModal: (modalId: string) => void
}

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
  badgeImage?: string // Add this line
  category: string
  difficulty: "easy" | "medium" | "hard"
  expiresIn?: number
  isNew?: boolean
  isCompleted?: boolean
  isCustom?: boolean
}

const ChallengesTab: React.FC<ChallengesTabProps> = ({ currentLanguage, onOpenModal }) => {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("all")
  const [showCompletedChallenges, setShowCompletedChallenges] = useState(true)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Initialize challenges with completion status from localStorage
  useEffect(() => {
    const initialChallenges = [
      {
        id: "seoul-street-food",
        title: {
          en: "Seoul Street Food Adventure",
          kr: "서울 길거리 음식 모험",
        },
        description: {
          en: "Visit and try food from 5 different street food locations in Seoul.",
          kr: "서울의 5개 다른 길거리 음식점을 방문하고 음식을 맛보세요.",
        },
        image: "/images/seoul-street-food.png",
        progress: 3,
        totalSteps: 5,
        reward: {
          en: "Food Connoisseur Badge",
          kr: "음식 감정가 배지",
        },
        badgeImage: "/images/food-connoisseur-badge.png",
        category: "food",
        difficulty: "medium",
      },
      {
        id: "seoul-historical-sites",
        title: {
          en: "Seoul Historical Sites",
          kr: "서울 역사 유적지",
        },
        description: {
          en: "Visit 4 historical palaces in Seoul and learn about Korean history.",
          kr: "서울의 4개 역사적 궁궐을 방문하고 한국 역사에 대해 배우세요.",
        },
        image: "/images/seoul-history.png",
        progress: 2,
        totalSteps: 4,
        reward: {
          en: "Cultural Enthusiast Badge",
          kr: "문화 애호가 배지",
        },
        badgeImage: "/images/culture-enthusiast-badge.png",
        category: "culture",
        difficulty: "easy",
        isNew: true,
      },
      {
        id: "capture-landmarks",
        title: {
          en: "Capture Seoul Landmarks",
          kr: "서울 랜드마크 촬영",
        },
        description: {
          en: "Take photos at 6 famous landmarks in Seoul.",
          kr: "서울의 6개 유명 랜드마크에서 사진을 찍으세요.",
        },
        image: "/images/seoul-landmark.png",
        progress: 4,
        totalSteps: 6,
        reward: {
          en: "Seoul Explorer Badge",
          kr: "서울 탐험가 배지",
        },
        badgeImage: "/images/seoulexplorerbadge.png",
        category: "photography",
        difficulty: "medium",
      },
      {
        id: "cafe-hopping",
        title: {
          en: "Seoul Cafe Hopping",
          kr: "서울 카페 투어",
        },
        description: {
          en: "Visit 5 unique cafes in different neighborhoods of Seoul.",
          kr: "서울의 다른 동네에 있는 5개의 독특한 카페를 방문하세요.",
        },
        image: "/images/seoul-cafe-hopping.png",
        progress: 5,
        totalSteps: 5,
        reward: {
          en: "Cafe Hopper Badge",
          kr: "카페 도장깨기 배지",
        },
        badgeImage: "/images/cafe-hopper-badge.png",
        category: "food",
        difficulty: "easy",
        expiresIn: 3,
      },
      {
        id: "seoul-bakery-pilgrimage",
        title: {
          en: "Seoul Bakery Pilgrimage",
          kr: "서울 빵지 순례",
        },
        description: {
          en: "Visit 6 famous bakeries in Seoul and try their signature pastries.",
          kr: "서울의 6개 유명 베이커리를 방문하고 시그니처 페이스트리를 맛보세요.",
        },
        image: "/images/bakerypilgrim3d.png",
        progress: 0,
        totalSteps: 6,
        reward: {
          en: "Bakery Connoisseur Badge",
          kr: "빵순/빵돌이 배지",
        },
        badgeImage: "/images/bakery-connoisseur-badge.png",
        category: "food",
        difficulty: "easy",
      },
      {
        id: "seoul-dullegil-conquest",
        title: {
          en: "Seoul Dullegil Conquest",
          kr: "서울 둘레길 정복",
        },
        description: {
          en: "Complete 8 sections of the Seoul Dullegil trail that circles the city.",
          kr: "서울을 둘러싸는 서울 둘레길의 8개 구간을 완주하세요.",
        },
        image: "/images/dullegil-master.png",
        progress: 0,
        totalSteps: 8,
        reward: {
          en: "Dullegil Master Badge",
          kr: "둘레길 마스터 배지",
        },
        badgeImage: "/images/dullegil-master-badge.png",
        category: "nature",
        difficulty: "hard",
      },
      {
        id: "bangkok-food-tour",
        title: {
          en: "Tasty Bangkok",
          kr: "맛있는 방콕",
        },
        description: {
          en: "Try 7 authentic Thai dishes in Bangkok.",
          kr: "방콕에서 7가지 정통 태국 요리를 맛보세요.",
        },
        image: "/images/tasty-bangkok.png",
        progress: 2,
        totalSteps: 7,
        reward: {
          en: "Thai Cuisine Master Badge",
          kr: "태국 요리 마스터 배지",
        },
        badgeImage: "/images/thai-cuisine-master-badge.png",
        category: "food",
        difficulty: "medium",
      },
    ]

    // Load completion status from localStorage
    const savedChallenges = localStorage.getItem("completedChallenges")
    const completedChallenges = savedChallenges ? JSON.parse(savedChallenges) : {}

    // Load step completion status from localStorage
    const savedSteps = localStorage.getItem("completedSteps")
    const completedSteps = savedSteps ? JSON.parse(savedSteps) : {}

    // Load custom challenges from localStorage
    const savedCustomChallenges = localStorage.getItem("customChallenges")
    const customChallenges = savedCustomChallenges ? JSON.parse(savedCustomChallenges) : []

    // Update challenges with saved completion status and progress
    const updatedChallenges = initialChallenges.map((challenge) => {
      // Check if challenge is completed
      const isCompleted = !!completedChallenges[challenge.id]

      // Calculate progress based on completed steps
      let progress = challenge.progress
      if (completedSteps && completedSteps[challenge.id]) {
        const stepsCompleted = Object.values(completedSteps[challenge.id]).filter(Boolean).length
        progress = stepsCompleted
      }

      // If challenge is completed, set progress to total steps
      if (isCompleted) {
        progress = challenge.totalSteps
      }

      return {
        ...challenge,
        isCompleted,
        progress,
      }
    })

    // Combine default challenges with custom challenges
    const allChallenges = [...updatedChallenges, ...customChallenges]

    setChallenges(allChallenges)
    setIsVisible(true)
  }, [])

  // Handle challenge completion
  const handleCompleteChallenge = (challengeId: string) => {
    triggerHapticFeedback(hapticPatterns.success)

    // Update challenges state
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === challengeId ? { ...challenge, isCompleted: true, progress: challenge.totalSteps } : challenge,
      ),
    )

    // Save to localStorage
    const savedChallenges = localStorage.getItem("completedChallenges")
    const completedChallenges = savedChallenges ? JSON.parse(savedChallenges) : {}
    completedChallenges[challengeId] = true
    localStorage.setItem("completedChallenges", JSON.stringify(completedChallenges))

    // Show completion modal
    onOpenModal("challengeCompletedModal")
  }

  // Handle challenge reset
  const handleResetChallenge = (challengeId: string) => {
    triggerHapticFeedback(hapticPatterns.medium)

    // Find the original progress value for this challenge
    const originalChallenge = challenges.find((c) => c.id === challengeId)
    const originalProgress = originalChallenge ? Math.floor(originalChallenge.totalSteps * 0.3) : 0

    // Update challenges state
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === challengeId ? { ...challenge, isCompleted: false, progress: originalProgress } : challenge,
      ),
    )

    // Remove from localStorage
    const savedChallenges = localStorage.getItem("completedChallenges")
    if (savedChallenges) {
      const completedChallenges = JSON.parse(savedChallenges)
      delete completedChallenges[challengeId]
      localStorage.setItem("completedChallenges", JSON.stringify(completedChallenges))
    }
  }

  const handleCategoryChange = (category: string) => {
    triggerHapticFeedback(hapticPatterns.light)
    setActiveCategory(category)
  }

  const handleToggleCompletedChallenges = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setShowCompletedChallenges(!showCompletedChallenges)
  }

  const handleToggleLeaderboard = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setShowLeaderboard(!showLeaderboard)
  }

  const handleToggleFilters = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setShowFilters(!showFilters)
  }

  const handleOpenCreateModal = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setShowCreateModal(true)
  }

  const handleSaveExploration = (newExploration: any) => {
    // Add the new exploration to the challenges state
    setChallenges((prevChallenges) => [...prevChallenges, newExploration])

    // Save custom challenges to localStorage
    const savedCustomChallenges = localStorage.getItem("customChallenges")
    const customChallenges = savedCustomChallenges ? JSON.parse(savedCustomChallenges) : []
    customChallenges.push(newExploration)
    localStorage.setItem("customChallenges", JSON.stringify(customChallenges))

    // Show notification or success message
    onOpenModal("challengeCompletedModal")
  }

  // Filter challenges based on active category and completion status
  const filteredChallenges = challenges.filter((challenge) => {
    // Filter by category
    if (activeCategory !== "all" && challenge.category !== activeCategory) {
      return false
    }

    // Filter by completion status
    if (!showCompletedChallenges && challenge.isCompleted) {
      return false
    }

    // 모든 도시의 퀘스트를 표시하도록 합니다
    return true
  })

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log("Available challenges:", challenges)
    console.log("Filtered challenges:", filteredChallenges)
  }, [challenges, filteredChallenges])

  return (
    <div
      id="challenges"
      className={`challenges-tab-container tab-content ${isVisible ? "active" : ""}`}
      style={{ minHeight: "calc(var(--app-height, 100vh) - 120px)" }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold serif-font">
            {currentLanguage === "en" ? "Exploration Notes" : "탐험노트"}
          </h2>
          <p className="text-stone-gray">
            {currentLanguage === "en"
              ? "Document your journey and collect memories"
              : "여행을 기록하고 추억을 수집하세요"}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors"
            aria-label={currentLanguage === "en" ? "Create new exploration" : "새 탐험 만들기"}
          >
            <FaPlus />
          </button>
          <button
            onClick={handleToggleFilters}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-light-sand hover:bg-stone-gray hover:text-white transition-colors"
            aria-label={currentLanguage === "en" ? "Filter explorations" : "탐험 필터링"}
          >
            <FaFilter className={showFilters ? "text-brand-coral" : ""} />
          </button>
          <button
            onClick={handleToggleLeaderboard}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-light-sand hover:bg-stone-gray hover:text-white transition-colors"
            aria-label={currentLanguage === "en" ? "Show collections" : "컬렉션 표시"}
          >
            <FaBook className={showLeaderboard ? "text-brand-coral" : ""} />
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <div className="bg-light-sand rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">{currentLanguage === "en" ? "Filter Explorations" : "탐험 필터링"}</h3>
                <div className="flex items-center">
                  <span className="text-sm mr-2">
                    {currentLanguage === "en" ? "Show completed" : "완료된 탐험 표시"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showCompletedChallenges}
                      onChange={handleToggleCompletedChallenges}
                    />
                    <div className="w-11 h-6 bg-stone-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`flex items-center px-3 py-2 rounded-full text-sm ${
                    activeCategory === "all"
                      ? "bg-brand-blue text-white"
                      : "bg-white text-stone-gray hover:bg-stone-gray hover:text-white"
                  } transition-colors`}
                  onClick={() => handleCategoryChange("all")}
                >
                  <FaBook className="mr-1" />
                  {currentLanguage === "en" ? "All" : "전체"}
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded-full text-sm ${
                    activeCategory === "food"
                      ? "bg-brand-blue text-white"
                      : "bg-white text-stone-gray hover:bg-stone-gray hover:text-white"
                  } transition-colors`}
                  onClick={() => handleCategoryChange("food")}
                >
                  <FaUtensils className="mr-1" />
                  {currentLanguage === "en" ? "Food" : "음식"}
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded-full text-sm ${
                    activeCategory === "culture"
                      ? "bg-brand-blue text-white"
                      : "bg-white text-stone-gray hover:bg-stone-gray hover:text-white"
                  } transition-colors`}
                  onClick={() => handleCategoryChange("culture")}
                >
                  <FaLandmark className="mr-1" />
                  {currentLanguage === "en" ? "Culture" : "문화"}
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded-full text-sm ${
                    activeCategory === "photography"
                      ? "bg-brand-blue text-white"
                      : "bg-white text-stone-gray hover:bg-stone-gray hover:text-white"
                  } transition-colors`}
                  onClick={() => handleCategoryChange("photography")}
                >
                  <FaCamera className="mr-1" />
                  {currentLanguage === "en" ? "Photography" : "사진"}
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded-full text-sm ${
                    activeCategory === "nature"
                      ? "bg-brand-blue text-white"
                      : "bg-white text-stone-gray hover:bg-stone-gray hover:text-white"
                  } transition-colors`}
                  onClick={() => handleCategoryChange("nature")}
                >
                  <FaHiking className="mr-1" />
                  {currentLanguage === "en" ? "Nature" : "자연"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Section - Renamed to Collections */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <ChallengeLeaderboard currentLanguage={currentLanguage} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-stone-gray">
          {filteredChallenges.length}
          {currentLanguage === "en" ? " explorations" : "개의 탐험"}
        </p>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            currentLanguage={currentLanguage}
            onCompleteChallenge={() => handleCompleteChallenge(challenge.id)}
            onResetChallenge={() => handleResetChallenge(challenge.id)}
            onViewDetails={(id) => router.push(`/challenge/${id}`)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredChallenges.length === 0 && (
        <div className="text-center py-8">
          <FaBook className="mx-auto text-4xl text-stone-gray mb-2" />
          <p className="text-stone-gray">
            {currentLanguage === "en"
              ? "No explorations found. Try changing your filters."
              : "탐험을 찾을 수 없습니다. 필터를 변경해 보세요."}
          </p>
        </div>
      )}

      {/* Create Exploration Modal */}
      <CreateExplorationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveExploration}
        currentLanguage={currentLanguage}
      />
    </div>
  )
}

export default ChallengesTab
