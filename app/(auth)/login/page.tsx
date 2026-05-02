"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { signInWithPhone, verifyOtp } = useAuth()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [verificationId, setVerificationId] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const result = await signInWithPhone(phoneNumber)
      setVerificationId(result.verificationId)
      setStep("otp")
      setResendTimer(60)
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await verifyOtp(verificationId, otp.join(""), fullName)
      router.push("/chats")
    } catch (err: any) {
      setError(err.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setLoading(true)
    try {
      const result = await signInWithPhone(phoneNumber)
      setVerificationId(result.verificationId)
      setResendTimer(60)
      setOtp(["", "", "", "", "", ""])
      otpInputsRef.current[0]?.focus()
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
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
      <div id="recaptcha-container" />

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
            {step === "phone" ? "Enter your phone number" : "Enter the 6-digit code"}
          </p>

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="tel"
                placeholder="+233 24 000 0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#1f1f1f] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
                style={{ fontFamily: "var(--font-body)" }}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#FFD600] text-black font-bold rounded-full py-3 disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)", transition: "all 0.2s" }}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? "Sending..." : "Send OTP"}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) {
                        otpInputsRef.current[index] = el;
                      }
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-[#1a1a1a] border border-[#1f1f1f] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
                    style={{ fontFamily: "var(--font-display)" }}
                  />
                ))}
              </div>
              
              <input
                type="text"
                placeholder="Full name (if new user)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#1f1f1f] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
                style={{ fontFamily: "var(--font-body)" }}
              />
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              <motion.button
                type="submit"
                disabled={loading || otp.some((d) => !d)}
                className="w-full mt-6 bg-[#FFD600] text-black font-bold rounded-full py-3 disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)", transition: "all 0.2s" }}
                whileHover={!loading && otp.every((d) => d) ? { scale: 1.02 } : {}}
                whileTap={!loading && otp.every((d) => d) ? { scale: 0.98 } : {}}
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </motion.button>
              
              <div className="text-center mt-4">
                {resendTimer > 0 ? (
                  <p className="text-[#888888] text-sm">
                    Resend code in {resendTimer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-[#FFD600] hover:underline text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Resend code
                  </button>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-[#888888] hover:text-white text-sm w-full"
                style={{ fontFamily: "var(--font-body)" }}
              >
                ← Change phone number
              </button>
            </form>
          )}

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
