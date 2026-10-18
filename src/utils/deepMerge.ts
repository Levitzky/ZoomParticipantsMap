import type { Template, TemplatePatch } from '@/types'

/**
 * Merges a TemplatePatch into a Template, doing a shallow merge on each
 * top-level section (background, header, map, etc.).
 */
export function mergeTemplate(base: Template, patch: TemplatePatch): Template {
  return {
    ...base,
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    background: patch.background ? { ...base.background, ...patch.background } : base.background,
    header: patch.header ? { ...base.header, ...patch.header } : base.header,
    map: patch.map ? { ...base.map, ...patch.map } : base.map,
    markers: patch.markers ? { ...base.markers, ...patch.markers } : base.markers,
    statistics: patch.statistics ? { ...base.statistics, ...patch.statistics } : base.statistics,
    branding: patch.branding ? { ...base.branding, ...patch.branding } : base.branding,
    updatedAt: Date.now(),
  }
}
