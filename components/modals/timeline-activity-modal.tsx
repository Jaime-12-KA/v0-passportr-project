"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
} from "react-icons/fa"
import { RiMapPinLine, RiQuillPenLine } from "react-icons/ri"
import { BsCamera, BsAward, BsCheckCircle } from "react-icons/bs"
import { motion, AnimatePresence } from "framer-motion"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface TimelineActivityModalProps {
  isOpen: boolean
  onClose: () => void
  activity: any // Replace with proper activity type
  currentLanguage: string
  position?: { top: number; left: number } | null
}

const TimelineActivityModal = ({
  isOpen,
  onClose,
  activity,
  currentLanguage,
  position,
}: TimelineActivityModalProps) => {
  const [animateIn, setAnimateIn] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true)
    }
  }, [isOpen])

  const handleClose = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setAnimateIn(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

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
    // Share functionality would go here
    alert(currentLanguage === "en" ? "Sharing functionality coming soon!" : "공유 기능이 곧 제공됩니다!")
  }

  const handleEdit = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    // Edit functionality would go here
    alert(currentLanguage === "en" ? "Edit functionality coming soon!" : "편집 기능이 곧 제공됩니다!")
  }

  const handleDelete = () => {
    triggerHapticFeedback(hapticPatterns.heavy)
    // Delete functionality would go here
    alert(currentLanguage === "en" ? "Delete functionality coming soon!" : "삭제 기능이 곧 제공됩니다!")
  }

  const toggleFullImage = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setShowFullImage(!showFullImage)
  }

  if (!isOpen) return null

  // Determine icon based on activity type
  const getActivityIcon = () => {
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

  // Get activity type text
  const getActivityTypeText = () => {
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

  // Get background color based on activity type
  const getHeaderBgColor = () => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{ height: 'var(--app-height, 100vh)' }}
        >
          {/* Full Image View */}
          {showFullImage && activity.image && (
            <motion.div
              className="fixed inset-0 z-60 bg-black flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleFullImage}
              style={{ height: 'var(--app-height, 100vh)' }}
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
                style={{ maxHeight: 'calc(var(--app-height, 100vh) - 32px)' }}
              />
            </motion.div>
          )}

          <motion.div
            className="bg-[#FFFBF5] rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: 'calc(var(--app-height, 100vh) - 32px)' }}
          >
            {/* Header */}
            <div className={`flex justify-between items-center p-5 border-b border-light-sand ${getHeaderBgColor()}`}>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4 shadow-sm">
                  {getActivityIcon()}
                </div>
                <div>
                  <span className="text-sm text-deep-gray font-medium">{getActivityTypeText()}</span>
                  <h3 className="font-bold text-deep-navy text-lg">{activity.title}</h3>
                </div>
              </div>
              <button
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-light-sand transition-colors"
                onClick={handleClose}
                aria-label={currentLanguage === "en" ? "Close" : "닫기"}
              >
                <FaTimes className="text-deep-navy" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 pb-16">
              {/* Date & Time */}
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

              {/* Location (for check-ins) */}
              {activity.location && (
                <div className="flex items-center mb-5 bg-light-sand p-3 rounded-lg">
                  <RiMapPinLine className="text-azure-radiance mr-3 text-lg" />
                  <p className="text-deep-navy">{activity.location}</p>
                </div>
              )}

              {/* Image (if available) */}
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

              {/* Subtitle/Description */}
              {activity.subtitle && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-deep-gray mb-1">
                    {currentLanguage === "en" ? "Collection" : "컬렉션"}
                  </h4>
                  <p className="text-deep-navy font-medium">{activity.subtitle}</p>
                </div>
              )}

              {/* Memo (for all activities) */}
              {activity.memo && (
                <div className="bg-light-sand p-4 rounded-lg mb-5">
                  <h4 className="text-sm font-medium text-deep-gray mb-2">
                    {currentLanguage === "en" ? "Travel Notes" : "여행 메모"}
                  </h4>
                  <p className="text-deep-navy whitespace-pre-line">{activity.memo}</p>
                </div>
              )}

              {/* Additional details based on activity type */}
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

              {/* Action buttons */}
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

앨범 아이템 추가 모달을 수정하겠습니다:

\
\
\
