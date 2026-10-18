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

  return (
    <div className={`absolute z-20 ${POSITION_CLASSES[header.position]}`}>
      {header.showTitle && (
        <h1
          className="text-4xl font-bold leading-tight drop-shadow-lg m-0"
          style={{ color: header.titleColor }}
        >
          {header.title}
        </h1>
      )}
      {header.showSubtitle && (
        <p
          className="text-lg mt-1 drop-shadow-md"
          style={{ color: header.subtitleColor }}
        >
          {header.subtitle}
        </p>
      )}
    </div>
  )
}
