import { useMeetingStore } from '@/store/useMeetingStore'

export function ParticipantList() {
  const participants = useMeetingStore(s => s.activeMeeting?.participants ?? [])
  const removeParticipant = useMeetingStore(s => s.removeParticipant)
  const clearParticipants = useMeetingStore(s => s.clearParticipants)

  if (participants.length === 0) {
    return (
      <div className="px-3 py-4 text-center text-sm text-slate-200">
        No participants yet
      </div>
    )
  }

  return (
    <div>
      <div className="max-h-48 overflow-y-auto">
        {participants.map(p => (
          <div
            key={p.id}
            className="flex items-center justify-between px-3 py-1.5 hover:bg-white/10 group"
          >
            <div className="min-w-0 flex-1">
              <span className="text-sm text-slate-200 truncate block">{p.name}</span>
              <span className="text-xs text-slate-300 truncate block">{p.location}</span>
            </div>
            <button
              onClick={() => removeParticipant(p.id)}
              aria-label={`Remove ${p.name}`}
              className="ml-2 text-slate-300 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all text-sm leading-none flex-shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 border-t border-white/20">
        <button
          onClick={clearParticipants}
          className="text-xs text-slate-200 hover:text-red-300 transition-colors"
        >
          Clear all
        </button>
      </div>
    </div>
  )
}
