import { useTemplateStore } from '@/store/useTemplateStore'
import { useMeetingStore } from '@/store/useMeetingStore'
import type { Template } from '@/types'
import { EVENT_GLOW } from '@/config/builtinTemplates'

/**
 * Returns the template that all display components should render from.
 *
 * Priority:
 *  1. draftTemplate  — when Template Editor is open (powers live preview)
 *  2. activeMeeting.template  — the snapshot taken at meeting start
 *  3. EVENT_GLOW fallback
 */
export function useCurrentTemplate(): Template {
  const draft = useTemplateStore(s => s.draftTemplate)
  const meeting = useMeetingStore(s => s.activeMeeting)

  if (draft) return draft
  if (meeting) return meeting.template
  return EVENT_GLOW
}
