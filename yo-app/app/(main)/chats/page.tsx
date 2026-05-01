"use client"

import { useState } from "react"
import { CONVERSATIONS } from "@/lib/mock-data"
import ChatList from "@/components/chat/ChatList"
import ChatWindow from "@/components/chat/ChatWindow"
import ContactInfoPanel from "@/components/chat/ContactInfoPanel"

export default function ChatsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(CONVERSATIONS[0]?.id || null)

  return (
    <div className="h-full flex flex-row overflow-hidden">
      {/* Column 1 - Chat List */}
      <div className={`${selectedId ? "hidden md:block" : "block"} md:w-[320px] w-full h-full`}>
        <ChatList selectedId={selectedId} onSelect={setSelectedId} />
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
