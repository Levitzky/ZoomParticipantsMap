import { useState, useRef } from 'react'
import { useMeetingStore } from '@/store/useMeetingStore'

export function ParticipantEntry() {
  const addParticipant = useMeetingStore(s => s.addParticipant)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const locationRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!location.trim()) return
    setLoading(true)
    setError(null)
    try {
      await addParticipant(location, name || undefined)
      setName('')
      setLocation('')
      locationRef.current?.focus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Location not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-b border-slate-700/50">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-slate-800/80 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/70 transition-colors"
        />
        <div className="flex gap-2">
          <input
            ref={locationRef}
            type="text"
            placeholder="City, State or State"
            value={location}
            onChange={e => { setLocation(e.target.value); setError(null) }}
            className="flex-1 bg-slate-800/80 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/70 transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading || !location.trim()}
            className="px-3 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? '…' : 'Add'}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    </form>
  )
}
