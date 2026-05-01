"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Camera } from "lucide-react"

const pulseAnimation = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }
`

export default function SignupPage() {
  const router = useRouter()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSignup = () => {
    localStorage.setItem("isLoggedIn", "true")
    router.push("/chats")
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      <style>{pulseAnimation}</style>
      
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,214,0,0.08) 0%, transparent 70%)"
        }}
      />
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-sm w-full mx-4 z-10"
      >
        <div className="bg-[#111111] rounded-2xl p-8 border border-[#1f1f1f]">
          <h1 
            className="text-5xl font-[800] text-[#FFD600] text-center mb-2"
            style={{ fontFamily: "var(--font-display)", animation: "pulse 2s ease-in-out infinite" }}
          >
            YO!
          </h1>
          
          <p className="text-[#888888] text-center mb-4" style={{ fontFamily: "var(--font-body)" }}>
            Create your account.
          </p>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full border-2 border-dashed border-[#FFD600] bg-[#1a1a1a] flex items-center justify-center overflow-hidden hover:bg-[#222222] transition-colors"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover rounded-full" />
              ) : (
                <Camera className="w-8 h-8 text-[#FFD600]" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full name"
              className="w-full bg-[#1a1a1a] border border-[#1f1f1f] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full bg-[#1a1a1a] border border-[#1f1f1f] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#1a1a1a] border border-[#1f1f1f] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full bg-[#1a1a1a] border border-[#1f1f1f] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>

          <button
            onClick={handleSignup}
            className="w-full mt-6 bg-[#FFD600] text-black font-bold rounded-full py-3 hover:scale-[1.02] hover:brightness-110 transition-all duration-200"
          >
            Create Account
          </button>

          <p className="text-center mt-6 text-[#888888]" style={{ fontFamily: "var(--font-body)" }}>
            Already have an account?{" "}
            <Link href="/login" className="text-[#FFD600] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
