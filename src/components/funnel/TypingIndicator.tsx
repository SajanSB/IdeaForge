export function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label="BA agent is composing a question"
      className="flex items-start gap-3 mb-4"
    >
      {/* Agent avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-7 h-7 rounded-full bg-[#FAEEDA] flex items-center justify-center">
          <span className="text-[10px] font-mono font-medium text-[#BA7517]">BA</span>
        </div>
      </div>

      {/* Typing bubble */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#6B7280]"
              style={{
                animation: 'typingDot 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  )
}
