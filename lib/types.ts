export interface Contact {
  id: string
  name: string
  phone: string
  bio: string
  avatar: string
  isOnline: boolean
}

export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  contact: Contact
  messages: Message[]
  unreadCount: number
  lastMessage: string
  lastTimestamp: string
}

export interface Notification {
  id: string
  type: "message" | "missed_call" | "joined"
  title: string
  description: string
  timestamp: string
  read: boolean
}
