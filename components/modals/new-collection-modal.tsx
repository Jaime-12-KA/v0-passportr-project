"use client"

import { type FC, useState } from "react"
import { FaTimes, FaStamp, FaTrophy } from "react-icons/fa"

interface NewCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string) => void
}

const NewCollectionModal: FC<NewCollectionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [collectionName, setCollectionName] = useState("")

  if (!isOpen) return null

  return (
    <div className="modal active fixed inset-0 z-50 flex items-center justify-center">
      <div className="popup p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold serif-font">{"Create New Collection"}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-light-sand hover:bg-stone-gray transition-colors"
          >
            <FaTimes className="text-stone-gray" />
          </button>
        </div>

        <input
          type="text"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          placeholder={"Collection Name"}
          className="w-full px-4 py-3 rounded-lg border border-light-sand focus:outline-none focus:border-sky-blue transition-colors mb-6"
          autoFocus
        />

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-sunshine-yellow rounded-full flex items-center justify-center mr-3">
              <FaStamp className="text-deep-navy text-lg" />
            </div>
            <span className="text-deep-navy font-medium">{"Collect Stamps"}</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-sky-blue rounded-full flex items-center justify-center mr-3">
              <FaTrophy className="text-brand-blue text-lg" />
            </div>
            <span className="text-deep-navy font-medium">{"Earn Rewards"}</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (collectionName.trim()) {
              onConfirm(collectionName)
              setCollectionName("")
            }
          }}
          className="w-full py-3 bg-sunset-coral text-white rounded-lg font-bold hover:bg-opacity-90 transition-colors btn-effect"
          disabled={!collectionName.trim()}
        >
          {"Create Collection"}
        </button>
      </div>
    </div>
  )
}

export default NewCollectionModal
