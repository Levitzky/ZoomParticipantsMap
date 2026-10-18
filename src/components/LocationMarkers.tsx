import { Marker } from 'react-simple-maps'
import { useCurrentTemplate } from '@/hooks/useCurrentTemplate'
import { useMeetingStore } from '@/store/useMeetingStore'

export function LocationMarkers() {
  const { markers } = useCurrentTemplate()
  const participants = useMeetingStore(s => s.activeMeeting?.participants ?? [])

  const radius = markers.size * 2         // 1–10 → 2–20px
  const glowBlur = markers.glowIntensity * 5  // 0–5 → 0–25px

  const animClass =
    markers.animationStyle === 'pulse'
      ? 'animate-pulse-glow'
      : markers.animationStyle === 'ripple'
      ? 'animate-ripple'
      : ''

  return (
    <>
      {participants.map(p => (
        <Marker key={p.id} coordinates={[p.lng, p.lat]}>
          {/* Glow ring — rendered as SVG circle so html2canvas captures it */}
          {markers.glowIntensity > 0 && (
            <circle
              r={radius + glowBlur / 2}
              fill={markers.color}
              fillOpacity={0.15}
              stroke="none"
              className={animClass}
            />
          )}
          {/* Main dot */}
          <circle
            r={radius}
            fill={markers.color}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1}
            className={animClass}
          />
          {/* Label */}
          {markers.showLabels && (
            <text
              textAnchor="middle"
              y={-(radius + 6)}
              fontSize={10}
              fill={markers.color}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {p.name}
            </text>
          )}
        </Marker>
      ))}
    </>
  )
}
