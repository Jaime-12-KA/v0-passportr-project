"use client"

import type { FC } from "react"

interface NotificationProps {
  show: boolean
  text: string
  onClose: () => void
}

const Notification: FC<NotificationProps> = ({ show, text, onClose }) => {
  return (
    <div
      className={`fixed top-4 right-4 bg-sunset-coral text-white px-4 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 flex items-center ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <i className="fas fa-bell mr-2"></i>
      <span>{text}</span>
    </div>
  )
}

export default Notification
