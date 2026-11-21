import type { BackgroundPreset } from '@/types'

export const BACKGROUND_GRADIENTS: Record<BackgroundPreset, string> = {
  'deep-space':
    'radial-gradient(ellipse at 20% 50%, #1a4a8a 0%, #0d2a52 60%, #071830 100%)',
  'navy-night':
    'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #061020 100%)',
  'golden-hour':
    'linear-gradient(160deg, #451a03 0%, #78350f 40%, #92400e 100%)',
  'morning-light':
    'linear-gradient(160deg, #dbeafe 0%, #bae6fd 45%, #e0f2fe 100%)',
}
