import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useCurrentTemplate } from '@/hooks/useCurrentTemplate'
import { useMeetingStore } from '@/store/useMeetingStore'
import geoData from '@/data/usStates10m.json'

// Map US state names (from topojson) to abbreviations for active-state detection
const STATE_NAME_TO_ABBR: Record<string, string> = {
  Alabama:'AL', Alaska:'AK', Arizona:'AZ', Arkansas:'AR', California:'CA',
  Colorado:'CO', Connecticut:'CT', Delaware:'DE', Florida:'FL', Georgia:'GA',
  Hawaii:'HI', Idaho:'ID', Illinois:'IL', Indiana:'IN', Iowa:'IA', Kansas:'KS',
  Kentucky:'KY', Louisiana:'LA', Maine:'ME', Maryland:'MD', Massachusetts:'MA',
  Michigan:'MI', Minnesota:'MN', Mississippi:'MS', Missouri:'MO', Montana:'MT',
  Nebraska:'NE', Nevada:'NV', 'New Hampshire':'NH', 'New Jersey':'NJ',
  'New Mexico':'NM', 'New York':'NY', 'North Carolina':'NC', 'North Dakota':'ND',
  Ohio:'OH', Oklahoma:'OK', Oregon:'OR', Pennsylvania:'PA', 'Rhode Island':'RI',
  'South Carolina':'SC', 'South Dakota':'SD', Tennessee:'TN', Texas:'TX',
  Utah:'UT', Vermont:'VT', Virginia:'VA', Washington:'WA', 'West Virginia':'WV',
  Wisconsin:'WI', Wyoming:'WY', 'District of Columbia':'DC',
}

interface USMapProps {
  children?: React.ReactNode
}

export function USMap({ children }: USMapProps) {
  const { map } = useCurrentTemplate()
  const participants = useMeetingStore(s => s.activeMeeting?.participants ?? [])
  const activeStates = new Set(participants.map(p => p.state))

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      style={{ width: '100%', height: '100%' }}
      projectionConfig={{ scale: 1000 }}
    >
      <Geographies geography={geoData}>
        {({ geographies }) =>
          geographies.map(geo => {
            const stateAbbr = STATE_NAME_TO_ABBR[geo.properties.name as string]
            const isActive = stateAbbr ? activeStates.has(stateAbbr) : false
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isActive ? map.activeStateColor : map.landColor}
                stroke={map.borderColor}
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', fill: isActive ? map.activeStateColor : map.landColor },
                  pressed: { outline: 'none' },
                }}
              />
            )
          })
        }
      </Geographies>
      {children}
    </ComposableMap>
  )
}
