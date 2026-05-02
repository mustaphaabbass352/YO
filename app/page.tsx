"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn === "true") {
      router.push("/chats")
    } else {
      router.push("/login")
    }
  }, [isClient, router])

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-2xl text-[#FFD600] font-bold">Loading...</div>
    </div>
  )
}
