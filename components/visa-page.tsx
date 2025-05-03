"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface VisaPageProps {
  currentLanguage: string
  onBack?: () => void
}

interface MilestoneStamp {
  id: string
  title: string
  subtitle: string
  date: string
  image: string
  type: "genesis" | "level" | "quest" | "special"
}

const VisaPage = ({ currentLanguage, onBack }: VisaPageProps) => {
  const [stamps, setStamps] = useState<MilestoneStamp[]>(getSampleMilestoneStamps(currentLanguage))

  const handleStampClick = (stampId: string) => {
    triggerHapticFeedback(hapticPatterns.medium)
    // Could open a detail modal here
  }

  return (
    <div className="visa-page relative bg-[#f8f3e2] rounded-xl p-5 shadow-sm overflow-hidden">
      {/* Background pattern - guilloche pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="guilloche" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M0,100 C50,50 150,50 200,100 S350,150 400,100" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M0,110 C50,60 150,60 200,110 S350,160 400,110" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M0,120 C50,70 150,70 200,120 S350,170 400,120" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M0,130 C50,80 150,80 200,130 S350,180 400,130" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M0,140 C50,90 150,90 200,140 S350,190 400,140" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M0,90 C50,40 150,40 200,90 S350,140 400,90" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M0,80 C50,30 150,30 200,80 S350,130 400,80" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M0,70 C50,20 150,20 200,70 S350,120 400,70" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M0,60 C50,10 150,10 200,60 S350,110 400,60" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M100,0 C50,50 50,150 100,200 S150,350 100,400" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M110,0 C60,50 60,150 110,200 S160,350 110,400" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M120,0 C70,50 70,150 120,200 S170,350 120,400" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M130,0 C80,50 80,150 130,200 S180,350 130,400" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M140,0 C90,50 90,150 140,200 S190,350 140,400" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M90,0 C40,50 40,150 90,200 S140,350 90,400" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M80,0 C30,50 30,150 80,200 S130,350 80,400" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M70,0 C20,50 20,150 70,200 S120,350 70,400" fill="none" stroke="#000" strokeWidth="0.5" />
            <path d="M60,0 C10,50 10,150 60,200 S110,350 60,400" fill="none" stroke="#000" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#guilloche)" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-sm font-bold text-deep-navy">VISA / 비자</h3>
        </div>
        <div>
          <h3 className="text-sm font-bold text-deep-navy">PASSPORTR</h3>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6 relative z-10">
        <h2 className="text-xl font-bold text-deep-navy">
          {currentLanguage === "en" ? "MILESTONE STAMPS" : "마일스톤 스탬프"}
        </h2>
        <p className="text-sm text-deep-gray mt-1">
          {currentLanguage === "en"
            ? "Special stamps commemorating your achievements"
            : "당신의 업적을 기념하는 특별한 스탬프"}
        </p>
      </div>

      {/* Stamps Grid */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        {stamps.map((stamp) => (
          <motion.div
            key={stamp.id}
            className="milestone-stamp bg-white rounded-lg p-3 shadow-sm border border-mid-gray cursor-pointer"
            whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            onClick={() => handleStampClick(stamp.id)}
          >
            <div className="flex justify-center mb-3">
              <div className="relative w-24 h-24">
                <Image
                  src={stamp.image || "/placeholder.svg"}
                  alt={stamp.title}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
                {/* Subtle glow effect for special stamps */}
                {stamp.type === "genesis" && (
                  <div className="absolute inset-0 bg-highlight-gold opacity-10 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-deep-navy text-sm">{stamp.title}</h4>
              <p className="text-xs text-deep-gray mt-1">{stamp.subtitle}</p>
              <p className="text-xs font-medium text-azure-radiance mt-2">{stamp.date}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Official Seal */}
      <div className="absolute bottom-4 right-4 opacity-30 w-24 h-24">
        <Image
          src="/images/official-passportr-seal.png"
          alt="Official Seal"
          width={96}
          height={96}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}

// Sample data function
function getSampleMilestoneStamps(currentLanguage: string): MilestoneStamp[] {
  return [
    {
      id: "genesis",
      title: currentLanguage === "en" ? "Passportr Genesis" : "패스포터 제네시스",
      subtitle: currentLanguage === "en" ? "First passport issuance" : "첫 여권 발급",
      date: "APR 15, 2025",
      image: "/images/special-passportr-genesis.png",
      type: "genesis",
    },
    {
      id: "level5",
      title: currentLanguage === "en" ? "Explorer Level V" : "탐험가 레벨 V",
      subtitle: currentLanguage === "en" ? "Reached level 5" : "레벨 5 달��",
      date: "APR 18, 2025",
      image: "/images/special-level5.png",
      type: "level",
    },
    {
      id: "seoul-master",
      title: currentLanguage === "en" ? "Seoul Master" : "서울 마스터",
      subtitle: currentLanguage === "en" ? "Completed all Seoul quests" : "서울 퀘스트 완료",
      date: "APR 19, 2025",
      image: "/images/special-seoul-master.png",
      type: "quest",
    },
    {
      id: "first-week",
      title: currentLanguage === "en" ? "First Week Journey" : "첫 주 여정",
      subtitle: currentLanguage === "en" ? "7 consecutive days of activity" : "7일 연속 활동",
      date: "APR 20, 2025",
      image: "/images/special-week.png",
      type: "special",
    },
  ]
}

export default VisaPage
