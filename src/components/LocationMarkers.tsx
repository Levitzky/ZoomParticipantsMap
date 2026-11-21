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
        const baseR = Math.max(baseRadius, count > 9 ? 13 : 10)
        const circleCy = isPin ? -baseR * 1.4 : 0

        // Pill dimensions based on city name
        const cityName = first.location.split(',')[0].trim()
        const mainFs = Math.max(9, Math.min(13, baseR * 1.0))
        const countFs = mainFs * 0.75
        const mainTextW = cityName.length * mainFs * 0.58
        const countGap = 4
        const countTextW = `(${count})`.length * countFs * 0.58 + countGap
        const totalTextW = mainTextW + countTextW
        const padX = 8, padY = 5
        const pillW = Math.max(totalTextW + padX * 2, baseR * 2)
        const pillH = mainFs + padY * 2
        const pillX = -pillW / 2
        const pillY = circleCy - pillH / 2

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
                <ellipse
                  cx={0} cy={circleCy}
                  rx={pillW / 2 + glowBlur / 2} ry={pillH / 2 + glowBlur / 2}
                  fill={markers.color}
                  fillOpacity={0.18}
                  stroke="none"
                  className={animClass}
                />
              )}

              <g className={animClass}>
                {/* Pin tail */}
                {isPin && (
                  <polygon
                    points={`${-pillW * 0.12},${circleCy + pillH / 2} ${pillW * 0.12},${circleCy + pillH / 2} 0,0`}
                    fill={markers.color}
                  />
                )}
                {/* Pill background */}
                <rect
                  x={pillX} y={pillY}
                  width={pillW} height={pillH}
                  rx={pillH / 2}
                  fill={markers.color}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={1}
                />
                {/* City name */}
                <text
                  x={-totalTextW / 2} y={circleCy}
                  textAnchor="start" dy="0.35em"
                  fontSize={mainFs} fontWeight="600" fill="#fff"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >{cityName}</text>
                {/* Count in small text */}
                <text
                  x={-totalTextW / 2 + mainTextW + countGap} y={circleCy}
                  textAnchor="start" dy="0.35em"
                  fontSize={countFs} fontWeight="400" fill="rgba(255,255,255,0.8)"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >({count})</text>
              </g>

              {markers.showLabels && (
                <text
                  textAnchor="middle"
                  y={pillY - 4}
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
