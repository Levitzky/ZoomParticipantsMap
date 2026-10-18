import type { Participant } from '@/types'

export function exportParticipantsCsv(participants: Participant[], meetingName: string): void {
  const rows = [
    ['Name', 'Location', 'State', 'Lat', 'Lng', 'Added At'],
    ...participants.map(p => [
      p.name,
      p.location,
      p.state,
      String(p.lat),
      String(p.lng),
      new Date(p.addedAt).toLocaleString(),
    ]),
  ]
  const csv = rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const safeName = meetingName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  a.download = `${safeName}-participants-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
