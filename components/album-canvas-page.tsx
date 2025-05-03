"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Save,
  ChevronLeft,
  ChevronRight,
  Move,
  Stamp,
  ImageIcon,
  StickyNote,
  Type,
  X,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { triggerHapticFeedback, hapticPatterns } from "@/utils/haptics"
import { SafeImage } from "@/components/ui/safe-image"

interface CanvasItem {
  id: string
  type: "stamp" | "photo" | "sticker" | "text"
  content: string
  x: number
  y: number
  rotation: number
  scale: number
  zIndex: number
  width?: number
  height?: number
  text?: string
  fontSize?: number
  color?: string
}

interface AlbumCanvasPageProps {
  currentLanguage: string
  onBack?: () => void
}

const AlbumCanvasPage = ({ currentLanguage, onBack }: AlbumCanvasPageProps) => {
  const [activeTab, setActiveTab] = useState<"stamps" | "photos" | "stickers" | "text">("stamps")
  const [zoom, setZoom] = useState(1)
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([
    {
      id: "stamp-1",
      type: "stamp",
      content: "/images/artistic-stamp-gyeongbokgung.png",
      x: 120,
      y: 150,
      rotation: -5,
      scale: 1,
      zIndex: 1,
      width: 100,
      height: 100,
    },
    {
      id: "photo-1",
      type: "photo",
      content: "/images/seoul-gyeongbok.png",
      x: 220,
      y: 280,
      rotation: 3,
      scale: 1,
      zIndex: 2,
      width: 150,
      height: 120,
    },
    {
      id: "text-1",
      type: "text",
      content: "text",
      text: "My Seoul Adventure",
      x: 150,
      y: 80,
      rotation: 0,
      scale: 1,
      zIndex: 4,
      fontSize: 24,
      color: "#1E3A8A",
    },
  ])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [startPanOffset, setStartPanOffset] = useState({ x: 0, y: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)
  const [isEditingText, setIsEditingText] = useState(false)
  const [editingText, setEditingText] = useState("")
  const [addingItemAnimation, setAddingItemAnimation] = useState<string | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLTextAreaElement>(null)

  // Sample palette items
  const stamps = [
    { id: "stamp-gyeongbokgung", src: "/images/artistic-stamp-gyeongbokgung.png", alt: "Gyeongbokgung Stamp" },
    { id: "stamp-namsan", src: "/images/artistic-stamp-namsan.png", alt: "Namsan Tower Stamp" },
    { id: "stamp-bukchon", src: "/images/Stamp-Haeundae Beach.jpg", alt: "Bukchon Stamp" },
    { id: "stamp-jagalchi", src: "/images/Stamp_Jagalchi Market.jpg", alt: "Jagalchi Market Stamp" },
    { id: "stamp-gamcheon", src: "/images/Stamp_Gamcheon Culture Village.jpg", alt: "Gamcheon Village Stamp" },
    { id: "stamp-seoul", src: "/images/Special_Complete Seoul Tour.jpg", alt: "Seoul Tour Stamp" },
  ]

  // Real-world travel photos from the project
  const photos = [
    { id: "photo-gyeongbokgung", src: "/images/Check-in-Gyeongbokgung.jpg", alt: "Gyeongbokgung Palace" },
    { id: "photo-bukchon", src: "/images/bukchon.jpeg", alt: "Bukchon Hanok Village" },
    { id: "photo-hongdae", src: "/images/hongdae.jpeg", alt: "Hongdae Street" },
    { id: "photo-gwangjang", src: "/images/gwangjang.jpeg", alt: "Gwangjang Market" },
    { id: "photo-ntower", src: "/images/Check-in-N-tower.jpg", alt: "N Seoul Tower" },
    { id: "photo-bangkok-watarun", src: "/images/wat-arun.jpg", alt: "Wat Arun Temple" },
    { id: "photo-busan-haeundae", src: "/images/Stamp-Haeundae Beach.jpg", alt: "Haeundae Beach" },
    { id: "photo-busan-gamcheon", src: "/images/Stamp_Gamcheon Culture Village.jpg", alt: "Gamcheon Culture Village" },
    { id: "photo-busan-jagalchi", src: "/images/Stamp_Jagalchi Market.jpg", alt: "Jagalchi Market" },
  ]

  // Only include stickers with actual image files
  const stickers = [
    { id: "sticker-heart", src: "/images/sticker-heart.png", alt: "Heart Sticker" },
    { id: "sticker-star", src: "/images/sticker-star.png", alt: "Star Sticker" },
    { id: "sticker-sunglasses", src: "/images/sticker-sunglasses.png", alt: "Sunglasses Sticker" },
    { id: "sticker-flower", src: "/images/sticker-flower.png", alt: "Flower Sticker" },
    { id: "sticker-suitcase", src: "/images/sticker-suitcase.png", alt: "Suitcase Sticker" },
  ]

  const textStyles = [
    {
      id: "text-heading",
      label: currentLanguage === "en" ? "Heading" : "제목",
      fontSize: 28,
      color: "#1E3A8A",
      fontFamily: "serif",
    },
    {
      id: "text-subheading",
      label: currentLanguage === "en" ? "Subheading" : "부제목",
      fontSize: 22,
      color: "#1E40AF",
      fontFamily: "serif",
    },
    {
      id: "text-body",
      label: currentLanguage === "en" ? "Body" : "본문",
      fontSize: 16,
      color: "#1E3A8A",
      fontFamily: "serif",
    },
    {
      id: "text-caption",
      label: currentLanguage === "en" ? "Caption" : "캡션",
      fontSize: 14,
      color: "#64748B",
      fontFamily: "serif",
    },
    {
      id: "text-date",
      label: currentLanguage === "en" ? "Date" : "날짜",
      fontSize: 16,
      color: "#475569",
      fontFamily: "serif",
    },
    {
      id: "text-quote",
      label: currentLanguage === "en" ? "Quote" : "인용구",
      fontSize: 18,
      color: "#0369A1",
      fontStyle: "italic",
      fontFamily: "serif",
    },
  ]

  // Clear animation flag after animation completes
  useEffect(() => {
    if (addingItemAnimation) {
      const timer = setTimeout(() => {
        setAddingItemAnimation(null)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [addingItemAnimation])

  // Handle adding new items to canvas
  const handleAddItem = (type: "stamp" | "photo" | "sticker" | "text", content: string, options?: any) => {
    triggerHapticFeedback(hapticPatterns.medium)

    const centerX = (canvasRef.current?.clientWidth || 400) / 2 - (options?.width || 100) / 2
    const centerY = (canvasRef.current?.clientHeight || 600) / 2 - (options?.height || 100) / 2

    const newItemId = `${type}-${Date.now()}`

    const newItem: CanvasItem = {
      id: newItemId,
      type,
      content,
      x: centerX,
      y: centerY,
      rotation: Math.random() * 6 - 3, // Slight random rotation for natural feel
      scale: 1,
      zIndex: canvasItems.length + 1,
      width: options?.width || (type === "text" ? undefined : type === "sticker" ? 60 : 100),
      height: options?.height || (type === "text" ? undefined : type === "sticker" ? 60 : 100),
      ...(type === "text" && {
        text: options?.text || (currentLanguage === "en" ? "Double tap to edit" : "두 번 탭하여 편집"),
        fontSize: options?.fontSize || 16,
        color: options?.color || "#1E3A8A",
        fontFamily: options?.fontFamily || "serif",
        fontStyle: options?.fontStyle,
      }),
    }

    setCanvasItems([...canvasItems, newItem])
    setSelectedItem(newItem.id)
    setAddingItemAnimation(newItem.id)
  }

  // Handle text editing
  const handleTextDoubleClick = (item: CanvasItem) => {
    if (item.type === "text") {
      setIsEditingText(true)
      setEditingText(item.text || "")
      setSelectedItem(item.id)

      // Focus the text input after it's rendered
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus()
        }
      }, 100)
    }
  }

  const handleTextSave = () => {
    if (selectedItem) {
      setCanvasItems(canvasItems.map((item) => (item.id === selectedItem ? { ...item, text: editingText } : item)))
      setIsEditingText(false)
    }
  }

  // Handle item selection
  const handleItemClick = (id: string) => {
    triggerHapticFeedback(hapticPatterns.light)
    if (selectedItem === id) {
      setSelectedItem(null)
    } else {
      setSelectedItem(id)
      // Bring selected item to front
      setCanvasItems(
        canvasItems.map((i) =>
          i.id === id
            ? {
                ...i,
                zIndex: Math.max(...canvasItems.map((i) => i.zIndex)) + 1,
              }
            : i,
        ),
      )
    }
  }

  // Handle item deletion
  const handleDeleteItem = () => {
    if (selectedItem) {
      triggerHapticFeedback(hapticPatterns.medium)
      setCanvasItems(canvasItems.filter((item) => item.id !== selectedItem))
      setSelectedItem(null)
    }
  }

  // Handle zoom controls
  const handleZoomIn = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  // Handle page navigation
  const handlePrevPage = () => {
    if (currentPage > 1) {
      triggerHapticFeedback(hapticPatterns.light)
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      triggerHapticFeedback(hapticPatterns.light)
      setCurrentPage((prev) => prev + 1)
    }
  }

  // Handle undo (remove last added item)
  const handleUndo = () => {
    if (canvasItems.length > 0) {
      triggerHapticFeedback(hapticPatterns.medium)
      setCanvasItems((prev) => prev.slice(0, -1))
      setSelectedItem(null)
    }
  }

  // Handle save
  const handleSave = () => {
    triggerHapticFeedback(hapticPatterns.success)
    // In a real app, this would save the canvas state
    alert(currentLanguage === "en" ? "Page saved successfully!" : "페이지가 성공적으로 저장되었습니다!")
  }

  // Handle pan mode toggle
  const handlePanModeToggle = () => {
    triggerHapticFeedback(hapticPatterns.light)
    setIsPanning(!isPanning)
    setSelectedItem(null)
  }

  // Handle pan start
  const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPanning) return

    setStartPanOffset({
      x: panOffset.x,
      y: panOffset.y,
    })

    if ("touches" in e) {
      const touch = e.touches[0]
      setIsDragging({ x: touch.clientX, y: touch.clientY })
    } else {
      setIsDragging({ x: e.clientX, y: e.clientY })
    }
  }

  // Handle pan move
  const handlePanMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPanning || !isDragging) return

    let clientX, clientY

    if ("touches" in e) {
      const touch = e.touches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const deltaX = clientX - isDragging.x
    const deltaY = clientY - isDragging.y

    setPanOffset({
      x: startPanOffset.x + deltaX,
      y: startPanOffset.y + deltaY,
    })
  }

  // Handle pan end
  const handlePanEnd = () => {
    if (!isPanning) return
    setIsDragging(false)
  }

  // Render canvas items
  const renderCanvasItems = () => {
    return canvasItems
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((item) => {
        const isSelected = selectedItem === item.id
        const isNewlyAdded = addingItemAnimation === item.id

        // Determine item-specific styling based on type
        const itemStyle = {}
        let containerStyle = {}

        if (item.type === "photo") {
          containerStyle = {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
            padding: "8px",
            backgroundColor: "white",
            borderRadius: "4px",
          }
        } else if (item.type === "stamp") {
          containerStyle = {
            filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1))",
          }
        } else if (item.type === "sticker") {
          containerStyle = {
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))",
          }
        }

        return (
          <motion.div
            key={item.id}
            className={`absolute ${isSelected ? "ring-2 ring-[#00A9E0] ring-opacity-80" : ""}`}
            style={{
              left: item.x,
              top: item.y,
              zIndex: item.zIndex,
              transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
              transformOrigin: "center",
              width: item.width ? `${item.width}px` : "auto",
              height: item.height ? `${item.height}px` : "auto",
              cursor: isPanning ? "move" : "pointer",
              ...containerStyle,
            }}
            initial={isNewlyAdded ? { opacity: 0, scale: 0.8 } : false}
            animate={
              isNewlyAdded
                ? { opacity: 1, scale: 1 }
                : isSelected
                  ? { scale: [1, 1.02, 1], transition: { duration: 0.3 } }
                  : {}
            }
            whileHover={!isPanning ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
            whileDrag={!isPanning ? { scale: 1.05, zIndex: 9999, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            drag={!isPanning && !isEditingText}
            dragMomentum={false}
            onDragStart={() => setSelectedItem(item.id)}
            onDragEnd={(_, info) => {
              const updatedItems = canvasItems.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      x: i.x + info.offset.x,
                      y: i.y + info.offset.y,
                    }
                  : i,
              )
              setCanvasItems(updatedItems)
            }}
            onClick={() => handleItemClick(item.id)}
            onDoubleClick={() => handleTextDoubleClick(item)}
          >
            {item.type === "text" ? (
              isEditingText && isSelected ? (
                <textarea
                  ref={textInputRef}
                  className="w-full h-full min-h-[60px] p-2 bg-transparent border-b border-[#00A9E0] rounded focus:outline-none focus:ring-1 focus:ring-[#00A9E0] focus:ring-opacity-50"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={handleTextSave}
                  style={{
                    fontSize: `${item.fontSize}px`,
                    color: item.color,
                    fontFamily: item.fontFamily || "serif",
                    fontStyle: item.fontStyle || "normal",
                  }}
                />
              ) : (
                <div
                  className="p-2 whitespace-pre-wrap"
                  style={{
                    fontSize: `${item.fontSize}px`,
                    color: item.color,
                    fontFamily: item.fontFamily || "serif",
                    fontStyle: item.fontStyle || "normal",
                  }}
                >
                  {item.text}
                </div>
              )
            ) : (
              <SafeImage
                src={item.content || "/placeholder.svg"}
                alt={`Canvas item ${item.id}`}
                width={item.width || 100}
                height={item.height || 100}
                className={`pointer-events-none ${item.type === "photo" ? "rounded-sm" : ""}`}
                fallbackSrc="/placeholder.svg"
              />
            )}

            {isSelected && !isEditingText && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteItem()
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            )}
          </motion.div>
        )
      })
  }

  // Render palette based on active tab
  const renderPalette = () => {
    switch (activeTab) {
      case "stamps":
        return (
          <div className="grid grid-cols-3 gap-3 p-3">
            {stamps.map((stamp) => (
              <motion.div
                key={stamp.id}
                className="aspect-square bg-white/90 rounded-lg p-2 shadow-sm border border-amber-100 cursor-pointer hover:border-[#00A9E0] transition-colors overflow-hidden"
                onClick={() => handleAddItem("stamp", stamp.src, { width: 100, height: 100 })}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeImage
                  src={stamp.src || "/placeholder.svg"}
                  alt={stamp.alt}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  fallbackSrc="/placeholder.svg"
                />
              </motion.div>
            ))}
          </div>
        )
      case "photos":
        return (
          <div className="grid grid-cols-3 gap-3 p-3">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                className="aspect-square bg-white/90 rounded-lg overflow-hidden shadow-sm border border-amber-100 cursor-pointer hover:border-[#00A9E0] transition-colors"
                onClick={() => handleAddItem("photo", photo.src, { width: 150, height: 120 })}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeImage
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  fallbackSrc="/placeholder.svg"
                />
              </motion.div>
            ))}
          </div>
        )
      case "stickers":
        return (
          <div className="grid grid-cols-3 gap-3 p-3">
            {stickers.map((sticker) => (
              <motion.div
                key={sticker.id}
                className="aspect-square bg-white/90 rounded-lg p-2 shadow-sm border border-amber-100 cursor-pointer hover:border-[#00A9E0] transition-colors"
                onClick={() => handleAddItem("sticker", sticker.src, { width: 60, height: 60 })}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeImage
                  src={sticker.src || "/placeholder.svg"}
                  alt={sticker.alt}
                  width={60}
                  height={60}
                  className="w-full h-full object-contain"
                  fallbackSrc="/placeholder.svg"
                />
              </motion.div>
            ))}
          </div>
        )
      case "text":
        return (
          <div className="grid grid-cols-2 gap-3 p-3">
            {textStyles.map((style) => (
              <motion.div
                key={style.id}
                className="bg-white/90 rounded-lg p-3 shadow-sm border border-amber-100 cursor-pointer hover:border-[#00A9E0] transition-colors"
                onClick={() =>
                  handleAddItem("text", "text", {
                    text: style.label,
                    fontSize: style.fontSize,
                    color: style.color,
                    fontFamily: style.fontFamily,
                    fontStyle: style.fontStyle,
                  })
                }
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <p
                  style={{
                    fontSize: `${style.fontSize}px`,
                    color: style.color,
                    fontFamily: style.fontFamily || "serif",
                    fontStyle: style.fontStyle || "normal",
                  }}
                >
                  {style.label}
                </p>
              </motion.div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col h-full"
      style={{
        backgroundColor: "#f8f3e2", // Warm sand tone
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Top Bar */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {onBack && (
            <Button variant="ghost" size="icon" className="mr-2 text-deep-navy hover:bg-amber-50" onClick={onBack}>
              <ChevronLeft />
            </Button>
          )}
          <h1 className="text-lg font-medium text-deep-navy">
            {currentLanguage === "en" ? "My Seoul Adventure" : "서울 모험"}
          </h1>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-deep-navy hover:bg-amber-50" onClick={handleUndo}>
            <RotateCcw size={18} />
          </Button>
          <Button
            variant={isPanning ? "default" : "ghost"}
            size="icon"
            className={`${isPanning ? "bg-[#00A9E0] text-white" : "text-deep-navy hover:bg-amber-50"}`}
            onClick={handlePanModeToggle}
          >
            <Move size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="text-deep-navy hover:bg-amber-50" onClick={handleSave}>
            <Save size={18} />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={canvasRef}
          className="absolute inset-0 mx-4 my-4 rounded-lg overflow-hidden shadow-md"
          style={{
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: "center",
            backgroundColor: "#fcf9f2", // Warm off-white for paper feel
            backgroundImage: "url('/placeholder.svg?key=ydra5')",
            backgroundSize: "cover",
            backgroundBlendMode: "overlay",
          }}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onTouchStart={handlePanStart}
          onTouchMove={handlePanMove}
          onTouchEnd={handlePanEnd}
        >
          {renderCanvasItems()}
        </div>

        {/* Canvas Controls */}
        <div className="absolute top-6 right-6 flex flex-col space-y-2">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm shadow-md hover:bg-amber-50 text-deep-navy"
              onClick={handleZoomIn}
            >
              <ZoomIn size={18} />
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm shadow-md hover:bg-amber-50 text-deep-navy"
              onClick={handleZoomOut}
            >
              <ZoomOut size={18} />
            </Button>
          </motion.div>
        </div>

        {/* Page Navigation */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-md px-4 py-1.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-deep-navy hover:bg-amber-50 rounded-full"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="mx-2 text-sm font-medium text-deep-navy">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-deep-navy hover:bg-amber-50 rounded-full"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </Button>
        </motion.div>
      </div>

      {/* Bottom Palette */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-amber-100">
        {/* Palette Tabs */}
        <div className="flex">
          <button
            className={`flex-1 py-3 text-sm font-medium flex flex-col items-center transition-all ${activeTab === "stamps" ? "text-[#00A9E0] border-b-2 border-[#00A9E0] bg-amber-50/50" : "text-stone-gray hover:bg-amber-50/30"}`}
            onClick={() => setActiveTab("stamps")}
          >
            <Stamp size={18} className="mb-1" />
            <span>{currentLanguage === "en" ? "Stamps" : "스탬프"}</span>
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium flex flex-col items-center transition-all ${activeTab === "photos" ? "text-[#00A9E0] border-b-2 border-[#00A9E0] bg-amber-50/50" : "text-stone-gray hover:bg-amber-50/30"}`}
            onClick={() => setActiveTab("photos")}
          >
            <ImageIcon size={18} className="mb-1" />
            <span>{currentLanguage === "en" ? "Photos" : "사진"}</span>
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium flex flex-col items-center transition-all ${activeTab === "stickers" ? "text-[#00A9E0] border-b-2 border-[#00A9E0] bg-amber-50/50" : "text-stone-gray hover:bg-amber-50/30"}`}
            onClick={() => setActiveTab("stickers")}
          >
            <StickyNote size={18} className="mb-1" />
            <span>{currentLanguage === "en" ? "Stickers" : "스티커"}</span>
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium flex flex-col items-center transition-all ${activeTab === "text" ? "text-[#00A9E0] border-b-2 border-[#00A9E0] bg-amber-50/50" : "text-stone-gray hover:bg-amber-50/30"}`}
            onClick={() => setActiveTab("text")}
          >
            <Type size={18} className="mb-1" />
            <span>{currentLanguage === "en" ? "Text" : "텍스트"}</span>
          </button>
        </div>

        {/* Palette Content */}
        <div className="h-48 overflow-y-auto bg-gradient-to-b from-amber-50/30 to-white/80">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPalette()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AlbumCanvasPage
