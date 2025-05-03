"use client"

import { motion } from "framer-motion"

interface PageIndicatorProps {
  totalPages: number
  currentPage: number
}

export default function PageIndicator({ totalPages, currentPage }: PageIndicatorProps) {
  return (
    <div className="flex space-x-4">
      {Array.from({ length: totalPages }).map((_, index) => (
        <div key={index} className="relative h-3 w-3 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-white bg-opacity-30"
            initial={false}
            animate={{ opacity: currentPage === index ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute inset-0 bg-brand-coral"
            initial={false}
            animate={{
              width: currentPage === index ? "100%" : "0%",
              opacity: currentPage === index ? 1 : 0,
            }}
            transition={{
              width: { duration: 0.5, ease: "easeOut" },
              opacity: { duration: 0.3 },
            }}
          />
          {currentPage === index && (
            <motion.div
              className="absolute inset-0 bg-brand-coral"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              style={{ borderRadius: "50%" }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
