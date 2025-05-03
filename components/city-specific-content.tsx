import type React from "react"
import { FaBuilding, FaUmbrellaBeach, FaArchway, FaLandmark } from "react-icons/fa"

interface CitySpecificContentProps {
  cityId: string
  currentLanguage: string
}

const CitySpecificContent: React.FC<CitySpecificContentProps> = ({ cityId, currentLanguage }) => {
  // 도시별 특화 콘텐츠 정의
  const getCityContent = () => {
    switch (cityId) {
      case "seoul":
        return {
          icon: <FaBuilding className="text-sky-blue text-2xl" />,
          title: currentLanguage === "en" ? "Seoul Insider Tips" : "서울 현지인 팁",
          content:
            currentLanguage === "en"
              ? "Seoul's subway system is one of the most efficient in the world. Get a T-money card for easy travel."
              : "서울의 지하철 시스템은 세계에서 가장 효율적인 시스템 중 하나입니다. 쉬운 여행을 위해 티머니 카드를 구입하세요.",
          specialFeature: {
            name: currentLanguage === "en" ? "Palace Closing Days" : "궁궐 휴무일",
            data:
              currentLanguage === "en"
                ? "Gyeongbokgung: Tuesdays | Changdeokgung: Mondays"
                : "경복궁: 화요일 | 창덕궁: 월요일",
          },
        }
      case "bangkok":
        return {
          icon: <FaLandmark className="text-sunshine-yellow text-2xl" />,
          title: currentLanguage === "en" ? "Bangkok Temple Etiquette" : "방콕 사원 예절",
          content:
            currentLanguage === "en"
              ? "When visiting temples, dress modestly covering shoulders and knees. Remove shoes before entering temple buildings."
              : "사원 방문 시 어깨와 무릎을 가리는 단정한 복장을 착용하세요. 사원 건물에 들어가기 전에 신발을 벗으세요.",
          specialFeature: {
            name: currentLanguage === "en" ? "River Taxi Times" : "수상 택시 시간",
            data:
              currentLanguage === "en"
                ? "Chao Phraya Express: 6AM-7PM | Tourist Boat: 9AM-5:30PM"
                : "차오프라야 익스프레스: 오전 6시-오후 7시 | 관광 보트: 오전 9시-오후 5시 30분",
          },
        }
      case "busan":
        return {
          icon: <FaUmbrellaBeach className="text-sunset-coral text-2xl" />,
          title: currentLanguage === "en" ? "Busan Beach Guide" : "부산 해변 가이드",
          content:
            currentLanguage === "en"
              ? "Haeundae Beach gets very crowded during summer. Visit early morning or evening for a more peaceful experience."
              : "해운대 해변은 여름에 매우 붐빕니다. 더 평화로운 경험을 위해 이른 아침이나 저녁에 방문하세요.",
          specialFeature: {
            name: currentLanguage === "en" ? "Tide Times" : "조수 시간",
            data:
              currentLanguage === "en"
                ? "High Tide: 10:30 AM & 10:45 PM | Low Tide: 4:15 AM & 4:30 PM"
                : "만조: 오전 10:30 & 오후 10:45 | 간조: 오전 4:15 & 오후 4:30",
          },
        }
      case "tokyo":
        return {
          icon: <FaArchway className="text-deep-navy text-2xl" />,
          title: currentLanguage === "en" ? "Tokyo Shrine Etiquette" : "도쿄 신사 예절",
          content:
            currentLanguage === "en"
              ? "When visiting shrines, bow slightly before entering the torii gate. Avoid walking in the center of the path as it's reserved for deities."
              : "신사를 방문할 때는 도리이 문을 들어가기 전에 약간 인사하세요. 신을 위해 예약된 길의 중앙에서 걷는 것을 피하세요.",
          specialFeature: {
            name: currentLanguage === "en" ? "Festival Calendar" : "축제 일정",
            data:
              currentLanguage === "en"
                ? "Sanja Matsuri: May | Kanda Matsuri: May (odd years) | Sumidagawa Fireworks: July"
                : "산자 마츠리: 5월 | 칸다 마츠리: 5월 (홀수 해) | 스미다가와 불꽃놀이: 7월",
          },
        }
      case "newyork":
        return {
          icon: <FaLandmark className="text-sunshine-yellow text-2xl" />,
          title: currentLanguage === "en" ? "NYC Subway Tips" : "뉴욕 지하철 팁",
          content:
            currentLanguage === "en"
              ? "Express trains are marked with letters, while local trains use numbers. Check the subway map to see which stations they stop at."
              : "급행 열차는 문자로 표시되고 일반 열차는 숫자를 사용합니다. 지하철 지도를 확인하여 어떤 역에 정차하는지 확인하세요.",
          specialFeature: {
            name: currentLanguage === "en" ? "Museum Free Days" : "박물관 무료 일",
            data:
              currentLanguage === "en"
                ? "MoMA: Friday 4-8PM | Natural History Museum: Pay-what-you-wish"
                : "MoMA: 금요일 4-8PM | 자연사 박물관: 원하는 만큼 지불",
          },
        }
      default:
        return null
    }
  }

  const cityContent = getCityContent()

  if (!cityContent) return null

  return (
    <div className="city-specific-content bg-light-sand p-4 rounded-lg mb-6">
      <div className="flex items-center mb-3">
        {cityContent.icon}
        <h4 className="font-bold ml-2">{cityContent.title}</h4>
      </div>
      <p className="text-sm mb-4">{cityContent.content}</p>

      {cityContent.specialFeature && (
        <div className="bg-white bg-opacity-50 p-3 rounded">
          <h5 className="text-sm font-medium mb-1">{cityContent.specialFeature.name}</h5>
          <p className="text-xs">{cityContent.specialFeature.data}</p>
        </div>
      )}
    </div>
  )
}

export default CitySpecificContent
