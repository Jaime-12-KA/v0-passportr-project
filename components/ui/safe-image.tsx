"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { getImagePath } from "@/utils/image-utils"

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  onLoad,
  onError,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(getImagePath(src))
  const [hasError, setHasError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // 이미지 소스가 변경되면 상태 초기화
    setImgSrc(getImagePath(src))
    setHasError(false)
    setIsLoading(true)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    if (!hasError) {
      console.warn(`Image failed to load: ${imgSrc}, falling back to: ${fallbackSrc}`)
      setImgSrc(getImagePath(fallbackSrc))
      setHasError(true)
      onError?.()
    } else {
      console.error(`Fallback image also failed to load: ${fallbackSrc}`)
      setImgSrc("/placeholder.svg")
    }
    setIsLoading(false)
  }

  return (
    <div className={`relative ${className?.includes("mix-blend") ? "" : className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        </div>
      )}
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: "contain",
          ...(className?.includes("mix-blend") ? { mixBlendMode: "multiply" } : {}),
        }}
        {...props}
      />
    </div>
  )
}
