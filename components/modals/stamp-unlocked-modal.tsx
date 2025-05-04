"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Share2, HelpCircle } from "lucide-react"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import Image from "next/image"
import Link from "next/link"

interface StampUnlockedModalProps {
  isOpen: boolean
  onClose: () => void
  stamp: {
    id: string
    name: string
    nameKr?: string
    image: string
    rarity: number
    description: string
    descriptionKr?: string
    location: string
    category: string
    stampColor?: string
    stampIcon?: string
  }
  currentLanguage: string
}

const StampUnlockedModal = ({ isOpen, onClose, stamp, currentLanguage }: StampUnlockedModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false)
  const [totalStamps, setTotalStamps] = useState(150)
  const [collectedStamps, setCollectedStamps] = useState(24)
  const [stampAnimationStage, setStampAnimationStage] = useState(0)
  const [showRipple, setShowRipple] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [showStampImpression, setShowStampImpression] = useState(false)
  const stampRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Sample stamp guide data
  const stampGuide = [
    { id: "cafe1", image: "/images/seoul-cafe-hopping.png", collected: true, category: "cafe" },
    { id: "bakery1", image: "/images/palace-guard.png", collected: true, category: "food" },
    { id: "park1", image: "/images/seoul-history.png", collected: true, category: "nature" },
    { id: "locked1", image: "/placeholder.svg", collected: false, category: "unknown" },
    { id: "mountain1", image: "/images/seoul-landmark.png", collected: true, category: "nature" },
    { id: "food1", image: "/images/seoul-street-food.png", collected: true, category: "food" },
    { id: "art1", image: "/images/tasty-bangkok.png", collected: true, category: "culture" },
    { id: "locked2", image: "/placeholder.svg", collected: false, category: "unknown" },
    { id: "locked3", image: "/placeholder.svg", collected: false, category: "unknown" },
    { id: "locked4", image: "/placeholder.svg", collected: false, category: "unknown" },
    { id: "locked5", image: "/placeholder.svg", collected: false, category: "unknown" },
    { id: "locked6", image: "/placeholder.svg", collected: false, category: "unknown" },
  ]

  // Create and preload audio element
  useEffect(() => {
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
    if (isOpen && stamp) {
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
  }, [isOpen, stamp])

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

  const handleClose = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    onClose()
  }

  if (!isOpen || !stamp) return null

  // Special animation for royal places
  const isRoyalPalace = stamp.stampIcon === "fa-crown"

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header with app name */}
            <div className="bg-brand-blue text-white py-2 px-4 flex justify-center items-center">
              <h1 className="text-center font-serif tracking-widest">P A S S P O R T R</h1>
            </div>

            {/* New Stamp Unlocked Section */}
            <div className="p-4">
              <div className="border-2 border-brand-coral rounded-lg p-4 mb-4 relative overflow-hidden">
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 50 }).map((_, i) => {
                      const size = Math.random() * 8 + 4
                      const color = [
                        "bg-brand-yellow",
                        "bg-brand-coral",
                        "bg-brand-blue",
                        "bg-green-400",
                        "bg-purple-400",
                      ][Math.floor(Math.random() * 5)]
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

                <div className="text-center mb-3">
                  <span className="text-xl mr-2">🎉</span>
                  <span className="font-bold tracking-wider text-brand-coral">
                    {currentLanguage === "en" ? "NEW STAMP UNLOCKED" : "새로운 스탬프 획득"}
                  </span>
                </div>

                {/* Stamp animation area */}
                <div className="relative h-48 mb-4 flex items-center justify-center">
                  {/* Passport page background */}
                  <div className="absolute inset-0 bg-brand-sand rounded-lg shadow-inner"></div>

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
                        stampAnimationStage === 1
                          ? "translateY(-50px)"
                          : stampAnimationStage === 2
                            ? "translateY(0)"
                            : ""
                      }`,
                      transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      zIndex: 20,
                      opacity: stampAnimationStage >= 2 ? 0 : 1, // Stamp disappears when it hits
                    }}
                  >
                    <div
                      className={`stamp-image w-32 h-32 rounded-full overflow-hidden bg-brand-coral ${
                        isRoyalPalace ? "animate-pulse-glow" : ""
                      }`}
                      style={{
                        boxShadow: `0 0 0 4px var(--brand-coral), 0 0 0 6px rgba(255,255,255,0.5)`,
                        transform: stampAnimationStage === 2 ? "scale(1.1)" : "scale(1)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <img
                        src={stamp.image || "/placeholder.svg"}
                        alt={stamp.name}
                        className="w-full h-full object-cover"
                        style={{ filter: "contrast(1.2) brightness(0.8)" }}
                      />
                      <div
                        className="absolute inset-0 bg-brand-coral opacity-30"
                        style={{ mixBlendMode: "color" }}
                      ></div>
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
                      className={`w-28 h-28 rounded-full overflow-hidden border-4 border-brand-coral ${
                        isRoyalPalace ? "animate-pulse-glow" : ""
                      }`}
                      style={{
                        boxShadow: `0 0 0 2px white, 0 0 0 4px var(--brand-coral)`,
                        position: "relative",
                        animation: showStampImpression
                          ? "stamp-thunk 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                          : "none",
                      }}
                    >
                      <img
                        src={stamp.image || "/placeholder.svg"}
                        alt={stamp.name}
                        className="w-full h-full object-cover"
                        style={{ filter: "contrast(1.2) brightness(0.8)" }}
                      />
                      <div
                        className="absolute inset-0 bg-brand-coral opacity-30"
                        style={{ mixBlendMode: "color" }}
                      ></div>
                    </div>
                    <div className="stamp-date mt-1 text-sm text-center">{new Date().toLocaleDateString()}</div>
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

                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <h3 className="font-bold mb-1">
                    {currentLanguage === "en" ? stamp.name : stamp.nameKr || stamp.name}
                  </h3>
                  <p className="text-sm italic">
                    "{currentLanguage === "en" ? stamp.description : stamp.descriptionKr || stamp.description}"
                  </p>
                </div>
              </div>

              {/* Stamp Guide Section */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">🗺️</span>
                  <h2 className="font-bold tracking-wider">
                    {currentLanguage === "en" ? "STAMP GUIDE" : "스탬프 가이드"}
                    <span className="ml-2 text-sm font-normal">
                      ({collectedStamps} / {totalStamps})
                    </span>
                  </h2>
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
              </div>

              {/* Location and Action Buttons */}
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">📍</span>
                  <span className="font-medium">{stamp.location}</span>
                </div>

                <div className="flex justify-between gap-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 py-2 px-4 bg-brand-blue text-white rounded-lg flex items-center justify-center"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    {currentLanguage === "en" ? "Share" : "공유"}
                  </button>
                  <button
                    onClick={handleHint}
                    className="flex-1 py-2 px-4 bg-brand-yellow text-deep-navy rounded-lg flex items-center justify-center"
                  >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    {currentLanguage === "en" ? "Hint" : "힌트"}
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {currentLanguage === "en" ? "Close" : "닫기"}
                  </button>
                </div>
              </div>

              {/* View All Stamps Button */}
              <Link href="/stamp-pokedex">
                <button
                  className="w-full py-2 bg-brand-coral text-white rounded-lg flex items-center justify-center"
                  onClick={() => triggerHapticFeedback(hapticPatterns.medium)}
                >
                  {currentLanguage === "en" ? "View All Stamps" : "모든 스탬프 보기"}
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StampUnlockedModal
