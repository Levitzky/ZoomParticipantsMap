import { useCurrentTemplate } from '@/hooks/useCurrentTemplate'
import { useMeetingStore } from '@/store/useMeetingStore'

export function StatisticsOverlay() {
  const { statistics } = useCurrentTemplate()
  const participants = useMeetingStore(s => s.activeMeeting?.participants ?? [])

  if (!statistics.showParticipantCount && !statistics.showStateCount) return null

  const stateCount = new Set(participants.map(p => p.state)).size

  return (
    <div
      className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-2"
      style={{ color: statistics.textColor }}
    >
      {statistics.showParticipantCount && (
        <div className="text-right">
          <span className="text-3xl font-bold drop-shadow-lg">{participants.length}</span>
          <span className="text-sm ml-2 opacity-80">Participant{participants.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      {statistics.showStateCount && (
        <div className="text-right">
          <span className="text-3xl font-bold drop-shadow-lg">{stateCount}</span>
          <span className="text-sm ml-2 opacity-80">State{stateCount !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}
