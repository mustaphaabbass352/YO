"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Send } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useMessages, useProfile, sendMessage } from "@/lib/supabase-utils"
import Avatar from "@/components/ui/Avatar"
import MessageBubble from "@/components/chat/MessageBubble"
import TypingIndicator from "@/components/chat/TypingIndicator"

interface ChatWindowProps {
  conversationId: string
  onBack?: () => void
}

export default function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const { user } = useAuth()
  const { profile: contact } = useProfile(conversationId)
  const { messages, loading } = useMessages(user?.id || "", conversationId)
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationId, messages.length])

  const handleSend = async () => {
    if (!inputText.trim() || !user) return
    
    setIsSending(true)
    const text = inputText
    setInputText("")
    
    try {
      await sendMessage(user.id, conversationId, text)
    } catch (error) {
      console.error("Failed to send message:", error)
      setInputText(text)
    } finally {
      setTimeout(() => setIsSending(false), 300)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-xl text-[#FFD600]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      <div className="flex items-center gap-3 p-4 border-b border-[#1f1f1f] bg-[#111111]">
        {onBack && (
          <button onClick={onBack} className="p-1 hover:bg-[#1a1a1a] rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        <Avatar 
          src={contact?.avatar_url || ""} 
          alt={contact?.full_name || "User"} 
          isOnline={contact?.is_online || false} 
        />
        <div>
          <h3 
            className="text-sm font-medium text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {contact?.full_name || "User"}
          </h3>
          <p 
            className="text-xs text-[#888888]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {contact?.is_online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.content}
            timestamp={formatTime(msg.created_at)}
            isSent={msg.sender_id === user?.id}
          />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[#1f1f1f] bg-[#111111]">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-[#1a1a1a] border border-[#1f1f1f] text-white rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <motion.button
            onClick={handleSend}
            disabled={!inputText.trim() || isSending}
            className="p-3 bg-[#FFD600] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!inputText.trim() || isSending ? {} : { scale: 1.05 }}
            whileTap={!inputText.trim() || isSending ? {} : { scale: 0.95 }}
          >
            <Send className="w-5 h-5 text-black" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
