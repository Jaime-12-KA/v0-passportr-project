"use client"

import { useState } from "react"
import PassportMain from "./passport-main"
import CitySection from "./city-section"

interface PassportTabProps {
  currentLanguage: string
  onOpenModal: (modalId: string) => void
}

const PassportTab = ({ currentLanguage, onOpenModal }: PassportTabProps) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId)
  }

  const handleBackToMain = () => {
    setSelectedCity(null)
  }

  return (
    <div
      id="passport"
      className="tab-content active passport-tab-container pb-16 tab-container"
      style={{ minHeight: "calc(var(--app-height, 100vh) - 120px)" }}
    >
      {selectedCity ? (
        <CitySection cityId={selectedCity} currentLanguage={currentLanguage} onBack={handleBackToMain} />
      ) : (
        <PassportMain currentLanguage={currentLanguage} onCitySelect={handleCitySelect} onOpenModal={onOpenModal} />
      )}
    </div>
  )
}

export default PassportTab
