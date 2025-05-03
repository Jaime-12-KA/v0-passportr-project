"use client"

import { useEffect } from "react"
import Image from "next/image"
import { handleImageError, normalizeImagePath } from "@/utils/image-utils"
import { debugImagePaths, logEnvironmentInfo } from "@/utils/debug-utils"

const testImages = [
  "/images/logo-new.png",
  "/images/challenge-cafe.png",
  "/images/challenge-landmark.png",
  "/images/challenge-seoulhistory.png",
  "/images/challenge-streetfood.png",
  "/images/challenge-tastybangkok.png",
  "/images/challenge-hike.png",
]

export default function ImageTest() {
  useEffect(() => {
    // 환경 정보 로깅
    logEnvironmentInfo()

    // 이미지 경로 디버깅
    const normalizedPaths = testImages.map((path) => normalizeImagePath(path))
    debugImagePaths(normalizedPaths)
  }, [])

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Image Path Test</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {testImages.map((src, index) => {
          const normalizedSrc = normalizeImagePath(src)
          return (
            <div key={index} className="flex flex-col items-center">
              <div className="w-20 h-20 relative mb-2 border border-gray-200 rounded">
                <Image
                  src={normalizedSrc || "/placeholder.svg"}
                  alt={`Test image ${index + 1}`}
                  width={80}
                  height={80}
                  onError={(e) =>
                    handleImageError(e, `/placeholder.svg?height=80&width=80&query=test-image-${index + 1}`)
                  }
                  style={{ objectFit: "cover" }}
                />
              </div>
              <p className="text-xs text-center break-all">{normalizedSrc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
