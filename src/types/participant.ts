export interface Participant {
  id: string
  name: string
  location: string  // canonical resolved name (e.g. "Boston, MA")
  lat: number
  lng: number
  state: string     // 2-letter abbreviation
  addedAt: number
}
