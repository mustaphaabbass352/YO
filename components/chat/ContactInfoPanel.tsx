"use client"

import { useProfile } from "@/lib/supabase-utils"
import Avatar from "@/components/ui/Avatar"

interface ContactInfoPanelProps {
  conversationId: string
}

export default function ContactInfoPanel({ conversationId }: ContactInfoPanelProps) {
  const { profile: contact } = useProfile(conversationId)

  if (!contact) return null

  return (
    <div className="h-full flex flex-col bg-[#111111] border-l border-[#1f1f1f] p-6">
      <div className="flex flex-col items-center mb-8">
        <Avatar 
          src={contact.avatar_url || ""} 
          alt={contact.full_name || "User"} 
          size="xl" 
          isOnline={contact.is_online || false} 
        />
        <h2 
          className="text-xl font-[700] text-white mt-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {contact.full_name || "User"}
        </h2>
        <p 
          className="text-sm text-[#888888] mt-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {contact.phone || ""}
        </p>
      </div>

      <div className="mb-6">
        <h3 
          className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-3"
          style={{ fontFamily: "var(--font-body)" }}
        >
          About
        </h3>
        <p 
          className="text-sm text-white"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {contact.bio || "Available"}
        </p>
      </div>

      <div className="flex-1" />

      <div className="text-center">
        <p 
          className="text-xs text-[#555555]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          YO! Chat
        </p>
      </div>
    </div>
  )
}
