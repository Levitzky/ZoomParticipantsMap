import { useRef, useState } from 'react'
import { PresentationView } from '@/components/PresentationView'
import { ParticipantEntry } from '@/components/ParticipantEntry'
import { ParticipantList } from '@/components/ParticipantList'
import { useMeetingStore } from '@/store/useMeetingStore'
import { exportMapAsPng } from '@/utils/exportPng'
import { exportParticipantsCsv } from '@/utils/exportCsv'

export function PresentationScreen() {
  const meeting = useMeetingStore(s => s.activeMeeting)
  const endMeeting = useMeetingStore(s => s.endMeeting)
  const mapRef = useRef<HTMLDivElement>(null)
  const [panelMinimized, setPanelMinimized] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)

  if (!meeting) return null

  return (
    <div className="relative w-full h-full">
      <PresentationView ref={mapRef} />

      {/* Floating participant panel — excluded from PNG export */}
      <div className="no-export absolute bottom-5 left-5 z-50 w-80 rounded-xl bg-slate-900/90 backdrop-blur-sm shadow-2xl border border-slate-700/50">
        {/* Panel header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-700/50">
          <span className="text-sm font-medium text-slate-300">
            Participants ({meeting.participants.length})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPanelMinimized(v => !v)}
              aria-label={panelMinimized ? 'Expand panel' : 'Minimize panel'}
              className="text-slate-500 hover:text-slate-300 transition-colors text-lg leading-none w-5 text-center"
            >
              {panelMinimized ? '+' : '−'}
            </button>
            <button
              onClick={() => setShowEndDialog(true)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors border border-red-800/50 hover:border-red-600/50 rounded px-2 py-0.5"
            >
              End
            </button>
          </div>
        </div>

        {!panelMinimized && (
          <>
            <ParticipantEntry />
            <ParticipantList />
          </>
        )}
      </div>

      {/* End meeting dialog */}
      {showEndDialog && (
        <div className="no-export absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 w-80">
            <h2 className="text-white text-lg font-semibold mb-1">End meeting?</h2>
            <p className="text-slate-400 text-sm mb-5">
              Save your map and participant list before leaving.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={() => exportMapAsPng(mapRef)}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Download map as PNG
              </button>
              <button
                onClick={() => exportParticipantsCsv(meeting.participants, meeting.name)}
                className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Download participants as CSV
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEndDialog(false)}
                className="flex-1 py-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={endMeeting}
                className="flex-1 py-2 text-sm text-red-400 hover:text-red-300 border border-red-800 rounded-lg transition-colors"
              >
                End &amp; Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
