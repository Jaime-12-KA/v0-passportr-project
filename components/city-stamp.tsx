import type React from "react"
import { FaLock } from "react-icons/fa"
import { SafeImage } from "@/components/ui/safe-image"

interface CityStampProps {
  cityId: string
  stampName: string
  stampImage: string
  stampDate: string
  isCollected: boolean
}

const CityStamp: React.FC<CityStampProps> = ({ cityId, stampName, stampImage, stampDate, isCollected }) => {
  // 도시별 스탬프 스타일 정의
  const getStampStyle = (cityId: string) => {
    switch (cityId) {
      case "seoul":
        return {
          borderColor: "var(--sunset-coral)",
          shape: "rounded-full", // 원형 스탬프
          borderWidth: "3px",
          shadowColor: "rgba(255, 82, 82, 0.3)",
          animation: "pulse",
        }
      case "busan":
        return {
          borderColor: "var(--sky-blue)",
          shape: "rounded-lg", // 사각형 스탬프
          borderWidth: "3px",
          shadowColor: "rgba(93, 169, 233, 0.3)",
          animation: "bounce",
        }
      case "tokyo":
        return {
          borderColor: "var(--deep-navy)",
          shape: "clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", // 육각형 스탬프
          borderWidth: "3px",
          shadowColor: "rgba(13, 71, 161, 0.3)",
          animation: "spin",
        }
      case "newyork":
        return {
          borderColor: "var(--sunshine-yellow)",
          shape: "clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // 다이아몬드 스탬프
          borderWidth: "3px",
          shadowColor: "rgba(255, 179, 0, 0.3)",
          animation: "flip",
        }
      default:
        return {
          borderColor: "var(--sky-blue)",
          shape: "rounded-full",
          borderWidth: "3px",
          shadowColor: "rgba(93, 169, 233, 0.3)",
          animation: "pulse",
        }
    }
  }

  const stampStyle = getStampStyle(cityId)

  return (
    <div className="flex flex-col items-center">
      {isCollected ? (
        <div
          className="passport-stamp-circle relative overflow-hidden"
          style={{
            width: "70px",
            height: "70px",
            borderWidth: stampStyle.borderWidth,
            borderStyle: "solid",
            borderColor: stampStyle.borderColor,
            borderRadius:
              stampStyle.shape === "rounded-full" ? "50%" : stampStyle.shape === "rounded-lg" ? "0.5rem" : "0",
            boxShadow: `0 0 10px ${stampStyle.shadowColor}`,
            [stampStyle.shape.startsWith("clip-path") ? "clipPath" : ""]: stampStyle.shape.startsWith("clip-path")
              ? stampStyle.shape.split(": ")[1]
              : "",
          }}
        >
          <div className="passport-stamp-image">
            {stampImage ? (
              <SafeImage
                src={stampImage}
                alt={stampName}
                width={70}
                height={70}
                className="w-full h-full object-cover"
                fallbackSrc="/placeholder.svg"
              />
            ) : (
              <SafeImage
                src="/placeholder.svg"
                alt={stampName}
                width={70}
                height={70}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      ) : (
        <div
          className="passport-stamp-circle relative overflow-hidden"
          style={{
            width: "70px",
            height: "70px",
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: "var(--stone-gray)",
            borderRadius:
              stampStyle.shape === "rounded-full" ? "50%" : stampStyle.shape === "rounded-lg" ? "0.5rem" : "0",
            [stampStyle.shape.startsWith("clip-path") ? "clipPath" : ""]: stampStyle.shape.startsWith("clip-path")
              ? stampStyle.shape.split(": ")[1]
              : "",
          }}
        >
          <div className="w-full h-full bg-stone-gray bg-opacity-50 flex items-center justify-center">
            <FaLock className="text-cloud-white" />
          </div>
        </div>
      )}
      <p className="text-sm font-medium text-center mt-2">{stampName}</p>
      {stampDate && <p className="text-xs text-center text-stone-gray">{stampDate}</p>}
    </div>
  )
}

export default CityStamp
