"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaTimes,
  FaPlus,
  FaUtensils,
  FaCamera,
  FaLandmark,
  FaHiking,
  FaMapMarkerAlt,
  FaTrash,
  FaImage,
} from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import Image from "next/image"

interface CreateExplorationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (exploration: any) => void
  currentLanguage: string
}

interface ExplorationStep {
  id: string
  title: {
    en: string
    kr: string
  }
  description?: {
    en: string
    kr: string
  }
  image?: string
  completed: boolean
}

const CreateExplorationModal: React.FC<CreateExplorationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentLanguage,
}) => {
  const [activeTab, setActiveTab] = useState("basic") // basic, steps, items
  const [title, setTitle] = useState({ en: "", kr: "" })
  const [description, setDescription] = useState({ en: "", kr: "" })
  const [category, setCategory] = useState("food")
  const [steps, setSteps] = useState<ExplorationStep[]>([])
  const [requiredItems, setRequiredItems] = useState({ en: [""], kr: [""] })
  const [estimatedTime, setEstimatedTime] = useState({ en: "2-3 hours", kr: "2-3시간" })
  const [reward, setReward] = useState({ en: "Custom Explorer Badge", kr: "커스텀 탐험가 배지" })
  const [tempImage, setTempImage] = useState("/placeholder.svg")
  const [currentStep, setCurrentStep] = useState<ExplorationStep | null>(null)
  const [isEditingStep, setIsEditingStep] = useState(false)
  const [stepIndex, setStepIndex] = useState(-1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTabChange = (tab: string) => {
    triggerHapticFeedback(hapticPatterns.light)
    setActiveTab(tab)
  }

  const handleAddStep = () => {
    setIsEditingStep(true)
    setCurrentStep({
      id: `step-${Date.now()}`,
      title: { en: "", kr: "" },
      description: { en: "", kr: "" },
      image: "/placeholder.svg",
      completed: false,
    })
    setStepIndex(-1)
  }

  const handleEditStep = (index: number) => {
    setIsEditingStep(true)
    setCurrentStep({ ...steps[index] })
    setStepIndex(index)
  }

  const handleDeleteStep = (index: number) => {
    triggerHapticFeedback(hapticPatterns.medium)
    const newSteps = [...steps]
    newSteps.splice(index, 1)
    setSteps(newSteps)
  }

  const handleSaveStep = () => {
    if (!currentStep || !currentStep.title.en || !currentStep.title.kr) return

    const newSteps = [...steps]
    if (stepIndex >= 0) {
      newSteps[stepIndex] = currentStep
    } else {
      newSteps.push(currentStep)
    }
    setSteps(newSteps)
    setIsEditingStep(false)
    setCurrentStep(null)
  }

  const handleAddRequiredItem = (language: "en" | "kr") => {
    const newItems = { ...requiredItems }
    newItems[language] = [...newItems[language], ""]
    setRequiredItems(newItems)
  }

  const handleRemoveRequiredItem = (language: "en" | "kr", index: number) => {
    const newItems = { ...requiredItems }
    newItems[language] = newItems[language].filter((_, i) => i !== index)
    setRequiredItems(newItems)
  }

  const handleRequiredItemChange = (language: "en" | "kr", index: number, value: string) => {
    const newItems = { ...requiredItems }
    newItems[language][index] = value
    setRequiredItems(newItems)
  }

  const handleSaveExploration = () => {
    if (!title.en || !title.kr || !description.en || !description.kr || steps.length === 0) {
      alert(
        currentLanguage === "en"
          ? "Please fill in all required fields and add at least one step"
          : "모든 필수 필드를 입력하고 최소 하나의 단계를 추가하세요",
      )
      return
    }

    const newExploration = {
      id: `custom-${Date.now()}`,
      title,
      description,
      image: tempImage,
      progress: 0,
      totalSteps: steps.length,
      reward,
      category,
      difficulty: "medium",
      steps,
      requiredItems,
      estimatedTime,
      isCustom: true,
    }

    triggerHapticFeedback(hapticPatterns.success)
    onSave(newExploration)
    onClose()
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          if (isEditingStep && currentStep) {
            setCurrentStep({
              ...currentStep,
              image: event.target.result as string,
            })
          } else {
            setTempImage(event.target.result as string)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {currentLanguage === "en" ? "Create New Exploration" : "새 탐험 만들기"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              <FaTimes />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === "basic" ? "border-b-2 border-brand-blue font-medium" : "text-gray-500"
              }`}
              onClick={() => handleTabChange("basic")}
            >
              {currentLanguage === "en" ? "Basic Info" : "기본 정보"}
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === "steps" ? "border-b-2 border-brand-blue font-medium" : "text-gray-500"
              }`}
              onClick={() => handleTabChange("steps")}
            >
              {currentLanguage === "en" ? "Steps" : "단계"}
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === "items" ? "border-b-2 border-brand-blue font-medium" : "text-gray-500"
              }`}
              onClick={() => handleTabChange("items")}
            >
              {currentLanguage === "en" ? "Details" : "세부사항"}
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Cover Image" : "커버 이미지"}
                  </label>
                  <div
                    className="relative h-40 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onClick={handleImageUpload}
                  >
                    <Image src={tempImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity">
                      <FaImage className="text-white text-2xl" />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Title (English)" : "제목 (영어)"}
                  </label>
                  <input
                    type="text"
                    value={title.en}
                    onChange={(e) => setTitle({ ...title, en: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder={currentLanguage === "en" ? "Enter title in English" : "영어로 제목 입력"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Title (Korean)" : "제목 (한국어)"}
                  </label>
                  <input
                    type="text"
                    value={title.kr}
                    onChange={(e) => setTitle({ ...title, kr: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder={currentLanguage === "en" ? "Enter title in Korean" : "한국어로 제목 입력"}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Description (English)" : "설명 (영어)"}
                  </label>
                  <textarea
                    value={description.en}
                    onChange={(e) => setDescription({ ...description, en: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder={currentLanguage === "en" ? "Enter description in English" : "영어로 설명 입력"}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Description (Korean)" : "설명 (한국어)"}
                  </label>
                  <textarea
                    value={description.kr}
                    onChange={(e) => setDescription({ ...description, kr: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder={currentLanguage === "en" ? "Enter description in Korean" : "한국어로 설명 입력"}
                  ></textarea>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Category" : "카테고리"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`flex items-center justify-center p-2 rounded-md ${
                        category === "food" ? "bg-orange-500 text-white" : "bg-gray-100"
                      }`}
                      onClick={() => setCategory("food")}
                    >
                      <FaUtensils className="mr-2" />
                      {currentLanguage === "en" ? "Food" : "음식"}
                    </button>
                    <button
                      className={`flex items-center justify-center p-2 rounded-md ${
                        category === "culture" ? "bg-purple-500 text-white" : "bg-gray-100"
                      }`}
                      onClick={() => setCategory("culture")}
                    >
                      <FaLandmark className="mr-2" />
                      {currentLanguage === "en" ? "Culture" : "문화"}
                    </button>
                    <button
                      className={`flex items-center justify-center p-2 rounded-md ${
                        category === "photography" ? "bg-blue-500 text-white" : "bg-gray-100"
                      }`}
                      onClick={() => setCategory("photography")}
                    >
                      <FaCamera className="mr-2" />
                      {currentLanguage === "en" ? "Photography" : "사진"}
                    </button>
                    <button
                      className={`flex items-center justify-center p-2 rounded-md ${
                        category === "nature" ? "bg-green-500 text-white" : "bg-gray-100"
                      }`}
                      onClick={() => setCategory("nature")}
                    >
                      <FaHiking className="mr-2" />
                      {currentLanguage === "en" ? "Nature" : "자연"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Steps Tab */}
            {activeTab === "steps" && !isEditingStep && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">{currentLanguage === "en" ? "Exploration Steps" : "탐험 단계"}</h3>
                  <button
                    className="flex items-center text-sm bg-brand-blue text-white px-3 py-1 rounded-md"
                    onClick={handleAddStep}
                  >
                    <FaPlus className="mr-1" />
                    {currentLanguage === "en" ? "Add Step" : "단계 추가"}
                  </button>
                </div>

                {steps.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="mx-auto text-gray-400 text-3xl mb-2" />
                    <p className="text-gray-500">
                      {currentLanguage === "en"
                        ? "No steps added yet. Add steps to your exploration."
                        : "아직 단계가 추가되지 않았습니다. 탐험에 단계를 추가하세요."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex items-center p-3 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 relative">
                          <Image
                            src={step.image || "/placeholder.svg"}
                            alt={currentLanguage === "en" ? step.title.en : step.title.kr}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{currentLanguage === "en" ? step.title.en : step.title.kr}</p>
                          {step.description && (
                            <p className="text-xs text-gray-500">
                              {currentLanguage === "en" ? step.description.en : step.description.kr}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-brand-blue" onClick={() => handleEditStep(index)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-red-500" onClick={() => handleDeleteStep(index)}>
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step Edit Form */}
            {activeTab === "steps" && isEditingStep && currentStep && (
              <div className="space-y-4">
                <h3 className="font-medium">
                  {currentLanguage === "en"
                    ? stepIndex >= 0
                      ? "Edit Step"
                      : "Add New Step"
                    : stepIndex >= 0
                      ? "단계 수정"
                      : "새 단계 추가"}
                </h3>

                {/* Step Image */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Step Image" : "단계 이미지"}
                  </label>
                  <div
                    className="relative h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onClick={handleImageUpload}
                  >
                    <Image src={currentStep.image || "/placeholder.svg"} alt="Step" fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity">
                      <FaImage className="text-white text-2xl" />
                    </div>
                  </div>
                </div>

                {/* Step Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Step Title (English)" : "단계 제목 (영어)"}
                  </label>
                  <input
                    type="text"
                    value={currentStep.title.en}
                    onChange={(e) =>
                      setCurrentStep({
                        ...currentStep,
                        title: { ...currentStep.title, en: e.target.value },
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    placeholder={currentLanguage === "en" ? "Enter step title in English" : "영어로 단계 제목 입력"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Step Title (Korean)" : "단계 제목 (한국어)"}
                  </label>
                  <input
                    type="text"
                    value={currentStep.title.kr}
                    onChange={(e) =>
                      setCurrentStep({
                        ...currentStep,
                        title: { ...currentStep.title, kr: e.target.value },
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    placeholder={currentLanguage === "en" ? "Enter step title in Korean" : "한국어로 단계 제목 입력"}
                  />
                </div>

                {/* Step Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Step Description (English)" : "단계 설명 (영어)"}
                  </label>
                  <textarea
                    value={currentStep.description?.en || ""}
                    onChange={(e) =>
                      setCurrentStep({
                        ...currentStep,
                        description: {
                          ...(currentStep.description || { en: "", kr: "" }),
                          en: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    placeholder={
                      currentLanguage === "en" ? "Enter step description in English" : "영어로 단계 설명 입력"
                    }
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Step Description (Korean)" : "단계 설명 (한국어)"}
                  </label>
                  <textarea
                    value={currentStep.description?.kr || ""}
                    onChange={(e) =>
                      setCurrentStep({
                        ...currentStep,
                        description: {
                          ...(currentStep.description || { en: "", kr: "" }),
                          kr: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    placeholder={
                      currentLanguage === "en" ? "Enter step description in Korean" : "한국어로 단계 설명 입력"
                    }
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md"
                    onClick={() => {
                      setIsEditingStep(false)
                      setCurrentStep(null)
                    }}
                  >
                    {currentLanguage === "en" ? "Cancel" : "취소"}
                  </button>
                  <button className="flex-1 py-2 bg-brand-blue text-white rounded-md" onClick={handleSaveStep}>
                    {currentLanguage === "en" ? "Save Step" : "단계 저장"}
                  </button>
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "items" && (
              <div className="space-y-4">
                {/* Required Items */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                      {currentLanguage === "en" ? "Required Items (English)" : "준비물 (영어)"}
                    </label>
                    <button
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                      onClick={() => handleAddRequiredItem("en")}
                    >
                      <FaPlus className="inline mr-1" />
                      {currentLanguage === "en" ? "Add" : "추가"}
                    </button>
                  </div>
                  {requiredItems.en.map((item, index) => (
                    <div key={`en-${index}`} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleRequiredItemChange("en", index, e.target.value)}
                        className="flex-1 p-2 border rounded-md"
                        placeholder={currentLanguage === "en" ? "Enter item" : "항목 입력"}
                      />
                      <button className="ml-2 text-red-500" onClick={() => handleRemoveRequiredItem("en", index)}>
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                      {currentLanguage === "en" ? "Required Items (Korean)" : "준비물 (한국어)"}
                    </label>
                    <button
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                      onClick={() => handleAddRequiredItem("kr")}
                    >
                      <FaPlus className="inline mr-1" />
                      {currentLanguage === "en" ? "Add" : "추가"}
                    </button>
                  </div>
                  {requiredItems.kr.map((item, index) => (
                    <div key={`kr-${index}`} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleRequiredItemChange("kr", index, e.target.value)}
                        className="flex-1 p-2 border rounded-md"
                        placeholder={currentLanguage === "en" ? "Enter item" : "항목 입력"}
                      />
                      <button className="ml-2 text-red-500" onClick={() => handleRemoveRequiredItem("kr", index)}>
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Estimated Time */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Estimated Time (English)" : "예상 소요시간 (영어)"}
                  </label>
                  <input
                    type="text"
                    value={estimatedTime.en}
                    onChange={(e) => setEstimatedTime({ ...estimatedTime, en: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder={currentLanguage === "en" ? "e.g. 2-3 hours" : "예: 2-3 hours"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Estimated Time (Korean)" : "예상 소요시간 (한국어)"}
                  </label>
                  <input
                    type="text"
                    value={estimatedTime.kr}
                    onChange={(e) => setEstimatedTime({ ...estimatedTime, kr: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder={currentLanguage === "en" ? "e.g. 2-3시간" : "예: 2-3시간"}
                  />
                </div>

                {/* Reward */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Reward (English)" : "보상 (영어)"}
                  </label>
                  <input
                    type="text"
                    value={reward.en}
                    onChange={(e) => setReward({ ...reward, en: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder={currentLanguage === "en" ? "e.g. Custom Explorer Badge" : "예: Custom Explorer Badge"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentLanguage === "en" ? "Reward (Korean)" : "보상 (한국어)"}
                  </label>
                  <input
                    type="text"
                    value={reward.kr}
                    onChange={(e) => setReward({ ...reward, kr: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder={currentLanguage === "en" ? "e.g. 커스텀 탐험가 배지" : "예: 커스텀 탐험가 배지"}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              {currentLanguage === "en" ? "Cancel" : "취소"}
            </Button>
            <Button variant="primary" onClick={handleSaveExploration}>
              {currentLanguage === "en" ? "Save Exploration" : "탐험 저장"}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default CreateExplorationModal
