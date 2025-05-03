"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  FaArrowLeft,
  FaTrophy,
  FaBolt,
  FaCheck,
  FaMapMarkerAlt,
  FaUtensils,
  FaLandmark,
  FaCamera,
  FaHiking,
  FaCalendarAlt,
  FaStar,
} from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

// Update the Challenge interface to include a steps array with completed status
interface Challenge {
  id: string
  title: {
    en: string
    kr: string
  }
  description: {
    en: string
    kr: string
  }
  image: string
  progress: number
  totalSteps: number
  reward: {
    en: string
    kr: string
  }
  category: string
  difficulty: "easy" | "medium" | "hard"
  expiresIn?: number
  isNew?: boolean
  isCompleted?: boolean
  badgeImage?: string // Add badgeImage property
  steps?: Array<{
    id: string
    title: { en: string; kr: string }
    description?: { en: string; kr: string }
    image?: string
    completed: boolean
  }>
}

export default function ChallengeDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(true)
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false)

  // Add a helper function to update localStorage with step completion
  const updateStepCompletionInStorage = (challengeId: string, stepId: string, isCompleted: boolean) => {
    const savedSteps = localStorage.getItem("completedSteps") || "{}"
    const completedSteps = JSON.parse(savedSteps)

    if (!completedSteps[challengeId]) {
      completedSteps[challengeId] = {}
    }

    completedSteps[challengeId][stepId] = isCompleted
    localStorage.setItem("completedSteps", JSON.stringify(completedSteps))

    return completedSteps
  }

  // Add a function to handle step completion
  const handleStepToggle = (stepId: string) => {
    if (!challenge) return

    triggerHapticFeedback(hapticPatterns.medium)

    // Create a copy of the challenge with the updated step
    const updatedSteps =
      challenge.steps?.map((step) => (step.id === stepId ? { ...step, completed: !step.completed } : step)) || []

    // Count completed steps
    const completedStepsCount = updatedSteps.filter((step) => step.completed).length

    // Update challenge with new steps and progress
    const updatedChallenge = {
      ...challenge,
      steps: updatedSteps,
      progress: completedStepsCount,
      isCompleted: completedStepsCount === challenge.totalSteps,
    }

    setChallenge(updatedChallenge)

    // Save to localStorage
    updateStepCompletionInStorage(challenge.id, stepId, !challenge.steps?.find((s) => s.id === stepId)?.completed)

    // If all steps are completed, mark the challenge as completed
    if (completedStepsCount === challenge.totalSteps && !challenge.isCompleted) {
      handleCompleteChallenge()
    } else if (completedStepsCount < challenge.totalSteps && challenge.isCompleted) {
      // If a step is unchecked and the challenge was completed, mark it as incomplete
      const savedChallenges = localStorage.getItem("completedChallenges")
      if (savedChallenges) {
        const completedChallenges = JSON.parse(savedChallenges)
        delete completedChallenges[challenge.id]
        localStorage.setItem("completedChallenges", JSON.stringify(completedChallenges))
      }
    }
  }

  // Update the useEffect to load step completion status
  useEffect(() => {
    // Load language setting from localStorage
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage === "ko" ? "kr" : savedLanguage)
    }

    // Load challenge data based on ID
    const challengeData = getChallengeById(params.id)

    // Load completed steps from localStorage
    const savedSteps = localStorage.getItem("completedSteps")
    if (savedSteps && challengeData) {
      const completedSteps = JSON.parse(savedSteps)
      if (completedSteps[challengeData.id]) {
        // Update steps with completion status
        const updatedSteps =
          challengeData.steps?.map((step) => ({
            ...step,
            completed: !!completedSteps[challengeData.id][step.id],
          })) || []

        // Count completed steps
        const completedStepsCount = updatedSteps.filter((step) => step.completed).length

        challengeData.steps = updatedSteps
        challengeData.progress = completedStepsCount
      }
    }

    setChallenge(challengeData)
    setIsLoading(false)
  }, [params.id])

  const handleBack = () => {
    triggerHapticFeedback(hapticPatterns.light)

    // Store the active tab in localStorage to ensure it persists
    localStorage.setItem("activeTab", "challenges")

    // Navigate to the main page
    router.push("/")
  }

  const handleCompleteChallenge = () => {
    if (!challenge) return

    setShowCompletionAnimation(true)
    triggerHapticFeedback(hapticPatterns.success)

    // Save to localStorage
    const savedChallenges = localStorage.getItem("completedChallenges")
    const completedChallenges = savedChallenges ? JSON.parse(savedChallenges) : {}
    completedChallenges[challenge.id] = true
    localStorage.setItem("completedChallenges", JSON.stringify(completedChallenges))

    // Update challenge state
    setChallenge({
      ...challenge,
      isCompleted: true,
      progress: challenge.totalSteps,
    })

    // Hide animation after 2 seconds
    setTimeout(() => {
      setShowCompletionAnimation(false)
    }, 2000)
  }

  // Update the handleResetChallenge function to also reset steps
  const handleResetChallenge = () => {
    if (!challenge) return

    triggerHapticFeedback(hapticPatterns.medium)

    // Remove from localStorage
    const savedChallenges = localStorage.getItem("completedChallenges")
    if (savedChallenges) {
      const completedChallenges = JSON.parse(savedChallenges)
      delete completedChallenges[challenge.id]
      localStorage.setItem("completedChallenges", JSON.stringify(completedChallenges))
    }

    // Reset steps in localStorage
    if (challenge.steps) {
      const savedSteps = localStorage.getItem("completedSteps")
      if (savedSteps) {
        const completedSteps = JSON.parse(savedSteps)
        if (completedSteps[challenge.id]) {
          delete completedSteps[challenge.id]
          localStorage.setItem("completedSteps", JSON.stringify(completedSteps))
        }
      }

      // Reset steps in state
      const resetSteps = challenge.steps.map((step) => ({
        ...step,
        completed: false,
      }))

      // Update challenge state
      setChallenge({
        ...challenge,
        isCompleted: false,
        progress: 0,
        steps: resetSteps,
      })
    } else {
      // Find the original progress value for this challenge (30% of total steps)
      const originalProgress = Math.floor(challenge.totalSteps * 0.3)

      // Update challenge state
      setChallenge({
        ...challenge,
        isCompleted: false,
        progress: originalProgress,
      })
    }
  }

  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return <FaUtensils className="text-white" />
      case "culture":
        return <FaLandmark className="text-white" />
      case "photography":
        return <FaCamera className="text-white" />
      case "nature":
        return <FaHiking className="text-white" />
      default:
        return <FaMapMarkerAlt className="text-white" />
    }
  }

  // Get color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "food":
        return "bg-orange-500"
      case "culture":
        return "bg-purple-500"
      case "photography":
        return "bg-blue-500"
      case "nature":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-orange-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Mock function to get challenge data by ID
  const getChallengeById = (id: string): Challenge | null => {
    // This would normally come from an API or database
    const challenges: Record<string, Challenge> = {
      "seoul-street-food": {
        id: "seoul-street-food",
        title: {
          en: "Seoul Street Food Adventure",
          kr: "서울 길거리 음식 모험",
        },
        description: {
          en: "Explore the vibrant street food scene in Seoul. Visit 5 different street food locations and try their signature dishes. Take photos and share your experience with other travelers.",
          kr: "서울의 활기찬 길거리 음식 현장을 탐험하세요. 5개의 다른 길거리 음식점을 방문하고 그들의 시그니처 요리를 맛보세요. 사진을 찍고 다른 여행자들과 경험을 공유하세요.",
        },
        image: "/images/seoulstreetfood.png",
        progress: 3,
        totalSteps: 5,
        reward: {
          en: "Food Connoisseur Badge",
          kr: "음식 감정가 배지",
        },
        category: "food",
        difficulty: "medium",
        steps: [
          {
            id: "gwangjang-tteokbokki",
            title: { en: "Gwangjang Market Tteokbokki", kr: "광장시장 떡볶이" },
            description: {
              en: "Try the famous spicy rice cakes at Gwangjang Market",
              kr: "광장시장에서 유명한 매운 떡볶이를 맛보세요",
            },
            image: "/images/tteockbokki.png",
            completed: true,
          },
          {
            id: "myeongdong-food",
            title: { en: "Myeongdong Street Food", kr: "명동 길거리 음식" },
            description: {
              en: "Explore the variety of street foods in Myeongdong",
              kr: "명동의 다양한 길거리 음식을 탐험하세요",
            },
            image: "/images/chall-street-myeongdong.png",
            completed: true,
          },
          {
            id: "hongdae-eggbread",
            title: { en: "Hongdae Egg Bread", kr: "홍대 계란빵" },
            description: {
              en: "Try the delicious egg bread in Hongdae area",
              kr: "홍대 지역에서 맛있는 계란빵을 맛보세요",
            },
            image: "/images/eggbread.png",
            completed: true,
          },
          {
            id: "namdaemun-kimbap",
            title: { en: "Namdaemun Market Kimbap", kr: "남대문시장 김밥" },
            description: {
              en: "Taste the traditional kimbap at Namdaemun Market",
              kr: "남대문시장에서 전통 김밥을 맛보세요",
            },
            image: "/images/gimbab.png",
            completed: false,
          },
          {
            id: "dongdaemun-hotteok",
            title: { en: "Dongdaemun Hotteok", kr: "동대문 호떡" },
            description: {
              en: "Enjoy sweet pancakes filled with brown sugar and nuts",
              kr: "갈색 설탕과 견과류로 채워진 달콤한 호떡을 즐기세요",
            },
            image: "/images/hotteock.png",
            completed: false,
          },
        ],
      },
      "seoul-historical-sites": {
        id: "seoul-historical-sites",
        title: {
          en: "Seoul Historical Sites",
          kr: "서울 역사 유적지",
        },
        description: {
          en: "Discover the rich history of Seoul by visiting 4 historical palaces. Learn about Korean history and traditional architecture while exploring these magnificent sites.",
          kr: "4개의 역사적 궁궐을 방문하여 서울의 풍부한 역사를 발견하세요. 이 웅장한 장소들을 탐험하면서 한국 역사와 전통 건축에 대해 배우세요.",
        },
        image: "/images/seoulhistory.png",
        progress: 2,
        totalSteps: 4,
        reward: {
          en: "Cultural Enthusiast Badge",
          kr: "문화 애호가 배지",
        },
        category: "culture",
        difficulty: "easy",
        isNew: true,
        steps: [
          {
            id: "gyeongbokgung",
            title: { en: "Gyeongbokgung Palace", kr: "경복궁" },
            description: {
              en: "Visit the main royal palace of the Joseon dynasty",
              kr: "조선 왕조의 주요 왕궁을 방문하세요",
            },
            image: "/images/gyeongbokgung.jpg",
            completed: true,
          },
          {
            id: "changdeokgung",
            title: { en: "Changdeokgung Palace", kr: "창덕궁" },
            description: {
              en: "Explore the UNESCO World Heritage site with its beautiful garden",
              kr: "아름다운 정원이 있는 유네스코 세계 문화유산을 탐험하세요",
            },
            image: "/serene-changdeokgung.png",
            completed: true,
          },
          {
            id: "deoksugung",
            title: { en: "Deoksugung Palace", kr: "덕수궁" },
            description: {
              en: "See the unique blend of traditional Korean and Western architecture",
              kr: "전통 한국과 서양 건축의 독특한 조화를 보세요",
            },
            image: "/deoksugung-tranquility.png",
            completed: false,
          },
          {
            id: "jongmyo",
            title: { en: "Jongmyo Shrine", kr: "종묘" },
            description: {
              en: "Visit the royal ancestral shrine of the Joseon dynasty",
              kr: "조선 왕조의 왕실 사당을 방문하세요",
            },
            image: "/Jongmyo-Royal-Ritual.png",
            completed: false,
          },
        ],
      },
      "capture-landmarks": {
        id: "capture-landmarks",
        title: {
          en: "Capture Seoul Landmarks",
          kr: "서울 랜드마크 촬영",
        },
        description: {
          en: "Take photos at 6 famous landmarks in Seoul. Capture the beauty of these iconic locations and create lasting memories of your trip.",
          kr: "서울의 6개 유명 랜드마크에서 사진을 찍으세요. 이 상징적인 장소들의 아름다움을 담아내고 여행의 지속적인 추억을 만드세요.",
        },
        image: "/images/capturelandmark.png",
        progress: 4,
        totalSteps: 6,
        reward: {
          en: "Seoul Explorer Badge",
          kr: "서울 탐험가 배지",
        },
        category: "photography",
        difficulty: "medium",
        steps: [
          {
            id: "n-seoul-tower",
            title: { en: "N Seoul Tower", kr: "N 서울타워" },
            description: {
              en: "Capture the iconic tower on Namsan Mountain",
              kr: "남산에 있는 상징적인 타워를 촬영하세요",
            },
            image: "/images/n-seoultower.png",
            completed: true,
          },
          {
            id: "gyeongbokgung-photo",
            title: { en: "Gyeongbokgung Palace", kr: "경복궁" },
            description: {
              en: "Take photos of the main royal palace",
              kr: "주요 왕궁의 사진을 찍으세요",
            },
            image: "/images/seoul-gyeongbok.png",
            completed: true,
          },
          {
            id: "bukchon-hanok",
            title: { en: "Bukchon Hanok Village", kr: "북촌 한옥마을" },
            description: {
              en: "Photograph the traditional Korean houses",
              kr: "전통 한국 가옥을 촬영하세요",
            },
            image: "/images/bukchon.png",
            completed: true,
          },
          {
            id: "ddp",
            title: { en: "Dongdaemun Design Plaza", kr: "동대문디자인플라자" },
            description: {
              en: "Capture the futuristic architecture",
              kr: "미래적인 건축물을 촬영하세요",
            },
            image: "/images/ddp.png",
            completed: true,
          },
          {
            id: "han-river",
            title: { en: "Han River", kr: "한강" },
            description: {
              en: "Take photos of Seoul's iconic river",
              kr: "서울의 상징적인 강의 사진을 찍으세요",
            },
            image: "/hanriver.png",
            completed: false,
          },
          {
            id: "lotte-tower",
            title: { en: "Lotte World Tower", kr: "롯데월드타워" },
            description: {
              en: "Photograph one of the tallest buildings in the world",
              kr: "세계에서 가장 높은 건물 중 하나를 촬영하세요",
            },
            image: "/lotteworldtower.png",
            completed: false,
          },
        ],
      },
      "seoul-bakery-pilgrimage": {
        id: "seoul-bakery-pilgrimage",
        title: {
          en: "Seoul Bakery Pilgrimage",
          kr: "서울 빵지 순례",
        },
        description: {
          en: "Discover Seoul's thriving bakery scene by visiting 6 famous bakeries. Try their signature pastries and breads to experience the unique fusion of Korean and Western baking traditions.",
          kr: "6개의 유명 베이커리를 방문하여 서울의 번성하는 베이커리 현장을 발견하세요. 한국과 서양의 제빵 전통이 독특하게 융합된 시그니처 페이스트리와 빵을 맛보세요.",
        },
        image: "/images/bakerypil3d.png",
        progress: 0,
        totalSteps: 6,
        reward: {
          en: "Bakery Connoisseur Badge",
          kr: "빵순/빵돌이 배지",
        },
        category: "food",
        difficulty: "easy",
        steps: [
          {
            id: "meal-bread",
            title: { en: "Meal Bread at Tartine", kr: "타르틴의 식사빵" },
            description: {
              en: "Try the famous meal bread at Tartine Bakery",
              kr: "타르틴 베이커리에서 유명한 식사빵을 맛보세요",
            },
            image: "/images/mealbr3d.png",
            completed: false,
          },
          {
            id: "croissant",
            title: { en: "Croissant at Gontran Cherrier", kr: "곤트란 쉐리에의 크루아상" },
            description: {
              en: "Taste the perfect croissant at Gontran Cherrier",
              kr: "곤트란 쉐리에에서 완벽한 크루아상을 맛보세요",
            },
            image: "/images/croissant3d.png",
            completed: false,
          },
          {
            id: "bread-picnic",
            title: { en: "Bread Picnic at Han River", kr: "한강에서 빵 피크닉" },
            description: {
              en: "Enjoy a bread picnic by the Han River with bakery items",
              kr: "베이커리 아이템으로 한강에서 빵 피크닉을 즐기세요",
            },
            image: "/images/picnic3d.png",
            completed: false,
          },
          {
            id: "jongro-toast",
            title: { en: "Jongro Toast", kr: "종로 토스트" },
            description: {
              en: "Try the traditional Korean street toast in Jongro",
              kr: "종로에서 전통 한국식 길거리 토스트를 맛보세요",
            },
            image: "/images/toast3d.png",
            completed: false,
          },
          {
            id: "danpat-donuts",
            title: { en: "Danpat Donuts", kr: "단팥 도넛" },
            description: {
              en: "Taste the sweet red bean filled donuts",
              kr: "달콤한 팥이 들어간 도넛을 맛보세요",
            },
            image: "/images/danpat3d.png",
            completed: false,
          },
          {
            id: "vegan-bakery",
            title: { en: "Vegan Bakery Visit", kr: "비건 베이커리 방문" },
            description: {
              en: "Discover plant-based baking at a vegan bakery",
              kr: "비건 베이커리에서 식물성 베이킹을 발견하세요",
            },
            image: "/images/vegan3d.png",
            completed: false,
          },
        ],
      },
      "seoul-dullegil-conquest": {
        id: "seoul-dullegil-conquest",
        title: {
          en: "Seoul Dullegil Conquest",
          kr: "서울 둘레길 정복",
        },
        description: {
          en: "Explore the Seoul Dullegil, a 157km trail that circles the city. Complete 8 sections of this beautiful trail to experience Seoul's natural landscapes and breathtaking views.",
          kr: "서울을 둘러싸는 157km 길인 서울 둘레길을 탐험하세요. 이 아름다운 트레일의 8개 구간을 완주하여 서울의 자연 경관과 멋진 전망을 경험하세요.",
        },
        image: "/images/dullegil.png",
        progress: 0,
        totalSteps: 8,
        reward: {
          en: "Dullegil Master Badge",
          kr: "둘레길 마스터 배지",
        },
        category: "nature",
        difficulty: "hard",
        steps: [
          {
            id: "dullegil-course1",
            title: { en: "Course 1: Dobongsan", kr: "코스 1: 도봉산" },
            description: {
              en: "Hike the Dobongsan Mountain section",
              kr: "도봉산 구간을 하이킹하세요",
            },
            image: "/images/dullegil_course1.jpg",
            completed: false,
          },
          {
            id: "dullegil-course2",
            title: { en: "Course 2: Bukhansan", kr: "코스 2: 북한산" },
            description: {
              en: "Explore the Bukhansan National Park section",
              kr: "북한산 국립공원 구간을 탐험하세요",
            },
            image: "/images/dullegil_course2.jpg",
            completed: false,
          },
          {
            id: "dullegil-course3",
            title: { en: "Course 3: Suraksan", kr: "코스 3: 수락산" },
            description: {
              en: "Trek through the Suraksan Mountain area",
              kr: "수락산 지역을 트레킹하세요",
            },
            image: "/images/dullegil_course3.jpg",
            completed: false,
          },
          {
            id: "dullegil-course4",
            title: { en: "Course 4: Buramsan", kr: "코스 4: 불암산" },
            description: {
              en: "Hike the scenic Buramsan Mountain trail",
              kr: "경치 좋은 불암산 트레일을 하이킹하세요",
            },
            image: "/images/dullegil_course4.jpg",
            completed: false,
          },
          {
            id: "dullegil-course5",
            title: { en: "Course 5: Gwanaksan", kr: "코스 5: 관악산" },
            description: {
              en: "Conquer the Gwanaksan Mountain section",
              kr: "관악산 구간을 정복하세요",
            },
            image: "/images/dullegil_course5.jpg",
            completed: false,
          },
          {
            id: "dullegil-course6",
            title: { en: "Course 6: Ansan", kr: "코스 6: 안산" },
            description: {
              en: "Walk through the Ansan Mountain trail",
              kr: "안산 트레일을 걸으세요",
            },
            image: "/images/dullegil_course6.jpg",
            completed: false,
          },
          {
            id: "dullegil-course7",
            title: { en: "Course 7: Namsan", kr: "코스 7: 남산" },
            description: {
              en: "Explore the iconic Namsan Mountain section",
              kr: "상징적인 남산 구간을 탐험하세요",
            },
            image: "/images/dullegil_course7.jpg",
            completed: false,
          },
          {
            id: "dullegil-course8",
            title: { en: "Course 8: Han River", kr: "코스 8: 한강" },
            description: {
              en: "Complete the Han River section of the trail",
              kr: "트레일의 한강 구간을 완주하세요",
            },
            image: "/images/dullegil_course8.jpg",
            completed: false,
          },
        ],
      },
      "bangkok-food-tour": {
        id: "bangkok-food-tour",
        title: {
          en: "Tasty Bangkok",
          kr: "맛있는 방콕",
        },
        description: {
          en: "Try 7 authentic Thai dishes in Bangkok. Experience the vibrant flavors and spices that make Thai cuisine world-famous.",
          kr: "방콕에서 7가지 정통 태국 요리를 맛보세요. 태국 요리를 세계적으로 유명하게 만든 생생한 맛과 향신료를 경험하세요.",
        },
        image: "/images/tastybangkok.png",
        progress: 2,
        totalSteps: 7,
        reward: {
          en: "Thai Cuisine Master Badge",
          kr: "태국 요리 마스터 배지",
        },
        category: "food",
        difficulty: "medium",
        steps: [
          {
            id: "pad-thai",
            title: { en: "Pad Thai", kr: "팟타이" },
            description: {
              en: "Try the famous stir-fried noodle dish",
              kr: "유명한 볶음 국수 요리를 맛보세요",
            },
            image: "/images/bangkok-padthai3d.png",
            completed: true,
          },
          {
            id: "tom-yum-goong",
            title: { en: "Tom Yum Goong", kr: "똠얌꿍" },
            description: {
              en: "Taste the spicy and sour shrimp soup",
              kr: "똠얌꿍",
            },
            description: {
              en: "Taste the spicy and sour shrimp soup",
              kr: "매콤하고 신맛이 나는 새우 수프를 맛보세요",
            },
            image: "/images/bangkok-tomyam.png",
            completed: true,
          },
          {
            id: "green-curry",
            title: { en: "Green Curry", kr: "그린 커리" },
            description: {
              en: "Experience the aromatic coconut-based curry",
              kr: "향긋한 코코넛 베이스 커리를 경험하세요",
            },
            image: "/images/bangkok-greencurry.png",
            completed: false,
          },
          {
            id: "mango-sticky-rice",
            title: { en: "Mango Sticky Rice", kr: "망고 스티키 라이스" },
            description: {
              en: "Enjoy the sweet dessert with fresh mango",
              kr: "신선한 망고와 함께 달콤한 디저트를 즐기세요",
            },
            image: "/images/bangkok-stickyrice.png",
            completed: false,
          },
          {
            id: "som-tam",
            title: { en: "Som Tam", kr: "솜땀" },
            description: {
              en: "Try the spicy green papaya salad",
              kr: "매콤한 그린 파파야 샐러드를 맛보세요",
            },
            image: "/images/bangkok-somtam.png",
            completed: false,
          },
          {
            id: "massaman-curry",
            title: { en: "Massaman Curry", kr: "마싸만 커리" },
            description: {
              en: "Taste the rich and mild curry with potatoes",
              kr: "감자가 들어간 풍부하고 순한 커리를 맛보세요",
            },
            image: "/images/bangkok-masamancurry.png",
            completed: false,
          },
          {
            id: "thai-iced-tea",
            title: { en: "Thai Iced Tea", kr: "타이 아이스티" },
            description: {
              en: "Refresh with the sweet orange-colored tea",
              kr: "달콤한 오렌지색 차로 갈증을 해소하세요",
            },
            image: "/images/bangkok-thaiicedtea.png",
            completed: false,
          },
        ],
      },
    }

    // Check if the challenge is completed from localStorage
    const savedChallenges = localStorage.getItem("completedChallenges")
    const completedChallenges = savedChallenges ? JSON.parse(savedChallenges) : {}

    // Load completed steps from localStorage
    const savedSteps = localStorage.getItem("completedSteps")
    const completedSteps = savedSteps ? JSON.parse(savedSteps) : {}

    // Return the challenge with completion status
    if (challenges[id]) {
      const challenge = {
        ...challenges[id],
        isCompleted: !!completedChallenges[id],
      }

      // Update steps with completion status from localStorage
      if (completedSteps[id] && challenge.steps) {
        challenge.steps = challenge.steps.map((step) => ({
          ...step,
          completed: !!completedSteps[id][step.id],
        }))

        // Update progress based on completed steps
        challenge.progress = challenge.steps.filter((step) => step.completed).length
      }

      return challenge
    }

    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-light-gray">
        <div className="w-16 h-16 border-4 border-azure-radiance border-t-transparent rounded-full animate-spin"></div>
        <span className="sr-only">{currentLanguage === "en" ? "Loading..." : "로딩 중..."}</span>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="p-4">
        <button
          onClick={handleBack}
          className="flex items-center text-deep-navy mb-4"
          aria-label={currentLanguage === "en" ? "Back to challenges" : "도전 과제로 돌아가기"}
        >
          <FaArrowLeft className="mr-2" />
          {currentLanguage === "en" ? "Back to Challenges" : "도전 과제로 돌아가기"}
        </button>
        <div className="text-center py-8">
          <p className="text-xl font-bold text-deep-navy">
            {currentLanguage === "en" ? "Challenge not found" : "도전 과제를 찾을 수 없습니다"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-light-gray min-h-screen pb-16 relative">
      {/* Completion Animation */}
      {showCompletionAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center animate-bounce-once">
            <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {currentLanguage === "en" ? "Challenge Completed!" : "도전 완료!"}
            </h2>
            <p className="text-gray-600 mb-4">
              {currentLanguage === "en"
                ? `You've earned: ${challenge.reward.en}`
                : `획득한 보상: ${challenge.reward.kr}`}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <button
          onClick={handleBack}
          className="flex items-center text-deep-navy"
          aria-label={currentLanguage === "en" ? "Back to challenges" : "도전 과제로 돌아가기"}
        >
          <FaArrowLeft className="mr-2" />
          {currentLanguage === "en" ? "Back to Challenges" : "도전 과제로 돌아가기"}
        </button>
      </div>

      <div className="p-4">
        {/* Challenge Header */}
        <div className="bg-white rounded-xl overflow-hidden mb-4 shadow-sm">
          <div className="relative h-48">
            <Image
              src={challenge.image || "/placeholder.svg"}
              alt={currentLanguage === "en" ? challenge.title.en : challenge.title.kr}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4 flex items-center">
              <div
                className={`w-10 h-10 rounded-full ${getCategoryColor(challenge.category)} flex items-center justify-center`}
              >
                {getCategoryIcon(challenge.category)}
              </div>
              <span className="ml-2 text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {currentLanguage === "en"
                  ? challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)
                  : challenge.category === "food"
                    ? "음식"
                    : challenge.category === "culture"
                      ? "문화"
                      : challenge.category === "photography"
                        ? "사진"
                        : "자연"}
              </span>
            </div>

            {/* Title */}
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl font-bold text-white">
                {currentLanguage === "en" ? challenge.title.en : challenge.title.kr}
              </h1>

              {/* Difficulty */}
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full ${getDifficultyColor(challenge.difficulty)} mr-1`}></div>
                <span className="text-white text-xs">
                  {currentLanguage === "en"
                    ? challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)
                    : challenge.difficulty === "easy"
                      ? "쉬움"
                      : challenge.difficulty === "medium"
                        ? "보통"
                        : "어려움"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Info */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <h2 className="font-bold mb-2 text-lg">{currentLanguage === "en" ? "Description" : "설명"}</h2>
          <p className="text-stone-gray mb-4">
            {currentLanguage === "en" ? challenge.description.en : challenge.description.kr}
          </p>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{currentLanguage === "en" ? "Progress" : "진행 상황"}</h3>
              <span className="text-sm text-stone-gray">
                {challenge.progress}/{challenge.totalSteps}
              </span>
            </div>
            <div className="h-2 bg-light-sand rounded-full overflow-hidden">
              <div
                className={`h-full ${challenge.isCompleted ? "bg-green-500" : "bg-brand-blue"}`}
                style={{ width: `${(challenge.progress / challenge.totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            {/* Difficulty */}
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full ${getDifficultyColor(challenge.difficulty)} flex items-center justify-center mr-2`}
              >
                <FaStar className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs text-stone-gray">{currentLanguage === "en" ? "Difficulty" : "난이도"}</p>
                <p className="font-medium">
                  {currentLanguage === "en"
                    ? challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)
                    : challenge.difficulty === "easy"
                      ? "쉬움"
                      : challenge.difficulty === "medium"
                        ? "보통"
                        : "어려움"}
                </p>
              </div>
            </div>

            {/* Expiry */}
            {challenge.expiresIn && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-brand-coral flex items-center justify-center mr-2">
                  <FaCalendarAlt className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-xs text-stone-gray">{currentLanguage === "en" ? "Expires in" : "만료"}</p>
                  <p className="font-medium">
                    {currentLanguage === "en" ? `${challenge.expiresIn} days` : `${challenge.expiresIn}일`}
                  </p>
                </div>
              </div>
            )}

            {/* Reward */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center mr-2">
                <FaTrophy className="text-deep-navy text-sm" />
              </div>
              <div>
                <p className="text-xs text-stone-gray">{currentLanguage === "en" ? "Reward" : "보상"}</p>
                <p className="font-medium">{currentLanguage === "en" ? challenge.reward.en : challenge.reward.kr}</p>
              </div>
            </div>

            {/* XP */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center mr-2">
                <FaBolt className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs text-stone-gray">XP</p>
                <p className="font-medium">+{challenge.totalSteps * 50}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Steps */}
        {challenge.steps && (
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <h2 className="font-bold mb-4 text-lg">{currentLanguage === "en" ? "Challenge Steps" : "도전 단계"}</h2>
            <div className="space-y-3">
              {challenge.steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    step.completed ? "border-green-500 bg-green-50" : "border-gray-200"
                  }`}
                  onClick={() => handleStepToggle(step.id)}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 relative">
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={currentLanguage === "en" ? step.title.en : step.title.kr}
                      fill
                      className={`object-cover ${!step.completed ? "filter grayscale" : ""}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.completed ? "text-deep-navy" : "text-stone-gray"}`}>
                      {currentLanguage === "en" ? step.title.en : step.title.kr}
                    </p>
                    {step.description && (
                      <p className="text-xs text-stone-gray">
                        {currentLanguage === "en" ? step.description.en : step.description.kr}
                      </p>
                    )}
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {step.completed ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <FaCheck className="text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400">
                        <span className="text-white text-xs">+1</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {challenge.isCompleted ? (
            <button
              className="flex-1 py-3 border border-stone-gray text-stone-gray rounded-lg flex items-center justify-center hover:bg-stone-gray hover:text-white transition-colors"
              onClick={handleResetChallenge}
            >
              <FaUndo className="mr-2" />
              {currentLanguage === "en" ? "Reset Challenge" : "도전 초기화"}
            </button>
          ) : (
            <button
              className="flex-1 py-3 bg-brand-blue text-white rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-colors"
              onClick={handleCompleteChallenge}
            >
              <FaCheck className="mr-2" />
              {currentLanguage === "en" ? "Mark as Complete" : "완료로 표시"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function FaUndo(props: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={props.className}
      width="1em"
      height="1em"
    >
      <path d="M255.5 8c66.3 0 126.2 26.4 170.2 69.3l-50.8 50.8c-28.4-28.1-67.5-45.5-110.6-45.5-86.6 0-157 70.4-157 157s70.4 157 157 157c71.1 0 130.9-47.3 150-112h-39.5c-16.7 44.6-59.7 76.5-110.5 76.5-65.2 0-118-52.8-118-118s52.8-118 118-118c32.3 0 61.5 13 82.8 34l-55.8 55.8h138v-138l-54.2 54.2c-33.8-33.6-80.3-54.5-131.7-54.5-103.2 0-187 83.8-187 187s83.8 187 187 187c94.3 0 172.3-70 185-161h-39.8c-12.2 61.8-67.2 108.5-133.2 108.5-75.2 0-136-60.8-136-136s60.8-136 136-136z" />
    </svg>
  )
}
