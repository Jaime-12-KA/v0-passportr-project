"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, Share2, HelpCircle, ArrowLeft, MapPin, Calendar, Award, Heart, MessageCircle } from "lucide-react"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getLocalTipsByStampId, type LocalTip } from "@/utils/local-tips-data"

interface StampData {
  id: string
  name: string
  nameKr?: string
  image: string
  stampImage?: string
  rarity: number
  description: string
  descriptionKr?: string
  location: string
  category: string
  stampColor?: string
  stampIcon?: string
  localTip?: {
    en: string
    kr: string
    author?: {
      name: string
      avatar: string
    }
    likes?: number
  }
}

export default function StampUnlockedPage() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<string>("en")
  const [stamp, setStamp] = useState<StampData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [totalStamps, setTotalStamps] = useState(150)
  const [collectedStamps, setCollectedStamps] = useState(24)
  const [stampAnimationStage, setStampAnimationStage] = useState(0)
  const [showRipple, setShowRipple] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [showStampImpression, setShowStampImpression] = useState(false)
  const [localTips, setLocalTips] = useState<LocalTip[]>([])
  const [selectedTipIndex, setSelectedTipIndex] = useState(0)
  const stampRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 샘플 스탬프 가이드 데이터 업데이트 - 실제 스탬프 도감 이미지 사용
  const stampGuide = [
    { id: "gyeongbokgung", image: "/images/gyeongbokgung.png", collected: true, category: "landmark" },
    { id: "hongdae", image: "/images/hongdae.png", collected: true, category: "culture" },
    { id: "gwangjang", image: "/images/gwangjang.png", collected: true, category: "food" },
    { id: "locked1", image: "/placeholder.svg", collected: false, category: "unknown" },
    { id: "n-seoultower", image: "/images/n-seoultower.png", collected: true, category: "landmark" },
    { id: "bukchon", image: "/images/bukchon.png", collected: true, category: "culture" },
    { id: "dongdaemun", image: "/images/dongdaemun.png", collected: true, category: "shopping" },
    { id: "locked2", image: "/placeholder.svg", collected: false, category: "unknown" },
    { id: "locked3", image: "/placeholder.svg", collected: false, category: "unknown" },
    { id: "locked4", image: "/placeholder.svg", collected: false, category: "unknown" },
    { id: "locked5", image: "/placeholder.svg", collected: false, category: "unknown" },
    { id: "locked6", image: "/placeholder.svg", collected: false, category: "unknown" },
  ]

  // Create and preload audio element
  useEffect(() => {
    // 언어 설정 가져오기
    const savedLanguage = localStorage.getItem("language") || "en"
    setCurrentLanguage(savedLanguage)

    // 스탬프 데이터 가져오기
    const stampData = localStorage.getItem("lastUnlockedStamp")
    if (stampData) {
      try {
        const parsedStamp = JSON.parse(stampData)
        setStamp(parsedStamp)

        // 스탬프 ID로 현지인 팁 가져오기
        if (parsedStamp.id) {
          const tips = getLocalTipsByStampId(parsedStamp.id)
          setLocalTips(tips.length > 0 ? tips : getLocalTipsByStampId("gyeongbokgung")) // 팁이 없으면 경복궁 팁을 기본값으로 사용
        }
      } catch (e) {
        console.error("Failed to parse stamp data:", e)
        // 기본 팁 설정
        setLocalTips(getLocalTipsByStampId("gyeongbokgung"))
      }
    } else {
      // 기본 팁 설정
      setLocalTips(getLocalTipsByStampId("gyeongbokgung"))
    }

    if (typeof window !== "undefined") {
      try {
        const audio = new Audio()
        audio.addEventListener("error", (e) => {
          console.warn("Audio failed to load:", e)
        })
        audio.src = "/sounds/stamp-thunk.mp3"
        audio.volume = 0.7
        audio.preload = "auto"
        audioRef.current = audio
        audio.load()
      } catch (err) {
        console.error("Error initializing audio:", err)
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [])

  // Play audio with fallback
  const playAudio = () => {
    if (!audioRef.current) {
      console.warn("Audio reference not available")
      return false
    }

    try {
      audioRef.current.currentTime = 0
      if (!audioRef.current.src || audioRef.current.src === "") {
        audioRef.current.src = "/sounds/stamp-thunk.mp3"
        audioRef.current.load()
      }

      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio played successfully")
          })
          .catch((error) => {
            console.warn("Audio play failed, using haptic feedback instead:", error)
            triggerHapticFeedback(hapticPatterns.stamp)
          })
      }
      return true
    } catch (e) {
      console.error("Audio play error:", e)
      triggerHapticFeedback(hapticPatterns.stamp)
      return false
    }
  }

  useEffect(() => {
    if (stamp) {
      setShowConfetti(true)
      triggerHapticFeedback(hapticPatterns.success)

      // Reset animation state
      setStampAnimationStage(0)
      setShowRipple(false)
      setShowParticles(false)
      setShowStampImpression(false)

      // Start animation sequence
      const timer1 = setTimeout(() => setStampAnimationStage(1), 500)
      const timer2 = setTimeout(() => {
        setStampAnimationStage(2)

        // Try to play audio, but continue with animation regardless
        try {
          playAudio()
        } catch (e) {
          console.warn("Failed to play stamp sound:", e)
        }

        // Always provide haptic feedback
        triggerHapticFeedback(hapticPatterns.stamp)

        setShowRipple(true)
        setTimeout(() => setShowParticles(true), 100)
        setTimeout(() => setShowStampImpression(true), 300)
      }, 1500)

      // Hide confetti after 3 seconds
      const timer3 = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [stamp])

  const handleShare = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    // Share functionality would go here
    alert(currentLanguage === "en" ? "Sharing stamp..." : "스탬프 공유 중...")
  }

  const handleHint = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    // Hint functionality would go here
    alert(currentLanguage === "en" ? "Showing hint..." : "힌트 표시 중...")
  }

  const handleBack = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    router.back()
  }

  const handleNextTip = () => {
    triggerHapticFeedback(hapticPatterns.light)
    if (localTips.length > 1) {
      setSelectedTipIndex((prev) => (prev + 1) % localTips.length)
    }
  }

  const handlePrevTip = () => {
    triggerHapticFeedback(hapticPatterns.light)
    if (localTips.length > 1) {
      setSelectedTipIndex((prev) => (prev === 0 ? localTips.length - 1 : prev - 1))
    }
  }

  const handleLikeTip = (tipIndex: number) => {
    triggerHapticFeedback(hapticPatterns.medium)
    setLocalTips((prevTips) => {
      const newTips = [...prevTips]
      newTips[tipIndex] = {
        ...newTips[tipIndex],
        likes: newTips[tipIndex].likes + 1,
      }
      return newTips
    })
  }

  if (!stamp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-coral mb-4"></div>
        <p className="text-deep-navy">
          {currentLanguage === "en" ? "Loading stamp information..." : "스탬프 정보를 불러오는 중..."}
        </p>
      </div>
    )
  }

  // Special animation for royal places
  const isRoyalPalace = stamp.stampIcon === "fa-crown"
  const currentTip = localTips[selectedTipIndex] || null

  return (
    <div className="min-h-screen bg-cloud-white">
      {/* Header */}
      <div className="bg-brand-blue text-white py-4 px-4 sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-serif tracking-wider flex-1 text-center">
            {currentLanguage === "en" ? "NEW STAMP UNLOCKED" : "새로운 스탬프 획득"}
          </h1>
        </div>
      </div>

      <div className="p-4">
        {/* Stamp animation area */}
        <div className="relative h-64 mb-6 flex items-center justify-center bg-brand-sand rounded-lg shadow-inner">
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 50 }).map((_, i) => {
                const size = Math.random() * 8 + 4
                const color = ["bg-brand-yellow", "bg-brand-coral", "bg-brand-blue", "bg-green-400", "bg-purple-400"][
                  Math.floor(Math.random() * 5)
                ]
                return (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full ${color}`}
                    initial={{
                      x: Math.random() * 100 - 50 + 50,
                      y: Math.random() * 20 - 60,
                      opacity: 1,
                    }}
                    animate={{
                      x: Math.random() * 220 - 110 + 50,
                      y: Math.random() * 220 + 40,
                      opacity: 0,
                    }}
                    transition={{
                      duration: Math.random() * 2 + 1,
                      ease: "easeOut",
                      delay: Math.random() * 0.5,
                    }}
                    style={{
                      width: size,
                      height: size,
                    }}
                  />
                )
              })}
            </div>
          )}

          {/* Ripple effect */}
          {showRipple && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1 }}
                className="w-32 h-32 rounded-full bg-brand-coral opacity-30"
              />
            </div>
          )}

          {/* Stamp container */}
          <div
            ref={stampRef}
            className={`stamp-container absolute ${stampAnimationStage >= 1 ? "stamp-ready" : ""} ${
              stampAnimationStage >= 2 ? "stamp-pressed" : ""
            } ${isRoyalPalace ? "royal-stamp" : ""}`}
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) ${
                stampAnimationStage === 1 ? "translateY(-50px)" : stampAnimationStage === 2 ? "translateY(0)" : ""
              }`,
              transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              zIndex: 20,
              opacity: stampAnimationStage >= 2 ? 0 : 1, // Stamp disappears when it hits
            }}
          >
            <div
              className={`stamp-image w-40 h-40 rounded-full overflow-hidden bg-brand-coral ${
                isRoyalPalace ? "animate-pulse-glow" : ""
              }`}
              style={{
                boxShadow: `0 0 0 4px var(--brand-coral), 0 0 0 6px rgba(255,255,255,0.5)`,
                transform: stampAnimationStage === 2 ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.2s ease",
              }}
            >
              <img
                src={
                  stamp.id === "gyeongbokgung"
                    ? "/images/gyeongbokgung.png"
                    : stamp.id === "hongdae"
                      ? "/images/hongdae.png"
                      : stamp.id === "n-seoultower"
                        ? "/images/n-seoultower.png"
                        : stamp.id === "gwangjang"
                          ? "/images/gwangjang.png"
                          : stamp.id === "bukchon"
                            ? "/images/bukchon.png"
                            : stamp.id === "dongdaemun"
                              ? "/images/dongdaemun.png"
                              : stamp.id === "starbucks"
                                ? "/images/starbucks.png"
                                : stamp.stampImage || stamp.image || "/placeholder.svg"
                }
                alt={stamp.name}
                className="w-full h-full object-cover"
                style={{ filter: "contrast(1.2) brightness(0.8)" }}
              />
              <div className="absolute inset-0 bg-brand-coral opacity-30" style={{ mixBlendMode: "color" }}></div>
            </div>
          </div>

          {/* Stamp impression that appears after animation */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              showStampImpression ? "visible" : "invisible"
            }`}
            style={{
              opacity: showStampImpression ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            <div
              className={`w-36 h-36 rounded-full overflow-hidden border-4 border-brand-coral ${
                isRoyalPalace ? "animate-pulse-glow" : ""
              }`}
              style={{
                boxShadow: `0 0 0 2px white, 0 0 0 4px var(--brand-coral)`,
                position: "relative",
                animation: showStampImpression ? "stamp-thunk 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "none",
              }}
            >
              <img
                src={
                  stamp.id === "gyeongbokgung"
                    ? "/images/gyeongbokgung.png"
                    : stamp.id === "hongdae"
                      ? "/images/hongdae.png"
                      : stamp.id === "n-seoultower"
                        ? "/images/n-seoultower.png"
                        : stamp.id === "gwangjang"
                          ? "/images/gwangjang.png"
                          : stamp.id === "bukchon"
                            ? "/images/bukchon.png"
                            : stamp.id === "dongdaemun"
                              ? "/images/dongdaemun.png"
                              : stamp.id === "starbucks"
                                ? "/images/starbucks.png"
                                : stamp.stampImage || stamp.image || "/placeholder.svg"
                }
                alt={stamp.name}
                className="w-full h-full object-cover"
                style={{ filter: "contrast(1.2) brightness(0.8)" }}
              />
              <div className="absolute inset-0 bg-brand-coral opacity-30" style={{ mixBlendMode: "color" }}></div>
            </div>
            <div className="stamp-date mt-2 text-sm text-center font-medium">{new Date().toLocaleDateString()}</div>
          </div>

          {/* Particles */}
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => {
                const size = Math.random() * 6 + 2
                const angle = (Math.PI * 2 * i) / 20
                const distance = Math.random() * 60 + 40
                const x = Math.cos(angle) * distance
                const y = Math.sin(angle) * distance
                const delay = Math.random() * 0.2

                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-brand-coral"
                    style={{
                      width: size,
                      height: size,
                      top: "50%",
                      left: "50%",
                      opacity: 0.8,
                    }}
                    initial={{ x: 0, y: 0, opacity: 0.8 }}
                    animate={{
                      x,
                      y,
                      opacity: 0,
                      scale: Math.random() * 0.5 + 0.5,
                    }}
                    transition={{
                      duration: Math.random() * 0.8 + 0.6,
                      delay,
                      ease: "easeOut",
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Stamp Info */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-bold text-deep-navy mb-2">
            {currentLanguage === "en" ? stamp.name : stamp.nameKr || stamp.name}
          </h2>

          <div className="flex items-center mb-4 text-sm text-stone-gray">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{stamp.location}</span>
            <span className="mx-2">•</span>
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>

          <div className="flex items-center mb-4">
            <div className="bg-brand-coral text-white px-2 py-1 rounded-full text-xs mr-2 flex items-center">
              <Award className="w-3 h-3 mr-1" />
              {currentLanguage === "en" ? "Rarity" : "희귀도"}: {stamp.rarity}/5
            </div>
            <div className="bg-light-sand text-deep-navy px-2 py-1 rounded-full text-xs flex items-center">
              {stamp.category}
            </div>
          </div>

          <p className="text-deep-navy mb-4 italic">
            "{currentLanguage === "en" ? stamp.description : stamp.descriptionKr || stamp.description}"
          </p>
        </div>

        {/* Local Tips Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-deep-navy flex items-center">
              <span className="text-xl mr-2">💡</span>
              {currentLanguage === "en" ? "Local Tips" : "현지인 팁"}
            </h2>

            {localTips.length > 1 && (
              <div className="flex items-center text-xs">
                <span className="text-stone-gray mr-2">
                  {selectedTipIndex + 1}/{localTips.length}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={handlePrevTip}
                    className="w-6 h-6 rounded-full bg-light-sand flex items-center justify-center"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleNextTip}
                    className="w-6 h-6 rounded-full bg-light-sand flex items-center justify-center transform rotate-180"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentTip ? (
            <>
              <div className="flex items-start mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <img
                    src={currentTip.author.avatar || "/placeholder.svg"}
                    alt={currentTip.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <p className="font-medium text-deep-navy">
                      {currentLanguage === "en"
                        ? currentTip.author.name
                        : currentTip.author.nameKr || currentTip.author.name}
                    </p>
                    <div className="ml-2 px-2 py-0.5 bg-light-sand rounded-full text-xs text-stone-gray flex items-center">
                      <span className="mr-1">Lv.{currentTip.author.level || 1}</span>
                      {currentLanguage === "en" ? "Local Guide" : "현지인 가이드"}
                      {currentTip.author.isVerified && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-1 text-brand-blue"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <p className="text-stone-gray">
                    {currentLanguage === "en" ? currentTip.content.en : currentTip.content.kr}
                  </p>
                </div>
              </div>

              {currentTip.tags && currentTip.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {currentTip.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleLikeTip(selectedTipIndex)}
                  className="flex items-center text-stone-gray hover:text-brand-coral transition-colors"
                >
                  <Heart className="h-5 w-5 mr-1" fill={currentTip.likes > 100 ? "currentColor" : "none"} />
                  <span>
                    {currentTip.likes} {currentLanguage === "en" ? "likes" : "좋아요"}
                  </span>
                </button>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1 text-stone-gray" />
                  <span className="text-xs text-stone-gray">
                    {new Date(currentTip.createdAt).toLocaleDateString(currentLanguage === "en" ? "en-US" : "ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <img src="/images/jaime-avatar.png" alt="Local guide" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <p className="font-medium text-deep-navy">Jaime Sung</p>
                  <div className="ml-2 px-2 py-0.5 bg-light-sand rounded-full text-xs text-stone-gray">
                    {currentLanguage === "en" ? "Local Guide" : "현지인 가이드"}
                  </div>
                </div>
                <p className="text-stone-gray">
                  {currentLanguage === "en"
                    ? "This is a popular spot among locals. Try to visit during weekdays to avoid crowds."
                    : "현지인들 사이에서 인기 있는 장소입니다. 혼잡함을 피하려면 평일에 방문해 보세요."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stamp Collection Progress */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-deep-navy flex items-center">
              <span className="text-xl mr-2">🗺️</span>
              {currentLanguage === "en" ? "Stamp Collection" : "스탬프 컬렉션"}
            </h2>
            <span className="text-sm font-medium text-deep-navy">
              {collectedStamps}/{totalStamps}
            </span>
          </div>

          <div className="h-2 bg-light-sand rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-brand-coral rounded-full transition-all duration-300"
              style={{ width: `${(collectedStamps / totalStamps) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {stampGuide.map((item, index) => (
              <div
                key={item.id}
                className={`aspect-square flex items-center justify-center border ${
                  item.collected ? "border-brand-coral bg-white" : "border-gray-300 bg-gray-100"
                } rounded-md overflow-hidden`}
              >
                {item.collected ? (
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={`Stamp ${index + 1}`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">🔒</span>
                )}
              </div>
            ))}
          </div>

          <Link href="/stamp-pokedex">
            <button className="w-full py-2 bg-light-sand text-deep-navy rounded-lg flex items-center justify-center">
              {currentLanguage === "en" ? "View All Stamps" : "모든 스탬프 보기"}
            </button>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleShare}
            className="flex-1 py-3 bg-brand-blue text-white rounded-lg flex items-center justify-center"
          >
            <Share2 className="w-5 h-5 mr-2" />
            {currentLanguage === "en" ? "Share" : "공유"}
          </button>
          <button
            onClick={handleHint}
            className="flex-1 py-3 bg-brand-yellow text-deep-navy rounded-lg flex items-center justify-center"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            {currentLanguage === "en" ? "Find Similar" : "비슷한 장소 찾기"}
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center mb-8"
        >
          <X className="w-5 h-5 mr-2" />
          {currentLanguage === "en" ? "Close" : "닫기"}
        </button>
      </div>

      <style jsx global>{`
        @keyframes stamp-thunk {
          0% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          20% {
            transform: scale(0.95);
          }
          40% {
            transform: scale(1.05);
          }
          60% {
            transform: scale(0.98);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 0 4px var(--brand-coral), 0 0 0 6px rgba(255,255,255,0.5), 0 0 10px rgba(255, 165, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 0 4px var(--brand-coral), 0 0 0 6px rgba(255,255,255,0.5), 0 0 20px rgba(255, 165, 0, 0.6);
          }
          100% {
            box-shadow: 0 0 0 4px var(--brand-coral), 0 0 0 6px rgba(255,255,255,0.5), 0 0 10px rgba(255, 165, 0, 0.3);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </div>
  )
}
