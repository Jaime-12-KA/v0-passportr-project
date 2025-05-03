"use client"

import { useState, useRef, useEffect } from "react"
import { X, Upload, Camera } from "lucide-react"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface AddAlbumItemModalProps {
  isOpen: boolean
  onClose: () => void
  currentLanguage: string
  albumName: string
}

const AddAlbumItemModal = ({ isOpen, onClose, currentLanguage, albumName }: AddAlbumItemModalProps) => {
  const [caption, setCaption] = useState("")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)

  // Korean translations
  const translations = {
    addNewStamp: currentLanguage === "en" ? "Add New Stamp" : "스탬프 추가",
    addToAlbum: currentLanguage === "en" ? `Add a new stamp to "${albumName}"` : `"${albumName}"에 새 스탬프 추가`,
    title: currentLanguage === "en" ? "Title" : "제목",
    enterTitle: currentLanguage === "en" ? "Enter title..." : "제목 입력...",
    location: currentLanguage === "en" ? "Location" : "위치",
    enterLocation: currentLanguage === "en" ? "Enter location..." : "위치 입력...",
    dragDrop: currentLanguage === "en" ? "Drag & Drop or Click to Upload" : "드래그 앤 드롭 또는 클릭하여 업로드",
    supports: currentLanguage === "en" ? "Supports JPG, PNG, HEIC" : "JPG, PNG, HEIC 지원",
    chooseFile: currentLanguage === "en" ? "Choose File" : "파일 선택",
    takePhoto: currentLanguage === "en" ? "Take Photo" : "사진 촬영",
    notes: currentLanguage === "en" ? "Notes" : "메모",
    addNotes: currentLanguage === "en" ? "Add your notes..." : "메모 추가...",
    tags: currentLanguage === "en" ? "Tags (comma separated)" : "태그 (쉼표로 구분)",
    tagsPlaceholder: currentLanguage === "en" ? "#food, #travel, #memory" : "#음식, #여행, #추억",
    addStamp: currentLanguage === "en" ? "Add Stamp" : "스탬프 추가",
  }

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  const handleAddItem = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    // In a real app, this would save the new item
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto my-4"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Header - Fixed at the top */}
        <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b border-light-sand">
          <h2 className="text-lg font-bold">{translations.addNewStamp}</h2>
          <button
            className="w-8 h-8 rounded-full bg-light-sand flex items-center justify-center"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="text-deep-navy w-4 h-4" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4">
          <p className="text-sm text-stone-gray mb-4">{translations.addToAlbum}</p>

          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{translations.title}</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-light-sand rounded-lg"
              placeholder={translations.enterTitle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Location Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{translations.location}</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-light-sand rounded-lg"
              placeholder={translations.enterLocation}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-light-sand rounded-lg p-4 mb-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-light-sand flex items-center justify-center mb-3">
              <Upload className="text-deep-navy w-6 h-6" />
            </div>
            <p className="text-sm font-medium mb-1 text-center">{translations.dragDrop}</p>
            <p className="text-xs text-stone-gray mb-3 text-center">{translations.supports}</p>
            <button className="px-4 py-2 bg-brand-blue text-cloud-white rounded-lg text-sm">
              {translations.chooseFile}
            </button>
          </div>

          {/* Camera Option */}
          <button className="w-full py-2 border border-light-sand rounded-lg flex items-center justify-center mb-4">
            <Camera className="w-4 h-4 mr-2 text-deep-navy" />
            <span className="text-sm">{translations.takePhoto}</span>
          </button>

          {/* Notes Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{translations.notes}</label>
            <textarea
              className="w-full px-3 py-2 border border-light-sand rounded-lg min-h-[80px]"
              placeholder={translations.addNotes}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* Tags Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{translations.tags}</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-light-sand rounded-lg"
              placeholder={translations.tagsPlaceholder}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Add Button */}
          <button
            className="w-full py-3 bg-brand-coral text-cloud-white rounded-lg font-medium"
            onClick={handleAddItem}
          >
            {translations.addStamp}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddAlbumItemModal
