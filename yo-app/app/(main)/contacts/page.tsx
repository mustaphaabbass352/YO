"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, MessageCircle } from "lucide-react"
import { useProfiles } from "@/lib/supabase-utils"
import Avatar from "@/components/ui/Avatar"
import SearchBar from "@/components/ui/SearchBar"

export default function ContactsPage() {
  const router = useRouter()
  const { profiles, loading } = useProfiles()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)

  const filteredContacts = profiles.filter((contact) =>
    (contact.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedContact = selectedContactId 
    ? profiles.find((c) => c.id === selectedContactId) 
    : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0a0a0a]">
        <div className="text-xl text-[#FFD600]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-row overflow-hidden">
      {/* Contact List */}
      <div className={`${selectedContact ? "hidden md:block" : "block"} md:w-[320px] w-full h-full flex flex-col bg-[#111111] border-r border-[#1f1f1f]`}>
        <div className="p-4 border-b border-[#1f1f1f]">
          <h2 
            className="text-xl font-[700] text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contacts
          </h2>
          <SearchBar 
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="text-[#888888]" style={{ fontFamily: "var(--font-body)" }}>
                No contacts found
              </p>
            </div>
          ) : (
            filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.2 }}
                onClick={() => setSelectedContactId(contact.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedContactId === contact.id ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar 
                    src={contact.avatar_url || ""} 
                    alt={contact.full_name || "User"} 
                    isOnline={contact.is_online || false} 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-sm font-medium text-white truncate"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {contact.full_name || "User"}
                    </h3>
                    <p 
                      className="text-sm text-[#888888] truncate"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {contact.bio || "Available"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Contact Detail */}
      {selectedContact && (
        <div className="flex-1 h-full flex flex-col bg-[#0a0a0a]">
          <div className="flex items-center gap-3 p-4 border-b border-[#1f1f1f] bg-[#111111]">
            <button 
              onClick={() => setSelectedContactId(null)}
              className="md:hidden p-1 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <Avatar 
              src={selectedContact.avatar_url || ""} 
              alt={selectedContact.full_name || "User"} 
              size="lg" 
              isOnline={selectedContact.is_online || false} 
            />
            <div>
              <h3 
                className="text-lg font-[600] text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {selectedContact.full_name || "User"}
              </h3>
              <p 
                className="text-sm text-[#888888]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {selectedContact.phone || ""}
              </p>
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="mb-8">
              <h4 
                className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-3"
                style={{ fontFamily: "var(--font-body)" }}
              >
                About
              </h4>
              <p 
                className="text-sm text-white"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {selectedContact.bio || "Available"}
              </p>
            </div>

            <button
              onClick={() => router.push("/chats")}
              className="w-full flex items-center justify-center gap-2 bg-[#FFD600] text-black font-bold rounded-full py-3 transition-all hover:scale-[1.02]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <MessageCircle className="w-5 h-5" />
              Message
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
