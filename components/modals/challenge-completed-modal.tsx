"use client"

import { useState, useEffect, useRef } from "react"
import { FaTimes, FaBolt, FaShare, FaStamp } from "react-icons/fa"
import Image from "next/image"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import type React from "react"
import type { JSX } from "react/jsx-runtime"

interface ChallengeCompletedModalProps {
  isOpen: boolean
  onClose: () => void
  currentLanguage: string
  challengeTitle?: string
  challengeDescription?: string
  xpReward?: number
  challengeImage?: string
}

const ChallengeCompletedModal: React.FC<ChallengeCompletedModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  challengeTitle = "Challenge Completed",
  challengeDescription = "You've completed a challenge!",
  xpReward = 50,
  challengeImage,
}) => {
  const [confetti, setConfetti] = useState<JSX.Element[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showStamp, setShowStamp] = useState(false)
  const [stampImpact, setStampImpact] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const stampAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio references
    audioRef.current = new Audio("/sounds/stamp-thunk.mp3")
    stampAudioRef.current = new Audio("/stamp-sound.mp3")

    if (audioRef.current) audioRef.current.volume = 0.7
    if (stampAudioRef.current) stampAudioRef.current.volume = 0.7

    return () => {
      // Cleanup audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (stampAudioRef.current) {
        stampAudioRef.current.pause()
        stampAudioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setShowModal(true)

      // Sequence the animations
      setTimeout(() => {
        setShowStamp(true)
        triggerHapticFeedback(hapticPatterns.heavy)

        // Play stamp sound
        try {
          if (stampAudioRef.current) {
            stampAudioRef.current.currentTime = 0
            stampAudioRef.current.play().catch((e) => console.warn("Audio play failed:", e))
          }
        } catch (e) {
          console.warn("Error playing audio:", e)
        }

        setTimeout(() => {
          setStampImpact(true)
          triggerHapticFeedback(hapticPatterns.success)

          // Play thunk sound
          try {
            if (audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play().catch((e) => console.warn("Audio play failed:", e))
            }
          } catch (e) {
            console.warn("Error playing audio:", e)
          }

          createConfetti()
        }, 300)
      }, 500)
    } else {
      setShowModal(false)
      setShowStamp(false)
      setStampImpact(false)
    }
  }, [isOpen])

  const createConfetti = () => {
    const colors = ["#5DA9E9", "#FF7E67", "#FFDA63", "#F4EAD5"]
    const newConfetti: JSX.Element[] = []

    for (let i = 0; i < 100; i++) {
      const left = Math.random() * 100
      const width = Math.random() * 10 + 5
      const height = Math.random() * 10 + 5
      const color = colors[Math.floor(Math.random() * colors.length)]
      const delay = Math.random() * 3
      const duration = Math.random() * 3 + 2
      const rotation = Math.random() * 360

      newConfetti.push(
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${left}%`,
            top: 0,
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: color,
            transform: `rotate(${rotation}deg)`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />,
      )
    }

    setConfetti(newConfetti)
  }

  const handleClose = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    onClose()
  }

  const handleShare = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    // Share functionality would go here
    onClose()
  }

  if (!showModal) return null

  return (
    <div className="modal active fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="popup p-6 bg-white rounded-lg max-w-md w-full relative overflow-hidden">
        {/* Confetti container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">{confetti}</div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold serif-font">
            {currentLanguage === "en" ? "Challenge Complete!" : "도전 완료!"}
          </h2>
          <button onClick={handleClose} className="hover-effect">
            <FaTimes className="text-stone-gray" />
          </button>
        </div>

        <div className="text-center mb-6 relative">
          {/* Stamp effect overlay */}
          <div className={`stamp-effect ${showStamp ? "active" : ""}`}>
            <div className={`stamp-inner ${stampImpact ? "impact" : ""}`}>
              <FaStamp className="text-sunset-coral text-4xl" />
            </div>
          </div>

          {challengeImage && (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-sunshine-yellow relative">
              <Image
                src={challengeImage || "/placeholder.svg"}
                alt={challengeTitle}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
              {showStamp && (
                <div
                  className={`absolute inset-0 bg-sunset-coral/30 flex items-center justify-center ${stampImpact ? "animate-pulse" : ""}`}
                >
                  <div
                    className={`text-white font-bold transform ${stampImpact ? "scale-100 rotate-0" : "scale-150 rotate-45"} transition-all duration-300`}
                  >
                    COMPLETED
                  </div>
                </div>
              )}
            </div>
          )}
          <h3 className="text-xl font-bold mb-2">{challengeTitle}</h3>
          <p className="text-stone-gray">{challengeDescription}</p>
        </div>

        <div className="bg-light-sand p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-3 text-center">{currentLanguage === "en" ? "Rewards" : "보상"}</h3>
          <div className="flex justify-center items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-sunshine-yellow rounded-full flex items-center justify-center mr-3 animate-pulse">
                <FaBolt className="text-deep-navy text-xl" />
              </div>
              <span className="text-xl font-bold">+{xpReward} XP</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            className="flex-1 py-3 bg-light-sand text-deep-navy rounded-lg font-bold hover:bg-opacity-90 transition-colors"
            onClick={handleClose}
          >
            {currentLanguage === "en" ? "Close" : "닫기"}
          </button>
          <button
            className="flex-1 py-3 bg-sunset-coral text-cloud-white rounded-lg font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center"
            onClick={handleShare}
          >
            <FaShare className="mr-2" />
            {currentLanguage === "en" ? "Share" : "공유하기"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChallengeCompletedModal

// If this function exists in the file, update it to use the new image path
// If not, this edit will be ignored
const handleCafeQuestComplete = (
  currentLanguage: string,
  handleChallengeComplete: (title: string, description: string, xp: number, image: string) => void,
) => {
  handleChallengeComplete(
    currentLanguage === "en" ? "Visit a café today" : "오늘 카페 한 군데 방문하기",
    currentLanguage === "en" ? "You've checked in at a café in Seoul!" : "서울의 카페에서 체크인했습니다!",
    50,
    "/images/challenge-cafe.png",
  )
}
