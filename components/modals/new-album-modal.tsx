"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import Image from "next/image"

interface NewAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  currentLanguage: string
  onAddAlbum: (name: string, coverImage: string) => void
}

const NewAlbumModal = ({ isOpen, onClose, currentLanguage, onAddAlbum }: NewAlbumModalProps) => {
  const [albumName, setAlbumName] = useState("")
  const [selectedCover, setSelectedCover] = useState("/images/album-cover-gold.jpeg")

  const coverOptions = [
    "/images/seoulcafetour.png",
    "/images/indiebookstore.png",
    "/images/2025europe.png",
    "/images/album-cover-blue.jpeg",
  ]

  const handleCreateAlbum = () => {
    if (albumName.trim() === "") return

    triggerHapticFeedback(hapticPatterns.medium)
    onAddAlbum(albumName, selectedCover)
    setAlbumName("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-light-sand">
          <h2 className="text-lg font-bold">{currentLanguage === "en" ? "Create New Album" : "새 앨범 만들기"}</h2>
          <button className="w-8 h-8 rounded-full bg-light-sand flex items-center justify-center" onClick={onClose}>
            <X className="text-deep-navy w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Album Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {currentLanguage === "en" ? "Album Name" : "앨범 이름"}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-light-sand rounded-lg"
              placeholder={currentLanguage === "en" ? "Enter album name..." : "앨범 이름 입력..."}
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
            />
          </div>

          {/* Cover Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {currentLanguage === "en" ? "Choose Cover" : "커버 선택"}
            </label>
            <div className="grid grid-cols-4 gap-3">
              {coverOptions.map((cover, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${selectedCover === cover ? "ring-2 ring-brand-coral" : ""}`}
                  onClick={() => setSelectedCover(cover)}
                >
                  <Image
                    src={cover || "/placeholder.svg"}
                    alt={`Cover option ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {currentLanguage === "en" ? "Preview" : "미리보기"}
            </label>
            <div className="flex items-center bg-light-sand p-3 rounded-lg">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                <Image
                  src={selectedCover || "/placeholder.svg"}
                  alt="Album cover preview"
                  width={64}
                  alt="Album cover preview"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{albumName || (currentLanguage === "en" ? "New Album" : "새 앨범")}</p>
                <p className="text-xs text-stone-gray">{currentLanguage === "en" ? "0 items" : "0개 항목"}</p>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <button
            className={`w-full py-3 rounded-lg font-medium ${albumName.trim() ? "bg-brand-coral text-cloud-white" : "bg-light-sand text-stone-gray"}`}
            onClick={handleCreateAlbum}
            disabled={!albumName.trim()}
          >
            {currentLanguage === "en" ? "Create Album" : "앨범 만들기"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewAlbumModal
