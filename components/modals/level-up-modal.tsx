"use client"

import { type FC, useEffect } from "react"

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
}

const LevelUpModal: FC<LevelUpModalProps> = ({ isOpen, onClose }) => {
  // Create confetti effect when the modal opens
  useEffect(() => {
    if (isOpen) {
      createConfetti()
    }
  }, [isOpen])

  const createConfetti = () => {
    const container = document.getElementById("confetti-container")
    if (!container) return

    const colors = ["#5DA9E9", "#FF7E67", "#FFDA63", "#F4EAD5"]

    // Clear existing confetti
    container.innerHTML = ""

    // Create new confetti particles
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = `${Math.random() * 100}%`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.width = `${Math.random() * 10 + 5}px`
      confetti.style.height = `${Math.random() * 10 + 5}px`
      confetti.style.animationDelay = `${Math.random() * 2}s`
      container.appendChild(confetti)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="modal active fixed inset-0 z-50 flex items-center justify-center"
      style={{ height: "var(--app-height, 100vh)" }}
    >
      <div className="popup p-8 text-center bg-white rounded-lg shadow-xl max-w-md w-full relative">
        <div className="absolute inset-0 overflow-hidden">
          <div id="confetti-container"></div>
        </div>
        <h2 className="text-2xl font-bold serif-font mb-4">Level Up!</h2>
        <div className="mb-6">
          <div className="w-24 h-24 bg-sunshine-yellow rounded-full flex items-center justify-center mx-auto mb-4 animate__animated animate__bounceIn">
            <span className="text-deep-navy text-3xl font-bold">12</span>
          </div>
          <p className="text-lg">
            Congratulations! You've reached <span className="font-bold">Level 12</span>
          </p>
          <p className="text-stone-gray mt-2">You've unlocked new passport designs and special stamps!</p>
        </div>
        <div className="bg-light-sand p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2">Level 12 Rewards:</h3>
          <ul className="text-left">
            <li className="flex items-center mb-2">
              <i className="fas fa-unlock text-sunset-coral mr-2"></i>
              <span>Premium Seoul Passport Design</span>
            </li>
            <li className="flex items-center mb-2">
              <i className="fas fa-unlock text-sunset-coral mr-2"></i>
              <span>+2 Streak Protection Items</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-unlock text-sunset-coral mr-2"></i>
              <span>New Achievement Category: "Night Explorer"</span>
            </li>
          </ul>
        </div>
        <button
          className="bg-sunset-coral text-brand-blue px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors btn-effect"
          onClick={onClose}
        >
          Claim Rewards
        </button>
      </div>
    </div>
  )
}

export default LevelUpModal
