"use client"

import { useState } from "react"
import { FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import Image from "next/image"

interface StampDetailViewProps {
  id: string
  title: string
  region: string
  city?: string
  notes: string
  tags: string[]
  image: string
  collectionName: string
  onBack: () => void
  currentLanguage: string
}

const StampDetailView = ({
  id,
  title,
  region,
  city,
  notes,
  tags,
  image,
  collectionName,
  onBack,
  currentLanguage,
}: StampDetailViewProps) => {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleToggleFavorite = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    setIsFavorite(!isFavorite)
  }

  // Korean translations
  const translations = {
    notes: currentLanguage === "en" ? "Notes" : "메모",
    tags: currentLanguage === "en" ? "Tags" : "태그",
    backToAlbum: currentLanguage === "en" ? "Back to Album" : "앨범으로 돌아가기",
    toggleFavorite: currentLanguage === "en" ? "Toggle favorite" : "즐겨찾기 토글",
    backToAlbumAriaLabel: currentLanguage === "en" ? "Back to album" : "앨범으로 돌아가기",
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b border-light-sand">
        <button
          className="w-8 h-8 rounded-full bg-light-sand flex items-center justify-center"
          onClick={onBack}
          aria-label={translations.backToAlbumAriaLabel}
        >
          <FaArrowLeft className="text-deep-navy" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">{collectionName}</h2>
        <button
          className="w-8 h-8 rounded-full bg-light-sand flex items-center justify-center"
          onClick={handleToggleFavorite}
          aria-label={translations.toggleFavorite}
        >
          {isFavorite ? <FaHeart className="text-brand-coral" /> : <FaRegHeart className="text-deep-navy" />}
        </button>
      </div>

      {/* Image Banner */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={image || "/placeholder.svg?height=400&width=600&query=travel+destination"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-stone-gray mb-4">{region || city}</p>

        {/* Notes */}
        <div className="bg-light-sand rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-stone-gray mb-2">{translations.notes}</h3>
          <p className="text-deep-navy">{notes}</p>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-stone-gray mb-2">{translations.tags}</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <button className="w-full py-3 bg-brand-blue text-cloud-white rounded-lg font-medium" onClick={onBack}>
          {translations.backToAlbum}
        </button>
      </div>
    </div>
  )
}

export default StampDetailView
