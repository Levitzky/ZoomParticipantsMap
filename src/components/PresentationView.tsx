import { forwardRef } from 'react'
import { MapBackground } from './MapBackground'
import { USMap } from './USMap/USMap'
import { LocationMarkers } from './LocationMarkers'
import { PresentationHeader } from './PresentationHeader'
import { StatisticsOverlay } from './StatisticsOverlay'
import { BrandingOverlay } from './BrandingOverlay'

interface PresentationViewProps {
  /** Optional overlay rendered on top of the map (e.g. meeting controls) */
  children?: React.ReactNode
}

export const PresentationView = forwardRef<HTMLDivElement, PresentationViewProps>(
  function PresentationView({ children }, ref) {
    return (
      <div ref={ref} className="relative w-full h-full overflow-hidden">
        <MapBackground />

        {/* Map layer */}
        <div className="absolute inset-0 z-10">
          <USMap>
            <LocationMarkers />
          </USMap>
        </div>

        {/* Overlay elements */}
        <PresentationHeader />
        <StatisticsOverlay />
        <BrandingOverlay />

        {/* Slot for screen-specific UI (meeting controls, etc.) */}
        {children}
      </div>
    )
  }
)
