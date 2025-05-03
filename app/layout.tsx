import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/AuthContext"
import { setupViewportHeightFix } from "@/utils/viewport-fix"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Passportr - Digital City Passport Experience",
  description: "Capture your city experiences in a unique digital passport",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (${setupViewportHeightFix.toString()})();
            `,
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
