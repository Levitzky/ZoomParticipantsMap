import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Marker } from 'react-simple-maps'
import { useCurrentTemplate } from '@/hooks/useCurrentTemplate'
import { useMeetingStore } from '@/store/useMeetingStore'
import type { Participant } from '@/types'

/** SVG path for a map pin (teardrop pointing down). Point at (0,0), circle above.
 *  R = radius of the circle part. Circle center at (0, -R*1.4). */
function pinPath(R: number) {
  return [
    `M 0 0`,
    `C ${-R * 0.35} ${-R * 0.5} ${-R} ${-R * 0.9} ${-R} ${-R * 1.4}`,
    `A ${R} ${R} 0 0 0 ${R} ${-R * 1.4}`,
    `C ${R} ${-R * 0.9} ${R * 0.35} ${-R * 0.5} 0 0`,
    `Z`,
  ].join(' ')
}

interface TooltipState { x: number; y: number; group: Participant[] }

export function LocationMarkers() {
  const { markers } = useCurrentTemplate()
  const participants = useMeetingStore(s => s.activeMeeting?.participants ?? [])
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const baseRadius = markers.size * 2        // 1–10 → 2–20px
  const glowBlur = markers.glowIntensity * 5
  const isPin = (markers.shape ?? 'circle') === 'pin'

  const animClass =
    markers.animationStyle === 'pulse'
      ? 'animate-pulse-glow'
      : markers.animationStyle === 'ripple'
      ? 'animate-ripple'
      : ''

  // Group participants by location (lat/lng)
  const groups = new Map<string, Participant[]>()
  for (const p of participants) {
    const key = `${p.lat},${p.lng}`
    const group = groups.get(key) ?? []
    group.push(p)
    groups.set(key, group)
  }

  return (
    <>
      {[...groups.values()].map(group => {
        const first = group[0]
        const count = group.length
        const radius = Math.max(baseRadius, count > 9 ? 13 : 10)
        const fontSize = Math.round(radius * 0.9)
        const circleCy = isPin ? -radius * 1.4 : 0

        return (
          <Marker key={`${first.lat},${first.lng}`} coordinates={[first.lng, first.lat]}>
            <g
              style={{ cursor: 'pointer' }}
              onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, group })}
              onMouseMove={e => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Glow */}
              {markers.glowIntensity > 0 && (
                <circle
                  cx={0} cy={circleCy}
                  r={radius + glowBlur / 2}
                  fill={markers.color}
                  fillOpacity={0.18}
                  stroke="none"
                  className={animClass}
                />
              )}

              {isPin ? (
                // ── Pin (teardrop) shape ────────────────────────────
                <g className={animClass}>
                  <path
                    d={pinPath(radius)}
                    fill={markers.color}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth={1}
                  />
                  <circle cx={0} cy={circleCy} r={radius * 0.55} fill="rgba(255,255,255,0.2)" />
                  <text
                    x={0} y={circleCy}
                    textAnchor="middle" dy="0.35em"
                    fontSize={fontSize} fontWeight="700" fill="#fff"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >{count}</text>
                </g>
              ) : (
                // ── Circle shape ────────────────────────────────────
                <>
                  <circle
                    r={radius}
                    fill={markers.color}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={1}
                    className={animClass}
                  />
                  <text
                    textAnchor="middle" dy="0.35em"
                    fontSize={fontSize} fontWeight="700" fill="#fff"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >{count}</text>
                </>
              )}

              {markers.showLabels && (
                <text
                  textAnchor="middle"
                  y={isPin ? circleCy - radius - 6 : -(radius + 6)}
                  fontSize={10} fill={markers.color}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >{first.location}</text>
              )}
            </g>
          </Marker>
        )
      })}

      {tooltip && createPortal(
        <div
          className="no-export"
          style={{ position: 'fixed', left: tooltip.x + 14, top: tooltip.y - 10, zIndex: 9999, pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(10, 20, 40, 0.92)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '10px 14px',
            minWidth: 140,
            maxWidth: 220,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 5 }}>
              {tooltip.group[0].location}
            </div>
            {tooltip.group.map(p => (
              <div key={p.id} style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>{p.name}</div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
