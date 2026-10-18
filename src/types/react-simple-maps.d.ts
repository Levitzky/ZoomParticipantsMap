declare module 'react-simple-maps' {
  import type { ReactNode, CSSProperties } from 'react'

  interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    style?: CSSProperties
    width?: number
    height?: number
    children?: ReactNode
  }

  interface GeographiesProps {
    geography: unknown
    children: (props: { geographies: Geography[] }) => ReactNode
  }

  interface Geography {
    rsmKey: string
    properties: Record<string, unknown>
    type: string
    geometry: unknown
  }

  interface GeographyProps {
    geography: Geography
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: {
      default?: CSSProperties
      hover?: CSSProperties
      pressed?: CSSProperties
    }
    [key: string]: unknown
  }

  interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
    [key: string]: unknown
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element
  export function Geographies(props: GeographiesProps): JSX.Element
  export function Geography(props: GeographyProps): JSX.Element
  export function Marker(props: MarkerProps): JSX.Element
  export function ZoomableGroup(props: Record<string, unknown>): JSX.Element
}
