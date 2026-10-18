export type BackgroundPreset = 'deep-space' | 'navy-night' | 'golden-hour' | 'morning-light'
export type HeaderPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center'
export type AnimationStyle = 'pulse' | 'static' | 'ripple'
export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface Template {
  id: string
  name: string
  isBuiltin?: boolean
  createdAt: number
  updatedAt: number
  background: {
    type: 'preset' | 'custom'
    preset: BackgroundPreset
    customImageDataUrl?: string
    brightness: number      // 0–1
    overlayOpacity: number  // 0–1
    overlayColor: string
  }
  header: {
    title: string
    subtitle: string
    showTitle: boolean
    showSubtitle: boolean
    position: HeaderPosition
    titleColor: string
    subtitleColor: string
    fontStyle?: 'sans' | 'serif'
    showDivider?: boolean
  }
  map: {
    landColor: string
    landOpacity?: number     // 0–1, default 1
    borderColor: string
    waterColor: string
    activeStateColor: string
  }
  markers: {
    color: string
    size: number           // 1–10
    glowIntensity: number  // 0–5
    showLabels: boolean
    animationStyle: AnimationStyle
    shape?: 'circle' | 'pin'
  }
  statistics: {
    showParticipantCount: boolean
    showStateCount: boolean
    textColor: string
  }
  branding: {
    logoDataUrl?: string
    logoPosition: LogoPosition
    showLogo: boolean
  }
}

export type TemplatePatch = {
  name?: string
  background?: Partial<Template['background']>
  header?: Partial<Template['header']>
  map?: Partial<Template['map']>
  markers?: Partial<Template['markers']>
  statistics?: Partial<Template['statistics']>
  branding?: Partial<Template['branding']>
}
