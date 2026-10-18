import html2canvas from 'html2canvas'

export async function exportMapAsPng(containerRef: React.RefObject<HTMLDivElement | null>): Promise<void> {
  if (!containerRef.current) return
  try {
    const canvas = await html2canvas(containerRef.current, {
      useCORS: true,
      scale: 2,
      logging: false,
      backgroundColor: null,
      ignoreElements: el => el.classList.contains('no-export'),
    })
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `participants-map-${new Date().toISOString().split('T')[0]}.png`
    a.click()
  } catch (err) {
    console.error('PNG export failed:', err)
    alert('Export failed. Please try again.')
  }
}
