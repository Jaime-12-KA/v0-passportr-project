"use client"

import { type FC, useState, useEffect } from "react"
import {
  FaSyncAlt,
  FaFilter,
  FaBolt,
  FaMedal,
  FaCrown,
  FaStar,
  FaMapMarkerAlt,
  FaChevronRight,
  FaUtensils,
  FaLandmark,
  FaMapMarkedAlt, // Fix: Import FaMapMarkedAlt
} from "react-icons/fa"
import ChallengeCompletedModal from "./modals/challenge-completed-modal"
import Image from "next/image"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
// Add import for the new modal at the top of the file
import ChallengeDetailsModal from "./modals/challenge-details-modal"

interface ChallengesTabProps {
  currentLanguage: string
  onOpenModal: (modalId: string) => void
  onCafeQuestComplete?: () => void // Add this prop
}

const ChallengesTab: FC<ChallengesTabProps> = ({ currentLanguage, onOpenModal, onCafeQuestComplete }) => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [cafeQuestStarted, setCafeQuestStarted] = useState(false)
  const [cafeQuestCompleted, setCafeQuestCompleted] = useState(false)
  const [landmarkQuestStarted, setLandmarkQuestStarted] = useState(false)
  const [palaceQuestActive, setPalaceQuestActive] = useState(false)
  const [showChallengeCompletedModal, setShowChallengeCompletedModal] = useState(false)
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<{
    title: string
    description: string
    xp: number
    image?: string
  } | null>(null)
  // Add state for the challenge details modal
  const [showChallengeDetailsModal, setShowChallengeDetailsModal] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null)
  const [showFilterModal, setShowFilterModal] = useState(false)

  // Define challenge categories
  const categories = [
    { id: "all", name: currentLanguage === "en" ? "All" : "전체" },
    { id: "daily", name: currentLanguage === "en" ? "Daily" : "일일" },
    { id: "weekly", name: currentLanguage === "en" ? "Weekly" : "주간" },
    { id: "collections", name: currentLanguage === "en" ? "Collections" : "컬렉션" },
    { id: "city", name: currentLanguage === "en" ? "City" : "도시" },
    { id: "special", name: currentLanguage === "en" ? "Special" : "특별" },
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleStartCafeQuest = () => {
    setCafeQuestStarted(true)
    triggerHapticFeedback(hapticPatterns.medium)

    // Simulate quest completion after 2 seconds (for demo purposes)
    setTimeout(() => {
      setCafeQuestCompleted(true)
    }, 2000)
  }

  const handleStartLandmarkQuest = () => {
    setLandmarkQuestStarted(true)
    triggerHapticFeedback(hapticPatterns.medium)

    // Show notification
    const notification = document.createElement("div")
    notification.className =
      "fixed top-4 right-4 bg-sunset-coral text-white px-4 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 flex items-center"
    notification.innerHTML = `<i class="fas fa-camera mr-2"></i><span>${currentLanguage === "en" ? "Landmark challenge started! Find a landmark to check in." : "랜드마크 도전 시작! 체크인할 랜드마크를 찾으세요."}</span>`
    document.body.appendChild(notification)

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  // Update the handleViewPalaceDetails function
  const handleViewPalaceDetails = () => {
    setPalaceQuestActive(true)
    triggerHapticFeedback(hapticPatterns.medium)

    // Set the selected challenge and show the modal
    //setSelectedChallenge(cityChallenges[0]);
    //setShowChallengeDetailsModal(true);
    console.log("Palace tour details view is no longer available")
  }

  // Update the handleViewStreetFoodDetails function
  const handleViewStreetFoodDetails = () => {
    triggerHapticFeedback(hapticPatterns.medium)

    // Set the selected challenge and show the modal
    setSelectedChallenge(collectionChallenges[0])
    setShowChallengeDetailsModal(true)
  }

  // Update the handleViewHistoricalSitesDetails function
  const handleViewHistoricalSitesDetails = () => {
    triggerHapticFeedback(hapticPatterns.medium)

    // Set the selected challenge and show the modal
    setSelectedChallenge(collectionChallenges[1])
    setShowChallengeDetailsModal(true)
  }

  // Update the handleViewBangkokDetails function
  const handleViewBangkokDetails = () => {
    triggerHapticFeedback(hapticPatterns.medium)

    // Set the selected challenge and show the modal
    setSelectedChallenge(collectionChallenges[2])
    setShowChallengeDetailsModal(true)
  }

  const handleChallengeComplete = (title: string, description: string, xp: number, image?: string) => {
    setCurrentChallenge({
      title,
      description,
      xp,
      image,
    })
    setShowChallengeCompletedModal(true)
  }

  const handleCafeQuestComplete = () => {
    // Use the passed callback if it exists
    if (onCafeQuestComplete) {
      onCafeQuestComplete()
      return
    }

    // Otherwise, handle it locally
    handleChallengeComplete(
      currentLanguage === "en" ? "Visit a café today" : "오늘 카페 한 군데 방문하기",
      currentLanguage === "en" ? "You've checked in at a café in Seoul!" : "서울의 카페에서 체크인했습니다!",
      50,
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/challenge_cafe-tzdvKP9Rzx94gdVn12PQ4rusvLeopT.png",
    )
  }

  const handleFilterToggle = () => {
    setShowFilterOptions(!showFilterOptions)
    triggerHapticFeedback(hapticPatterns.light)
  }

  // Add filtering functionality based on the selected category
  const dailyChallenges = [
    {
      id: 1,
      title: currentLanguage === "en" ? "Visit a café today" : "오늘 카페 한 군데 방문하기",
      description: currentLanguage === "en" ? "Check in at any café in Seoul" : "서울의 어떤 카페에서든 체크인하세요",
      progress: cafeQuestCompleted ? "1/1" : "0/1",
      progressPercent: cafeQuestCompleted ? 100 : cafeQuestStarted ? 50 : 0,
      timeLeft: currentLanguage === "en" ? "8 hours" : "8시간",
      xp: 50,
      category: "daily",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/challenge_cafe-tzdvKP9Rzx94gdVn12PQ4rusvLeopT.png",
      started: cafeQuestStarted,
      completed: cafeQuestCompleted,
      onStart: handleStartCafeQuest,
      onComplete: handleCafeQuestComplete,
    },
    {
      id: 2,
      title: currentLanguage === "en" ? "Capture a landmark" : "랜드마크 촬영하기",
      description: currentLanguage === "en" ? "Check in at any famous landmark" : "유명한 랜드마크에서 체크인하세요",
      progress: "0/1",
      progressPercent: landmarkQuestStarted ? 30 : 0,
      timeLeft: currentLanguage === "en" ? "8 hours" : "8시간",
      xp: 75,
      category: "daily",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/challenge_capture-ZZ8dvViCDPPWznBCR9ImZZxvZAyRWI.png",
      started: landmarkQuestStarted,
      completed: false,
      onStart: handleStartLandmarkQuest,
      onComplete: null,
    },
  ]

  const weeklyChallenges = [
    {
      id: 3,
      title: currentLanguage === "en" ? "Seoul Dullegil Conquest" : "서울 둘레길 정복",
      description: currentLanguage === "en" ? "Complete 8 Seoul Dullegil Courses" : "서울 둘레길 코스 8개 완주",
      progress: "2/8",
      progressPercent: 25,
      timeLeft: currentLanguage === "en" ? "6 days" : "6일",
      xp: 250,
      badge: currentLanguage === "en" ? "Hiker Badge" : "하이커 배지",
      category: "weekly",
      image: "/images/hike2.png",
      started: true,
      completed: false,
      onStart: null,
      icon: <FaMapMarkedAlt className="text-white text-xl" />,
      onDetails: () => {
        setSelectedChallenge(weeklyChallenges[0])
        setShowChallengeDetailsModal(true)
      },
    },
  ]

  const cityChallenges = []

  const collectionChallenges = [
    {
      id: 5,
      title: currentLanguage === "en" ? "Seoul Street Food Tour" : "서울 길거리 음식 투어",
      description:
        currentLanguage === "en" ? "Visit 8 street food locations in Seoul" : "서울의 8개 길거리 음식점 방문하기",
      progress: "5/8",
      progressPercent: 62.5,
      difficulty: 2,
      xp: 400,
      badge: currentLanguage === "en" ? "Food Explorer" : "음식 탐험가",
      category: "collections",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/seoulstreetfood-5sqroWX9Er7PqmByuXWanySAUtz9CF.png",
      started: true,
      completed: false,
      onStart: null,
      onComplete: null,
      onDetails: handleViewStreetFoodDetails,
      icon: <FaUtensils className="text-white text-xl" />,
    },
    {
      id: 6,
      title: currentLanguage === "en" ? "Seoul Historical Sites" : "서울 역사 유적지",
      description:
        currentLanguage === "en" ? "Visit 6 historical landmarks in Seoul" : "서울의 6개 역사 유적지 방문하기",
      progress: "2/6",
      progressPercent: 33,
      difficulty: 3,
      xp: 300,
      badge: currentLanguage === "en" ? "History Buff" : "역사 애호가",
      category: "collections",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/challenge_seoulhistory-d5G5qk5nQob5o75uCNopN0UfCbVgsT.png",
      started: true,
      completed: false,
      onStart: null,
      onComplete: null,
      onDetails: handleViewHistoricalSitesDetails,
      icon: <FaLandmark className="text-white text-xl" />,
    },
    {
      id: 7,
      title: currentLanguage === "en" ? "Bangkok Taste & Style" : "방콕 맛과 멋",
      description:
        currentLanguage === "en" ? "Experience 7 unique locations in Bangkok" : "방콕의 7개 특별한 장소 경험하기",
      progress: "3/7",
      progressPercent: 43,
      difficulty: 3,
      xp: 350,
      badge: currentLanguage === "en" ? "Bangkok Explorer" : "방콕 탐험가",
      category: "collections",
      image: "/images/bangkok_challenge.png",
      started: true,
      completed: false,
      onStart: null,
      onComplete: null,
      onDetails: handleViewBangkokDetails,
      icon: <FaMapMarkedAlt className="text-white text-xl" />,
    },
  ]

  const specialChallenges = []

  // Filter challenges based on the selected category
  const getFilteredChallenges = () => {
    if (activeCategory === "all") {
      return [...dailyChallenges, ...weeklyChallenges, ...collectionChallenges, ...cityChallenges, ...specialChallenges]
    } else if (activeCategory === "daily") {
      return dailyChallenges
    } else if (activeCategory === "weekly") {
      return weeklyChallenges
    } else if (activeCategory === "collections") {
      return collectionChallenges
    } else if (activeCategory === "city") {
      return cityChallenges
    } else if (activeCategory === "special") {
      return specialChallenges
    }
    return []
  }

  const filteredChallenges = getFilteredChallenges()

  const handleShowNotification = (text: string) => {
    const notification = document.createElement("div")
    notification.className =
      "fixed top-4 right-4 bg-sky-blue text-white px-4 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 flex items-center"
    notification.innerHTML = `<span>${text}</span>`
    document.body.appendChild(notification)

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  return (
   <div id="challenges" className={`tab-content ${isVisible ? "active" : ""}`}>
     <ChallengeCompletedModal
       isOpen={showChallengeCompletedModal}
       onClose={() => setShowChallengeCompletedModal(false)}
       currentLanguage={currentLanguage}
       challengeTitle={currentChallenge?.title}
       challengeDescription={currentChallenge?.description}
       xpReward={currentChallenge?.xp}
       challengeImage={currentChallenge?.image} // Fix: Use currentChallenge?.image
     />
     {/* Add the ChallengeDetailsModal component to the JSX */}
     {/* Add this right after the ChallengeCompletedModal component */}
     <ChallengeDetailsModal
       isOpen={showChallengeDetailsModal}
       onClose={() => setShowChallengeDetailsModal(false)}
       currentLanguage={currentLanguage}
       challenge={selectedChallenge}
     />

     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
       <div>
         <h2 className="text-xl sm:text-2xl font-bold serif-font">
           {currentLanguage === "en" ? "Challenges" : "도전 과제"}
         </h2>
         <p className="text-stone-gray text-sm sm:text-base">
           {currentLanguage === "en"
             ? "Complete challenges to earn rewards and XP"
             : "도전 과제를 완료하고 보상과 XP를 획득하세요"}
         </p>
       </div>
       <div className="flex space-x-2">
         <button
           className="px-3 py-2 sm:px-4 sm:py-2 bg-sky-blue text-cloud-white rounded-lg btn-effect text-sm sm:text-base"
           onClick={() => {
             triggerHapticFeedback(hapticPatterns.medium)
             handleShowNotification(currentLanguage === "en" ? "Finding nearby locations..." : "주변 위치 찾는 중...")
           }}
         >
           <FaSyncAlt className="inline mr-1" />
           <span>{currentLanguage === "en" ? "Refresh" : "새로고침"}</span>
         </button>
         <button
           className="px-3 py-2 sm:px-4 sm:py-2 bg-light-sand text-deep-navy rounded-lg btn-effect text-sm sm:text-base"
           onClick={() => {
             triggerHapticFeedback(hapticPatterns.light)
             setShowFilterModal(!showFilterModal)
           }}
         >
           <FaFilter className="inline mr-1" />
           <span>{currentLanguage === "en" ? "Filter" : "필터"}</span>
         </button>
       </div>
     </div>

     {showFilterOptions && (
       <div className="bg-light-sand rounded-lg p-4 mb-4">
         <h3 className="font-medium mb-2">{currentLanguage === "en" ? "Filter Challenges" : "도전 과제 필터링"}</h3>
         <div className="flex flex-wrap gap-2">
           {categories.map((category) => (
             <button
               key={category.id}
               className={`px-4 py-2 rounded-lg text-sm ${
                 activeCategory === category.id ? "bg-sky-blue text-white" : "bg-cloud-white text-deep-navy"
               }`}
               onClick={() => {
                 setActiveCategory(category.id)
                 triggerHapticFeedback(hapticPatterns.light)
               }}
             >
               {category.name}
             </button>
           ))}
         </div>
       </div>
     )}

     {activeCategory === "collections" && (
       <div className="bg-light-sand rounded-lg p-4 mb-4">
         <div className="flex items-center mb-3">
           <FaMapMarkedAlt className="text-sunset-coral mr-2" />
           <h3 className="font-bold">{currentLanguage === "en" ? "Collection Quests" : "컬렉션 퀘스트"}</h3>
         </div>
         <p className="text-sm text-stone-gray mb-2">
           {currentLanguage === "en"
             ? "Visit themed locations to complete your collection and earn special rewards."
             : "테마별 장소를 방문하여 컬렉션을 완성하고 특별한 보상을 받으세요."}
         </p>
         <div className="flex justify-between items-center text-xs">
           <span className="text-deep-navy font-medium">
             {currentLanguage === "en" ? "Active Collections: 3" : "활성 컬렉션: 3"}
           </span>
           <button
             className="text-sky-blue hover:underline flex items-center"
             onClick={() => {
               if (onOpenModal) onOpenModal("newCollectionModal")
               triggerHapticFeedback(hapticPatterns.light)
             }}
           >
             {currentLanguage === "en" ? "Browse All Collections" : "모든 컬렉션 보기"}
             <FaChevronRight className="ml-1 text-xs" />
           </button>
         </div>
       </div>
     )}

     <div className="grid grid-cols-1 gap-4 mb-6">
       {filteredChallenges.map((challenge) => (
         <div key={challenge.id} className="bg-cloud-white p-3 sm:p-4 rounded-lg border border-light-sand">
           {/* 도전과제 카드의 텍스트 색상 개선 */}
           <div className="flex flex-col sm:flex-row sm:items-start">
             <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 mx-auto sm:mx-0 overflow-hidden">
               {challenge.image ? (
                 <Image
                   src={challenge.image || "/placeholder.svg"}
                   alt={challenge.title}
                   width={64}
                   height={64}
                   className="w-full h-full object-cover"
                   onError={(e: any) => {
                     e.target.src = "/placeholder.svg?key=quqv4"
                   }}
                 />
               ) : (
                 // Render a placeholder with the appropriate icon based on challenge type
                 <div
                   className={`w-16 h-16 ${
                     challenge.category === "daily"
                       ? "bg-sunshine-yellow"
                       : challenge.category === "weekly"
                         ? "bg-sky-blue"
                         : challenge.category === "collections"
                           ? "bg-sunset-coral"
                           : "bg-deep-navy"
                   } rounded-full flex items-center justify-center`}
                 >
                   {challenge.icon ||
                     (challenge.category === "collections" ? (
                       <FaMapMarkedAlt className="text-white text-xl" />
                     ) : challenge.title.toLowerCase().includes("food") ? (
                       <FaUtensils className="text-white text-xl" />
                     ) : challenge.title.toLowerCase().includes("landmark") ||
                       challenge.title.toLowerCase().includes("palace") ? (
                       <FaLandmark className="text-white text-xl" />
                     ) : (
                       <FaMapMarkerAlt className="text-white text-xl" />
                     ))}
                 </div>
               )}
             </div>
             <div className="flex-1">
               <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-2">
                 <div className="text-center sm:text-left mb-2 sm:mb-0">
                   <h3 className="font-bold text-lg text-deep-navy">{challenge.title}</h3>
                   <p className="text-stone-gray text-sm">{challenge.description}</p>
                 </div>
                 <span
                   className={`px-2 py-1 ${
                     challenge.category === "daily"
                       ? "bg-sunshine-yellow text-deep-navy"
                       : challenge.category === "weekly"
                         ? "bg-sky-blue text-white"
                         : challenge.category === "collections"
                           ? "bg-sunset-coral text-white"
                           : challenge.category === "city"
                             ? "bg-deep-navy text-white"
                             : "bg-sunset-coral text-white"
                   } text-xs font-bold rounded`}
                 >
                   {challenge.category === "daily"
                     ? currentLanguage === "en"
                       ? "DAILY"
                       : "일일"
                     : challenge.category === "weekly"
                       ? currentLanguage === "en"
                         ? "WEEKLY"
                         : "주간"
                       : challenge.category === "collections"
                         ? currentLanguage === "en"
                           ? "COLLECTION"
                           : "컬렉션"
                         : challenge.category === "city"
                           ? currentLanguage === "en"
                             ? "CITY"
                             : "도시"
                           : currentLanguage === "en"
                             ? "SPECIAL"
                             : "특별"}
                 </span>
               </div>

               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                 <div className="w-full sm:w-auto mb-2 sm:mb-0">
                   <p className="text-sm text-stone-gray mb-1">{currentLanguage === "en" ? "Progress" : "진행"}</p>
                   <div className="flex items-center">
                     <div className="progress-bar w-32 mr-3">
                       <div
                         className="progress-fill bg-sunset-coral"
                         style={{ width: `${challenge.progressPercent}%` }}
                       ></div>
                     </div>
                     <span className="text-sm text-deep-navy">{challenge.progress}</span>
                   </div>
                 </div>
                 <div className="w-full sm:w-auto">
                   {challenge.timeLeft ? (
                     <>
                       <p className="text-sm text-stone-gray mb-1">
                         {currentLanguage === "en" ? "Time Left" : "남은 시간"}
                       </p>
                       <p className="font-medium text-deep-navy">{challenge.timeLeft}</p>
                     </>
                   ) : challenge.difficulty ? (
                     <>
                       <p className="text-sm text-stone-gray mb-1">
                         {currentLanguage === "en" ? "Difficulty" : "난이도"}
                       </p>
                       <div className="flex">
                         {Array.from({ length: 5 }).map((_, i) => (
                           <FaStar
                             key={i}
                             className={i < challenge.difficulty ? "text-sunshine-yellow" : "text-stone-gray"}
                           />
                         ))}
                       </div>
                     </>
                   ) : null}
                 </div>
               </div>
             </div>
           </div>

           <div className="flex flex-col sm:flex-row justify-between items-center">
             <div className="flex items-center mb-3 sm:mb-0">
               <div className="w-8 h-8 bg-sky-blue rounded-full flex items-center justify-center mr-2">
                 <FaBolt className="text-cloud-white text-sm" />
               </div>
               <span className="font-medium">+{challenge.xp} XP</span>

               {challenge.badge && (
                 <div className="flex items-center ml-2">
                   <div className="w-8 h-8 bg-sunshine-yellow rounded-full flex items-center justify-center mr-2">
                     <FaMedal className="text-deep-navy text-sm" />
                   </div>
                   <span className="font-medium">{challenge.badge}</span>
                 </div>
               )}

               {challenge.specialReward && (
                 <div className="flex items-center ml-2">
                   <div className="w-8 h-8 bg-sunshine-yellow rounded-full flex items-center justify-center mr-2">ll flex items-center justify-center mr-2">
                     <FaCrown className="text-deep-navy text-sm" />
                   </div>
                   <span className="font-medium whitespace-nowrap">{challenge.specialReward}</span>
                 </div>
               )}
             </div>

             {challenge.completed ? (
               
                 
               
             ) : challenge.onDetails ? (
               <button
                 className="w-full sm:w-auto px-4 py-2 bg-green-500 text-cloud-white rounded-lg btn-effect whitespace-nowrap"
                 onClick={challenge.onComplete}
               >
                 {currentLanguage === "en" ? "Claim Reward" : "보상 받기"}
               </button>
             ) : challenge.onDetails ? (
               <button
                 className="w-full sm:w-auto px-4 py-2 bg-deep-navy text-cloud-white rounded-lg btn-effect whitespace-nowrap"
                 onClick={challenge.onDetails}
               >
                 {currentLanguage === "en" ? "View Details" : "세부 정보 보기"}
               </button>
             ) : challenge.onStart ? (
               <button
                 className="w-full sm:w-auto px-4 py-2 bg-sunset-coral text-cloud-white rounded-lg btn-effect whitespace-nowrap"
                 onClick={challenge.onStart}
                 disabled={challenge.started && !challenge.onComplete}
               >
                 {challenge.started && !challenge.onComplete
                   ? currentLanguage === "en"
                     ? "In Progress..."
                     : "진행 중..."
                   : challenge.onComplete
                     ? currentLanguage === "en"
                       ? "Continue"
                       : "계속하기"
                     : currentLanguage === "en"
                       ? "Start Challenge"
                       : "도전 시작"}
               </button>
             ) : (
               <></>
             )}
           </div>
         </div>
       ))}
     </div>
   </div>
 )
}

// Helper function to show notifications
const handleShowNotification = (text: string) => {
  // This is a placeholder - the actual implementation would be in the parent component
  console.log("Notification:", text)
}

export default ChallengesTab
