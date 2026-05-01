"use client"

import { CURRENT_USER, NOTIFICATIONS } from "@/lib/mock-data"
import { MessageCircle, Users, Bell, Settings, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { label: "Chats", icon: MessageCircle, href: "/chats" },
    { label: "Contacts", icon: Users, href: "/contacts" },
    { label: "Notifications", icon: Bell, href: "/notifications" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ]

  const unreadNotificationsCount = NOTIFICATIONS.filter(n => !n.read).length

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  return (
    <div 
      className="w-[270px] h-screen flex flex-col bg-[#111111] border-r border-[#1f1f1f]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="p-6">
        <h1 
          className="text-2xl font-[800] text-[#FFD600]"
          style={{ 
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.02em",
            textShadow: "0 0 30px rgba(255,214,0,0.4)"
          }}
        >
          YO!
        </h1>
      </div>

      <div className="flex flex-col gap-1 px-3 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isNotifications = item.href === "/notifications"

          return (
            <div key={item.href} className="relative group">
              <button
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200 ${
                  isActive 
                    ? "bg-[#1a1a1a] text-[#FFD600]" 
                    : "text-[#888888] hover:bg-[#1a1a1a] hover:text-white"
                }`}
                style={isActive ? { boxShadow: "inset 3px 0 0 #FFD600" } : {}}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
              
              {isNotifications && unreadNotificationsCount > 0 && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}

              <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#1a1a1a] text-white text-xs px-2 py-1 rounded-lg border border-[#1f1f1f] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex-1" />

      <div className="p-4 border-t border-[#1f1f1f]">
        <div className="flex items-center gap-3">
          <img 
            src={CURRENT_USER.avatar} 
            alt={CURRENT_USER.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-display)" }}>
              {CURRENT_USER.name}
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
          <motion.button
            onClick={handleLogout}
            className="ml-auto text-[#888888] hover:text-red-400 transition-colors"
            whileHover={{ x: 2 }}
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
