import type { BackgroundPreset } from '@/types'

export const BACKGROUND_GRADIENTS: Record<BackgroundPreset, string> = {
  'deep-space':
    'radial-gradient(ellipse at 20% 50%, #0f2d52 0%, #020b18 60%, #000510 100%)',
  'navy-night':
    'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #061020 100%)',
  'golden-hour':
    'linear-gradient(160deg, #451a03 0%, #78350f 40%, #92400e 100%)',
  'morning-light':
    'linear-gradient(160deg, #dbeafe 0%, #bae6fd 45%, #e0f2fe 100%)',
}
