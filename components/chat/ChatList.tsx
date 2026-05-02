"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Avatar from "@/components/ui/Avatar"
import Badge from "@/components/ui/Badge"
import SearchBar from "@/components/ui/SearchBar"

interface Conversation {
  contact: {
    id: string
    full_name: string | null
    avatar_url: string | null
    is_online: boolean | null
  }
  lastMessage: {
    content: string
    created_at: string
  }
  unreadCount: number
}

interface ChatListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function ChatList({ conversations, selectedId, onSelect }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    (conv.contact.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const oneDay = 24 * 60 * 60 * 1000

    if (diff < oneDay && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diff < oneDay * 2) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#111111] border-r border-[#1f1f1f]">
      <div className="p-4 border-b border-[#1f1f1f]">
        <h2 
          className="text-xl font-[700] text-white mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Chats
        </h2>
        <SearchBar 
          placeholder="Search chats..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <p className="text-[#888888]" style={{ fontFamily: "var(--font-body)" }}>
              No chats found
            </p>
          </div>
        ) : (
          filteredConversations.map((conv, index) => (
            <motion.div
              key={conv.contact.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.2 }}
              onClick={() => onSelect(conv.contact.id)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedId === conv.contact.id ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar 
                  src={conv.contact.avatar_url || ""} 
                  alt={conv.contact.full_name || "User"} 
                  isOnline={conv.contact.is_online || false} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 
                      className="text-sm font-medium text-white truncate"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {conv.contact.full_name || "User"}
                    </h3>
                    <span 
                      className="text-xs text-[#888888]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {formatTime(conv.lastMessage.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p 
                      className="text-sm text-[#888888] truncate"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {conv.lastMessage.content}
                    </p>
                    <Badge count={conv.unreadCount} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
