import { useCurrentTemplate } from '@/hooks/useCurrentTemplate'
import { useMeetingStore } from '@/store/useMeetingStore'

export function StatisticsOverlay() {
  const { statistics } = useCurrentTemplate()
  const participants = useMeetingStore(s => s.activeMeeting?.participants ?? [])

  if (!statistics.showParticipantCount && !statistics.showStateCount) return null

  const stateCount = new Set(participants.map(p => p.state)).size
  const accent = statistics.textColor

  return (
    <div className="absolute top-5 right-5 z-20" style={{ pointerEvents: 'none' }}>
      <div style={{
        background: 'rgba(255,255,255,0.93)',
        borderRadius: 12,
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 2px 20px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(6px)',
      }}>
        {statistics.showParticipantCount && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* People icon */}
            <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
              <circle cx="10" cy="6" r="4" fill={accent} />
              <path d="M2 22c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={accent} strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <circle cx="20" cy="7" r="3" fill={accent} opacity="0.55" />
              <path d="M16 22c0-3 1.8-5.5 4-6.5" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55" />
            </svg>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{participants.length}</div>
              <div style={{ fontSize: 9, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>Participants</div>
            </div>
          </div>
        )}

        {statistics.showParticipantCount && statistics.showStateCount && (
          <div style={{ width: 1, height: 38, background: '#ddd', flexShrink: 0 }} />
        )}

        {statistics.showStateCount && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Map pin icon */}
            <svg width="18" height="24" viewBox="0 0 18 24" fill={accent}>
              <path d="M9 0C5.134 0 2 3.134 2 7c0 5.25 7 14 7 14s7-8.75 7-14c0-3.866-3.134-7-7-7zm0 9.5A2.5 2.5 0 1 1 9 4.5a2.5 2.5 0 0 1 0 5z" />
            </svg>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{stateCount}</div>
              <div style={{ fontSize: 9, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>States</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
