"use client"
import { Outfit, Syne } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { cn } from "@/lib/utils"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryclient"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
})

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
})

// export const metadata: Metadata = {
//   title: "Revelio — AI Solana Wallet Analyzer",
//   description:
//     "Paste any Solana wallet and get an AI breakdown of trading patterns, wins, losses and behavior.",
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <QueryClientProvider client={queryClient}>
          <html
          lang="en"
          className={cn(
            "dark antialiased",
            outfit.variable,
            syne.variable
          )}
        >
          <body className="min-h-screen">
            {children}
          </body>
        </html>
    </QueryClientProvider>
  )
}
