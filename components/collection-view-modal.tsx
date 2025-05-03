// components/collection-view-modal.tsx

import type React from "react"
import { FaUtensils, FaMapMarkedAlt } from "react-icons/fa"

interface CollectionData {
  description: string
  locations: {
    name: string
    icon: React.ReactNode
    unlocked: boolean
  }[]
  reward: {
    xp: number
    badge: string
  }
}

interface CollectionViewModalProps {
  title: string
  currentLanguage: string
}

const CollectionViewModal: React.FC<CollectionViewModalProps> = ({ title, currentLanguage }) => {
  const getCollectionData = (): CollectionData | null => {
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
    } else if (title.includes("Dullegil") || title.includes("둘레길")) {
      return {
        description:
          currentLanguage === "en"
            ? "Conquer the Seoul Dullegil Trail by completing all 8 courses around the city."
            : "서울 둘레길의 8개 코스를 모두 완주하여 서울 둘레길을 정복하세요.",
        locations: [
          {
            name: currentLanguage === "en" ? "Course 1: Suraksan" : "1코스: 수락산",
            icon: <FaMapMarkedAlt />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Course 2: Deokneunggogae" : "2코스: 덕릉������",
            icon: <FaMapMarkedAlt />,
            unlocked: true,
          },
          {
            name: currentLanguage === "en" ? "Course 3: Bulamsan" : "3코스: ���암산",
            icon: <FaMapMarkedAlt />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Course 4: Yongmasan" : "4코스: 용마산",
            icon: <FaMapMarkedAlt />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Course 5: Achasan" : "5코스: 아차산",
            icon: <FaMapMarkedAlt />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Course 6: Godeoksan" : "6코스: 고덕산",
            icon: <FaMapMarkedAlt />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Course 7: Iljasan" : "7코스: 일자산",
            icon: <FaMapMarkedAlt />,
            unlocked: false,
          },
          {
            name: currentLanguage === "en" ? "Course 8: Jangji/Tancheon" : "8코스: 장지/탄천",
            icon: <FaMapMarkedAlt />,
            unlocked: false,
          },
        ],
        reward: {
          xp: 350,
          badge: currentLanguage === "en" ? "Hiker Badge" : "하이커 배지",
        },
      }
    }

    return null
  }

  const collectionData = getCollectionData()

  if (!collectionData) {
    return <div>Collection not found.</div>
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{collectionData.description}</p>
      <h3>Locations:</h3>
      <ul>
        {collectionData.locations.map((location, index) => (
          <li key={index}>
            {location.icon} {location.name} - {location.unlocked ? "Unlocked" : "Locked"}
          </li>
        ))}
      </ul>
      <h3>Reward:</h3>
      <p>XP: {collectionData.reward.xp}</p>
      <p>Badge: {collectionData.reward.badge}</p>
    </div>
  )
}

export default CollectionViewModal
