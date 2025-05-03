"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trophy, Medal, Award, TrendingUp, Users, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface LeaderboardEntry {
  id: number
  name: string
  image: string
  level: number
  completedChallenges: number
  totalPoints: number
  streak: number
  isFollowing: boolean
  isFriend: boolean
  recentBadge?: {
    name: string
    image: string
  }
}

interface ChallengeLeaderboardProps {
  currentLanguage: string
}

const ChallengeLeaderboard: React.FC<ChallengeLeaderboardProps> = ({ currentLanguage }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [filterType, setFilterType] = useState<"all" | "friends" | "following">("all")
  const [sortBy, setSortBy] = useState<"points" | "challenges" | "streak">("points")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "allTime">("week")
  const [isLoading, setIsLoading] = useState(true)
  const [userRank, setUserRank] = useState<number | null>(null)

  // Mock data for the leaderboard
  const mockLeaderboardData: LeaderboardEntry[] = [
    {
      id: 1,
      name: "Jaime Sung",
      image: "/images/jaime-sung-avatar.png",
      level: 12,
      completedChallenges: 18,
      totalPoints: 2450,
      streak: 7,
      isFollowing: false,
      isFriend: false,
      recentBadge: {
        name: currentLanguage === "en" ? "Seoul Explorer" : "서울 탐험가",
        image: "/images/seoulexplorerbadge.png",
      },
    },
    {
      id: 2,
      name: "Min-ji Kim",
      image: "/images/Friends_Minji Kim.jpg",
      level: 15,
      completedChallenges: 24,
      totalPoints: 3200,
      streak: 14,
      isFollowing: true,
      isFriend: true,
      recentBadge: {
        name: currentLanguage === "en" ? "Food Connoisseur" : "음식 감정가",
        image: "/images/food-connoisseur-badge.png",
      },
    },
    {
      id: 3,
      name: "Tom Park",
      image: "/images/Friends_Tom Park.jpg",
      level: 9,
      completedChallenges: 12,
      totalPoints: 1800,
      streak: 5,
      isFollowing: true,
      isFriend: true,
    },
    {
      id: 4,
      name: "Sarah Lee",
      image: "/images/Friends_Sarah Lee.jpg",
      level: 11,
      completedChallenges: 16,
      totalPoints: 2100,
      streak: 3,
      isFollowing: true,
      isFriend: true,
    },
    {
      id: 5,
      name: "James Choi",
      image: "/images/Friends_James Choi.jpg",
      level: 14,
      completedChallenges: 22,
      totalPoints: 2900,
      streak: 9,
      isFollowing: true,
      isFriend: true,
      recentBadge: {
        name: currentLanguage === "en" ? "Night Explorer" : "야행성 탐험가",
        image: "/images/night-owl.png",
      },
    },
    {
      id: 6,
      name: "David Kim",
      image: "/images/alien_james.png",
      level: 8,
      completedChallenges: 10,
      totalPoints: 1500,
      streak: 2,
      isFollowing: false,
      isFriend: false,
    },
    {
      id: 7,
      name: "Jenny Park",
      image: "/images/astronaut_sarah.png",
      level: 10,
      completedChallenges: 14,
      totalPoints: 1950,
      streak: 6,
      isFollowing: true,
      isFriend: false,
    },
    {
      id: 8,
      name: "Mike Johnson",
      image: "/images/jaime_avatar.png",
      level: 7,
      completedChallenges: 8,
      totalPoints: 1200,
      streak: 1,
      isFollowing: false,
      isFriend: false,
    },
  ]

  // Load and sort leaderboard data
  useEffect(() => {
    // Simulate loading delay
    setIsLoading(true)

    setTimeout(() => {
      let filteredData = [...mockLeaderboardData]

      // Apply filters
      if (filterType === "friends") {
        filteredData = filteredData.filter((entry) => entry.isFriend)
      } else if (filterType === "following") {
        filteredData = filteredData.filter((entry) => entry.isFollowing)
      }

      // Apply sorting
      filteredData.sort((a, b) => {
        let comparison = 0

        if (sortBy === "points") {
          comparison = a.totalPoints - b.totalPoints
        } else if (sortBy === "challenges") {
          comparison = a.completedChallenges - b.completedChallenges
        } else if (sortBy === "streak") {
          comparison = a.streak - b.streak
        }

        return sortDirection === "desc" ? -comparison : comparison
      })

      // Find user's rank
      const userIndex = filteredData.findIndex((entry) => entry.name === "Jaime Sung")
      setUserRank(userIndex !== -1 ? userIndex + 1 : null)

      setLeaderboardData(filteredData)
      setIsLoading(false)
    }, 800)
  }, [filterType, sortBy, sortDirection, timeFrame])

  // Handle filter change
  const handleFilterChange = (filter: "all" | "friends" | "following") => {
    triggerHapticFeedback(hapticPatterns.light)
    setFilterType(filter)
  }

  // Handle sort change
  const handleSortChange = (sort: "points" | "challenges" | "streak") => {
    triggerHapticFeedback(hapticPatterns.light)
    if (sortBy === sort) {
      // Toggle direction if clicking the same sort option
      setSortDirection(sortDirection === "desc" ? "asc" : "desc")
    } else {
      setSortBy(sort)
      setSortDirection("desc") // Default to descending when changing sort type
    }
  }

  // Handle time frame change
  const handleTimeFrameChange = (time: "week" | "month" | "allTime") => {
    triggerHapticFeedback(hapticPatterns.light)
    setTimeFrame(time)
  }

  // Toggle filters visibility
  const toggleFilters = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setShowFilters(!showFilters)
  }

  // Get medal for top 3 positions
  const getMedal = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 2:
        return <Award className="w-5 h-5 text-amber-700" />
      default:
        return null
    }
  }

  return (
    <div className="bg-cloud-white rounded-xl border border-light-sand p-4 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-brand-blue" />
          {currentLanguage === "en" ? "Challenge Leaderboard" : "도전 리더보드"}
        </h3>
        <button
          onClick={toggleFilters}
          className="flex items-center text-sm text-stone-gray hover:text-brand-blue transition-colors"
        >
          <Filter className="w-4 h-4 mr-1" />
          {showFilters
            ? currentLanguage === "en"
              ? "Hide Filters"
              : "필터 숨기기"
            : currentLanguage === "en"
              ? "Show Filters"
              : "필터 표시"}
        </button>
      </div>

      {/* User's current rank */}
      {userRank !== null && (
        <div className="bg-light-sand rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold mr-3">
              {userRank}
            </div>
            <div>
              <p className="font-medium text-sm">{currentLanguage === "en" ? "Your Rank" : "내 순위"}</p>
              <p className="text-xs text-stone-gray">
                {currentLanguage === "en"
                  ? `Top ${Math.round((userRank / leaderboardData.length) * 100)}%`
                  : `상위 ${Math.round((userRank / leaderboardData.length) * 100)}%`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-brand-blue">
              {leaderboardData[userRank - 1]?.totalPoints.toLocaleString()} pts
            </p>
            <p className="text-xs text-stone-gray">
              {leaderboardData[userRank - 1]?.completedChallenges}
              {currentLanguage === "en" ? " challenges" : "개 도전"}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-light-sand rounded-lg p-3">
              {/* Filter by connection type */}
              <div className="mb-3">
                <p className="text-xs text-stone-gray mb-2">{currentLanguage === "en" ? "Show:" : "표시:"}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFilterChange("all")}
                    className={`px-3 py-1 rounded-full text-xs ${
                      filterType === "all" ? "bg-brand-blue text-white" : "bg-white text-stone-gray"
                    }`}
                  >
                    <Users className="w-3 h-3 inline mr-1" />
                    {currentLanguage === "en" ? "All" : "전체"}
                  </button>
                  <button
                    onClick={() => handleFilterChange("friends")}
                    className={`px-3 py-1 rounded-full text-xs ${
                      filterType === "friends" ? "bg-brand-blue text-white" : "bg-white text-stone-gray"
                    }`}
                  >
                    <Users className="w-3 h-3 inline mr-1" />
                    {currentLanguage === "en" ? "Friends" : "친구"}
                  </button>
                  <button
                    onClick={() => handleFilterChange("following")}
                    className={`px-3 py-1 rounded-full text-xs ${
                      filterType === "following" ? "bg-brand-blue text-white" : "bg-white text-stone-gray"
                    }`}
                  >
                    <Users className="w-3 h-3 inline mr-1" />
                    {currentLanguage === "en" ? "Following" : "팔로잉"}
                  </button>
                </div>
              </div>

              {/* Time frame */}
              <div className="mb-3">
                <p className="text-xs text-stone-gray mb-2">{currentLanguage === "en" ? "Time Period:" : "기간:"}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTimeFrameChange("week")}
                    className={`px-3 py-1 rounded-full text-xs ${
                      timeFrame === "week" ? "bg-brand-blue text-white" : "bg-white text-stone-gray"
                    }`}
                  >
                    {currentLanguage === "en" ? "This Week" : "이번 주"}
                  </button>
                  <button
                    onClick={() => handleTimeFrameChange("month")}
                    className={`px-3 py-1 rounded-full text-xs ${
                      timeFrame === "month" ? "bg-brand-blue text-white" : "bg-white text-stone-gray"
                    }`}
                  >
                    {currentLanguage === "en" ? "This Month" : "이번 달"}
                  </button>
                  <button
                    onClick={() => handleTimeFrameChange("allTime")}
                    className={`px-3 py-1 rounded-full text-xs ${
                      timeFrame === "allTime" ? "bg-brand-blue text-white" : "bg-white text-stone-gray"
                    }`}
                  >
                    {currentLanguage === "en" ? "All Time" : "전체 기간"}
                  </button>
                </div>
              </div>

              {/* Sort options */}
              <div>
                <p className="text-xs text-stone-gray mb-2">{currentLanguage === "en" ? "Sort By:" : "정렬:"}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSortChange("points")}
                    className={`px-3 py-1 rounded-full text-xs flex items-center ${
                      sortBy === "points" ? "bg-brand-blue text-white" : "bg-white text-stone-gray"
                    }`}
                  >
                    {currentLanguage === "en" ? "Points" : "포인트"}
                    {sortBy === "points" &&
                      (sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 ml-1" />
                      ) : (
                        <ChevronUp className="w-3 h-3 ml-1" />
                      ))}
                  </button>
                  <button
                    onClick={() => handleSortChange("challenges")}
                    className={`px-3 py-1 rounded-full text-xs flex items-center ${
                      sortBy === "challenges" ? "bg-brand-blue text-white" : "bg-white text-stone-gray"
                    }`}
                  >
                    {currentLanguage === "en" ? "Challenges" : "도전"}
                    {sortBy === "challenges" &&
                      (sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 ml-1" />
                      ) : (
                        <ChevronUp className="w-3 h-3 ml-1" />
                      ))}
                  </button>
                  <button
                    onClick={() => handleSortChange("streak")}
                    className={`px-3 py-1 rounded-full text-xs flex items-center ${
                      sortBy === "streak" ? "bg-brand-blue text-white" : "bg-white text-stone-gray"
                    }`}
                  >
                    {currentLanguage === "en" ? "Streak" : "연속"}
                    {sortBy === "streak" &&
                      (sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 ml-1" />
                      ) : (
                        <ChevronUp className="w-3 h-3 ml-1" />
                      ))}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-light-sand border-t-brand-blue rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboardData.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center p-3 rounded-lg ${
                entry.name === "Jaime Sung" ? "bg-brand-blue bg-opacity-10 border border-brand-blue" : "bg-light-sand"
              }`}
            >
              {/* Rank */}
              <div className="w-8 flex-shrink-0 mr-2">
                {index < 3 ? (
                  <div className="flex justify-center">{getMedal(index)}</div>
                ) : (
                  <div className="text-center font-bold text-stone-gray">{index + 1}</div>
                )}
              </div>

              {/* User info */}
              <div className="flex items-center flex-grow">
                <div className="relative">
                  <img
                    src={entry.image || "/placeholder.svg"}
                    alt={entry.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-brand-yellow text-xs text-deep-navy font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {entry.level}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm">{entry.name}</p>
                  <div className="flex items-center">
                    <p className="text-xs text-stone-gray mr-2">
                      {entry.completedChallenges}
                      {currentLanguage === "en" ? " challenges" : "개 도전"}
                    </p>
                    {entry.recentBadge && (
                      <div className="flex items-center">
                        <img
                          src={entry.recentBadge.image || "/placeholder.svg"}
                          alt={entry.recentBadge.name}
                          className="w-4 h-4 rounded-full mr-1"
                        />
                        <span className="text-xs text-brand-coral truncate max-w-[80px]">{entry.recentBadge.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <p className="font-bold text-brand-blue">{entry.totalPoints.toLocaleString()}</p>
                <div className="flex items-center justify-end">
                  <span className="text-xs text-stone-gray mr-1">{currentLanguage === "en" ? "Streak:" : "연속:"}</span>
                  <span className="text-xs font-medium">{entry.streak}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChallengeLeaderboard
