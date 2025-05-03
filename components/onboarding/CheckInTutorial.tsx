"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaChevronLeft, FaMapMarkerAlt, FaPassport, FaTasks, FaAward, FaUser } from "react-icons/fa"

interface CheckInTutorialProps {
  onNext: () => void
  onBack: () => void
  currentLanguage: string
  translations: any
}

export default function CheckInTutorial({ onNext, onBack, currentLanguage, translations }: CheckInTutorialProps) {
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showStampEffect, setShowStampEffect] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // 현재 언어에 맞는 텍스트 가져오기
  const t = translations[currentLanguage].tutorial

  const handleCheckIn = () => {
    setTutorialStep(1)

    // Show stamp effect with delay
    setTimeout(() => {
      setShowStampEffect(true)

      // Show confetti after stamp appears
      setTimeout(() => {
        setShowConfetti(true)
      }, 300)

      // Move to next step after animation completes
      setTimeout(() => {
        setTutorialStep(2)
      }, 2000)
    }, 500)
  }

  const handleContinue = () => {
    onNext()
  }

  return (
    <div className="min-h-screen w-full bg-cloud-white flex flex-col">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center">
          <FaChevronLeft className="text-deep-navy" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {tutorialStep === 0 && (
            <motion.div
              key="step1"
              className="w-full max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-deep-navy mb-4">
                  {currentLanguage === "en" ? "Let's check in!" : "체크인해 보세요!"}
                </h2>
                <p
                  className="text-stone-gray"
                  dangerouslySetInnerHTML={{
                    __html:
                      currentLanguage === "en"
                        ? "Tap the check-in button below to collect your first stamp"
                        : "아래의 체크인 버튼을 탭하여<br />첫 번째 스탬프를 수집하세요",
                  }}
                ></p>
              </div>

              {/* Simulated tab bar with highlighted check-in button */}
              <div className="relative mt-12">
                <div className="w-full h-16 bg-white rounded-t-xl shadow-sm flex items-center justify-around px-4 border-t border-light-sand">
                  <div className="flex flex-col items-center">
                    <FaPassport className="text-stone-gray" />
                    <span className="text-xs text-stone-gray mt-1">
                      {currentLanguage === "en" ? "Passport" : "여권"}
                    </span>
                  </div>

                  {/* Animated arrow pointing to check-in button */}
                  <motion.div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-sunset-coral"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 20V4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 12L12 4L19 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>

                  {/* Check-in button - Changed from plus to map marker */}
                  <motion.button
                    className="w-14 h-14 rounded-full bg-sunset-coral text-white flex items-center justify-center shadow-lg relative -top-5"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheckIn}
                  >
                    <FaMapMarkerAlt className="text-xl" />
                  </motion.button>

                  <div className="flex flex-col items-center">
                    <FaTasks className="text-stone-gray" />
                    <span className="text-xs text-stone-gray mt-1">
                      {currentLanguage === "en" ? "Challenges" : "도전"}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <FaUser className="text-stone-gray" />
                    <span className="text-xs text-stone-gray mt-1">
                      {currentLanguage === "en" ? "Profile" : "프로필"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tutorialStep === 1 && (
            <motion.div
              key="step2"
              className="w-full max-w-md relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative h-64 flex items-center justify-center">
                {/* Stamp effect */}
                <motion.div
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-sunset-coral"
                  initial={{ y: -100, scale: 1.2, opacity: 0 }}
                  animate={{
                    y: showStampEffect ? 0 : -100,
                    scale: showStampEffect ? 1 : 1.2,
                    opacity: showStampEffect ? 1 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                >
                  <div className="w-full h-full bg-sunset-coral/20 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-4xl text-sunset-coral" />
                  </div>
                </motion.div>

                {/* Confetti effect */}
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 50 }).map((_, i) => {
                      const size = Math.random() * 8 + 4
                      const angle = (Math.PI * 2 * i) / 50
                      const distance = Math.random() * 100 + 50
                      const x = Math.cos(angle) * distance
                      const y = Math.sin(angle) * distance
                      const color = ["#1E88E5", "#FF5252", "#FFB300", "#F4EAD5"][Math.floor(Math.random() * 4)]

                      return (
                        <motion.div
                          key={i}
                          className="absolute rounded-full"
                          style={{
                            width: size,
                            height: size,
                            backgroundColor: color,
                            top: "50%",
                            left: "50%",
                          }}
                          initial={{ x: 0, y: 0, opacity: 1 }}
                          animate={{
                            x,
                            y,
                            opacity: 0,
                            scale: Math.random() * 0.5 + 0.5,
                          }}
                          transition={{
                            duration: Math.random() * 0.8 + 0.6,
                            ease: "easeOut",
                          }}
                        />
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-deep-navy mb-2">
                  {currentLanguage === "en" ? "Collecting stamp..." : "스탬프 수집 중..."}
                </h3>
                {/* Removed the text about hearing the ping sound */}
              </div>
            </motion.div>
          )}

          {tutorialStep === 2 && (
            <motion.div
              key="step3"
              className="w-full max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-deep-navy mb-4">
                  {currentLanguage === "en" ? "Congratulations!" : "축하합니다!"}
                </h2>
                <p
                  className="text-stone-gray mb-6"
                  dangerouslySetInnerHTML={{
                    __html:
                      currentLanguage === "en"
                        ? "You've collected your first stamp. Check in at more locations to grow your collection!"
                        : "첫 번째 스탬프를 수집했습니다. 더 많은 장소에서<br />체크인하여 컬렉션을 늘려보세요!",
                  }}
                ></p>

                <div className="bg-light-sand p-4 rounded-lg mb-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-sunset-coral rounded-full flex items-center justify-center mr-3">
                        <FaMapMarkerAlt className="text-white" />
                      </div>
                      <span className="font-medium text-deep-navy">
                        {currentLanguage === "en" ? "First Check-in" : "첫 번째 체크인"}
                      </span>
                    </div>
                    <span className="text-brand-blue font-medium">+50 XP</span>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full py-3 bg-sunset-coral text-white rounded-lg font-medium shadow-sm hover:bg-sunset-coral/90 transition-colors"
                >
                  {currentLanguage === "en" ? "Continue to Passportr" : "Passportr로 계속하기"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Updated bottom navigation bar to match main app */}
      <div className="h-16 bg-white border-t border-light-sand flex items-center justify-around px-4">
        <button className="flex flex-col items-center">
          <FaMapMarkerAlt className="text-stone-gray" />
          <span className="text-xs text-stone-gray mt-1">{currentLanguage === "en" ? "Check-in" : "체크인"}</span>
        </button>

        <button className="flex flex-col items-center">
          <FaPassport className="text-stone-gray" />
          <span className="text-xs text-stone-gray mt-1">{currentLanguage === "en" ? "Passport" : "여권"}</span>
        </button>

        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-sunset-coral text-white flex items-center justify-center relative -top-4">
            <FaMapMarkerAlt />
          </div>
        </button>

        <button className="flex flex-col items-center">
          <FaTasks className="text-stone-gray" />
          <span className="text-xs text-stone-gray mt-1">{currentLanguage === "en" ? "Challenges" : "도전"}</span>
        </button>

        <button className="flex flex-col items-center">
          <FaAward className="text-stone-gray" />
          <span className="text-xs text-stone-gray mt-1">{currentLanguage === "en" ? "Achievements" : "업적"}</span>
        </button>
      </div>
    </div>
  )
}
