"use client"

import type { FC } from "react"
import {
  FaTimes,
  FaMapMarkerAlt,
  FaUtensils,
  FaHome,
  FaLandmark,
  FaLock,
  FaBolt,
  FaMoon,
  FaTheaterMasks,
  FaFish,
  FaCookieBite,
  FaStore,
  FaPalette,
  FaWater,
  FaConciergeBell,
} from "react-icons/fa"

interface CollectionViewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  progress: string
  progressPercent: number
  stamps: number
  totalStamps: number
  color: string
  currentLanguage: string
  setShowFilterModal?: (show: boolean) => void
}

const CollectionViewModal: FC<CollectionViewModalProps> = ({
  isOpen,
  onClose,
  title,
  progress,
  progressPercent,
  stamps,
  totalStamps,
  color,
  currentLanguage,
  setShowFilterModal,
}) => {
  if (!isOpen) return null

  // Collection data based on title
  const getCollectionData = () => {
    if (title.includes("Street Food") || title.includes("길거리 음식")) {
      return {
        description:
          currentLanguage === "en"
            ? "Explore Seoul's vibrant street food culture by visiting these iconic locations."
            : "이 상징적인 장소들을 방문하여 서울의 활기찬 길거리 음식 문화를 탐험하세요.",
        locations: [
          {
            name: currentLanguage === "en" ? "Gwangjang Market" : "광장시장",
            icon: <FaUtensils />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Myeongdong Street Food Alley" : "명동 길거리 음식 골목",
            icon: <FaUtensils />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Tongin Market" : "통인시장",
            icon: <FaUtensils />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Namdaemun Market" : "남대문시장",
            icon: <FaUtensils />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Hongdae Food Street" : "홍대 푸드 스트리트",
            icon: <FaUtensils />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Dongdaemun Night Market" : "동대문 야시장",
            icon: <FaUtensils />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Yeouido Night Market" : "여의도 야시장",
            icon: <FaUtensils />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Gangnam Street Food" : "강남 길거리 음식",
            icon: <FaUtensils />,
            unlocked: false,
          },
        ],
        reward: {
          xp: 300,
          badge: currentLanguage === "en" ? "Food Explorer" : "음식 탐험가",
        },
      }
    } else if (title.includes("Historical") || title.includes("역사 유적지")) {
      return {
        description:
          currentLanguage === "en"
            ? "Discover Seoul's rich history by visiting these historical landmarks."
            : "이 역사적인 랜드마크를 방문하여 서울의 풍부한 역사를 발견하세요.",
        locations: [
          {
            name: currentLanguage === "en" ? "Gyeongbokgung Palace" : "경복궁",
            icon: <FaLandmark />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Changdeokgung Palace" : "창덕궁",
            icon: <FaLandmark />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Bukchon Hanok Village" : "북촌 한옥마을",
            icon: <FaHome />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Deoksugung Palace" : "덕수궁",
            icon: <FaLandmark />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Jongmyo Shrine" : "종묘",
            icon: <FaLandmark />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Seoul City Wall" : "서울 성곽",
            icon: <FaMapMarkerAlt />,
            unlocked: false,
          },
        ],
        reward: {
          xp: 250,
          badge: currentLanguage === "en" ? "History Buff" : "역사 애호가",
        },
      }
    } else if (title.includes("Night Explorer") || title.includes("야행성 탐험가")) {
      return {
        description:
          currentLanguage === "en"
            ? "Explore Seoul's vibrant nightlife and evening attractions."
            : "서울의 활기찬 밤 문화와 저녁 명소를 탐험하세요.",
        locations: [
          {
            name: currentLanguage === "en" ? "Namsan Tower at Night" : "밤의 남산타워",
            icon: <FaMoon />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Han River Night Cruise" : "한강 야간 크루즈",
            icon: <FaMoon />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Dongdaemun Night Market" : "동대문 야시장",
            icon: <FaMoon />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Hongdae Night Street" : "홍대 야간 거리",
            icon: <FaMoon />,
            unlocked: false,
          },
        ],
        reward: {
          xp: 200,
          badge: currentLanguage === "en" ? "Night Explorer" : "야행성 탐험가",
        },
      }
    } else if (title.includes("Culture Enthusiast") || title.includes("문화 애호가")) {
      return {
        description:
          currentLanguage === "en"
            ? "Immerse yourself in Korean cultural experiences and performances."
            : "한국 문화 체험과 공연에 몰입하세요.",
        locations: [
          {
            name: currentLanguage === "en" ? "National Museum of Korea" : "국립중앙박물관",
            icon: <FaTheaterMasks />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Korean Folk Village" : "한국민속촌",
            icon: <FaTheaterMasks />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Nanta Show" : "난타 공연",
            icon: <FaTheaterMasks />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Bukchon Traditional Experience" : "북촌 전통 체험",
            icon: <FaTheaterMasks />,
            unlocked: false,
          },
        ],
        reward: {
          xp: 220,
          badge: currentLanguage === "en" ? "Culture Enthusiast" : "문화 애호가",
        },
      }
    } else if (title.includes("Busan Taste & Style") || title.includes("부산 맛과 멋")) {
      return {
        description:
          currentLanguage === "en"
            ? "From vibrant markets to special alleys, discover the real taste and style of Busan!"
            : "활기찬 시장부터 특별한 골목까지, 진짜 부산의 맛과 멋을 찾아 떠나보세요!",
        locations: [
          {
            name: currentLanguage === "en" ? "Jagalchi Market" : "자갈치 시장",
            icon: <FaFish />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "BIFF Square Ssiat Hotteok" : "BIFF 광장 씨앗호떡",
            icon: <FaCookieBite />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Gukje Market" : "국제시장",
            icon: <FaStore />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Gamcheon Culture Village" : "감천문화마을",
            icon: <FaPalette />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Huinnyeoul Culture Village" : "흰여울문화마을",
            icon: <FaWater />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Dwaeji Gukbap" : "돼지국밥 한 그릇",
            icon: <FaUtensils />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Bupyeong Kkangtong Night Market" : "부평깡통야시장",
            icon: <FaConciergeBell />,
            unlocked: false,
          },
        ],
        reward: {
          xp: 350,
          badge: currentLanguage === "en" ? "Busan Foodie" : "부산 미식가",
        },
      }
    } else if (title.includes("Bangkok Taste & Style") || title.includes("방콕 맛과 멋")) {
      return {
        description:
          currentLanguage === "en"
            ? "From vibrant markets to magnificent temples, discover the real taste and style of Bangkok!"
            : "활기찬 시장부터 웅장한 사원까지, 진짜 방콕의 맛과 멋을 찾아 떠나보세요!",
        locations: [
          {
            name: currentLanguage === "en" ? "Wat Arun (Temple of Dawn)" : "왓 아룬 (새벽 사원)",
            icon: <FaLandmark />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Grand Palace" : "왕궁",
            icon: <FaLandmark />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Chatuchak Weekend Market" : "짜뚜짝 주말 시장",
            icon: <FaStore />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Khao San Road" : "카오산 로드",
            icon: <FaMapMarkerAlt />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Chinatown (Yaowarat)" : "차이나타운 (야오와랏)",
            icon: <FaUtensils />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Chao Phraya River Cruise" : "차오프라야 강 크루즈",
            icon: <FaWater />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Jim Thompson House" : "짐 톰슨 하우스",
            icon: <FaHome />,
            unlocked: false,
          },
        ],
        reward: {
          xp: 350,
          badge: currentLanguage === "en" ? "Bangkok Explorer" : "방콕 탐험가",
        },
      }
    } else {
      // 기본 도쿄 신사 컬렉션 (이제 사용되지 않음)
      return {
        description:
          currentLanguage === "en"
            ? "Explore Tokyo's beautiful temples and shrines."
            : "도쿄의 아름다운 사원과 신사를 탐험하세요.",
        locations: [
          {
            name: currentLanguage === "en" ? "Meiji Shrine" : "메이지 신사",
            icon: <FaLandmark />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Senso-ji Temple" : "센소지 절",
            icon: <FaLandmark />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Zojoji Temple" : "조조지 절",
            icon: <FaLandmark />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Nezu Shrine" : "네즈 신사",
            icon: <FaLandmark />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Yasukuni Shrine" : "야스쿠니 신사",
            icon: <FaLandmark />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Gotokuji Temple" : "고토쿠지 절",
            icon: <FaLandmark />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Kanda Shrine" : "칸다 신사",
            icon: <FaLandmark />,
            unlocked: false,
          },
        ],
        reward: {
          xp: 350,
          badge: currentLanguage === "en" ? "Spiritual Explorer" : "영적 탐험가",
        },
      }
    }
  }

  const collectionData = getCollectionData()

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => setShowFilterModal && setShowFilterModal(false)}
    >
      <div
        className="popup p-0 bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 완전히 고정된 헤더 - position: absolute 대신 fixed 사용 */}
        <div className="fixed top-[5vh] left-0 right-0 mx-auto max-w-2xl w-full z-30 bg-white rounded-t-lg border-b border-light-sand shadow-md">
          <div className="flex justify-between items-center p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold serif-font">{title}</h2>
            <button
              onClick={onClose}
              className="hover-effect w-10 h-10 flex items-center justify-center bg-light-sand rounded-full"
            >
              <FaTimes className="text-stone-gray" />
            </button>
          </div>
        </div>

        {/* 헤더 높이만큼 상단 패딩 추가 */}
        <div className="pt-[72px] sm:pt-[88px]"></div>

        {/* 스크롤 가능한 내용 영역 */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          <p className="mb-6 text-stone-gray">{collectionData.description}</p>

          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">{currentLanguage === "en" ? "Collection Progress:" : "컬렉션 진행:"}</span>
            <span className="text-sunset-coral font-medium">{progress}</span>
          </div>
          <div className="progress-bar mb-6">
            <div className={`progress-fill bg-${color}`} style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {collectionData.locations.map((location, index) => (
              <div key={index} className="text-center">
                {location.unlocked ? (
                  <div className={`w-16 h-16 rounded-full bg-${color} flex items-center justify-center mx-auto mb-2`}>
                    {location.icon}
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-stone-gray flex items-center justify-center mx-auto mb-2 badge-locked">
                    <FaLock className="text-cloud-white" />
                  </div>
                )}
                <p className="text-sm font-medium">{location.name}</p>
              </div>
            ))}
          </div>

          <div className="bg-light-sand p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-3">{currentLanguage === "en" ? "Completion Rewards:" : "완료 보상:"}</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-sunshine-yellow rounded-full flex items-center justify-center mr-3">
                  <FaMapMarkerAlt className="text-deep-navy" />
                </div>
                <span className="text-deep-navy">{collectionData.reward.badge}</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-sky-blue rounded-full flex items-center justify-center mr-3">
                  <FaBolt className="text-brand-blue text-lg" />
                </div>
                <span className="text-deep-navy">+{collectionData.reward.xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* 고정된 푸터 */}
        <div className="border-t border-light-sand p-4 flex justify-center bg-white rounded-b-lg">
          <button
            className={`bg-${color} text-cloud-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors btn-effect`}
            onClick={onClose}
          >
            {currentLanguage === "en" ? "Continue Exploring" : "계속 탐험하기"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CollectionViewModal
