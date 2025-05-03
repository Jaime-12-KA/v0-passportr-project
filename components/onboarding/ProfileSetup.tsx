"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaChevronLeft, FaCamera, FaUser } from "react-icons/fa"
import Image from "next/image"

interface ProfileSetupProps {
  onNext: () => void
  onBack: () => void
  profileData: {
    nickname: string
    photoUrl: string
    theme: string
  }
  onProfileUpdate: (
    data: Partial<{
      nickname: string
      photoUrl: string
      theme: string
    }>,
  ) => void
  currentLanguage: string
  translations: any
}

export default function ProfileSetup({
  onNext,
  onBack,
  profileData,
  onProfileUpdate,
  currentLanguage,
  translations,
}: ProfileSetupProps) {
  const [nickname, setNickname] = useState(profileData.nickname || "")
  const [selectedTheme, setSelectedTheme] = useState(profileData.theme || "classic-blue")

  // 현재 언어에 맞는 텍스트 가져오기
  const t = translations[currentLanguage].profile

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onProfileUpdate({
      nickname,
      theme: selectedTheme,
    })
    onNext()
  }

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme)
    onProfileUpdate({ theme })
  }

  // Updated themes with new color scheme
  const themes = [
    {
      id: "classic-blue",
      name: currentLanguage === "en" ? "Classic Blue" : "클래식 블루",
      color: "#1E88E5",
      image: "/images/new-cover-classic.png",
    },
    {
      id: "coral-sunset",
      name: currentLanguage === "en" ? "Coral Sunset" : "코랄 선셋",
      color: "#FF5252",
      image: "/images/new-cover-coral.png",
    },
    {
      id: "highlight-gold",
      name: currentLanguage === "en" ? "Highlight Gold" : "하이라이트 골드",
      color: "#FFD60A",
      image: "/images/new-cover-yellow.png",
    },
    {
      id: "forest-green",
      name: currentLanguage === "en" ? "Forest Green" : "포레스트 그린",
      color: "#2E7D32",
      image: "/images/new-cover-green.png",
    },
  ]

  return (
    <div className="h-full w-full bg-cloud-white flex flex-col overflow-auto">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center">
          <FaChevronLeft className="text-deep-navy" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-6 py-12 min-h-min">
        <motion.div
          className="w-full max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-deep-navy text-center mb-8">{t.title}</h2>

          <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            {/* Profile photo */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-light-sand flex items-center justify-center overflow-hidden">
                  {profileData.photoUrl ? (
                    <Image
                      src={profileData.photoUrl || "/placeholder.svg"}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-4xl text-stone-gray" />
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-md"
                >
                  <FaCamera />
                </button>
              </div>
              <label className="text-sm text-stone-gray">{t.addPhoto}</label>
            </div>

            {/* Nickname */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-deep-navy mb-1">
                {t.nickname}
              </label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-light-sand focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder={t.nicknamePlaceholder}
                required
              />
            </div>

            {/* Theme selection */}
            <div>
              <label className="block text-sm font-medium text-deep-navy mb-3">{t.chooseTheme}</label>
              <div className="grid grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedTheme === theme.id ? "ring-2 ring-sunset-coral" : "ring-1 ring-light-sand"
                    }`}
                    onClick={() => handleThemeChange(theme.id)}
                  >
                    <div className="aspect-[3/4] relative">
                      <Image src={theme.image || "/placeholder.svg"} alt={theme.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium">
                        {theme.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-light-sand rounded-lg p-4 flex items-center">
              <div className="w-16 h-20 rounded-lg overflow-hidden mr-4">
                <Image
                  src={themes.find((t) => t.id === selectedTheme)?.image || themes[0].image}
                  alt="Passport preview"
                  width={64}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-deep-navy">{t.preview}</h4>
                <p className="text-sm text-stone-gray">
                  {nickname || "Your name"}
                  {t.previewName}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sunset-coral text-white rounded-lg font-medium shadow-sm hover:bg-sunset-coral/90 transition-colors"
            >
              {t.continue}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
