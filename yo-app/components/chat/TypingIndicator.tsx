export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-[#1a1a1a] rounded-2xl rounded-tl-none w-fit">
      <div className="w-2 h-2 bg-[#888888] rounded-full" style={{ animation: "yo-bounce 1s ease-in-out infinite" }} />
      <div className="w-2 h-2 bg-[#888888] rounded-full" style={{ animation: "yo-bounce 1s ease-in-out infinite 0.2s" }} />
      <div className="w-2 h-2 bg-[#888888] rounded-full" style={{ animation: "yo-bounce 1s ease-in-out infinite 0.4s" }} />
    </div>
  )
}
