"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AlbumCanvasPage from "@/components/album-canvas-page"

export default function AlbumCanvasRoute() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState("en")

  const handleBack = () => {
    router.back()
  }

  return <AlbumCanvasPage currentLanguage={currentLanguage} onBack={handleBack} />
}
