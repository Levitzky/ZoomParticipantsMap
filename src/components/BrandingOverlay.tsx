import { useCurrentTemplate } from '@/hooks/useCurrentTemplate'
import type { LogoPosition } from '@/types'

const POSITION_CLASSES: Record<LogoPosition, string> = {
  'top-left':     'top-4 left-4',
  'top-right':    'top-4 right-4',
  'bottom-left':  'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
}

export function BrandingOverlay() {
  const { branding } = useCurrentTemplate()
  if (!branding.showLogo || !branding.logoDataUrl) return null

  return (
    <div className={`absolute z-20 ${POSITION_CLASSES[branding.logoPosition]}`}>
      <img
        src={branding.logoDataUrl}
        alt="Company logo"
        className="max-h-16 max-w-48 object-contain drop-shadow-lg"
      />
    </div>
  )
}
