"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { FaArrowLeft, FaMapMarkerAlt, FaCheck, FaLock, FaChevronRight } from "react-icons/fa"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"

type QuestDetailsPageProps = {}

const QuestDetailsPage: React.FC<QuestDetailsPageProps> = () => {
  const router = useRouter()
  const params = useParams()
  const { cityId, questId } = params as { cityId: string; questId: string }

  const [currentLanguage, setCurrentLanguage] = useState<string>("en")
  const [questData, setQuestData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])

  // Toggle language function
  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === "en" ? "ko" : "en")
  }

  useEffect(() => {
    // Simulate loading quest data
    setTimeout(() => {
      const data = getQuestData(cityId, questId, currentLanguage)
      setQuestData(data)

      // Initialize completed tasks from localStorage or from the quest data
      const savedCompletedTasks = localStorage.getItem(`${cityId}-${questId}-completed-tasks`)
      if (savedCompletedTasks) {
        setCompletedTasks(JSON.parse(savedCompletedTasks))
      } else if (data) {
        // Initialize from quest data
        const initialCompletedTasks = data.tasks.filter((task: any) => task.completed).map((task: any) => task.id)
        setCompletedTasks(initialCompletedTasks)
        localStorage.setItem(`${cityId}-${questId}-completed-tasks`, JSON.stringify(initialCompletedTasks))
      }

      setLoading(false)
    }, 500)
  }, [cityId, questId, currentLanguage])

  const handleBack = () => {
    triggerHapticFeedback(hapticPatterns.medium)
    router.back()
  }

  const handleTaskClick = (taskId: string, isLocked: boolean) => {
    if (isLocked) {
      triggerHapticFeedback(hapticPatterns.error)
      return
    }

    triggerHapticFeedback(hapticPatterns.light)

    // Toggle task completion status
    let newCompletedTasks = [...completedTasks]

    if (completedTasks.includes(taskId)) {
      // Remove from completed tasks
      newCompletedTasks = newCompletedTasks.filter((id) => id !== taskId)
    } else {
      // Add to completed tasks
      newCompletedTasks.push(taskId)
      triggerHapticFeedback(hapticPatterns.success)
    }

    setCompletedTasks(newCompletedTasks)
    localStorage.setItem(`${cityId}-${questId}-completed-tasks`, JSON.stringify(newCompletedTasks))

    // In a real app, this would also update the server
    console.log(`Task ${taskId} clicked, new status:`, newCompletedTasks.includes(taskId))
  }

  const handleTaskDetailsClick = (taskId: string, isLocked: boolean) => {
    if (isLocked) {
      triggerHapticFeedback(hapticPatterns.error)
      return
    }

    triggerHapticFeedback(hapticPatterns.medium)
    // Navigate to task details page or show a modal
    console.log(`View details for task ${taskId}`)
    // In a real app, this would navigate to a task details page
    // router.push(`/quest-details/${cityId}/${questId}/task/${taskId}`)

    // For now, just show an alert
    alert(`Task details for ${taskId} would be shown here`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    )
  }

  if (!questData) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center mr-4"
          >
            <FaArrowLeft className="text-deep-navy" />
          </button>
          <h1 className="text-xl font-bold text-deep-navy">
            {currentLanguage === "en" ? "Quest Not Found" : "퀘스트를 찾을 수 없습니다"}
          </h1>
        </div>
        <p className="text-stone-gray">
          {currentLanguage === "en"
            ? "Sorry, the quest you're looking for doesn't exist or has been removed."
            : "죄송합니다. 찾고 계신 퀘스트가 존재하지 않거나 삭제되었습니다."}
        </p>
      </div>
    )
  }

  // Calculate current progress based on completedTasks state
  const currentProgress = completedTasks.length
  const progressPercent = (currentProgress / questData.tasks.length) * 100

  return (
    <div className="pb-20">
      {/* Header with navigation and title */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-light-sand flex items-center justify-center"
          >
            <FaArrowLeft className="text-deep-navy" />
          </button>

          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-full bg-light-sand text-deep-navy text-sm font-medium"
          >
            {currentLanguage === "en" ? "한국어" : "English"}
          </button>
        </div>

        <h1 className="text-xl font-bold text-deep-navy mt-2">{questData.title}</h1>
        <div className="flex items-center text-stone-gray text-sm mt-1">
          <FaMapMarkerAlt className="mr-1" />
          <span>{questData.location}</span>
        </div>
      </div>

      {/* Quest content */}
      <div className="p-6">
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-deep-navy mb-2">{currentLanguage === "en" ? "Description" : "설명"}</h2>
          <p className="text-stone-gray">{questData.description}</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-deep-navy">{currentLanguage === "en" ? "Progress" : "진행 상황"}</h2>
            <span className="text-sm font-medium text-deep-navy">
              {currentProgress}/{questData.tasks.length}
            </span>
          </div>
          <div className="h-2 bg-light-sand rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-brand-coral rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-stone-gray">
            {currentLanguage === "en"
              ? `${currentProgress} of ${questData.tasks.length} tasks completed`
              : `${questData.tasks.length}개 중 ${currentProgress}개 완료됨`}
          </p>
        </div>

        {/* Tasks */}
        <div>
          <h2 className="text-lg font-bold text-deep-navy mb-4">{currentLanguage === "en" ? "Tasks" : "작업"}</h2>
          <div className="space-y-4">
            {questData.tasks.map((task: any) => {
              const isCompleted = completedTasks.includes(task.id)

              return (
                <div
                  key={task.id}
                  className={`rounded-lg overflow-hidden border ${
                    isCompleted
                      ? "border-brand-blue bg-brand-blue/5"
                      : task.locked
                        ? "border-light-sand bg-light-sand/50"
                        : "border-light-sand"
                  } ${!task.locked ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
                >
                  {/* Task image */}
                  <div className="relative h-40 w-full">
                    <Image
                      src={task.image || "/placeholder.svg?height=400&width=600&query=quest task"}
                      alt={task.title}
                      fill
                      className={`object-cover ${task.locked ? "opacity-50" : ""}`}
                    />
                    {task.locked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <FaLock className="text-white text-2xl" />
                      </div>
                    )}
                    {isCompleted && (
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <FaCheck className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Task content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className={`font-medium mb-1 ${task.locked ? "text-stone-gray" : "text-deep-navy"}`}>
                          {task.title}
                        </h3>
                        <p className={`text-sm ${task.locked ? "text-stone-gray/70" : "text-stone-gray"}`}>
                          {task.description}
                        </p>
                        {task.reward && (
                          <div className="mt-2 text-xs text-brand-coral font-medium">
                            {currentLanguage === "en" ? "Reward: " : "보상: "}
                            {task.reward}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center ml-3">
                        <button
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                            isCompleted ? "bg-green-500" : task.locked ? "bg-gray-300" : "bg-gray-200"
                          }`}
                          onClick={() => handleTaskClick(task.id, task.locked)}
                          disabled={task.locked}
                          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                        >
                          <FaCheck className="text-white" />
                        </button>

                        <button
                          className="w-8 h-8 bg-light-sand rounded-full flex items-center justify-center"
                          onClick={() => handleTaskDetailsClick(task.id, task.locked)}
                          disabled={task.locked}
                          aria-label="View details"
                        >
                          <FaChevronRight className="text-deep-navy" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Reward */}
        <div className="mt-8 p-4 bg-light-sand rounded-lg">
          <h2 className="text-lg font-bold text-deep-navy mb-2">
            {currentLanguage === "en" ? "Quest Reward" : "퀘스트 보상"}
          </h2>
          <p className="text-stone-gray mb-3">{questData.rewardDescription}</p>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <Image
                src={questData.rewardImage || "/placeholder.svg?height=100&width=100&query=reward badge"}
                alt="Reward"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-deep-navy">{questData.rewardTitle}</h3>
              <p className="text-xs text-stone-gray">
                {currentLanguage === "en" ? "Complete all tasks to claim" : "모든 작업을 완료하여 획득"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get quest data
function getQuestData(cityId: string, questId: string, language: string) {
  // This would typically come from an API or database
  const questsData: Record<string, any> = {
    "seoul-food": {
      title: language === "en" ? "Seoul Street Food Tour" : "서울 길거리 음식 투어",
      location: language === "en" ? "Seoul, South Korea" : "대한민국 서울",
      description:
        language === "en"
          ? "Explore the vibrant street food scene of Seoul. From traditional snacks to modern fusion treats, discover the flavors that make Seoul a food lover's paradise."
          : "서울의 활기찬 길거리 음식 현장을 탐험하세요. 전통적인 간식부터 현대적인 퓨전 음식까지, 서울을 음식 애호가들의 천국으로 만드는 맛을 발견하세요.",
      completedTasks: 5,
      tasks: [
        {
          id: "tteokbokki",
          title: language === "en" ? "Try Tteokbokki" : "떡볶이 맛보기",
          description:
            language === "en"
              ? "Spicy rice cakes, a Korean street food classic"
              : "매콤한 떡볶이, 한국 길거리 음식의 클래식",
          image: "/images/tteockbokki.png",
          completed: true,
          locked: false,
          reward: "+50 XP",
        },
        {
          id: "hotteok",
          title: language === "en" ? "Taste Hotteok" : "호떡 맛보기",
          description:
            language === "en"
              ? "Sweet pancakes filled with brown sugar and nuts"
              : "흑설탕과 견과류로 채워진 달콤한 팬케이크",
          image: "/images/hotteok.jpg",
          locked: false,
          reward: "+50 XP",
        },
        {
          id: "bungeoppang",
          title: language === "en" ? "Find Bungeoppang" : "붕어빵 찾기",
          description:
            language === "en"
              ? "Fish-shaped pastry filled with sweet red bean paste"
              : "달콤한 팥으로 채워진 물고기 모양의 페이스트리",
          image: "/images/bungeoppang.jpeg",
          completed: true,
          locked: false,
          reward: "+50 XP",
        },
        {
          id: "odeng",
          title: language === "en" ? "Savor Odeng" : "오뎅 맛보기",
          description: language === "en" ? "Fish cake skewers in warm broth" : "따뜻한 국물에 담긴 어묵 꼬치",
          image: "/images/oden.png",
          completed: true,
          locked: false,
          reward: "+50 XP",
        },
        {
          id: "tornado-potato",
          title: language === "en" ? "Try Tornado Potato" : "회오리 감자 맛보기",
          description:
            language === "en"
              ? "Spiral-cut potato on a skewer, deep-fried and seasoned"
              : "꼬치에 나선형으로 자른 감자, 튀겨서 양념한 음식",
          image: "/images/tornadopotato.png",
          completed: true,
          locked: false,
          reward: "+50 XP",
        },
        {
          id: "bindaetteok",
          title: language === "en" ? "Taste Bindaetteok" : "빈대떡 맛보기",
          description: language === "en" ? "Savory mung bean pancakes" : "고소한 녹두 전",
          image: "/images/mungbeanpancake.png",
          completed: false,
          locked: false,
          reward: "+50 XP",
        },
        {
          id: "kimbap",
          title: language === "en" ? "Roll with Kimbap" : "김밥 맛보기",
          description: language === "en" ? "Seaweed rice rolls with various fillings" : "다양한 속재료가 들어간 김밥",
          image: "/images/gimbap.png",
          completed: false,
          locked: false,
          reward: "+50 XP",
        },
        {
          id: "dakkochi",
          title: language === "en" ? "Grill Dakkochi" : "닭꼬치 맛보기",
          description:
            language === "en"
              ? "Grilled chicken skewers with sweet and spicy sauce"
              : "달콤 매콤한 소스의 그릴에 구운 닭꼬치",
          image: "/images/chickenskewer.jpeg",
          completed: false,
          locked: true,
          reward: "+50 XP",
        },
      ],
      rewardTitle: language === "en" ? "Seoul Foodie Badge" : "서울 푸디 배지",
      rewardDescription:
        language === "en"
          ? "Complete all tasks to earn the exclusive Seoul Foodie Badge and unlock special food recommendations!"
          : "모든 작업을 완료하여 독점 서울 푸디 배지를 획득하고 특별한 음식 추천을 잠금 해제하세요!",
      rewardImage: "/images/seoulfoodiebadge.png",
    },
    "seoul-historical": {
      title: language === "en" ? "Seoul Historical Sites" : "서울 역사 유적지",
      location: language === "en" ? "Seoul, South Korea" : "대한민국 서울",
      description:
        language === "en"
          ? "Journey through Seoul's rich history by visiting its most significant historical sites. From ancient palaces to traditional villages, discover the cultural heritage of Korea's capital."
          : "서울의 가장 중요한 역사적 장소들을 방문하며 서울의 풍부한 역사를 여행하세요. 고대 궁전부터 전통 마을까지, 한국 수도의 문화 유산을 발견하세요.",
      completedTasks: 2,
      tasks: [
        {
          id: "gyeongbokgung",
          title: language === "en" ? "Visit Gyeongbokgung Palace" : "경복궁 방문",
          description:
            language === "en"
              ? "The largest of the Five Grand Palaces built by the Joseon Dynasty"
              : "조선 왕조가 지은 5대 궁궐 중 가장 큰 궁궐",
          image: "/images/Check-in-Gyeongbokgung.jpg",
          completed: true,
          locked: false,
          reward: "+100 XP",
        },
        {
          id: "bukchon",
          title: language === "en" ? "Explore Bukchon Hanok Village" : "북촌 한옥마을 탐험",
          description:
            language === "en"
              ? "A traditional Korean village with hundreds of hanoks (traditional houses)"
              : "수백 채의 한옥(전통 가옥)이 있는 전통 한국 마을",
          image: "/images/bukchon.jpg",
          completed: true,
          locked: false,
          reward: "+100 XP",
        },
        {
          id: "changdeokgung",
          title: language === "en" ? "Tour Changdeokgung Palace" : "창덕궁 투어",
          description:
            language === "en"
              ? "UNESCO World Heritage site known for its beautiful garden"
              : "아름다운 정원으로 유명한 유네스코 세계문화유산",
          image: "/serene-changdeokgung.png",
          completed: false,
          locked: false,
          reward: "+100 XP",
        },
        {
          id: "jongmyo",
          title: language === "en" ? "Visit Jongmyo Shrine" : "종묘 방문",
          description:
            language === "en"
              ? "Confucian shrine dedicated to the memory of royal ancestors"
              : "왕실 조상의 기억을 위한 유교 사당",
          image: "/Jongmyo-Royal-Ritual.png",
          completed: false,
          locked: false,
          reward: "+100 XP",
        },
        {
          id: "deoksugung",
          title: language === "en" ? "Discover Deoksugung Palace" : "덕수궁 발견",
          description:
            language === "en"
              ? "Palace notable for its Western-style garden and modern art museum"
              : "서양식 정원과 현대 미술관으로 주목할 만한 궁궐",
          image: "/deoksugung-tranquility.png",
          completed: false,
          locked: true,
          reward: "+100 XP",
        },
        {
          id: "seoulwall",
          title: language === "en" ? "Walk the Seoul City Wall" : "서울 성곽길 걷기",
          description:
            language === "en"
              ? "18km fortress wall built during the Joseon Dynasty"
              : "조선 시대에 지어진 18km 요새 벽",
          image: "/seoul-wall-autumn.png",
          completed: false,
          locked: true,
          reward: "+100 XP",
        },
      ],
      rewardTitle: language === "en" ? "Seoul Historian Badge" : "서울 역사가 배지",
      rewardDescription:
        language === "en"
          ? "Complete all tasks to earn the prestigious Seoul Historian Badge and unlock special historical insights!"
          : "모든 작업을 완료하여 명망 높은 서울 역사가 배지를 획득하고 특별한 역사적 통찰력을 잠금 해제하세요!",
      rewardImage: "/images/seoulhistorianbadge.png",
    },
    "busan-taste": {
      title: language === "en" ? "Busan Taste & Style" : "부산 맛과 멋 탐방",
      location: language === "en" ? "Busan, South Korea" : "대한민국 부산",
      description:
        language === "en"
          ? "Experience the unique flavors and vibrant culture of Busan. From fresh seafood to bustling markets, discover what makes this coastal city special."
          : "부산의 독특한 맛과 활기찬 문화를 경험하세요. 신선한 해산물부터 분주한 시장까지, 이 해안 도시를 특별하게 만드는 것을 발견하세요.",
      completedTasks: 3,
      tasks: [
        {
          id: "haeundae",
          title: language === "en" ? "Visit Haeundae Beach" : "해운대 해변 방문",
          description:
            language === "en"
              ? "Korea's most famous beach with beautiful coastline"
              : "아름다운 해안선을 가진 한국에서 가장 유명한 해변",
          image: "/images/haeundae-busan.jpeg",
          completed: true,
          locked: false,
          reward: "+75 XP",
        },
        {
          id: "jagalchi",
          title: language === "en" ? "Explore Jagalchi Fish Market" : "자갈치 시장 탐험",
          description:
            language === "en"
              ? "Korea's largest seafood market with fresh catches daily"
              : "매일 신선한 해산물을 판매하는 한국 최대의 해산물 시장",
          image: "/images/jagalichi-busan.jpg",
          completed: true,
          locked: false,
          reward: "+75 XP",
        },
        {
          id: "gamcheon",
          title: language === "en" ? "Discover Gamcheon Culture Village" : "감천문화마을 발견",
          description:
            language === "en"
              ? "Colorful hillside community known as the 'Machu Picchu of Busan'"
              : "'부산의 마추픽추'로 알려진 다채로운 언덕 마을",
          image: "/images/gamcheon-busan.jpg",
          completed: true,
          locked: false,
          reward: "+75 XP",
        },
        {
          id: "gukje",
          title: language === "en" ? "Shop at Gukje Market" : "국제시장에서 쇼핑",
          description:
            language === "en"
              ? "Bustling traditional market with everything from clothes to street food"
              : "옷부터 길거리 음식까지 모든 것이 있는 분주한 전통 시장",
          image: "/bustling-gukje-market.png",
          completed: false,
          locked: false,
          reward: "+75 XP",
        },
        {
          id: "dwaeji",
          title: language === "en" ? "Try Dwaeji Gukbap" : "돼지국밥 맛보기",
          description: language === "en" ? "Busan's signature pork soup with rice" : "부산의 대표적인 돼지고기 국밥",
          image: "/steaming-dwaeji-gukbap.png",
          completed: false,
          locked: false,
          reward: "+75 XP",
        },
        {
          id: "bupyeong",
          title: language === "en" ? "Visit Bupyeong Night Market" : "부평 야시장 방문",
          description:
            language === "en"
              ? "Vibrant night market with diverse food options"
              : "다양한 음식 옵션이 있는 활기찬 야시장",
          image: "/bustling-bupyeong-night.png",
          completed: false,
          locked: true,
          reward: "+75 XP",
        },
        {
          id: "taejongdae",
          title: language === "en" ? "Explore Taejongdae Park" : "태종대 공원 탐험",
          description:
            language === "en"
              ? "Natural park with cliffs overlooking the ocean"
              : "바다를 내려다보는 절벽이 있는 자연 공원",
          image: "/bustling-busan-street-food.png",
          completed: false,
          locked: true,
          reward: "+75 XP",
        },
      ],
      rewardTitle: language === "en" ? "Busan Explorer Badge" : "부산 탐험가 배지",
      rewardDescription:
        language === "en"
          ? "Complete all tasks to earn the exclusive Busan Explorer Badge and unlock special local recommendations!"
          : "모든 작업을 완��하여 독점 부산 탐험가 배지를 획득하고 특별한 현지 추천을 잠금 해제하세요!",
      rewardImage: "/images/busanexplorerbadge.png",
    },
    "bangkok-temples": {
      title: language === "en" ? "Bangkok Temple Tour" : "방콕 사원 투어",
      location: language === "en" ? "Bangkok, Thailand" : "태국 방콕",
      description:
        language === "en"
          ? "Discover the spiritual side of Bangkok through its magnificent temples. From the Grand Palace to hidden gems, explore the architectural wonders and cultural significance of Thai Buddhism."
          : "방콕의 웅장한 사원들을 통해 방콕의 영적인 면을 발견하세요. 왕궁부터 숨겨진 보석까지, 태국 불교의 건축적 경이로움과 문화적 중요성을 탐험하세요.",
      completedTasks: 2,
      tasks: [
        {
          id: "watarun",
          title: language === "en" ? "Visit Wat Arun" : "왓 아룬 방문",
          description:
            language === "en"
              ? "Temple of Dawn with its distinctive spires on the Chao Phraya River"
              : "차오프라야 강에 있는 독특한 첨탑이 있는 새벽 사원",
          image: "/images/watarun.jpg",
          completed: true,
          locked: false,
          reward: "+80 XP",
        },
        {
          id: "watpho",
          title: language === "en" ? "Explore Wat Pho" : "왓 포 탐험",
          description: language === "en" ? "Home to the famous Reclining Buddha statue" : "유명한 와불상이 있는 곳",
          image: "/reclining-buddha-glory.png",
          completed: true,
          locked: false,
          reward: "+80 XP",
        },
        {
          id: "grandpalace",
          title: language === "en" ? "Tour the Grand Palace" : "왕궁 투어",
          description:
            language === "en"
              ? "Former royal residence with Wat Phra Kaew (Temple of the Emerald Buddha)"
              : "왓 프라 깨우(에메랄드 불상 사원)가 있는 이전 왕실 거주지",
          image: "/images/watphrakaew.jpg",
          completed: false,
          locked: false,
          reward: "+80 XP",
        },
        {
          id: "watsamaen",
          title: language === "en" ? "Visit Wat Saket (Golden Mount)" : "왓 사켓(골든 마운트) 방문",
          description:
            language === "en"
              ? "Temple on a hill offering panoramic views of Bangkok"
              : "방콕의 파노라마 전망을 제공하는 언덕 위의 사원",
          image: "/golden-mount-panorama.png",
          completed: false,
          locked: false,
          reward: "+80 XP",
        },
        {
          id: "wattraimit",
          title: language === "en" ? "Discover Wat Traimit" : "왓 트라이밋 발견",
          description:
            language === "en"
              ? "Home to the world's largest solid gold Buddha statue"
              : "세계에서 가장 큰 순금 불상이 있는 곳",
          image: "/golden-buddha-temple.png",
          completed: false,
          locked: true,
          reward: "+80 XP",
        },
      ],
      rewardTitle: language === "en" ? "Bangkok Temple Explorer Badge" : "방콕 사원 탐험가 배지",
      rewardDescription:
        language === "en"
          ? "Complete all tasks to earn the prestigious Bangkok Temple Explorer Badge and unlock special cultural insights!"
          : "모든 작업을 완료하여 명망 높은 방콕 사원 탐험가 배지를 획득하고 특별한 문화적 통찰력을 잠금 해제하세요!",
      rewardImage: "/images/bangkoktemplebadge.png",
    },
    "newyork-landmarks": {
      title: language === "en" ? "NYC Iconic Landmarks" : "뉴욕 상징적 랜드마크",
      location: language === "en" ? "New York City, USA" : "미국 뉴욕시",
      description:
        language === "en"
          ? "Experience the most iconic landmarks that define the New York City skyline and culture. From towering skyscrapers to historic monuments, discover what makes NYC one of the world's most recognizable cities."
          : "뉴욕시의 스카이라인과 문화를 정의하는 가장 상징적인 랜드마크를 경험하세요. 높은 마천루부터 역사적인 기념물까지, 뉴욕을 세계에서 가장 인식하기 쉬운 도시 중 하나로 만드는 것을 발견하세요.",
      completedTasks: 3,
      tasks: [
        {
          id: "timessquare",
          title: language === "en" ? "Visit Times Square" : "타임스 스퀘어 방문",
          description:
            language === "en"
              ? "The bustling heart of Manhattan with dazzling billboards"
              : "현란한 광고판이 있는 맨해튼의 분주한 중심지",
          image: "/times-square-night.png",
          completed: true,
          locked: false,
          reward: "+90 XP",
        },
        {
          id: "statueofliberty",
          title: language === "en" ? "Visit Statue of Liberty" : "자유의 여신상 방문",
          description:
            language === "en"
              ? "Iconic symbol of freedom on Liberty Island"
              : "리버티 섬에 있는 자유의 상징적인 상징물",
          image: "/liberty-harbor-view.png",
          completed: true,
          locked: false,
          reward: "+90 XP",
        },
        {
          id: "centralpark",
          title: language === "en" ? "Explore Central Park" : "센트럴 파크 탐험",
          description: language === "en" ? "Urban oasis in the heart of Manhattan" : "맨해튼 중심부의 도시 오아시스",
          image: "/central-park-lake-skyline.png",
          completed: true,
          locked: false,
          reward: "+90 XP",
        },
        {
          id: "empirestate",
          title: language === "en" ? "Visit Empire State Building" : "엠파이어 스테이트 빌딩 방문",
          description:
            language === "en"
              ? "Iconic Art Deco skyscraper with observation deck"
              : "전망대가 있는 상징적인 아르데코 마천루",
          image: "/empire-state-view.png",
          completed: false,
          locked: false,
          reward: "+90 XP",
        },
        {
          id: "brooklynbridge",
          title: language === "en" ? "Walk the Brooklyn Bridge" : "브루클린 브릿지 걷기",
          description:
            language === "en"
              ? "Historic bridge connecting Manhattan and Brooklyn"
              : "맨해튼과 브루클린을 연결하는 역사적인 다리",
          image: "/brooklyn-bridge-sunset-glow.png",
          completed: false,
          locked: false,
          reward: "+90 XP",
        },
        {
          id: "onewtc",
          title: language === "en" ? "Visit One World Trade Center" : "원 월드 트레이드 센터 방문",
          description:
            language === "en"
              ? "Tallest building in the Western Hemisphere with observation deck"
              : "전망대가 있는 서반구에서 가장 높은 건물",
          image: "/one-wtc-skyline.png",
          completed: false,
          locked: true,
          reward: "+90 XP",
        },
      ],
      rewardTitle: language === "en" ? "NYC Explorer Badge" : "뉴욕 탐험가 배지",
      rewardDescription:
        language === "en"
          ? "Complete all tasks to earn the exclusive NYC Explorer Badge and unlock special city insights!"
          : "모든 작업을 완료하여 독점 뉴욕 탐험가 배지를 획득하고 특별한 도시 통찰력을 잠금 해제하세요!",
      rewardImage: "/images/nycexplorerbadge.png",
    },
    "newyork-food": {
      title: language === "en" ? "New York Food Tour" : "뉴욕 음식 투어",
      location: language === "en" ? "New York City, USA" : "미국 뉴욕시",
      description:
        language === "en"
          ? "Taste your way through the diverse culinary landscape of New York City. From iconic street food to international cuisines, discover why NYC is a global food capital."
          : "뉴욕시의 다양한 요리 풍경을 맛보세요. 상징적인 길거리 음식부터 국제 요리까지, 뉴욕이 왜 세계적인 음식 수도인지 발견하세요.",
      completedTasks: 1,
      tasks: [
        {
          id: "nypizza",
          title: language === "en" ? "Try New York Pizza" : "뉴욕 피자 맛보기",
          description:
            language === "en"
              ? "The iconic thin-crust slice, folded and eaten on the go"
              : "상징적인 얇은 크러스트 조각, 접어서 이동 중에 먹는 피자",
          image: "/images/newyorkpizza.jpeg",
          completed: true,
          locked: false,
          reward: "+70 XP",
        },
        {
          id: "bagellox",
          title: language === "en" ? "Enjoy a Bagel with Lox" : "베이글과 훈제연어 즐기기",
          description:
            language === "en"
              ? "Classic NYC breakfast with cream cheese and smoked salmon"
              : "크림치즈와 훈제 연어가 있는 클래식 뉴욕 아침 식사",
          image: "/new-york-lox-bagel.png",
          completed: false,
          locked: false,
          reward: "+70 XP",
        },
        {
          id: "pastrami",
          title: language === "en" ? "Savor a Pastrami Sandwich" : "파스트라미 샌드위치 맛보기",
          description:
            language === "en"
              ? "Iconic deli sandwich with cured meat on rye bread"
              : "호밀빵에 절인 고기가 들어간 상징적인 델리 샌드위치",
          image: "/piled-high-pastrami.png",
          completed: false,
          locked: false,
          reward: "+70 XP",
        },
        {
          id: "dimsum",
          title: language === "en" ? "Experience Chinatown Dim Sum" : "차이나타운 딤섬 경험하기",
          description:
            language === "en"
              ? "Variety of small dishes in one of America's oldest Chinatowns"
              : "미국에서 가장 오래된 차이나타운 중 하나에서 다양한 작은 요리",
          image: "/bustling-chinatown-dim-sum.png",
          completed: false,
          locked: false,
          reward: "+70 XP",
        },
        {
          id: "halalcart",
          title: language === "en" ? "Try a Halal Cart Meal" : "할랄 카트 식사 맛보기",
          description:
            language === "en"
              ? "Street food favorite with rice, meat, and the famous white sauce"
              : "밥, 고기, 그리고 유명한 화이트 소스가 있는 길거리 음식 인기 메뉴",
          image: "/bustling-halal-cart.png",
          completed: false,
          locked: false,
          reward: "+70 XP",
        },
        {
          id: "cheesecake",
          title: language === "en" ? "Taste New York Cheesecake" : "뉴욕 치즈케이크 맛보기",
          description:
            language === "en" ? "Creamy dessert that's become a city institution" : "도시의 기관이 된 크리미한 디저트",
          image: "/classic-new-york-cheesecake.png",
          completed: false,
          locked: true,
          reward: "+70 XP",
        },
        {
          id: "cronut",
          title: language === "en" ? "Find a Cronut" : "크로넛 찾기",
          description:
            language === "en"
              ? "Famous croissant-donut hybrid that started a global trend"
              : "전 세계적인 트렌드를 시작한 유명한 크루아상-도넛 하이브리드",
          image: "/frosted-layered-pastry.png",
          completed: false,
          locked: true,
          reward: "+70 XP",
        },
      ],
      rewardTitle: language === "en" ? "NYC Foodie Badge" : "뉴욕 푸디 배지",
      rewardDescription:
        language === "en"
          ? "Complete all tasks to earn the exclusive NYC Foodie Badge and unlock special restaurant recommendations!"
          : "모든 작업을 완료하여 독점 뉴욕 푸디 배지를 획득하고 특별한 레스토랑 추천을 잠금 해제하세요!",
      rewardImage: "/images/nycfoodiebadge.png",
    },
    "jeju-nature": {
      title: language === "en" ? "Jeju Natural Wonders" : "제주 자연의 경이로움",
      location: language === "en" ? "Jeju Island, South Korea" : "대한민국 제주도",
      description:
        language === "en"
          ? "Explore the breathtaking natural landscapes of Jeju Island. From volcanic formations to pristine beaches, discover why this island is known as 'Korea's Hawaii' and a UNESCO World Natural Heritage site."
          : "제주도의 숨막히는 자연 경관을 탐험하세요. 화산 지형부터 깨끗한 해변까지, 이 섬이 왜 '한국의 하와이'와 유네스코 세계자연유산으로 알려져 있는지 발견하세요.",
      completedTasks: 2,
      tasks: [
        {
          id: "hallasan",
          title: language === "en" ? "Hike Hallasan Mountain" : "한라산 등산",
          description:
            language === "en"
              ? "South Korea's highest mountain with a crater lake at the summit"
              : "정상에 분화구 호수가 있는 한국에서 가장 높은 산",
          image: "/hallasan-green-slopes.png",
          completed: true,
          locked: false,
          reward: "+85 XP",
        },
        {
          id: "seongsan",
          title: language === "en" ? "Visit Seongsan Ilchulbong" : "성산일출봉 방문",
          description:
            language === "en"
              ? "Dramatic tuff cone formed by volcanic eruption, known as 'Sunrise Peak'"
              : "화산 폭발로 형성된 극적인 응회구, '일출봉'으로 알려짐",
          image: "/jeju-sunrise-crater.png",
          completed: true,
          locked: false,
          reward: "+85 XP",
        },
        {
          id: "manjanggul",
          title: language === "en" ? "Explore Manjanggul Cave" : "만장굴 탐험",
          description:
            language === "en"
              ? "One of the world's longest lava tubes with unique formations"
              : "독특한 지형을 가진 세계에서 가장 긴 용암 튜브 중 하나",
          image: "/images/manjang.jpg",
          completed: false,
          locked: false,
          reward: "+85 XP",
        },
        {
          id: "cheonjiyeon",
          title: language === "en" ? "Visit Cheonjiyeon Waterfall" : "천지연 폭포 방문",
          description:
            language === "en"
              ? "Beautiful waterfall whose name means 'God's pond'"
              : "'하늘과 땅이 만나는 연못'이라는 의미의 아름다운 폭포",
          image: "/cheonjiyeon-waterfall.png",
          completed: false,
          locked: false,
          reward: "+85 XP",
        },
        {
          id: "hyeopjae",
          title: language === "en" ? "Relax at Hyeopjae Beach" : "협재 해변에서 휴식",
          description:
            language === "en"
              ? "White sand beach with emerald waters and view of Biyangdo Island"
              : "비양도를 볼 수 있는 에메랄드 물과 하얀 모래 해변",
          image: "/hyeopjae-beach-emerald.png",
          completed: false,
          locked: true,
          reward: "+85 XP",
        },
      ],
      rewardTitle: language === "en" ? "Jeju Nature Explorer Badge" : "제주 자연 탐험가 배지",
      rewardDescription:
        language === "en"
          ? "Complete all tasks to earn the exclusive Jeju Nature Explorer Badge and unlock special hiking trail recommendations!"
          : "모든 작업을 완료하여 독점 제주 자연 탐험가 배지를 획득하고 특별한 하이킹 코스 추천을 잠금 해제하세요!",
      rewardImage: "/images/jejunaturebadge.png",
    },
    "jeju-culture": {
      title: language === "en" ? "Jeju Cultural Experience" : "제주 문화 체험",
      location: language === "en" ? "Jeju Island, South Korea" : "대한민국 제주도",
      description:
        language === "en"
          ? "Immerse yourself in the unique culture of Jeju Island. From traditional villages to local customs, discover the distinctive heritage that sets Jeju apart from mainland Korea."
          : "제주도의 독특한 문화에 몰입하세요. 전통 마을부터 지역 관습까지, 제주도를 한국 본토와 구별하는 독특한 유산을 발견하세요.",
      completedTasks: 0,
      tasks: [
        {
          id: "seongeup",
          title: language === "en" ? "Visit Seongeup Folk Village" : "성읍 민속마을 방문",
          description:
            language === "en"
              ? "Well-preserved traditional village with thatched-roof houses"
              : "초가지붕 집이 있는 잘 보존된 전통 마을",
          image: "/seongeup-village-courtyard.png",
          completed: false,
          locked: false,
          reward: "+80 XP",
        },
        {
          id: "haenyeo",
          title: language === "en" ? "Learn about Haenyeo (Female Divers)" : "해녀(여성 다이버)에 대해 배우기",
          description:
            language === "en"
              ? "UNESCO cultural heritage of female free-divers who harvest seafood"
              : "해산물을 수확하는 여성 프리다이버의 유네스코 문화유산",
          image: "/jeju-divers-gathering.png",
          completed: false,
          locked: false,
          reward: "+80 XP",
        },
        {
          id: "dolharubang",
          title: language === "en" ? "Find Dol Hareubang Statues" : "돌하르방 석상 찾기",
          description:
            language === "en"
              ? "Iconic stone grandfather statues that are symbols of Jeju"
              : "제주의 상징인 상징적인 돌 할아버지 석상",
          image: "/jeju-guardians.png",
          completed: false,
          locked: false,
          reward: "+80 XP",
        },
        {
          id: "osulloc",
          title: language === "en" ? "Visit O'Sulloc Tea Museum" : "오설록 티 뮤지엄 방문",
          description:
            language === "en"
              ? "Museum dedicated to Korean tea culture with tea plantations"
              : "차 농장이 있는 한국 차 문화 전용 박물관",
          image: "/jeju-green-tea-vista.png",
          completed: false,
          locked: false,
          reward: "+80 XP",
        },
        {
          id: "loveland",
          title: language === "en" ? "Explore Jeju Loveland" : "제주 러브랜드 탐험",
          description:
            language === "en"
              ? "Unique sculpture park dedicated to sensuality and eroticism"
              : "감각과 에로티시즘에 전념하는 독특한 조각 공원",
          image: "/images/jejuloveland.jpg",
          completed: false,
          locked: true,
          reward: "+80 XP",
        },
      ],
      rewardTitle: language === "en" ? "Jeju Cultural Ambassador Badge" : "제주 문화 대사 배지",
      rewardDescription:
        language === "en"
          ? "Complete all tasks to earn the exclusive Jeju Cultural Ambassador Badge and unlock special cultural insights!"
          : "모든 작업을 완료하여 독점 제주 문화 대사 배지를 획득하고 특별한 문화적 통찰력을 잠금 해제하세요!",
      rewardImage: "/images/jejuambassadorbadge.png",
    },
  }

  return questsData[questId] || null
}

export default QuestDetailsPage
