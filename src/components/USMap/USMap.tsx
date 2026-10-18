import type { ReactNode } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useCurrentTemplate } from '@/hooks/useCurrentTemplate'
import geoData from '@/data/usStates10m.json'

interface USMapProps {
  children?: ReactNode
}

export function USMap({ children }: USMapProps) {
  const { map } = useCurrentTemplate()

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ComposableMap
        projection="geoAlbersUsa"
        style={{ width: '100%', height: '100%', transform: 'translate(4%, 8%)' }}
        projectionConfig={{ scale: 1000 }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={map.landColor}
                fillOpacity={map.landOpacity ?? 1}
                stroke={map.borderColor}
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none', cursor: 'default' },
                  hover: { outline: 'none', fill: map.landColor, fillOpacity: map.landOpacity ?? 1 },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        {children}
      </ComposableMap>
    </div>
  )
}
