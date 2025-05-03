"use client"

import { useState, useEffect, useCallback } from "react"
import { FaFilter, FaCheckCircle, FaStamp, FaMedal, FaArrowUp, FaLeaf } from "react-icons/fa"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { RiMedalLine, RiMapPinLine, RiQuillPenLine } from "react-icons/ri"
import { BsCamera, BsAward, BsCheckCircle } from "react-icons/bs"
import Image from "next/image"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

interface TimelineTabProps {
  currentLanguage: string
}

// Define activity types for the timeline
type ActivityType = "check-in" | "manual-log" | "stamp-earned" | "badge-earned" | "quest-completed"

interface TimelineActivity {
  id: string
  type: ActivityType
  title: string
  subtitle?: string
  timestamp: string
  date: string
  dateGroup: string
  image?: string
  location?: string
  memo?: string
  category?: string
}

export function TimelineTab({ currentLanguage }: TimelineTabProps) {
  const [activities, setActivities] = useState<TimelineActivity[]>(getSampleActivities(currentLanguage))
  const [filterOpen, setFilterOpen] = useState(false)
  const [showGoToTop, setShowGoToTop] = useState(false)
  const router = useRouter()

  // Add a new state for filtered activities
  const [filteredActivities, setFilteredActivities] = useState<TimelineActivity[]>(activities)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  // Add a function to handle filter selection
  const handleFilterSelect = (filter: string) => {
    setActiveFilter(filter)
    triggerHapticFeedback(hapticPatterns.light)

    if (filter === "all") {
      setFilteredActivities(activities)
    } else {
      setFilteredActivities(activities.filter((activity) => activity.type === filter))
    }
  }

  // Update the toggleFilter function to properly show filter options
  const toggleFilter = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setFilterOpen(!filterOpen)
  }

  // Group activities by date
  const groupedActivities = filteredActivities.reduce(
    (groups, activity) => {
      if (!groups[activity.dateGroup]) {
        groups[activity.dateGroup] = []
      }
      groups[activity.dateGroup].push(activity)
      return groups
    },
    {} as Record<string, TimelineActivity[]>,
  )

  // Get date groups in order
  const dateGroups = Object.keys(groupedActivities)

  // Function to scroll to the top of the timeline
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Show/hide the "go to top" button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 200) // Adjust scroll threshold as needed
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Update activities state when the currentLanguage prop changes
  useEffect(() => {
    setActivities(getSampleActivities(currentLanguage))
  }, [currentLanguage])

  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    // When activities change, apply the current filter
    if (activeFilter === "all") {
      setFilteredActivities(activities)
    } else {
      setFilteredActivities(activities.filter((activity) => activity.type === activeFilter))
    }
  }, [activities, activeFilter])

  return (
    <div className="tab-container">
      {" "}
      {/* tab-container 클래스 추가 */}
      <div className="timeline-tab-container pb-16" style={{ minHeight: "calc(var(--app-height, 100vh) - 120px)" }}>
        <div className="timeline-tab tab-content active bg-[#f8f3e2] p-4 sm:p-6 min-h-screen">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl font-bold serif-font text-deep-navy">
                {currentLanguage === "en" ? "The Explorer's Log" : "탐험가의 기록"}
              </h2>
              <p className="text-stone-gray text-sm">
                {currentLanguage === "en" ? "The Journey in Every Step" : "한 발짝 여행기"}
              </p>
            </div>
            <button
              className={`w-10 h-10 rounded-full ${
                filterOpen ? "bg-azure-radiance text-white" : "bg-[#F0F0F0] text-deep-navy border border-mid-gray"
              } flex items-center justify-center shadow-sm transition-colors duration-200`}
              onClick={toggleFilter}
            >
              <FaFilter className={`${filterOpen ? "text-white" : "text-deep-navy"} transition-colors duration-200`} />
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                className="bg-[#FFFBF5] rounded-xl p-5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] mb-6 border border-light-sand"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  border: "1px solid #E0E0E0",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h3 className="font-medium mb-3 text-deep-navy serif-font">
                  {currentLanguage === "en" ? "Filter Your Story" : "이야기 필터링"}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button
                    className={`px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeFilter === "all"
                        ? "font-medium shadow-md"
                        : "bg-[#F0F0F0] text-deep-navy hover:bg-[#E5E5E5] border border-mid-gray"
                    }`}
                    style={{
                      backgroundColor: activeFilter === "all" ? "#00A9E0" : "#F0F0F0",
                      color: activeFilter === "all" ? "white" : "#1D1D1F",
                    }}
                    onClick={() => handleFilterSelect("all")}
                  >
                    {currentLanguage === "en" ? "All Moments" : "모든 순간"}
                  </button>
                  <button
                    className={`px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeFilter === "check-in"
                        ? "font-medium shadow-md"
                        : "bg-[#F0F0F0] text-deep-navy hover:bg-[#E5E5E5] border border-mid-gray"
                    }`}
                    style={{
                      backgroundColor: activeFilter === "check-in" ? "#00A9E0" : "#F0F0F0",
                      color: activeFilter === "check-in" ? "white" : "#1D1D1F",
                    }}
                    onClick={() => handleFilterSelect("check-in")}
                  >
                    {currentLanguage === "en" ? "Just Footprints" : "발자국만"}
                  </button>
                  <button
                    className={`px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeFilter === "stamp-earned"
                        ? "font-medium shadow-md"
                        : "bg-[#F0F0F0] text-deep-navy hover:bg-[#E5E5E5] border border-mid-gray"
                    }`}
                    style={{
                      backgroundColor: activeFilter === "stamp-earned" ? "#00A9E0" : "#F0F0F0",
                      color: activeFilter === "stamp-earned" ? "white" : "#1D1D1F",
                    }}
                    onClick={() => handleFilterSelect("stamp-earned")}
                  >
                    {currentLanguage === "en" ? "Collected Stamps" : "수집된 스탬프"}
                  </button>
                  <button
                    className={`px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeFilter === "badge-earned"
                        ? "font-medium shadow-md"
                        : "bg-[#F0F0F0] text-deep-navy hover:bg-[#E5E5E5] border border-mid-gray"
                    }`}
                    style={{
                      backgroundColor: activeFilter === "badge-earned" ? "#00A9E0" : "#F0F0F0",
                      color: activeFilter === "badge-earned" ? "white" : "#1D1D1F",
                    }}
                    onClick={() => handleFilterSelect("badge-earned")}
                  >
                    {currentLanguage === "en" ? "Earned Treasures" : "획득한 보물"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline Content */}
          <div className="timeline-content relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-8 bottom-0 w-px border-l border-dashed border-stone-gray border-opacity-20 z-0"></div>

            {dateGroups.map((dateGroup) => (
              <div key={dateGroup} className="mb-8 sm:mb-10 relative z-10">
                {/* Date Header */}
                <div className="date-header flex items-center mb-4 sm:mb-5">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#FFFBF5] border border-light-sand shadow-sm flex items-center justify-center z-10">
                      <FaLeaf className="text-sunset-coral text-sm opacity-70" />
                    </div>
                    <h3 className="ml-3 text-base font-medium serif-font text-stone-gray">{dateGroup}</h3>
                  </div>
                </div>

                {/* Activities for this date */}
                <div className="space-y-4 sm:space-y-5 pl-5">
                  {groupedActivities[dateGroup].map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} currentLanguage={currentLanguage} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Go-to-top button */}
          <AnimatePresence>
            {showGoToTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToTop}
                className="fixed bottom-20 right-4 bg-azure-radiance text-cloud-white rounded-full w-12 h-12 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:bg-opacity-90 transition-all duration-200 z-40"
                aria-label={currentLanguage === "en" ? "Scroll to top" : "맨 위로 스크롤"}
              >
                <FaArrowUp />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Activity Item Component
const ActivityItem = ({
  activity,
  currentLanguage,
}: {
  activity: TimelineActivity
  currentLanguage: string
}) => {
  const isMobile = useMobile()
  const router = useRouter()

  const handleClick = () => {
    triggerHapticFeedback(hapticPatterns.light)
    // 모달을 열지 않고 새 페이지로 이동
    router.push(`/timeline-activity/${activity.id}`)
  }

  // Render different activity types
  switch (activity.type) {
    case "check-in":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFBF5] rounded-xl p-5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] flex items-start cursor-pointer hover:shadow-md transition-all duration-200 active:bg-light-sand relative overflow-hidden"
          onClick={handleClick}
          role="button"
          aria-label={`View details for ${activity.title}`}
        >
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-azure-radiance opacity-70"></div>

          <div className="w-12 h-12 rounded-full bg-azure-radiance bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
            <RiMapPinLine className="text-azure-radiance text-xl" />
          </div>
          <div className="flex-grow">
            <h4 className="font-medium text-deep-navy text-lg mb-1">{activity.title}</h4>
            <p className="text-[#64748B] mb-2">{activity.location}</p>
            <p className="text-xs text-[#94A3B8]">{activity.timestamp}</p>
          </div>
        </motion.div>
      )

    case "manual-log":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFBF5] rounded-xl p-5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] flex flex-col cursor-pointer hover:shadow-md transition-all duration-200 active:bg-light-sand relative overflow-hidden"
          onClick={handleClick}
          role="button"
          aria-label={`View details for ${activity.title}`}
        >
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-forest-canopy opacity-70"></div>

          {/* Image at the top if available */}
          {activity.image && (
            <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
              <Image
                src={activity.image || "/placeholder.svg"}
                alt={activity.title}
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-forest-canopy bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
              {activity.category === "photo" ? (
                <BsCamera className="text-forest-canopy text-xl" />
              ) : (
                <RiQuillPenLine className="text-forest-canopy text-xl" />
              )}
            </div>
            <div className="flex-grow">
              <h4 className="font-medium text-deep-navy text-lg mb-1">{activity.title}</h4>
              <p className={cn("text-[#64748B] mb-2", !activity.image && "line-clamp-3")}>
                {activity.memo}
                {activity.memo && activity.memo.length > 150 && (
                  <span className="text-azure-radiance text-sm ml-1">
                    {currentLanguage === "en" ? "Read more..." : "더 보기..."}
                  </span>
                )}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#94A3B8]">{activity.timestamp}</p>
                {activity.location && (
                  <div className="flex items-center text-xs text-[#94A3B8]">
                    <HiOutlineLocationMarker className="mr-1" />
                    <span>{activity.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )

    case "stamp-earned":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFBF5] rounded-xl p-5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] flex items-start cursor-pointer hover:shadow-md transition-all duration-200 active:bg-light-sand relative overflow-hidden"
          onClick={handleClick}
          role="button"
          aria-label={`View details for ${activity.title} stamp`}
        >
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-highlight-gold opacity-70"></div>

          <div className="w-16 h-16 mr-4 flex-shrink-0 relative rounded-lg overflow-hidden">
            {activity.image ? (
              <Image
                src={activity.image || "/placeholder.svg"}
                alt={activity.title}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-highlight-gold bg-opacity-10 flex items-center justify-center">
                <RiMedalLine className="text-highlight-gold text-2xl" />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 rounded-full bg-highlight-gold bg-opacity-20 flex items-center justify-center mr-2">
                <FaStamp className="text-highlight-gold text-[10px]" />
              </div>
              <h4 className="font-medium text-deep-navy text-lg">
                {currentLanguage === "en" ? "Met a new Stamp:" : "새로운 스탬프 만남:"}
              </h4>
            </div>
            <p className="text-deep-navy font-medium mb-1">{activity.title}</p>
            {activity.subtitle && <p className="text-[#64748B] mb-2">{activity.subtitle}</p>}
            <p className="text-xs text-[#94A3B8]">{activity.timestamp}</p>
          </div>
        </motion.div>
      )

    case "badge-earned":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFBF5] rounded-xl p-5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] flex items-start cursor-pointer hover:shadow-md transition-all duration-200 active:bg-light-sand relative overflow-hidden"
          onClick={handleClick}
          role="button"
          aria-label={`View details for ${activity.title} badge`}
        >
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-highlight-gold opacity-70"></div>

          <div className="w-16 h-16 mr-4 flex-shrink-0 relative rounded-lg overflow-hidden">
            {activity.image ? (
              <Image
                src={activity.image || "/placeholder.svg"}
                alt={activity.title}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-highlight-gold bg-opacity-10 flex items-center justify-center">
                <BsAward className="text-highlight-gold text-2xl" />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 rounded-full bg-highlight-gold bg-opacity-20 flex items-center justify-center mr-2">
                <FaMedal className="text-highlight-gold text-[10px]" />
              </div>
              <h4 className="font-medium text-deep-navy text-lg">
                {currentLanguage === "en" ? "A shiny Badge earned!" : "반짝이는 뱃지 획득!"}
              </h4>
            </div>
            <p className="text-deep-navy font-medium mb-1">{activity.title}</p>
            {activity.subtitle && <p className="text-[#64748B] mb-2">{activity.subtitle}</p>}
            <p className="text-xs text-[#94A3B8]">{activity.timestamp}</p>
          </div>
        </motion.div>
      )

    case "quest-completed":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFBF5] rounded-xl p-5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] flex items-start cursor-pointer hover:shadow-md transition-all duration-200 active:bg-light-sand relative overflow-hidden"
          onClick={handleClick}
          role="button"
          aria-label={`View details for ${activity.title} quest`}
        >
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-sunset-coral opacity-70"></div>

          <div className="w-12 h-12 rounded-full bg-sunset-coral bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
            <BsCheckCircle className="text-sunset-coral text-xl" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 rounded-full bg-sunset-coral bg-opacity-20 flex items-center justify-center mr-2">
                <FaCheckCircle className="text-sunset-coral text-[10px]" />
              </div>
              <h4 className="font-medium text-deep-navy text-lg">
                {currentLanguage === "en" ? "Adventure Completed:" : "모험 완료:"}
              </h4>
            </div>
            <p className="text-deep-navy font-medium mb-1">{activity.title}</p>
            {activity.subtitle && <p className="text-[#64748B] mb-2">{activity.subtitle}</p>}
            <p className="text-xs text-[#94A3B8]">{activity.timestamp}</p>
          </div>
        </motion.div>
      )

    default:
      return null
  }
}

