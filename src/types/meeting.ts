import type { Participant } from './participant'
import type { Template } from './template'

export interface Meeting {
  id: string
  name: string
  templateId: string
  template: Template  // snapshot at session start — immutable during meeting
  participants: Participant[]
  startedAt: number
}
