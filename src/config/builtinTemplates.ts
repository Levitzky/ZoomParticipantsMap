import type { Template } from '@/types'

const now = Date.now()

export const EVENT_GLOW: Template = {
  id: 'event-glow',
  name: 'Event Glow',
  isBuiltin: true,
  createdAt: now,
  updatedAt: now,
  background: {
    type: 'preset',
    preset: 'deep-space',
    brightness: 1.0,
    overlayOpacity: 0.25,
    overlayColor: '#020b18',
  },
  header: {
    title: 'Welcome to Our Event',
    subtitle: 'Where are you joining from today?',
    showTitle: true,
    showSubtitle: true,
    position: 'top-left',
    titleColor: '#ffffff',
    subtitleColor: '#f59e0b',
  },
  map: {
    landColor: '#1e3a5f',
    borderColor: '#2a4f7a',
    waterColor: '#0f2035',
    activeStateColor: '#0d9488',
  },
  markers: {
    color: '#f59e0b',
    size: 6,
    glowIntensity: 3,
    showLabels: false,
    animationStyle: 'pulse',
  },
  statistics: {
    showParticipantCount: true,
    showStateCount: true,
    textColor: '#f59e0b',
  },
  branding: {
    logoPosition: 'bottom-right',
    showLogo: false,
  },
}

export const BUILTIN_TEMPLATES: Template[] = [EVENT_GLOW]
