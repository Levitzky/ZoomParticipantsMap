/**
 * Builds src/data/usCities.json from cached geonames US.zip
 * Fields: city, state_id, lat, lng
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const AdmZip = require('adm-zip')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ZIP = path.join(__dirname, '../src/data/US.zip')
const OUTPUT = path.join(__dirname, '../src/data/usCities.json')

const VALID_STATES = new Set([
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL',
  'IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE',
  'NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD',
  'TN','TX','UT','VT','VA','WA','WV','WI','WY'
])

console.log('Extracting US.txt from ZIP...')
const zip = new AdmZip(ZIP)
const entry = zip.getEntry('US.txt')
if (!entry) throw new Error('US.txt not found in zip')
const text = entry.getData().toString('utf8')

console.log('Parsing populated places...')
const lines = text.split('\n')
const cities = []

for (const line of lines) {
  if (!line.trim()) continue
  const cols = line.split('\t')
  if (cols.length < 15) continue
  if (cols[6] !== 'P') continue  // only populated places (feature class P)
  if (cols[8] !== 'US') continue

  const pop = parseInt(cols[14], 10)
  if (isNaN(pop) || pop < 1000) continue

  const state_id = cols[10]  // admin1 is already the state abbreviation in geonames
  if (!VALID_STATES.has(state_id)) continue

  const lat = parseFloat(cols[4])
  const lng = parseFloat(cols[5])
  const city = cols[2] || cols[1]  // prefer ASCII name

  if (!city || isNaN(lat) || isNaN(lng)) continue

  cities.push({ city, state_id, lat, lng })
}

cities.sort((a, b) => a.city.localeCompare(b.city))

console.log(`Writing ${cities.length} cities to usCities.json...`)
fs.writeFileSync(OUTPUT, JSON.stringify(cities))
const sizeMb = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2)
console.log(`Done! File size: ${sizeMb} MB`)
