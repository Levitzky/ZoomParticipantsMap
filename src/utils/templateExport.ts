import type { Template } from '@/types'

export function exportTemplateJson(template: Template): void {
  const json = JSON.stringify(template, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `template-${template.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importTemplateJson(json: string): Template {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('Invalid JSON file')
  }

  const obj = parsed as Record<string, unknown>
  const required = ['name', 'background', 'header', 'map', 'markers', 'statistics', 'branding']
  for (const key of required) {
    if (!(key in obj)) throw new Error(`Invalid template: missing "${key}"`)
  }

  const template = parsed as Template
  return {
    ...template,
    id: crypto.randomUUID(),
    isBuiltin: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
