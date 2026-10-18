import { useCurrentTemplate } from '@/hooks/useCurrentTemplate'
import { BACKGROUND_GRADIENTS } from '@/config/backgroundPresets'

export function MapBackground() {
  const { background } = useCurrentTemplate()

  const bgStyle =
    background.type === 'custom' && background.customImageDataUrl
      ? {
          backgroundImage: `url(${background.customImageDataUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `brightness(${background.brightness})`,
        }
      : {
          backgroundImage: BACKGROUND_GRADIENTS[background.preset],
          filter: `brightness(${background.brightness})`,
        }

  return (
    <div className="absolute inset-0 z-0" style={bgStyle}>
      {/* Overlay for depth / text readability */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: background.overlayColor,
          opacity: background.overlayOpacity,
        }}
      />
    </div>
  )
}
