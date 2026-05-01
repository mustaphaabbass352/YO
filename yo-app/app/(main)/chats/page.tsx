"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useConversations } from "@/lib/supabase-utils"
import ChatList from "@/components/chat/ChatList"
import ChatWindow from "@/components/chat/ChatWindow"
import ContactInfoPanel from "@/components/chat/ContactInfoPanel"

export default function ChatsPage() {
  const { user } = useAuth()
  const { conversations, loading } = useConversations(user?.id || "")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0a0a0a]">
        <div className="text-xl text-[#FFD600]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-row overflow-hidden">
      {/* Column 1 - Chat List */}
      <div className={`${selectedId ? "hidden md:block" : "block"} md:w-[320px] w-full h-full`}>
        <ChatList 
          conversations={conversations} 
          selectedId={selectedId} 
          onSelect={setSelectedId} 
        />
      </div>

      {/* Column 2 - Chat Window */}
      {selectedId && (
        <div className={`flex-1 h-full ${selectedId ? "block" : "hidden md:block"}`}>
          <ChatWindow 
            conversationId={selectedId} 
            onBack={() => setSelectedId(null)} 
          />
        </div>
      )}

      {/* Column 3 - Contact Info (desktop only) */}
      {selectedId && (
        <div className="hidden lg:block w-[300px] h-full">
          <ContactInfoPanel conversationId={selectedId} />
        </div>
      )}
    </div>
  )
}
