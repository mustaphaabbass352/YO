import { motion } from "framer-motion"

interface MessageBubbleProps {
  text: string
  timestamp: string
  isSent: boolean
}

export default function MessageBubble({ text, timestamp, isSent }: MessageBubbleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isSent ? "justify-end" : "justify-start"} mb-4`}
    >
      <div 
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isSent 
            ? "bg-[#FFD600] text-black rounded-tr-none" 
            : "bg-[#1a1a1a] text-white rounded-tl-none"
        }`}
      >
        <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          {text}
        </p>
        <p className={`text-xs mt-1 ${isSent ? "text-black/60" : "text-[#888888]"}`} style={{ fontFamily: "var(--font-body)" }}>
          {timestamp}
        </p>
      </div>
    </motion.div>
  )
}
