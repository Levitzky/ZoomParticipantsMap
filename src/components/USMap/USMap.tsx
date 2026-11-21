import type { ReactNode } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useCurrentTemplate } from '@/hooks/useCurrentTemplate'
import geoData from '@/data/usStates10m.json'

interface USMapProps {
  children?: ReactNode
}

export function USMap({ children }: USMapProps) {
  const { map } = useCurrentTemplate()
  const hasTerrain = Boolean(map.terrainImageUrl)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ComposableMap
        projection="geoAlbersUsa"
        style={{ width: '100%', height: '100%', transform: 'translate(4%, 8%)' }}
        projectionConfig={{ scale: 1000 }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) => (
            <>
              {hasTerrain && (
                <defs>
                  <clipPath id="us-terrain-clip">
                    {geographies.map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                      />
                    ))}
                  </clipPath>
                </defs>
              )}

              {hasTerrain && (
                <image
                  href={map.terrainImageUrl}
                  x="-10%" y="-10%"
                  width="120%" height="120%"
                  clipPath="url(#us-terrain-clip)"
                  preserveAspectRatio="xMidYMid slice"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={hasTerrain ? 'transparent' : map.landColor}
                  fillOpacity={hasTerrain ? 0 : (map.landOpacity ?? 1)}
                  stroke={map.borderColor}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none', cursor: 'default' },
                    hover: { outline: 'none', fill: hasTerrain ? 'transparent' : map.landColor, fillOpacity: hasTerrain ? 0 : (map.landOpacity ?? 1) },
                    pressed: { outline: 'none' },
                  }}
                />
              ))}
            </>
          )}
        </Geographies>
        {children}
      </ComposableMap>
    </div>
  )
}
