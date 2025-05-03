"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { FaChevronRight } from "react-icons/fa"

interface StampCollectionScreenProps {
  onNext: () => void
  currentLanguage?: string
  translations?: any
}

export default function StampCollectionScreen({
  onNext,
  currentLanguage = "en",
  translations,
}: StampCollectionScreenProps) {
  const [isPassportOpen, setIsPassportOpen] = useState(false)

  // 언어에 따른 텍스트 가져오기
  const t =
    translations && translations[currentLanguage]
      ? translations[currentLanguage].stampCollection
      : {
          title: currentLanguage === "en" ? "Collect Stamps" : "스탬프 수집하기",
          subtitle:
            currentLanguage === "en"
              ? "Check in at locations to collect unique stamps"
              : "장소에 체크인하여 특별한 스탬프를 수집하세요",
          openPassport: currentLanguage === "en" ? "Open your passport" : "여권 열기",
          yourPassport: currentLanguage === "en" ? "Your Passport" : "내 여권",
          stampDescription:
            currentLanguage === "en"
              ? "Each stamp is a memory of your journey"
              : "각 스탬프는 당신의 여정의 추억입니다",
          nextButton: currentLanguage === "en" ? "Next" : "다음",
        }

  const handlePassportClick = () => {
    setIsPassportOpen(!isPassportOpen)
  }

  return (
    <div className="h-full w-full bg-cloud-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.h2
          className="text-2xl font-bold text-deep-navy mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t.title}
        </motion.h2>
        <motion.p
          className="text-stone-gray mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {t.subtitle}
        </motion.p>

        <div className="relative w-full max-w-md mx-auto mb-8">
          {isPassportOpen ? (
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="passport-open"
            >
              <div className="bg-white rounded-lg shadow-lg p-4 border border-light-sand">
                <h3 className="text-xl font-bold text-center mb-4">{t.yourPassport}</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="stamp-placeholder">
                    <Image
                      src="/images/stamps_Undiscovered.png"
                      alt="Stamp"
                      width={80}
                      height={80}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="stamp-placeholder">
                    <Image
                      src="/images/stamps_Undiscovered.png"
                      alt="Stamp"
                      width={80}
                      height={80}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="stamp-placeholder">
                    <Image
                      src="/images/stamps_Undiscovered.png"
                      alt="Stamp"
                      width={80}
                      height={80}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <p className="text-sm text-stone-gray text-center">{t.stampDescription}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="passport-closed"
              onClick={handlePassportClick}
            >
              <Image
                src="/images/passportr-cover3.png"
                alt="Passport Cover"
                width={300}
                height={400}
                className="mx-auto rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-brand-blue mt-2 cursor-pointer">{t.openPassport}</p>
            </motion.div>
          )}
        </div>

        <motion.button
          className="bg-brand-blue text-white px-6 py-3 rounded-full flex items-center justify-center shadow-md hover:bg-brand-blue/90 transition-colors"
          onClick={onNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {t.nextButton} <FaChevronRight className="ml-2" />
        </motion.button>
      </div>
    </div>
  )
}
