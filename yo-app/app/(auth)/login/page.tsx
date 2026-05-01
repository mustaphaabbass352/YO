"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true")
    router.push("/chats")
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      <div 
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "600px",
          background: "radial-gradient(ellipse, rgba(255,214,0,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0
        }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-sm w-full mx-4 z-10 relative"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="bg-[#111111] rounded-2xl p-8 border border-[#1f1f1f]">
          <h1 
            className="text-5xl font-[800] text-[#FFD600] text-center mb-2 yo-pulse"
            style={{ fontFamily: "var(--font-display)" }}
          >
            YO!
          </h1>
          
          <p className="text-[#888888] text-center mb-6" style={{ fontFamily: "var(--font-body)" }}>
            Say it loud.
          </p>

          <div className="space-y-4">
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
          </div>

          <motion.button
            onClick={handleLogin}
            className="w-full mt-6 bg-[#FFD600] text-black font-bold rounded-full py-3"
            style={{ fontFamily: "var(--font-body)", transition: "all 0.2s" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>

          <p className="text-center mt-6 text-[#888888]" style={{ fontFamily: "var(--font-body)" }}>
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#FFD600] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
