import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Template, TemplatePatch } from '@/types'
import { BUILTIN_TEMPLATES, EVENT_GLOW } from '@/config/builtinTemplates'
import { mergeTemplate } from '@/utils/deepMerge'

interface TemplateState {
  savedTemplates: Template[]
  draftTemplate: Template | null
  lastUsedTemplateId: string

  // Read helpers
  getAllTemplates: () => Template[]
  getTemplateById: (id: string) => Template | undefined

  // Draft editing (Template Editor)
  beginEdit: (templateId: string) => void
  updateDraft: (patch: TemplatePatch) => void
  saveDraft: (name: string) => Template
  cancelEdit: () => void

  // Saved template management
  deleteTemplate: (id: string) => void
  duplicateTemplate: (id: string) => Template | null
  setLastUsed: (id: string) => void
  resetToBuiltins: () => void
}

const SIZE_LIMIT = 3_000_000

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      savedTemplates: [],
      draftTemplate: null,
      lastUsedTemplateId: 'event-glow',

      getAllTemplates() {
        return [...BUILTIN_TEMPLATES, ...get().savedTemplates]
      },

      getTemplateById(id) {
        return get().getAllTemplates().find(t => t.id === id)
      },

      beginEdit(templateId) {
        const template = get().getTemplateById(templateId)
        if (!template) return
        // If editing a builtin, create a copy; otherwise edit the saved template directly
        const draft: Template = template.isBuiltin
          ? { ...template, id: crypto.randomUUID(), isBuiltin: false, name: `${template.name} (copy)`, createdAt: Date.now(), updatedAt: Date.now() }
          : { ...template }
        set({ draftTemplate: draft })
      },

      updateDraft(patch) {
        const draft = get().draftTemplate
        if (!draft) return
        set({ draftTemplate: mergeTemplate(draft, patch) })
      },

      saveDraft(name) {
        const draft = get().draftTemplate
        if (!draft) throw new Error('No draft to save')
        const toSave: Template = { ...draft, name, updatedAt: Date.now() }

        const existing = get().savedTemplates.find(t => t.id === toSave.id)
        const updated = existing
          ? get().savedTemplates.map(t => t.id === toSave.id ? toSave : t)
          : [...get().savedTemplates, toSave]

        const sizeEst = JSON.stringify(updated).length
        if (sizeEst > SIZE_LIMIT) {
          throw new Error('Storage limit reached. Delete some saved templates or use a smaller logo image.')
        }

        set({ savedTemplates: updated, draftTemplate: null, lastUsedTemplateId: toSave.id })
        return toSave
      },

      cancelEdit() {
        set({ draftTemplate: null })
      },

      deleteTemplate(id) {
        set(s => ({ savedTemplates: s.savedTemplates.filter(t => t.id !== id) }))
      },

      duplicateTemplate(id) {
        const template = get().getTemplateById(id)
        if (!template) return null
        const copy: Template = {
          ...template,
          id: crypto.randomUUID(),
          name: `${template.name} (copy)`,
          isBuiltin: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set(s => ({ savedTemplates: [...s.savedTemplates, copy] }))
        return copy
      },

      setLastUsed(id) {
        set({ lastUsedTemplateId: id })
      },

      resetToBuiltins() {
        set({ savedTemplates: [], lastUsedTemplateId: 'event-glow', draftTemplate: null })
      },
    }),
    {
      name: 'participants-map-templates',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: state => ({
        savedTemplates: state.savedTemplates,
        lastUsedTemplateId: state.lastUsedTemplateId,
      }),
    }
  )
)

/** Returns the template currently being used for a new meeting (last used or default). */
export function getDefaultTemplate(): Template {
  const { lastUsedTemplateId, getAllTemplates } = useTemplateStore.getState()
  return getAllTemplates().find(t => t.id === lastUsedTemplateId) ?? EVENT_GLOW
}
