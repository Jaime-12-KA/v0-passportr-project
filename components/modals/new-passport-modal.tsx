"use client"

import type React from "react"

import { useState } from "react"
import { FaTimes, FaGlobeAsia, FaMapMarkedAlt, FaPassport } from "react-icons/fa"

interface NewPassportModalProps {
  isOpen: boolean
  onClose: () => void
  currentLanguage: string
  activePassports?: string[] // Array of active passport IDs
  onAddPassport: (passportId: string) => void
}

const NewPassportModal: React.FC<NewPassportModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  activePassports = [],
  onAddPassport,
}) => {
  const [step, setStep] = useState(1)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  if (!isOpen) return null

  // Add default active passports for Seoul, Busan, Jeju, and Bangkok
  const defaultActivePassports = ["seoul", "busan", "jeju", "bangkok"]

  // Combine with any user-provided active passports
  const allActivePassports = [...new Set([...defaultActivePassports, ...activePassports])]

  // Only show cities that are not already active
  const cities = [
    {
      id: "london",
      name: currentLanguage === "en" ? "London" : "런던",
      country: currentLanguage === "en" ? "United Kingdom" : "영국",
      image: "/images/london-passport-cover.png",
      description:
        currentLanguage === "en"
          ? "Discover the historic landmarks and vibrant neighborhoods of England's capital"
          : "영국 수도의 역사적인 랜드마크와 활기찬 동네를 발견하세요",
      comingSoon: true,
    },
    {
      id: "shanghai",
      name: currentLanguage === "en" ? "Shanghai" : "상하이",
      country: currentLanguage === "en" ? "China" : "중국",
      image: "/images/shanghai-passport-cover.png",
      description:
        currentLanguage === "en"
          ? "Experience the perfect blend of tradition and futuristic innovation in China's largest city"
          : "중국 최대 도시의 전통과 미래 혁신이 완벽하게 조화된 모습을 경험하세요",
      comingSoon: true,
    },
  ].filter((city) => !allActivePassports.includes(city.id))

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId)
    setStep(2)
  }

  const handleCreatePassport = () => {
    if (selectedCity) {
      onAddPassport(selectedCity)
    }
    onClose()
  }

  const renderStep1 = () => (
    <>
      <h2 className="text-2xl font-bold serif-font mb-4">
        {currentLanguage === "en" ? "Choose Your Destination" : "목적지를 선택하세요"}
      </h2>
      <p className="text-stone-gray mb-6">
        {currentLanguage === "en"
          ? "Select a city to create your new digital passport"
          : "새로운 디지털 여권을 만들 도시를 선택하세요"}
      </p>

      {/* Show available cities */}
      {cities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-h-[50vh] overflow-y-auto pb-2">
          {cities.map((city) => (
            <div
              key={city.id}
              className={`border border-light-sand rounded-lg overflow-hidden transition-all hover:shadow-md ${
                city.comingSoon ? "cursor-default" : "cursor-pointer"
              }`}
              onClick={() => !city.comingSoon && handleCitySelect(city.id)}
            >
              <div className="h-40 relative">
                <img src={city.image || "/placeholder.svg"} alt={city.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>

                {city.comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-deep-navy bg-opacity-70 text-white px-4 py-2 rounded-lg font-bold transform rotate-12 shadow-lg">
                      {currentLanguage === "en" ? "COMING SOON" : "출시 예정"}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 p-4 text-cloud-white">
                  <h3 className="font-bold text-lg">{city.name}</h3>
                  {city.country && <p className="text-sm">{city.country}</p>}
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm">{city.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-light-sand rounded-lg mb-6">
          <FaPassport className="text-stone-gray text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">
            {currentLanguage === "en" ? "All Passports Created" : "모든 여권이 생성됨"}
          </h3>
          <p className="text-stone-gray">
            {currentLanguage === "en"
              ? "You've already created passports for all available cities."
              : "사용 가능한 모든 도시에 대한 여권을 이미 만들었습니다."}
          </p>
        </div>
      )}
    </>
  )

  const renderStep2 = () => {
    const selectedCityData = cities.find((city) => city.id === selectedCity)

    return (
      <>
        <h2 className="text-2xl font-bold serif-font mb-4">
          {currentLanguage === "en" ? "Confirm Your Passport" : "여권 확인"}
        </h2>

        <div className="bg-light-sand p-4 rounded-lg mb-6 max-h-[50vh] overflow-y-auto">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img
                src={selectedCityData?.image || "/placeholder.svg"}
                alt={selectedCityData?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{selectedCityData?.name}</h3>
              <p className="text-sm text-stone-gray">{selectedCityData?.country}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-stone-gray mb-1">
              {currentLanguage === "en" ? "Passport Benefits:" : "여권 혜택:"}
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-center">
                <FaMapMarkedAlt className="text-sky-blue mr-2 flex-shrink-0" />
                <span>
                  {currentLanguage === "en" ? "Access to exclusive check-in locations" : "독점 체크인 장소에 대한 접근"}
                </span>
              </li>
              <li className="flex items-center">
                <FaPassport className="text-sunset-coral mr-2 flex-shrink-0" />
                <span>
                  {currentLanguage === "en"
                    ? "Collect unique stamps for each location"
                    : "각 장소에 대한 고유한 스탬프 수집"}
                </span>
              </li>
              <li className="flex items-center">
                <FaGlobeAsia className="text-sunshine-yellow mr-2 flex-shrink-0" />
                <span>
                  {currentLanguage === "en" ? "City-specific challenges and rewards" : "도시별 도전 과제 및 보상"}
                </span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-stone-gray">
            {currentLanguage === "en"
              ? "Your passport will be valid for 5 years from the date of issue."
              : "여권은 발급일로부터 5년간 유효합니다."}
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            className="flex-1 py-3 bg-light-sand text-deep-navy rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            onClick={() => setStep(1)}
          >
            {currentLanguage === "en" ? "Back" : "뒤로"}
          </button>
          <button
            className="flex-1 py-3 bg-sky-blue text-brand-blue rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            onClick={handleCreatePassport}
          >
            {currentLanguage === "en" ? "Create Passport" : "여권 만들기"}
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="modal active">
      <div className="popup p-6 max-w-lg w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 z-10 flex justify-between items-center mb-4 bg-cloud-white">
          <div className="w-10 h-10 bg-sky-blue rounded-full flex items-center justify-center">
            <FaPassport className="text-white" />
          </div>
          <button
            onClick={onClose}
            className="hover-effect w-10 h-10 flex items-center justify-center bg-light-sand rounded-full"
          >
            <FaTimes className="text-stone-gray" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] pr-1">{step === 1 ? renderStep1() : renderStep2()}</div>
      </div>
    </div>
  )
}

export default NewPassportModal
