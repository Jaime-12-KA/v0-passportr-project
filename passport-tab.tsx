"use client"

import type React from "react"
import Image from "next/image"

const PassportTab: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Your Passport</h2>
      <div className="relative">
        <Image
          src="/images/passportr-cover-classic-hr.png"
          alt="Passport Cover"
          width={300}
          height={200}
          className="rounded-md shadow-md"
          onClick={() => alert("Passport Clicked!")} // Example onClick
          style={{ cursor: "pointer" }}
        />
        <div className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-md p-1 text-xs">Classic</div>
      </div>
      <p className="mt-4 text-gray-600">Click the passport to view details.</p>
    </div>
  )
}

export default PassportTab
