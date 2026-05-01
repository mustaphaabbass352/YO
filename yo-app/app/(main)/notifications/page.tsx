"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Phone, UserPlus } from "lucide-react"
import { NOTIFICATIONS } from "@/lib/mock-data"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([...NOTIFICATIONS])

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <Bell className="w-5 h-5 text-[#FFD600]" />
      case "missed_call":
        return <Phone className="w-5 h-5 text-red-400" />
      case "joined":
        return <UserPlus className="w-5 h-5 text-green-400" />
      default:
        return <Bell className="w-5 h-5 text-[#888888]" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      <div className="p-4 border-b border-[#1f1f1f] bg-[#111111]">
        <div className="flex items-center justify-between">
          <h2 
            className="text-xl font-[700] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Notifications
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[#FFD600] text-sm font-medium hover:underline"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={`p-4 border-b border-[#1f1f1f] ${!notification.read ? "bg-[#111111]/50" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#1a1a1a] rounded-full">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-sm font-medium text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {notification.title}
                </h3>
                <p 
                  className="text-sm text-[#888888] mt-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {notification.description}
                </p>
                <p 
                  className="text-xs text-[#555555] mt-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {notification.timestamp}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-[#FFD600] rounded-full mt-2" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
