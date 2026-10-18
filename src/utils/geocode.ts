import Fuse from 'fuse.js'
import cities from '@/data/usCities.json'
import { STATE_BY_ABBR, STATE_BY_NAME } from '@/data/usStates'

interface CityRecord {
  city: string
  state_id: string
  lat: number
  lng: number
}

export interface ResolvedLocation {
  lat: number
  lng: number
  state: string
  canonicalName: string
}

const cityList = cities as CityRecord[]

// Build Fuse index once at module load
const fuse = new Fuse(cityList, {
  keys: ['city'],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
})

/**
 * Resolves a free-text location input to lat/lng + state.
 * Resolution priority:
 *  1. "City, ST" exact match (case-insensitive)
 *  2. 2-char state abbreviation → centroid
 *  3. Full state name → centroid
 *  4. "City, StateName" exact match
 *  5. "City ST" (no comma) pattern
 *  6. Fuzzy city name match
 */
export function resolveLocation(input: string): ResolvedLocation | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // 1. "City, ST" — split on last comma
  const commaIdx = trimmed.lastIndexOf(',')
  if (commaIdx > 0) {
    const cityPart = trimmed.slice(0, commaIdx).trim()
    const statePart = trimmed.slice(commaIdx + 1).trim().toUpperCase()

    // Try state abbreviation (2-char)
    if (statePart.length === 2 && STATE_BY_ABBR[statePart]) {
      const match = cityList.find(
        c => c.city.toLowerCase() === cityPart.toLowerCase() && c.state_id === statePart
      )
      if (match) {
        return { lat: match.lat, lng: match.lng, state: match.state_id, canonicalName: `${match.city}, ${match.state_id}` }
      }
      // City not found in dataset but state is valid — try fuzzy in that state
      const fuzzyInState = fuseSearchInState(cityPart, statePart)
      if (fuzzyInState) return fuzzyInState
    }

    // Try full state name after comma
    const stateByName = STATE_BY_NAME[statePart.toLowerCase()]
    if (stateByName) {
      const match = cityList.find(
        c => c.city.toLowerCase() === cityPart.toLowerCase() && c.state_id === stateByName.abbr
      )
      if (match) {
        return { lat: match.lat, lng: match.lng, state: match.state_id, canonicalName: `${match.city}, ${match.state_id}` }
      }
      const fuzzyInState = fuseSearchInState(cityPart, stateByName.abbr)
      if (fuzzyInState) return fuzzyInState
    }
  }

  // 2. State abbreviation only (2 chars)
  const upper = trimmed.toUpperCase()
  if (/^[A-Z]{2}$/.test(upper) && STATE_BY_ABBR[upper]) {
    const s = STATE_BY_ABBR[upper]
    return { lat: s.lat, lng: s.lng, state: s.abbr, canonicalName: s.name }
  }

  // 3. Full state name
  const stateByName = STATE_BY_NAME[trimmed.toLowerCase()]
  if (stateByName) {
    return { lat: stateByName.lat, lng: stateByName.lng, state: stateByName.abbr, canonicalName: stateByName.name }
  }

  // 5. "City ST" pattern (no comma, last word is 2-char state abbr)
  const parts = trimmed.split(/\s+/)
  if (parts.length >= 2) {
    const lastWord = parts[parts.length - 1].toUpperCase()
    if (/^[A-Z]{2}$/.test(lastWord) && STATE_BY_ABBR[lastWord]) {
      const cityPart = parts.slice(0, -1).join(' ')
      const match = cityList.find(
        c => c.city.toLowerCase() === cityPart.toLowerCase() && c.state_id === lastWord
      )
      if (match) {
        return { lat: match.lat, lng: match.lng, state: match.state_id, canonicalName: `${match.city}, ${match.state_id}` }
      }
    }
  }

  // 6. Fuzzy city name match (full input or city part)
  const cityQuery = commaIdx > 0 ? trimmed.slice(0, commaIdx).trim() : trimmed
  const results = fuse.search(cityQuery)
  if (results.length > 0 && (results[0].score ?? 1) < 0.35) {
    const match = results[0].item
    return { lat: match.lat, lng: match.lng, state: match.state_id, canonicalName: `${match.city}, ${match.state_id}` }
  }

  return null
}

function fuseSearchInState(cityQuery: string, stateAbbr: string): ResolvedLocation | null {
  const stateResults = fuse.search(cityQuery)
  const inState = stateResults.find(r => r.item.state_id === stateAbbr)
  if (inState && (inState.score ?? 1) < 0.4) {
    const m = inState.item
    return { lat: m.lat, lng: m.lng, state: m.state_id, canonicalName: `${m.city}, ${m.state_id}` }
  }
  return null
}
