"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaStamp, FaCalendarDay, FaBolt, FaShare } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface StampModalProps {
  isOpen: boolean
  onClose: () => void
  place: {
    name: {
      en: string
      kr: string
    }
    category: {
      en: string
      kr: string
    }
    image: string
    stampColor: string
    stampIcon: string
  } | null
  currentLanguage: string
  position?: { top: number; left: number } | null
}

const StampModal = ({ isOpen, onClose, place, currentLanguage, position }: StampModalProps) => {
  const [stampAnimationStage, setStampAnimationStage] = useState(0)
  const [showRipple, setShowRipple] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [showStampImpression, setShowStampImpression] = useState(false)
  const stampRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Create and preload audio element
  useEffect(() => {
    // Only create audio element if we're in a browser environment
    if (typeof window !== "undefined") {
      try {
        // Create audio element for stamp sound
        const audio = new Audio()

        // Set error handler before setting source
        audio.addEventListener("error", (e) => {
          console.warn("Audio failed to load:", e)
        })

        // Set source and other properties
        audio.src = "/stamp-sound.mp3"
        audio.volume = 0.7
        audio.preload = "auto" // Explicitly set preload

        // Store the audio element
        audioRef.current = audio

        // Try to load the audio (this might fail silently)
        audio.load()

        console.log("Audio element initialized")
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
      // Reset audio to beginning
      audioRef.current.currentTime = 0

      // Check if source is set
      if (!audioRef.current.src || audioRef.current.src === "") {
        audioRef.current.src = "/stamp-sound.mp3"
        audioRef.current.load()
      }

      // Play with promise handling for browsers that return a promise
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio played successfully")
          })
          .catch((error) => {
            console.warn("Audio play failed, using haptic feedback instead:", error)
            // Fall back to haptic feedback only
            triggerHapticFeedback(hapticPatterns.stamp)
          })
      }

      return true
    } catch (e) {
      console.error("Audio play error:", e)
      // Fall back to haptic feedback
      triggerHapticFeedback(hapticPatterns.stamp)
      return false
    }
  }

  useEffect(() => {
    if (isOpen && place) {
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

      // Ensure modal is at the top of the viewport
      if (modalRef.current) {
        modalRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [isOpen, place])

  const handleButtonClick = () => {
    // Trigger haptic feedback on button click
    triggerHapticFeedback(hapticPatterns.medium)
    onClose()
  }

  const handleShareClick = () => {
    // Trigger haptic feedback on share button click
    triggerHapticFeedback(hapticPatterns.medium)

    // 오디오 재생 시도 - 실패해도 계속 진행
    try {
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.warn("Audio play failed on share:", e))
      }
    } catch (e) {
      console.warn("Failed to play audio on share:", e)
    }

    onClose()
  }

  const handleCheckInComplete = () => {
    triggerHapticFeedback(hapticPatterns.success)
    onClose()
    // 여기서는 아무것도 추가하지 않음 - 부모 컴포넌트에서 처리
  }

  if (!isOpen || !place) return null

  // Special animation for Gyeongbokgung Palace (crown icon)
  const isRoyalPalace = place.stampIcon === "fa-crown"

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4"
          onClick={(e) => {
            e.stopPropagation() // Stop event propagation
            onClose() // Close the modal
          }}
          style={{
            cursor: "default",
            paddingTop: position ? `${Math.max(position.top, 20)}px` : "4rem", // Use position if available, otherwise default padding
          }}
        >
          <motion.div
            className="popup p-4 md:p-8 text-center w-[95%] relative overflow-hidden bg-white rounded-xl shadow-xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            ref={modalRef}
          >
            {/* Close button */}
            <button
              onClick={handleButtonClick}
              className="absolute top-4 right-4 text-brand-gray hover:text-brand-navy transition-colors z-50"
            >
              <FaTimes />
            </button>

            {/* Header */}
            <motion.h2
              className="text-2xl font-bold serif-font mb-2 text-brand-navy"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isRoyalPalace
                ? currentLanguage === "en"
                  ? "Royal Palace Stamp Collected!"
                  : "왕궁 스탬프 수집!"
                : currentLanguage === "en"
                  ? "New Stamp Collected!"
                  : "새 스탬프 수집!"}
            </motion.h2>

            {/* Place image */}
            <motion.div
              className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 border-2 border-brand-sand"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <img src={place.image || "/placeholder.svg"} alt={place.name.en} className="w-full h-full object-cover" />
            </motion.div>

            <motion.p
              className="text-brand-gray mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentLanguage === "en" ? `You've checked in at ${place.name.en}` : `${place.name.kr}에 체크인했습니다`}
            </motion.p>

            {/* Stamp animation area */}
            <div className="relative h-48 mb-6 flex items-center justify-center">
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
                  top: position?.top || "50%",
                  left: position?.left || "50%",
                  transform: `translate(-50%, -50%) ${
                    stampAnimationStage === 1 ? "translateY(-50px)" : stampAnimationStage === 2 ? "translateY(0)" : ""
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
                    src={place.image || "/placeholder.svg"}
                    alt={place.name.en}
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
                    src={place.image || "/placeholder.svg"}
                    alt={place.name.en}
                    className="w-full h-full object-cover"
                    style={{ filter: "contrast(1.2) brightness(0.8)" }}
                  />
                  <div className="absolute inset-0 bg-brand-coral opacity-30" style={{ mixBlendMode: "color" }}></div>
                </div>
                <div className="stamp-date mt-1 text-sm">{new Date().toLocaleDateString()}</div>
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

            {/* Rewards section */}
            <motion.div
              className="bg-brand-sand p-4 rounded-lg mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="font-bold mb-3 text-brand-navy">{currentLanguage === "en" ? "Rewards" : "보상"}</h3>
              <div className="flex justify-around">
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-2">
                    <FaStamp className="text-[#1E88E5]" />
                  </div>
                  <p className="text-sm font-medium">+1 Stamp</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-2">
                    <FaCalendarDay className="text-[#1E88E5]" />
                  </div>
                  <p className="text-sm font-medium">+1 Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-2">
                    <FaBolt className="text-brand-navy" />
                  </div>
                  <p className="text-sm font-medium">{isRoyalPalace ? "+100 XP" : "+50 XP"}</p>
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex space-x-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                className="flex-1 py-3 bg-brand-sand text-brand-navy rounded-lg font-bold hover:bg-opacity-90 transition-colors"
                onClick={handleButtonClick}
              >
                {currentLanguage === "en" ? "Close" : "닫기"}
              </button>
              <button
                className="flex-1 py-3 bg-brand-coral text-cloud-white rounded-lg font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center"
                onClick={handleShareClick}
              >
                <FaShare className="mr-2" />
                {currentLanguage === "en" ? "Share" : "공유하기"}
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default StampModal
