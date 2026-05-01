"use client"

import { Conversation } from "@/lib/types"
import { CONVERSATIONS } from "@/lib/mock-data"
import Avatar from "@/components/ui/Avatar"
import Badge from "@/components/ui/Badge"
import SearchBar from "@/components/ui/SearchBar"
import { motion } from "framer-motion"
import { useState } from "react"

interface ChatListProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function ChatList({ selectedId, onSelect }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = CONVERSATIONS.filter((conv) =>
    conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              key={conv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.2 }}
              onClick={() => onSelect(conv.id)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedId === conv.id ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar src={conv.contact.avatar} alt={conv.contact.name} isOnline={conv.contact.isOnline} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 
                      className="text-sm font-medium text-white truncate"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {conv.contact.name}
                    </h3>
                    <span 
                      className="text-xs text-[#888888]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {conv.lastTimestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p 
                      className="text-sm text-[#888888] truncate"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {conv.lastMessage}
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
