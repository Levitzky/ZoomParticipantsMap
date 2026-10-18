export interface Participant {
  id: string
  name: string
  location: string  // raw input from host
  lat: number
  lng: number
  state: string     // 2-letter abbreviation
  addedAt: number
}
