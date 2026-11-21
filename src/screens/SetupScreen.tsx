import { useState } from 'react'
import { useMeetingStore } from '@/store/useMeetingStore'
import { EVENT_GLOW } from '@/config/builtinTemplates'
import { compressImage } from '@/utils/compressImage'

const BUBBLE_COLORS = [
  { label: 'Amber',  value: '#f59e0b' },
  { label: 'Teal',   value: '#14b8a6' },
  { label: 'Blue',   value: '#3b82f6' },
  { label: 'Rose',   value: '#f43f5e' },
  { label: 'Purple', value: '#a78bfa' },
  { label: 'White',  value: '#e2e8f0' },
]

export function SetupScreen() {
  const activeMeeting        = useMeetingStore(s => s.activeMeeting)
  const startMeeting         = useMeetingStore(s => s.startMeeting)
  const setScreen            = useMeetingStore(s => s.setScreen)
  const patchMeetingTemplate = useMeetingStore(s => s.patchMeetingTemplate)

  // Pre-populate from active meeting when returning to setup
  const [eventName,   setEventName]   = useState(activeMeeting?.template.header.title ?? '')
  const [eventDate,   setEventDate]   = useState(activeMeeting?.template.header.date ?? '')
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(activeMeeting?.template.branding.logoDataUrl ?? null)
  const [bubbleColor, setBubbleColor] = useState(activeMeeting?.template.markers.color ?? '#f59e0b')

  function handleResume() {
    // Apply any edits made on the setup screen back to the active meeting
    patchMeetingTemplate({
      header: {
        ...activeMeeting!.template.header,
        title: eventName.trim() || activeMeeting!.name,
        date: eventDate.trim() || undefined,
      },
      markers: { ...activeMeeting!.template.markers, color: bubbleColor },
      branding: {
        ...activeMeeting!.template.branding,
        logoDataUrl: logoDataUrl ?? undefined,
        showLogo: !!logoDataUrl,
      },
    })
    setScreen('presentation')
  }

  function handleStart() {
    const name = eventName.trim() || 'Meeting'
    const template = {
      ...EVENT_GLOW,
      header: {
        ...EVENT_GLOW.header,
        title: name,
        date: eventDate.trim() || undefined,
      },
      markers: {
        ...EVENT_GLOW.markers,
        color: bubbleColor,
      },
      branding: {
        ...EVENT_GLOW.branding,
        logoDataUrl: logoDataUrl ?? undefined,
        showLogo: !!logoDataUrl,
      },
    }
    startMeeting(name, template)
  }

  return (
    <div className="w-full h-full flex items-center justify-center"
         style={{ background: 'radial-gradient(ellipse at 20% 50%, #1a4a8a 0%, #0d2a52 60%, #071830 100%)' }}>
      <div className="w-full max-w-md px-6">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">ParticipantsMap</h1>
          <p className="text-slate-400">Set up your event</p>
        </div>

        {/* Event name */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-300 mb-2">Event name</label>
          <input
            type="text"
            placeholder="e.g. Annual Summit"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/70 transition-colors"
          />
        </div>

        {/* Event date */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-300 mb-2">Date <span className="text-slate-500 font-normal">(optional)</span></label>
          <input
            type="text"
            placeholder="e.g. November 21, 2026"
            value={eventDate}
            onChange={e => setEventDate(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/70 transition-colors"
          />
        </div>

        {/* Logo upload */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-300 mb-2">Logo <span className="text-slate-500 font-normal">(optional)</span></label>
          <label className="flex items-center gap-3 w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 cursor-pointer hover:border-slate-500 transition-colors">
            {logoDataUrl
              ? <img src={logoDataUrl} alt="Logo preview" className="h-8 max-w-[120px] object-contain" />
              : <span className="text-slate-400 text-sm">Click to upload</span>
            }
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0]
                if (!file) return
                const dataUrl = await compressImage(file, 400, 200, 0.9)
                setLogoDataUrl(dataUrl)
              }}
            />
            {logoDataUrl && (
              <button
                type="button"
                onClick={e => { e.preventDefault(); setLogoDataUrl(null) }}
                className="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >✕ Remove</button>
            )}
          </label>
        </div>

        {/* Bubble color */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-3">Bubble color</label>
          <div className="flex gap-3">
            {BUBBLE_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => setBubbleColor(c.value)}
                title={c.label}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  bubbleColor === c.value ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ background: c.value }}
              />
            ))}
          </div>
        </div>

        {/* Resume or Start */}
        {activeMeeting ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleResume}
              className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-lg rounded-xl transition-colors shadow-lg shadow-teal-900/30"
            >
              ▶ Resume "{activeMeeting.name}"
            </button>
            <button
              onClick={handleStart}
              className="w-full py-2.5 text-sm text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-500 rounded-xl transition-colors"
            >
              Start new event (ends current)
            </button>
          </div>
        ) : (
          <button
            onClick={handleStart}
            className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-lg rounded-xl transition-colors shadow-lg shadow-teal-900/30"
          >
            Start Event →
          </button>
        )}
      </div>
    </div>
  )
}
