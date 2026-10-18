import { useState, useRef } from 'react'
import { useTemplateStore } from '@/store/useTemplateStore'
import { useMeetingStore } from '@/store/useMeetingStore'
import { PresentationView } from '@/components/PresentationView'
import { BUILTIN_TEMPLATES } from '@/config/builtinTemplates'
import { BACKGROUND_GRADIENTS } from '@/config/backgroundPresets'
import { exportTemplateJson, importTemplateJson } from '@/utils/templateExport'
import { compressImage } from '@/utils/compressImage'
import type { BackgroundPreset, AnimationStyle, HeaderPosition, LogoPosition } from '@/types'

export function TemplateEditorScreen() {
  const draft = useTemplateStore(s => s.draftTemplate)
  const updateDraft = useTemplateStore(s => s.updateDraft)
  const saveDraft = useTemplateStore(s => s.saveDraft)
  const cancelEdit = useTemplateStore(s => s.cancelEdit)
  const editingId = useMeetingStore(s => s.editingTemplateId)
  const beginEdit = useTemplateStore(s => s.beginEdit)
  const setScreen = useMeetingStore(s => s.setScreen)
  const savedTemplates = useTemplateStore(s => s.savedTemplates)
  const deleteTemplate = useTemplateStore(s => s.deleteTemplate)

  const [templateName, setTemplateName] = useState(draft?.name ?? '')
  const [saveError, setSaveError] = useState<string | null>(null)
  const importRef = useRef<HTMLInputElement>(null)

  // Init draft if not started yet
  if (!draft && editingId) {
    beginEdit(editingId)
    return null
  }
  if (!draft) {
    return <div className="flex items-center justify-center w-full h-full text-slate-400">Loading…</div>
  }

  function handleSave() {
    const name = templateName.trim() || draft!.name
    try {
      saveDraft(name)
      setScreen('setup')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  function handleCancel() {
    cancelEdit()
    setScreen('setup')
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = importTemplateJson(ev.target?.result as string)
        // Load the imported template as draft
        updateDraft(imported)
        setTemplateName(imported.name)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Import failed')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Left: editor panel */}
      <div className="w-96 flex-shrink-0 h-full overflow-y-auto bg-slate-950 border-r border-slate-800 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-slate-800 bg-slate-900">
          <h1 className="text-white font-semibold mb-3">Template Editor</h1>
          <input
            type="text"
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            placeholder="Template name"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 mb-3 transition-colors"
          />
          {saveError && <p className="text-xs text-red-400 mb-2">{saveError}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Editor sections */}
        <div className="flex-1 overflow-y-auto">
          {/* Presets */}
          <Section title="Start from a preset">
            <div className="grid grid-cols-3 gap-2">
              {BUILTIN_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { updateDraft(t); setTemplateName(t.name + ' (copy)') }}
                  className="relative aspect-video rounded-lg overflow-hidden border border-slate-700 hover:border-teal-500 transition-colors group"
                >
                  <div className="absolute inset-0" style={{ backgroundImage: BACKGROUND_GRADIENTS[t.background.preset] }} />
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 py-0.5 px-1">
                    <span className="text-xs text-white">{t.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          {/* Background */}
          <Section title="Background">
            <label className="block text-xs text-slate-400 mb-1">Style</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {([
                ['deep-space', 'Deep Space'],
                ['navy-night', 'Navy Night'],
                ['golden-hour', 'Golden Hour'],
                ['morning-light', 'Morning Light'],
              ] as [BackgroundPreset, string][]).map(([p, label]) => (
                <button
                  key={p}
                  onClick={() => updateDraft({ background: { type: 'preset', preset: p } })}
                  className={`h-10 rounded-lg border transition-colors text-xs ${
                    draft.background.preset === p && draft.background.type === 'preset'
                      ? 'border-teal-400'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                  style={{
                    backgroundImage: BACKGROUND_GRADIENTS[p],
                    color: p === 'morning-light' ? '#1e3a5f' : '#fff',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="block text-xs text-slate-400 mb-1">Custom image</label>
            <input
              type="file"
              accept="image/*"
              onChange={async e => {
                const file = e.target.files?.[0]
                if (!file) return
                const dataUrl = await compressImage(file)
                updateDraft({ background: { type: 'custom', customImageDataUrl: dataUrl } })
              }}
              className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-700 file:text-slate-300 mb-3"
            />
            <SliderRow label="Brightness" value={draft.background.brightness} min={0.3} max={1} step={0.05}
              onChange={v => updateDraft({ background: { brightness: v } })} />
            <SliderRow label="Overlay opacity" value={draft.background.overlayOpacity} min={0} max={0.8} step={0.05}
              onChange={v => updateDraft({ background: { overlayOpacity: v } })} />
          </Section>

          {/* Title & Header */}
          <Section title="Title & Header">
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id="showTitle" checked={draft.header.showTitle}
                onChange={e => updateDraft({ header: { showTitle: e.target.checked } })}
                className="accent-teal-500" />
              <label htmlFor="showTitle" className="text-xs text-slate-300">Show title</label>
            </div>
            <input type="text" value={draft.header.title}
              onChange={e => updateDraft({ header: { title: e.target.value } })}
              placeholder="Title"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 mb-2" />
            <ColorRow label="Title color" value={draft.header.titleColor}
              onChange={v => updateDraft({ header: { titleColor: v } })} />

            <div className="flex items-center gap-2 mb-2 mt-3">
              <input type="checkbox" id="showSub" checked={draft.header.showSubtitle}
                onChange={e => updateDraft({ header: { showSubtitle: e.target.checked } })}
                className="accent-teal-500" />
              <label htmlFor="showSub" className="text-xs text-slate-300">Show subtitle</label>
            </div>
            <input type="text" value={draft.header.subtitle}
              onChange={e => updateDraft({ header: { subtitle: e.target.value } })}
              placeholder="Subtitle"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 mb-2" />
            <ColorRow label="Subtitle color" value={draft.header.subtitleColor}
              onChange={v => updateDraft({ header: { subtitleColor: v } })} />

            <label className="block text-xs text-slate-400 mt-3 mb-1">Font style</label>
            <div className="flex gap-2 mb-3">
              {(['sans', 'serif'] as const).map(f => (
                <button key={f} onClick={() => updateDraft({ header: { fontStyle: f } })}
                  className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                    (draft.header.fontStyle ?? 'sans') === f ? 'border-teal-400 text-teal-300 bg-teal-900/30' : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                  style={{ fontFamily: f === 'serif' ? 'Georgia, serif' : undefined }}>
                  {f === 'sans' ? 'Sans-serif' : 'Serif'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" id="showDivider" checked={draft.header.showDivider ?? false}
                onChange={e => updateDraft({ header: { showDivider: e.target.checked } })}
                className="accent-teal-500" />
              <label htmlFor="showDivider" className="text-xs text-slate-300">Show decorative line under title</label>
            </div>
            <label className="block text-xs text-slate-400 mt-3 mb-1">Position</label>
            <div className="grid grid-cols-3 gap-1">
              {(['top-left','top-center','top-right','bottom-left','bottom-center'] as HeaderPosition[]).map(pos => (
                <button key={pos} onClick={() => updateDraft({ header: { position: pos } })}
                  className={`py-1 text-xs rounded border transition-colors ${
                    draft.header.position === pos ? 'border-teal-400 text-teal-300 bg-teal-900/30' : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}>
                  {pos.replace('-', ' ')}
                </button>
              ))}
            </div>
          </Section>

          {/* Map Colors */}
          <Section title="Map Colors">
            <ColorRow label="Land" value={draft.map.landColor} onChange={v => updateDraft({ map: { landColor: v } })} />
            <SliderRow label={`Land opacity (${Math.round((draft.map.landOpacity ?? 1) * 100)}%)`}
              value={draft.map.landOpacity ?? 1} min={0} max={1} step={0.05}
              onChange={v => updateDraft({ map: { landOpacity: v } })} />
            <ColorRow label="Water" value={draft.map.waterColor} onChange={v => updateDraft({ map: { waterColor: v } })} />
            <ColorRow label="State border" value={draft.map.borderColor} onChange={v => updateDraft({ map: { borderColor: v } })} />
            <ColorRow label="Active state" value={draft.map.activeStateColor} onChange={v => updateDraft({ map: { activeStateColor: v } })} />
          </Section>

          {/* Markers */}
          <Section title="Markers">
            <label className="block text-xs text-slate-400 mb-1">Shape</label>
            <div className="flex gap-2 mb-3">
              {(['circle', 'pin'] as const).map(s => (
                <button key={s} onClick={() => updateDraft({ markers: { shape: s } })}
                  className={`flex-1 py-1.5 text-xs rounded border transition-colors capitalize ${
                    (draft.markers.shape ?? 'circle') === s ? 'border-teal-400 text-teal-300 bg-teal-900/30' : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}>
                  {s === 'circle' ? '● Circle' : '📍 Pin'}
                </button>
              ))}
            </div>
            <ColorRow label="Color" value={draft.markers.color} onChange={v => updateDraft({ markers: { color: v } })} />
            <SliderRow label={`Size (${draft.markers.size})`} value={draft.markers.size} min={1} max={10} step={1}
              onChange={v => updateDraft({ markers: { size: v } })} />
            <SliderRow label={`Glow (${draft.markers.glowIntensity})`} value={draft.markers.glowIntensity} min={0} max={5} step={1}
              onChange={v => updateDraft({ markers: { glowIntensity: v } })} />
            <label className="block text-xs text-slate-400 mt-2 mb-1">Animation</label>
            <div className="flex gap-2">
              {(['pulse', 'ripple', 'static'] as AnimationStyle[]).map(a => (
                <button key={a} onClick={() => updateDraft({ markers: { animationStyle: a } })}
                  className={`flex-1 py-1.5 text-xs rounded border transition-colors capitalize ${
                    draft.markers.animationStyle === a ? 'border-teal-400 text-teal-300 bg-teal-900/30' : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}>
                  {a}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="showLabels" checked={draft.markers.showLabels}
                onChange={e => updateDraft({ markers: { showLabels: e.target.checked } })}
                className="accent-teal-500" />
              <label htmlFor="showLabels" className="text-xs text-slate-300">Show name labels</label>
            </div>
          </Section>

          {/* Statistics */}
          <Section title="Statistics">
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id="showCount" checked={draft.statistics.showParticipantCount}
                onChange={e => updateDraft({ statistics: { showParticipantCount: e.target.checked } })}
                className="accent-teal-500" />
              <label htmlFor="showCount" className="text-xs text-slate-300">Show participant count</label>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" id="showStates" checked={draft.statistics.showStateCount}
                onChange={e => updateDraft({ statistics: { showStateCount: e.target.checked } })}
                className="accent-teal-500" />
              <label htmlFor="showStates" className="text-xs text-slate-300">Show state count</label>
            </div>
            <ColorRow label="Text color" value={draft.statistics.textColor}
              onChange={v => updateDraft({ statistics: { textColor: v } })} />
          </Section>

          {/* Branding / Logo */}
          <Section title="Logo">
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" id="showLogo" checked={draft.branding.showLogo}
                onChange={e => updateDraft({ branding: { showLogo: e.target.checked } })}
                className="accent-teal-500" />
              <label htmlFor="showLogo" className="text-xs text-slate-300">Show logo</label>
            </div>
            <label className="block text-xs text-slate-400 mb-1">Upload logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={async e => {
                const file = e.target.files?.[0]
                if (!file) return
                // Logo: smaller max size, higher quality to preserve detail
                const dataUrl = await compressImage(file, 400, 200, 0.9)
                updateDraft({ branding: { logoDataUrl: dataUrl, showLogo: true } })
              }}
              className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-700 file:text-slate-300 mb-3"
            />
            {draft.branding.logoDataUrl && (
              <img src={draft.branding.logoDataUrl} alt="Logo preview" className="max-h-12 mb-3 object-contain" />
            )}
            <label className="block text-xs text-slate-400 mb-1">Position</label>
            <div className="grid grid-cols-2 gap-1">
              {(['top-left','top-right','bottom-left','bottom-right'] as LogoPosition[]).map(pos => (
                <button key={pos} onClick={() => updateDraft({ branding: { logoPosition: pos } })}
                  className={`py-1 text-xs rounded border transition-colors ${
                    draft.branding.logoPosition === pos ? 'border-teal-400 text-teal-300 bg-teal-900/30' : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}>
                  {pos.replace('-', ' ')}
                </button>
              ))}
            </div>
          </Section>

          {/* Saved templates management */}
          {savedTemplates.length > 0 && (
            <Section title="Saved Templates">
              {savedTemplates.map(t => (
                <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-sm text-slate-300 truncate flex-1">{t.name}</span>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => { updateDraft(t); setTemplateName(t.name) }}
                      className="text-xs text-slate-400 hover:text-teal-400 px-1">Load</button>
                    <button onClick={() => exportTemplateJson(t)}
                      className="text-xs text-slate-400 hover:text-blue-400 px-1">Export</button>
                    <button onClick={() => deleteTemplate(t.id)}
                      className="text-xs text-slate-400 hover:text-red-400 px-1">Delete</button>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Import / Export */}
          <Section title="Import / Export">
            <button
              onClick={() => exportTemplateJson(draft)}
              className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg mb-2 transition-colors"
            >
              Export current template as JSON
            </button>
            <label className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg flex items-center justify-center cursor-pointer transition-colors">
              Import template from JSON
              <input ref={importRef} type="file" accept=".json,application/json" onChange={handleImport} className="hidden" />
            </label>
          </Section>
        </div>
      </div>

      {/* Right: live preview */}
      <div className="flex-1 relative">
        <div className="absolute top-3 left-3 z-50 bg-black/60 text-slate-400 text-xs px-2 py-1 rounded-full pointer-events-none">
          Live Preview
        </div>
        <PresentationView />
      </div>
    </div>
  )
}

// ─── Helper sub-components ────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="border-b border-slate-800" open>
      <summary className="px-4 py-3 text-sm font-medium text-slate-300 cursor-pointer hover:bg-slate-800/50 select-none list-none flex items-center justify-between">
        {title}
        <span className="text-slate-600 text-xs">▾</span>
      </summary>
      <div className="px-4 pb-4 pt-1">{children}</div>
    </details>
  )
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs text-slate-400">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border border-slate-700 bg-transparent" />
        <span className="text-xs text-slate-500 font-mono w-16">{value}</span>
      </div>
    </div>
  )
}

function SliderRow({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void
}) {
  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <label className="text-xs text-slate-400">{label}</label>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-teal-500" />
    </div>
  )
}
