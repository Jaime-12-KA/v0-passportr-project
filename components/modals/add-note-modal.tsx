"use client"

import type React from "react"

import { useState } from "react"
import { FaTimes, FaBook } from "react-icons/fa"
import { motion } from "framer-motion"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

interface AddNoteModalProps {
  isOpen: boolean
  onClose: () => void
  currentLanguage: string
  cityName: string
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, currentLanguage, cityName }) => {
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    triggerHapticFeedback(hapticPatterns.medium)
    // In a real app, we would save the note here
    // For now, just close the modal
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={() => onClose()}
      style={{ height: "var(--app-height, 100vh)" }}
    >
      <motion.div
        className="bg-cloud-white rounded-lg shadow-xl max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "calc(var(--app-height, 100vh) - 32px)" }}
      >
        <div className="flex justify-between items-center p-4 border-b border-light-sand">
          <div className="flex items-center">
            <FaBook className="text-brand-blue mr-2" />
            <h2 className="text-xl font-bold text-deep-navy">
              {currentLanguage === "en" ? "Add Travel Note" : "여행 노트 추가"}
            </h2>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-light-sand transition-colors"
            onClick={onClose}
          >
            <FaTimes className="text-stone-gray" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(var(--app-height, 100vh) - 150px)" }}
        >
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-deep-navy mb-1">
              {currentLanguage === "en" ? "Location" : "위치"}
            </label>
            <input
              type="text"
              id="location"
              className="w-full px-4 py-2 rounded-lg border border-light-sand focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder={currentLanguage === "en" ? `Location in ${cityName}` : `${cityName}의 위치`}
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="note" className="block text-sm font-medium text-deep-navy mb-1">
              {currentLanguage === "en" ? "Your Note" : "메모"}
            </label>
            <textarea
              id="note"
              className="w-full px-4 py-2 rounded-lg border border-light-sand focus:outline-none focus:ring-2 focus:ring-brand-blue min-h-[120px]"
              placeholder={
                currentLanguage === "en" ? "Write your travel memories here..." : "여행 추억을 여기에 적어주세요..."
              }
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
          </div>

          <div className="flex space-x-3">
            <button type="button" className="flex-1 py-2 bg-light-sand text-deep-navy rounded-lg" onClick={onClose}>
              {currentLanguage === "en" ? "Cancel" : "취소"}
            </button>
            <button type="submit" className="flex-1 py-2 bg-brand-blue text-cloud-white rounded-lg">
              {currentLanguage === "en" ? "Save Note" : "노트 저장"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AddNoteModal
