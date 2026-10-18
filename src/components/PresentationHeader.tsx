import { useCurrentTemplate } from '@/hooks/useCurrentTemplate'
import type { HeaderPosition } from '@/types'

const POSITION_CLASSES: Record<HeaderPosition, string> = {
  'top-left':      'top-8 left-10',
  'top-center':    'top-8 left-1/2 -translate-x-1/2',
  'top-right':     'top-8 right-10',
  'bottom-left':   'bottom-8 left-10',
  'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
}

export function PresentationHeader() {
  const { header } = useCurrentTemplate()
  if (!header.showTitle && !header.showSubtitle) return null

  const isSerif = header.fontStyle === 'serif'
  const isCentered = header.position === 'top-center' || header.position === 'bottom-center'

  return (
    <div className={`absolute z-20 ${POSITION_CLASSES[header.position]}`} style={{ textAlign: isCentered ? 'center' : 'left' }}>
      {header.showTitle && (
        <h1
          className="leading-tight drop-shadow-lg m-0"
          style={{
            color: header.titleColor,
            fontFamily: isSerif ? "Georgia, 'Times New Roman', serif" : undefined,
            fontSize: isSerif ? '3rem' : '2.25rem',
            fontWeight: 700,
          }}
        >
          {header.title}
        </h1>
      )}
      {header.showDivider && header.showTitle && (
        <div style={{
          width: 56,
          height: 2,
          background: header.subtitleColor,
          margin: isCentered ? '8px auto 0' : '8px 0 0',
          borderRadius: 1,
        }} />
      )}
      {header.showSubtitle && (
        <p
          className="drop-shadow-md"
          style={{
            color: header.subtitleColor,
            marginTop: header.showDivider ? 8 : 4,
            fontSize: isSerif ? '0.85rem' : '1.125rem',
            letterSpacing: isSerif ? '0.12em' : undefined,
            textTransform: isSerif ? 'uppercase' : undefined,
          }}
        >
          {header.subtitle}
        </p>
      )}
    </div>
  )
}
