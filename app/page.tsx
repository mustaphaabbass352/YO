"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useConversations } from "@/lib/supabase-utils"
import ChatList from "@/components/chat/ChatList"
import ChatWindow from "@/components/chat/ChatWindow"
import Sidebar from "@/components/layout/Sidebar"
import BottomNav from "@/components/layout/BottomNav"

export default function Home() {
  const { user, loading } = useAuth()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const { conversations, loading: conversationsLoading } = useConversations(user?.id || "")

  if (loading || conversationsLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-2xl text-[#FFD600] font-bold">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const transformedConversations = conversations.map(conv => ({
    contact: {
      id: conv.contact.id,
      full_name: conv.contact.full_name,
      avatar_url: conv.contact.avatar_url,
      is_online: conv.contact.is_online
    },
    lastMessage: {
      content: conv.lastMessage.content,
      created_at: conv.lastMessage.created_at
    },
    unreadCount: conv.unreadCount
  }))

  return (
    <div className="flex flex-row h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="hidden md:block w-80">
        <ChatList 
          conversations={transformedConversations}
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
        />
      </div>
      <main className="flex-1 overflow-y-auto relative">
        {selectedConversationId ? (
          <ChatWindow 
            conversationId={selectedConversationId}
            onBack={() => setSelectedConversationId(null)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <h1 
              className="text-4xl font-[800] text-[#FFD600] mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              YO!
            </h1>
            <p 
              className="text-[#888888] text-lg"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  )
}
