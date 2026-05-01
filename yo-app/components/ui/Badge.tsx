interface BadgeProps {
  count: number
  className?: string
}

export default function Badge({ count, className = "" }: BadgeProps) {
  if (count <= 0) return null
  
  return (
    <span 
      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#FFD600] text-black text-xs font-bold rounded-full ${className}`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}
