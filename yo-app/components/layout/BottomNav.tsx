"use client"

import { NOTIFICATIONS } from "@/lib/mock-data"
import { MessageCircle, Users, Bell, Settings } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { icon: MessageCircle, href: "/chats" },
    { icon: Users, href: "/contacts" },
    { icon: Bell, href: "/notifications" },
    { icon: Settings, href: "/settings" },
  ]

  const unreadNotificationsCount = NOTIFICATIONS.filter(n => !n.read).length

  return (
    <div className="w-full bg-[#111111] border-t border-[#1f1f1f] h-16 flex flex-row justify-around items-center md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        const isNotifications = item.href === "/notifications"

        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`p-3 rounded-xl transition-colors relative ${
              isActive ? "text-[#FFD600]" : "text-[#888888]"
            }`}
          >
            <Icon size={24} />
            {isNotifications && unreadNotificationsCount > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}
