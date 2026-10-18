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
    textColor: '#94a3b8',
  },
  branding: {
    logoPosition: 'top-right',
    showLogo: false,
  },
}

export const EVENING: Template = {
  id: 'evening',
  name: 'Evening',
  isBuiltin: true,
  createdAt: now,
  updatedAt: now,
  background: {
    type: 'preset',
    preset: 'navy-night',
    brightness: 1.0,
    overlayOpacity: 0.3,
    overlayColor: '#0a1628',
  },
  header: {
    title: 'Welcome to Our Event',
    subtitle: 'Where are you joining from today?',
    showTitle: true,
    showSubtitle: true,
    position: 'top-left',
    titleColor: '#f1f5f9',
    subtitleColor: '#94a3b8',
  },
  map: {
    landColor: '#152340',
    borderColor: '#1e3a5f',
    waterColor: '#0a1628',
    activeStateColor: '#4f46e5',
  },
  markers: {
    color: '#e2e8f0',
    size: 5,
    glowIntensity: 2,
    showLabels: false,
    animationStyle: 'pulse',
  },
  statistics: {
    showParticipantCount: true,
    showStateCount: true,
    textColor: '#64748b',
  },
  branding: {
    logoPosition: 'top-right',
    showLogo: false,
  },
}

export const WARM_WELCOME: Template = {
  id: 'warm-welcome',
  name: 'Warm Welcome',
  isBuiltin: true,
  createdAt: now,
  updatedAt: now,
  background: {
    type: 'preset',
    preset: 'golden-hour',
    brightness: 1.0,
    overlayOpacity: 0.2,
    overlayColor: '#451a03',
  },
  header: {
    title: 'Welcome to Our Event',
    subtitle: 'Where are you joining from today?',
    showTitle: true,
    showSubtitle: true,
    position: 'top-left',
    titleColor: '#fff7ed',
    subtitleColor: '#fcd34d',
  },
  map: {
    landColor: '#92400e',
    borderColor: '#b45309',
    waterColor: '#7c2d12',
    activeStateColor: '#d97706',
  },
  markers: {
    color: '#fcd34d',
    size: 6,
    glowIntensity: 2,
    showLabels: false,
    animationStyle: 'ripple',
  },
  statistics: {
    showParticipantCount: true,
    showStateCount: true,
    textColor: '#fde68a',
  },
  branding: {
    logoPosition: 'top-right',
    showLogo: false,
  },
}

export const BUILTIN_TEMPLATES: Template[] = [EVENT_GLOW, EVENING, WARM_WELCOME]
