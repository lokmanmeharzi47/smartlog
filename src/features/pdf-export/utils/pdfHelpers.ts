import type { jsPDF } from 'jspdf'

export const PAGE = { w: 210, h: 297, margin: 14 }
export const C = {
  bg: '#020617', card: '#081225', navy: '#0f1e38',
  cyan: '#22d3ee', emerald: '#10b981', orange: '#fb923c', red: '#ef4444',
  white: '#f1f5f9', muted: '#94a3b8', border: '#1e293b',
}

/** Draw page background + optional header bar */
export function drawPageBg(doc: jsPDF, title: string, pageNum: number, total: number) {
  const { w, h, margin } = PAGE
  doc.setFillColor(C.bg)
  doc.rect(0, 0, w, h, 'F')

  // Top accent stripe
  doc.setFillColor(C.navy)
  doc.rect(0, 0, w, 12, 'F')
  doc.setFillColor(C.cyan)
  doc.rect(0, 11.5, w, 0.5, 'F')

  // Header text
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(C.cyan)
  doc.text('SMARTLOG WMS v2.0', margin, 8)
  doc.setTextColor(C.muted)
  doc.text(title, w / 2, 8, { align: 'center' })
  doc.text(`Page ${pageNum}/${total}`, w - margin, 8, { align: 'right' })

  // Footer
  doc.setFillColor(C.navy)
  doc.rect(0, h - 10, w, 10, 'F')
  doc.setFontSize(6)
  doc.setTextColor(C.muted)
  const now = new Date().toLocaleString('fr-FR')
  doc.text(`Généré le ${now} — SmartLog WMS`, margin, h - 4)
  doc.text('CONFIDENTIEL', w - margin, h - 4, { align: 'right' })
}

export function drawCard(doc: jsPDF, x: number, y: number, w: number, h: number) {
  doc.setFillColor(C.card)
  doc.setDrawColor(C.border)
  doc.roundedRect(x, y, w, h, 3, 3, 'FD')
}

export function sectionTitle(doc: jsPDF, text: string, y: number) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(C.cyan)
  doc.text(text, PAGE.margin, y)
  doc.setDrawColor(C.cyan)
  doc.setLineWidth(0.3)
  doc.line(PAGE.margin, y + 1.5, PAGE.w - PAGE.margin, y + 1.5)
}
