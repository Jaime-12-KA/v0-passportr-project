"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  FaStamp,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaShare,
  FaEdit,
  FaTrash,
  FaBookmark,
  FaHeart,
  FaExpand,
  FaArrowLeft,
} from "react-icons/fa"
import { RiMapPinLine, RiQuillPenLine } from "react-icons/ri"
import { BsCamera, BsAward, BsCheckCircle } from "react-icons/bs"
import { motion } from "framer-motion"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

// 샘플 활동 데이터를 가져오는 함수
function getSampleActivities(currentLanguage: string) {
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
      subtitle: currentLanguage === "en" ? "Seoul Heritage Collection" : "서울 문화유산 컬렉���",
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
      image: "/images/seoulhistorianbadge.png",
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
      dateGroup: currentLanguage === "en" ? "This Week" : "이번 ��",
      image: "/images/Checkin_Hongdae Street.jpg",
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
      image: "/images/Checkin_Gwangjang Market.jpg",
    },
  ]
}

interface TimelineActivityPageProps {
  params: { id: string }
}

export default function TimelineActivityPage({ params }: TimelineActivityPageProps) {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [activity, setActivity] = useState<any>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)

  useEffect(() => {
    // Load language setting from localStorage
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage === "ko" ? "kr" : savedLanguage)
    }
  }, [])

  useEffect(() => {
    // 실제 앱에서는 API 호출이나 상태 관리 라이브러리에서 데이터를 가져올 것입니다
    // 여기서는 샘플 데이터를 사용합니다
    const activities = getSampleActivities(currentLanguage)
    const foundActivity = activities.find((a) => a.id === params.id)

    if (foundActivity) {
      setActivity(foundActivity)
    } else {
      // 활동을 찾을 수 없는 경우 타임라인으로 리디렉션
      router.push("/")
    }
  }, [params.id, currentLanguage, router])

  const toggleBookmark = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setIsBookmarked(!isBookmarked)
  }

  const toggleLike = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    alert(currentLanguage === "en" ? "Sharing functionality coming soon!" : "공유 기능이 곧 제공됩니다!")
  }

  const handleEdit = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    alert(currentLanguage === "en" ? "Edit functionality coming soon!" : "편집 기능이 곧 제공됩니다!")
  }

  const handleDelete = () => {
    triggerHapticFeedback(hapticPatterns.heavy)
    alert(currentLanguage === "en" ? "Delete functionality coming soon!" : "삭제 기능이 곧 제공됩니다!")
  }

  const toggleFullImage = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setShowFullImage(!showFullImage)
  }

  const handleBack = () => {
    triggerHapticFeedback(hapticPatterns.light)
    router.back()
  }

  // 활동 유형에 따른 아이콘 가져오기
  const getActivityIcon = () => {
    if (!activity) return null

    switch (activity.type) {
      case "check-in":
        return <RiMapPinLine className="text-azure-radiance text-xl" />
      case "manual-log":
        return activity.category === "photo" ? (
          <BsCamera className="text-forest-canopy text-xl" />
        ) : (
          <RiQuillPenLine className="text-forest-canopy text-xl" />
        )
      case "stamp-earned":
        return <FaStamp className="text-highlight-gold text-xl" />
      case "badge-earned":
        return <BsAward className="text-highlight-gold text-xl" />
      case "quest-completed":
        return <BsCheckCircle className="text-sunset-coral text-xl" />
      default:
        return null
    }
  }

  // 활동 유형 텍스트 가져오기
  const getActivityTypeText = () => {
    if (!activity) return ""

    switch (activity.type) {
      case "check-in":
        return currentLanguage === "en" ? "Footprint" : "발자국"
      case "manual-log":
        return activity.category === "photo"
          ? currentLanguage === "en"
            ? "Photo Memory"
            : "사진 기억"
          : currentLanguage === "en"
            ? "Travel Note"
            : "여행 메모"
      case "stamp-earned":
        return currentLanguage === "en" ? "Stamp Collection" : "스탬프 수집"
      case "badge-earned":
        return currentLanguage === "en" ? "Badge Achievement" : "뱃지 업적"
      case "quest-completed":
        return currentLanguage === "en" ? "Adventure Complete" : "모험 완료"
      default:
        return ""
    }
  }

  // 활동 유형에 따른 배경색 가져오기
  const getHeaderBgColor = () => {
    if (!activity) return "bg-light-sand"

    switch (activity.type) {
      case "check-in":
        return "bg-azure-radiance bg-opacity-10"
      case "manual-log":
        return "bg-forest-canopy bg-opacity-10"
      case "stamp-earned":
      case "badge-earned":
        return "bg-highlight-gold bg-opacity-10"
      case "quest-completed":
        return "bg-sunset-coral bg-opacity-10"
      default:
        return "bg-light-sand"
    }
  }

  if (!activity) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFBF5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-azure-radiance"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#FFFBF5] min-h-screen">
      {/* 전체 이미지 보기 */}
      {showFullImage && activity.image && (
        <motion.div
          className="fixed inset-0 z-60 bg-black flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleFullImage}
        >
          <button
            className="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full p-3 hover:bg-opacity-30 transition-all"
            onClick={(e) => {
              e.stopPropagation()
              toggleFullImage()
            }}
          >
            <FaTimes className="text-white text-xl" />
          </button>
          <Image
            src={activity.image || "/placeholder.svg"}
            alt={activity.title}
            width={800}
            height={600}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </motion.div>
      )}

      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-[#FFFBF5] shadow-sm">
        <div className="flex justify-between items-center p-5">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center"
          >
            <FaArrowLeft className="text-deep-navy" />
          </button>
          <h1 className="text-lg font-bold text-deep-navy">
            {currentLanguage === "en" ? "Activity Details" : "활동 세부정보"}
          </h1>
          <div className="w-10 h-10"></div> {/* 균형을 위한 빈 공간 */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* 활동 헤더 */}
        <div
          className={`flex justify-between items-center p-5 border-b border-light-sand ${getHeaderBgColor()} rounded-t-xl`}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4 shadow-sm">
              {getActivityIcon()}
            </div>
            <div>
              <span className="text-sm text-deep-gray font-medium">{getActivityTypeText()}</span>
              <h3 className="font-bold text-deep-navy text-lg">{activity.title}</h3>
            </div>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-5 bg-white rounded-b-xl shadow-sm">
          {/* 날짜 및 시간 */}
          <div className="flex items-center mb-5 text-sm text-deep-gray">
            <div className="flex items-center mr-4">
              <FaCalendarAlt className="mr-2 text-azure-radiance opacity-70" />
              <span>{activity.dateGroup}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2 text-azure-radiance opacity-70" />
              <span>{activity.timestamp}</span>
            </div>
          </div>

          {/* 위치 (체크인의 경우) */}
          {activity.location && (
            <div className="flex items-center mb-5 bg-light-sand p-3 rounded-lg">
              <RiMapPinLine className="text-azure-radiance mr-3 text-lg" />
              <p className="text-deep-navy">{activity.location}</p>
            </div>
          )}

          {/* 이미지 (있는 경우) */}
          {activity.image && (
            <div
              className="mb-5 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              onClick={toggleFullImage}
            >
              <div className="relative">
                <Image
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.title}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all">
                  <div className="bg-white bg-opacity-0 hover:bg-opacity-70 p-2 rounded-full transition-all transform scale-90 hover:scale-100">
                    <FaExpand className="text-transparent hover:text-deep-navy transition-colors" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-deep-gray mt-2 text-center italic">
                {currentLanguage === "en" ? "Tap to view full image" : "전체 이미지를 보려면 탭하세요"}
              </p>
            </div>
          )}

          {/* 부제목/설명 */}
          {activity.subtitle && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-deep-gray mb-1">
                {currentLanguage === "en" ? "Collection" : "컬렉션"}
              </h4>
              <p className="text-deep-navy font-medium">{activity.subtitle}</p>
            </div>
          )}

          {/* 메모 (모든 활동) */}
          {activity.memo && (
            <div className="bg-light-sand p-4 rounded-lg mb-5">
              <h4 className="text-sm font-medium text-deep-gray mb-2">
                {currentLanguage === "en" ? "Travel Notes" : "여행 메모"}
              </h4>
              <p className="text-deep-navy whitespace-pre-line">{activity.memo}</p>
            </div>
          )}

          {/* 활동 유형에 따른 추가 세부 정보 */}
          {activity.type === "stamp-earned" && (
            <div className="bg-highlight-gold bg-opacity-10 p-4 rounded-lg mb-5 border border-highlight-gold border-opacity-20">
              <p className="text-deep-navy text-sm">
                {currentLanguage === "en"
                  ? "This beautiful stamp has been added to your collection. Keep exploring to find more!"
                  : "이 아름다운 스탬프가 컬렉션에 추가되었습니다. 더 많은 스탬프를 찾으려면 계속 탐험하세요!"}
              </p>
            </div>
          )}

          {activity.type === "badge-earned" && (
            <div className="bg-highlight-gold bg-opacity-10 p-4 rounded-lg mb-5 border border-highlight-gold border-opacity-20">
              <p className="text-deep-navy text-sm">
                {currentLanguage === "en"
                  ? "Congratulations! This badge represents your achievement and has been added to your collection."
                  : "축하합니다! 이 뱃지는 당신의 업적을 나타내며 컬렉션에 추가되었습니다."}
              </p>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="grid grid-cols-5 gap-2 mt-6 mb-5">
            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-sand transition-colors"
              onClick={toggleBookmark}
            >
              <FaBookmark className={isBookmarked ? "text-highlight-gold" : "text-deep-gray"} />
              <span className="text-xs mt-1 text-deep-gray">{currentLanguage === "en" ? "Save" : "저장"}</span>
            </button>

            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-sand transition-colors"
              onClick={toggleLike}
            >
              <FaHeart className={isLiked ? "text-sunset-coral" : "text-deep-gray"} />
              <span className="text-xs mt-1 text-deep-gray">{currentLanguage === "en" ? "Like" : "좋아요"}</span>
            </button>

            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-sand transition-colors"
              onClick={handleShare}
            >
              <FaShare className="text-deep-gray" />
              <span className="text-xs mt-1 text-deep-gray">{currentLanguage === "en" ? "Share" : "공유"}</span>
            </button>

            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-sand transition-colors"
              onClick={handleEdit}
            >
              <FaEdit className="text-deep-gray" />
              <span className="text-xs mt-1 text-deep-gray">{currentLanguage === "en" ? "Edit" : "편집"}</span>
            </button>

            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-light-sand transition-colors"
              onClick={handleDelete}
            >
              <FaTrash className="text-alert-red" />
              <span className="text-xs mt-1 text-deep-gray">{currentLanguage === "en" ? "Delete" : "삭제"}</span>
            </button>
          </div>

          {/* 닫기 버튼 */}
          <button
            className="w-full py-3 bg-azure-radiance text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            onClick={handleBack}
          >
            {currentLanguage === "en" ? "Close" : "닫기"}
          </button>
        </div>
      </div>
    </div>
  )
}
