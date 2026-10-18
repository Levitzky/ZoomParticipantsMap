import { create } from 'zustand'
import type { Meeting, Participant, Template } from '@/types'
import { resolveLocation } from '@/utils/geocode'

export type AppScreen = 'setup' | 'presentation' | 'template-editor'

interface MeetingState {
  screen: AppScreen
  activeMeeting: Meeting | null
  editingTemplateId: string | null  // which template is open in editor

  setScreen: (screen: AppScreen) => void
  startMeeting: (name: string, template: Template) => void
  endMeeting: () => void
  addParticipant: (location: string, name?: string) => Promise<void>
  removeParticipant: (id: string) => void
  clearParticipants: () => void
  openTemplateEditor: (templateId: string) => void
}

export const useMeetingStore = create<MeetingState>()((set) => ({
  screen: 'setup',
  activeMeeting: null,
  editingTemplateId: null,

  setScreen(screen) {
    set({ screen })
  },

  startMeeting(name, template) {
    const meeting: Meeting = {
      id: crypto.randomUUID(),
      name,
      templateId: template.id,
      template: { ...template },  // snapshot
      participants: [],
      startedAt: Date.now(),
    }
    set({ activeMeeting: meeting, screen: 'presentation' })
  },

  endMeeting() {
    set({ activeMeeting: null, screen: 'setup' })
  },

  async addParticipant(location, name) {
    const resolved = resolveLocation(location)
    if (!resolved) throw new Error(`Location not found: "${location}"`)

    const participant: Participant = {
      id: crypto.randomUUID(),
      name: name?.trim() || resolved.canonicalName,
      location,
      lat: resolved.lat,
      lng: resolved.lng,
      state: resolved.state,
      addedAt: Date.now(),
    }

    set(s => {
      if (!s.activeMeeting) return s
      return {
        activeMeeting: {
          ...s.activeMeeting,
          participants: [...s.activeMeeting.participants, participant],
        },
      }
    })
  },

  removeParticipant(id) {
    set(s => {
      if (!s.activeMeeting) return s
      return {
        activeMeeting: {
          ...s.activeMeeting,
          participants: s.activeMeeting.participants.filter(p => p.id !== id),
        },
      }
    })
  },

  clearParticipants() {
    set(s => {
      if (!s.activeMeeting) return s
      return { activeMeeting: { ...s.activeMeeting, participants: [] } }
    })
  },

  openTemplateEditor(templateId) {
    set({ editingTemplateId: templateId, screen: 'template-editor' })
  },
}))