// Sample data function
function getSampleActivities(currentLanguage: string): TimelineActivity[] {
  return [
    {
      id: "1",
      type: "check-in",
      title: currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁",
      location: currentLanguage === "en" ? "Seoul, South Korea" : "서울, 대한민국",
      timestamp: "10:30 AM",
      date: "2025-04-20",
      dateGroup: currentLanguage === "en" ? "Today" : "오늘",
      image: "/images/gyeongbokgung.png",
      memo:
        currentLanguage === "en"
          ? "Visited the main royal palace of the Joseon dynasty. The architecture is stunning and the changing of the guard ceremony was impressive."
          : "조선 왕조의 주요 왕궁을 방문했습니다. 건축물이 아름답고 수비대 교대식이 인상적이었습니다.",
    },
    {
      id: "2",
      type: "stamp-earned",
      title: currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁",
      subtitle: currentLanguage === "en" ? "Seoul Heritage Collection" : "서울 문화유산 컬렉션",
      timestamp: "10:32 AM",
      date: "2025-04-20",
      dateGroup: currentLanguage === "en" ? "Today" : "오늘",
      image: "/images/gyeongbokgung.png",
      memo:
        currentLanguage === "en"
          ? "Earned this stamp by checking in at Gyeongbokgung Palace. This is part of the Seoul Heritage Collection."
          : "경복궁에 체크인하여 이 스탬프를 획득했습니다. 서울 문화유산 컬렉션의 일부입니다.",
    },
    {
      id: "3",
      type: "manual-log",
      title: currentLanguage === "en" ? "Palace Guard Ceremony" : "궁궐 수비대 의식",
      memo:
        currentLanguage === "en"
          ? "Watched the changing of the guards ceremony. Amazing traditional costumes! The ceremony happens at 10:00 AM and 2:00 PM every day except Mondays."
          : "수비대 교대식을 관람했습니다. 놀라운 전통 의상! 이 의식은 월요일을 제외한 매일 오전 10시와 오후 2시에 진행됩니다.",
      timestamp: "11:15 AM",
      date: "2025-04-20",
      dateGroup: currentLanguage === "en" ? "Today" : "오늘",
      category: "photo",
      image: "/images/gyeongbokgung.jpeg",
      location: currentLanguage === "en" ? "Gyeongbokgung Palace, Seoul" : "경복궁, 서울",
    },
    {
      id: "4",
      type: "check-in",
      title: currentLanguage === "en" ? "Namsan Seoul Tower" : "남산서울타워",
      location: currentLanguage === "en" ? "Seoul, South Korea" : "서울, 대한민국",
      timestamp: "4:45 PM",
      date: "2025-04-19",
      dateGroup: currentLanguage === "en" ? "Yesterday" : "어제",
      image: "/images/n-seoultower.png",
      memo:
        currentLanguage === "en"
          ? "Visited N Seoul Tower on Namsan Mountain. The view of Seoul from the observation deck is breathtaking, especially at sunset."
          : "남산에 있는 N서울타워를 방문했습니다. 전망대에서 바라본 서울의 전경은 특히 일몰 때 숨이 멎을 정도로 아름답습니다.",
    },
    {
      id: "5",
      type: "stamp-earned",
      title: currentLanguage === "en" ? "Namsan Tower" : "남산타워",
      subtitle: currentLanguage === "en" ? "Seoul Landmarks Collection" : "서울 랜드마크 컬렉션",
      timestamp: "4:47 PM",
      date: "2025-04-19",
      dateGroup: currentLanguage === "en" ? "Yesterday" : "어제",
      image: "/images/n-seoultower.png",
      memo:
        currentLanguage === "en"
          ? "Earned this stamp by checking in at N Seoul Tower. This is part of the Seoul Landmarks Collection."
          : "N서울타워에 체크인하여 이 스탬프를 획득했습니다. 서울 랜드마크 컬렉션의 일부입니다.",
    },
    {
      id: "6",
      type: "badge-earned",
      title: currentLanguage === "en" ? "Seoul Explorer" : "서울 탐험가",
      subtitle: currentLanguage === "en" ? "Visit 5 locations in Seoul" : "서울에서 5곳 방문",
      timestamp: "4:50 PM",
      date: "2025-04-19",
      dateGroup: currentLanguage === "en" ? "Yesterday" : "어제",
      image: "/images/seoulexplorerbadge.png",
      memo:
        currentLanguage === "en"
          ? "Earned the Seoul Explorer badge by visiting 5 different locations in Seoul. Keep exploring to unlock more badges!"
          : "서울의 5개 다른 장소를 방문하여 서울 탐험가 뱃지를 획득했습니다. 더 많은 뱃지를 잠금 해제하려면 계속 탐험하세요!",
    },
    {
      id: "7",
      type: "quest-completed",
      title: currentLanguage === "en" ? "Seoul Royal Palace Tour" : "서울 왕궁 투어",
      subtitle: currentLanguage === "en" ? "Visit all royal palaces in Seoul" : "서울의 모든 왕궁 방문",
      timestamp: "5:30 PM",
      date: "2025-04-19",
      dateGroup: currentLanguage === "en" ? "Yesterday" : "어제",
      memo:
        currentLanguage === "en"
          ? "Completed the Seoul Royal Palace Tour quest by visiting Gyeongbokgung, Changdeokgung, Changgyeonggung, Deoksugung, and Gyeonghuigung palaces."
          : "경복궁, 창덕궁, 창경궁, 덕수궁, 경희궁을 방문하여 서울 왕궁 투어 퀘스트를 완료했습니다.",
    },
    {
      id: "8",
      type: "check-in",
      title: currentLanguage === "en" ? "Hongdae Street" : "홍대 거리",
      location: currentLanguage === "en" ? "Seoul, South Korea" : "서울, 대한민국",
      timestamp: "7:30 PM",
      date: "2025-04-17",
      dateGroup: currentLanguage === "en" ? "This Week" : "이번 주",
      image: "/images/hongdae.png",
      memo:
        currentLanguage === "en"
          ? "Explored the vibrant Hongdae area, known for its youthful and artistic atmosphere. Lots of street performances, unique shops, and cafes."
          : "젊고 예술적인 분위기로 유명한 홍대 지역을 탐험했습니다. 많은 거리 공연, 독특한 상점 및 카페가 있습니다.",
    },
    {
      id: "9",
      type: "manual-log",
      title: currentLanguage === "en" ? "Street Food Adventure" : "길거리 음식 모험",
      memo:
        currentLanguage === "en"
          ? "Tried tteokbokki and hotteok at Gwangjang Market. So delicious! The market is full of amazing food stalls and has a great atmosphere."
          : "광장시장에서 떡볶이와 호떡을 먹어봤어요. 너무 맛있어요! 시장은 놀라운 음식 가판대로 가득 차 있고 분위기가 좋습니다.",
      timestamp: "8:15 PM",
      date: "2025-04-17",
      dateGroup: currentLanguage === "en" ? "This Week" : "이번 주",
      category: "note",
      location: currentLanguage === "en" ? "Gwangjang Market, Seoul" : "광장시장, 서울",
      image: "/images/hotteok.jpg",
    },
  ]
}

export default TimelineTab
