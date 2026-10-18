import { useState } from 'react'
import { useTemplateStore } from '@/store/useTemplateStore'
import { useMeetingStore } from '@/store/useMeetingStore'
import { BACKGROUND_GRADIENTS } from '@/config/backgroundPresets'
import type { Template } from '@/types'

export function SetupScreen() {
  const getAllTemplates = useTemplateStore(s => s.getAllTemplates)
  const lastUsedId = useTemplateStore(s => s.lastUsedTemplateId)
  const setLastUsed = useTemplateStore(s => s.setLastUsed)
  const duplicateTemplate = useTemplateStore(s => s.duplicateTemplate)
  const deleteTemplate = useTemplateStore(s => s.deleteTemplate)
  const activeMeeting = useMeetingStore(s => s.activeMeeting)
  const startMeeting = useMeetingStore(s => s.startMeeting)
  const setScreen = useMeetingStore(s => s.setScreen)
  const openTemplateEditor = useMeetingStore(s => s.openTemplateEditor)

  const templates = getAllTemplates()
  const [selectedId, setSelectedId] = useState(lastUsedId)
  const [meetingName, setMeetingName] = useState('')

  const selectedTemplate = templates.find(t => t.id === selectedId) ?? templates[0]

  function handleStart() {
    if (!selectedTemplate) return
    const name = meetingName.trim() || `Meeting – ${new Date().toLocaleDateString()}`
    setLastUsed(selectedId)
    startMeeting(name, selectedTemplate)
  }

  function handleNewTemplate() {
    const newId = duplicateTemplate('event-glow')?.id
    if (newId) openTemplateEditor(newId)
  }

  return (
    <div className="w-full h-full flex items-center justify-center"
         style={{ background: 'radial-gradient(ellipse at 20% 50%, #0f2d52 0%, #020b18 60%, #000510 100%)' }}>
      <div className="w-full max-w-2xl px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">ParticipantsMap</h1>
          <p className="text-slate-400">Start a new meeting</p>
        </div>

        {/* Meeting name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Meeting name
          </label>
          <input
            type="text"
            placeholder={`Meeting – ${new Date().toLocaleDateString()}`}
            value={meetingName}
            onChange={e => setMeetingName(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/70 transition-colors"
          />
        </div>

        {/* Template picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Choose a template
          </label>
          <div className="grid grid-cols-3 gap-3">
            {templates.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                selected={t.id === selectedId}
                onSelect={() => setSelectedId(t.id)}
                onEdit={() => openTemplateEditor(t.id)}
                onDelete={!t.isBuiltin ? () => { deleteTemplate(t.id); if (selectedId === t.id) setSelectedId('event-glow') } : undefined}
              />
            ))}
            {/* New template card */}
            <button
              onClick={handleNewTemplate}
              className="aspect-video rounded-xl border-2 border-dashed border-slate-600/50 hover:border-teal-500/50 text-slate-500 hover:text-teal-400 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <span className="text-2xl">+</span>
              <span className="text-xs">New Template</span>
            </button>
          </div>
        </div>

        {/* Resume or Start button */}
        {activeMeeting ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setScreen('presentation')}
              className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-lg rounded-xl transition-colors shadow-lg shadow-teal-900/30"
            >
              ▶ Resume "{activeMeeting.name}"
            </button>
            <button
              onClick={handleStart}
              className="w-full py-2.5 text-sm text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-500 rounded-xl transition-colors"
            >
              Start new meeting (ends current)
            </button>
          </div>
        ) : (
          <button
            onClick={handleStart}
            className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-lg rounded-xl transition-colors shadow-lg shadow-teal-900/30"
          >
            Start Meeting →
          </button>
        )}
      </div>
    </div>
  )
}

interface TemplateCardProps {
  template: Template
  selected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete?: () => void
}

function TemplateCard({ template, selected, onSelect, onEdit, onDelete }: TemplateCardProps) {
  const bg =
    template.background.type === 'custom' && template.background.customImageDataUrl
      ? { backgroundImage: `url(${template.background.customImageDataUrl})`, backgroundSize: 'cover' }
      : { backgroundImage: BACKGROUND_GRADIENTS[template.background.preset] }

  return (
    <div
      onClick={onSelect}
      className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
        selected ? 'border-teal-400 shadow-lg shadow-teal-900/40' : 'border-slate-700/50 hover:border-slate-500'
      }`}
    >
      {/* Preview swatch */}
      <div className="absolute inset-0" style={bg} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Mini map color hint */}
        <div
          className="w-3/4 h-1/2 rounded opacity-60"
          style={{ backgroundColor: template.map.landColor }}
        />
      </div>

      {/* Name label */}
      <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1">
        <p className="text-xs text-white truncate">{template.name}</p>
      </div>

      {/* Action buttons on hover */}
      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => { e.stopPropagation(); onEdit() }}
          className="w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded text-xs flex items-center justify-center"
          title="Edit template"
        >
          ✎
        </button>
        {onDelete && (
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="w-6 h-6 bg-black/60 hover:bg-red-800/80 text-white rounded text-xs flex items-center justify-center"
            title="Delete template"
          >
            ×
          </button>
        )}
      </div>

      {selected && (
        <div className="absolute top-1 left-1 w-4 h-4 bg-teal-400 rounded-full flex items-center justify-center">
          <span className="text-slate-900 text-xs">✓</span>
        </div>
      )}
    </div>
  )
}
