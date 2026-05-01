import { supabase } from "./supabase"
import { useEffect, useState, useMemo } from "react"
import type { Database } from "./database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type Message = Database["public"]["Tables"]["messages"]["Row"]

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await supabase.from("profiles").select("*")
      if (data) setProfiles(data)
      setLoading(false)
    }

    fetchProfiles()

    const channel = supabase
      .channel("profiles-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProfiles((prev) => [...prev, payload.new as Profile])
          } else if (payload.eventType === "UPDATE") {
            setProfiles((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Profile) : p))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { profiles, loading }
}

export function useMessages(userId1: string, userId2: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
        .order("created_at", { ascending: true })
      if (data) setMessages(data)
      setLoading(false)
    }

    fetchMessages()

    const channel = supabase
      .channel(`messages-${userId1}-${userId2}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(sender_id.eq.${userId1},receiver_id.eq.${userId1})`,
        },
        (payload) => {
          const newMessage = payload.new as Message
          if (
            (newMessage.sender_id === userId1 && newMessage.receiver_id === userId2) ||
            (newMessage.sender_id === userId2 && newMessage.receiver_id === userId1)
          ) {
            setMessages((prev) => [...prev, newMessage])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId1, userId2])

  return { messages, loading }
}

export function useConversations(currentUserId: string) {
  const { profiles, loading: profilesLoading } = useProfiles()
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [messagesLoading, setMessagesLoading] = useState(true)

  useEffect(() => {
    if (!currentUserId) return

    async function fetchAllMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: false })
      if (data) setAllMessages(data)
      setMessagesLoading(false)
    }

    fetchAllMessages()

    const channel = supabase
      .channel(`all-messages-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId})`,
        },
        (payload) => {
          setAllMessages((prev) => [payload.new as Message, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId])

  const conversations = useMemo(() => {
    const conversationMap = new Map<string, { contact: Profile; lastMessage: Message; unreadCount: number }>()

    allMessages.forEach((message) => {
      const otherUserId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id
      const contact = profiles.find((p) => p.id === otherUserId)

      if (!contact) return

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          contact,
          lastMessage: message,
          unreadCount: 0,
        })
      }

      const conv = conversationMap.get(otherUserId)!
      if (message.receiver_id === currentUserId && !message.read) {
        conv.unreadCount++
      }
    })

    return Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    )
  }, [allMessages, profiles, currentUserId])

  return { conversations, loading: profilesLoading || messagesLoading }
}

export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      read: false,
    })
    .select()
  return { data, error }
}

export async function createProfile(
  userId: string,
  fullName: string,
  phone: string,
  avatarUrl?: string
) {
  const { data, error } = await supabase.from("profiles").insert({
    id: userId,
    full_name: fullName,
    phone,
    avatar_url: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=FFD600&color=000&bold=true`,
    bio: "Available",
    is_online: true,
  })
  return { data, error }
}

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()
      if (data) setProfile(data)
      setLoading(false)
    }

    if (userId) fetchProfile()
  }, [userId])

  return { profile, loading }
}
