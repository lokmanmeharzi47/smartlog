import type { Product } from '@/types/database'
import type { Prediction } from '@/features/predictive-ai/types'
import { getStockStatus } from '@/features/inventory/utils/stock'
import { PAGE, C, drawPageBg, drawCard, sectionTitle } from '../utils/pdfHelpers'

// Lazy-load jsPDF to keep bundle small
async function getJsPDF() {
  const { default: jsPDF } = await import('jspdf')
  return jsPDF
}

export interface ReportData {
  products: Product[]
  predictions: Prediction[]
  stats: {
    totalStock: number
    totalProducts: number
    criticalItems: number
    okItems: number
    coverageRate: number
    totalValue: number
    todayMovements: number
  }
  generatedBy?: string
}

// ─── PAGE 1: COVER ─────────────────────────────────────────────────────────
function drawCover(doc: InstanceType<Awaited<ReturnType<typeof getJsPDF>>>, data: ReportData) {
  const { w, h } = PAGE
  doc.setFillColor(C.bg)
  doc.rect(0, 0, w, h, 'F')

  // Gradient-like diagonal block
  doc.setFillColor(C.navy)
  doc.rect(0, 0, w, 80, 'F')
  doc.setFillColor(C.card)
  doc.rect(0, 80, w, 40, 'F')

  // Cyan accent
  doc.setFillColor(C.cyan)
  doc.rect(0, 78, w, 2, 'F')
  doc.rect(0, 119, w, 1, 'F')

  // Main title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(32)
  doc.setTextColor(C.white)
  doc.text('SmartLog WMS', w / 2, 38, { align: 'center' })

  doc.setFontSize(13)
  doc.setTextColor(C.cyan)
  doc.text('v2.0', w / 2, 48, { align: 'center' })

  doc.setFontSize(11)
  doc.setTextColor(C.muted)
  doc.text('Rapport Intelligent Logistique', w / 2, 62, { align: 'center' })

  // Info block
  doc.setFontSize(9)
  doc.setTextColor(C.white)
  const now = new Date()
  const infoLines = [
    ['Date', now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
    ['Heure', now.toLocaleTimeString('fr-FR')],
    ['Utilisateur', data.generatedBy ?? 'Admin WMS'],
    ['Entrepôt', 'SmartLog — Entrepôt Principal'],
  ]
  let y = 92
  infoLines.forEach(([key, val]) => {
    doc.setTextColor(C.muted)
    doc.setFont('helvetica', 'normal')
    doc.text(key + ' :', 50, y)
    doc.setTextColor(C.white)
    doc.setFont('helvetica', 'bold')
    doc.text(val, 90, y)
    y += 8
  })

  // Stats summary
  y += 10
  const statItems = [
    { label: 'Total produits', value: String(data.stats.totalProducts), color: C.cyan },
    { label: 'Articles critiques', value: String(data.stats.criticalItems), color: C.red },
    { label: 'Taux couverture', value: `${data.stats.coverageRate}%`, color: C.emerald },
  ]
  statItems.forEach((s, i) => {
    const x = 14 + i * 62
    drawCard(doc, x, y, 58, 28)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(s.color)
    doc.text(s.value, x + 29, y + 14, { align: 'center' })
    doc.setFontSize(7)
    doc.setTextColor(C.muted)
    doc.text(s.label, x + 29, y + 22, { align: 'center' })
  })

  // Footer branding
  doc.setFillColor(C.navy)
  doc.rect(0, h - 20, w, 20, 'F')
  doc.setFillColor(C.cyan)
  doc.rect(0, h - 21, w, 1, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(C.cyan)
  doc.text('SMARTLOG WMS', w / 2, h - 12, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(C.muted)
  doc.text('Document confidentiel — Usage interne uniquement', w / 2, h - 6, { align: 'center' })
}

// ─── PAGE 2: KPIs ──────────────────────────────────────────────────────────
function drawKPIPage(doc: InstanceType<Awaited<ReturnType<typeof getJsPDF>>>, data: ReportData) {
  doc.addPage()
  drawPageBg(doc, 'KPI Dashboard', 2, 5)

  let y = 22
  sectionTitle(doc, 'Indicateurs Clés de Performance', y)
  y += 10

  const kpis = [
    { label: 'Total articles', value: String(data.stats.totalStock), sub: `${data.stats.totalProducts} références`, color: C.cyan },
    { label: 'Articles critiques', value: String(data.stats.criticalItems), sub: 'Stock < seuil min', color: C.red },
    { label: 'Articles OK', value: String(data.stats.okItems), sub: 'Au-dessus du seuil', color: C.emerald },
    { label: 'Taux couverture', value: `${data.stats.coverageRate}%`, sub: 'Stock vs seuils', color: C.orange },
    { label: 'Valeur stock', value: `${(data.stats.totalValue / 1000).toFixed(0)}k DZD`, sub: 'Prix × stock', color: C.cyan },
    { label: 'Mvts aujourd\'hui', value: String(data.stats.todayMovements), sub: 'Entrées + Sorties', color: C.muted },
  ]

  const cols = 3
  const cardW = (PAGE.w - PAGE.margin * 2 - 8) / cols
  kpis.forEach((kpi, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = PAGE.margin + col * (cardW + 4)
    const cy = y + row * 36
    drawCard(doc, x, cy, cardW, 30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(kpi.color)
    doc.text(kpi.value, x + cardW / 2, cy + 14, { align: 'center' })
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(C.white)
    doc.text(kpi.label, x + cardW / 2, cy + 21, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(C.muted)
    doc.text(kpi.sub, x + cardW / 2, cy + 26, { align: 'center' })
  })
}

// ─── PAGE 3: INVENTORY ─────────────────────────────────────────────────────
function drawInventoryPage(doc: InstanceType<Awaited<ReturnType<typeof getJsPDF>>>, products: Product[]) {
  doc.addPage()
  drawPageBg(doc, 'Inventaire Complet', 3, 5)

  let y = 22
  sectionTitle(doc, 'Inventaire Complet', y)
  y += 10

  const cols = [
    { label: 'Code', x: 14, w: 30 },
    { label: 'Désignation', x: 46, w: 52 },
    { label: 'Catégorie', x: 100, w: 30 },
    { label: 'Quantité', x: 132, w: 20 },
    { label: 'Seuil min', x: 154, w: 20 },
    { label: 'Statut', x: 176, w: 20 },
  ]

  // Header row
  doc.setFillColor(C.navy)
  doc.rect(14, y, PAGE.w - 28, 7, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(C.cyan)
  cols.forEach(c => doc.text(c.label.toUpperCase(), c.x + 1, y + 5))
  y += 8

  const statusLabel = { OK: 'OK', LOW: 'FAIBLE', CRITICAL: 'CRITIQUE' }
  const statusColor = { OK: C.emerald, LOW: C.orange, CRITICAL: C.red }

  products.slice(0, 40).forEach((p, i) => {
    if (y > PAGE.h - 18) return // skip overflow
    if (i % 2 === 0) {
      doc.setFillColor(C.card)
      doc.rect(14, y - 1, PAGE.w - 28, 6.5, 'F')
    }
    const st = getStockStatus(p.stock, p.min_stock)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6)
    doc.setTextColor(C.cyan)
    doc.text(p.barcode.substring(0, 12), cols[0].x + 1, y + 4)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(C.white)
    doc.text(p.name.substring(0, 28), cols[1].x + 1, y + 4)
    doc.setTextColor(C.muted)
    doc.text((p.category ?? '—').substring(0, 14), cols[2].x + 1, y + 4)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(statusColor[st])
    doc.text(String(p.stock), cols[3].x + 1, y + 4)
    doc.setTextColor(C.muted)
    doc.setFont('helvetica', 'normal')
    doc.text(String(p.min_stock), cols[4].x + 1, y + 4)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(statusColor[st])
    doc.text(statusLabel[st], cols[5].x + 1, y + 4)
    y += 6.5
  })
}

// ─── PAGE 4: ALERTS ────────────────────────────────────────────────────────
function drawAlertsPage(doc: InstanceType<Awaited<ReturnType<typeof getJsPDF>>>, products: Product[]) {
  doc.addPage()
  drawPageBg(doc, 'Alertes Stock', 4, 5)

  let y = 22
  sectionTitle(doc, 'Alertes & Articles Critiques', y)
  y += 10

  const critical = products.filter(p => getStockStatus(p.stock, p.min_stock) === 'CRITICAL')
  const low = products.filter(p => getStockStatus(p.stock, p.min_stock) === 'LOW')

  const drawAlertSection = (title: string, items: Product[], color: string) => {
    if (items.length === 0) return
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(color)
    doc.text(`${title} (${items.length})`, PAGE.margin, y)
    y += 5
    items.slice(0, 12).forEach(p => {
      drawCard(doc, PAGE.margin, y, PAGE.w - PAGE.margin * 2, 8)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.setTextColor(color)
      doc.text(p.barcode, PAGE.margin + 2, y + 5.5)
      doc.setTextColor(C.white)
      doc.text(p.name.substring(0, 30), PAGE.margin + 25, y + 5.5)
      doc.setTextColor(C.muted)
      doc.text(`Stock: ${p.stock} / Min: ${p.min_stock}`, PAGE.w - PAGE.margin - 2, y + 5.5, { align: 'right' })
      y += 9.5
    })
    y += 4
  }

  drawAlertSection('⚠ CRITIQUE — Commander maintenant', critical, C.red)
  drawAlertSection('⚡ FAIBLE — Planifier réapprovisionnement', low, C.orange)

  if (critical.length === 0 && low.length === 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(C.emerald)
    doc.text('✓ Aucune alerte — Tous les stocks sont OK', PAGE.w / 2, y + 20, { align: 'center' })
  }
}

// ─── PAGE 5: AI PREDICTIONS ────────────────────────────────────────────────
function drawPredictionsPage(doc: InstanceType<Awaited<ReturnType<typeof getJsPDF>>>, predictions: Prediction[]) {
  doc.addPage()
  drawPageBg(doc, 'Prédictions IA & Advanced Analytics', 5, 5)

  let y = 22
  sectionTitle(doc, 'Analytique Avancée (WMA, EOQ, Z-Score)', y)
  y += 8

  // Formula box
  drawCard(doc, PAGE.margin, y, PAGE.w - PAGE.margin * 2, 22)
  doc.setFont('courier', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(C.cyan)
  doc.text('WMA = Σ(wᵢ × xᵢ) / Σwᵢ | Z-Score (Anomalie) | EOQ (Formule de Wilson)', PAGE.w / 2, y + 8, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(C.muted)
  doc.text('Classe ABC (Pareto) — Stock Sécurité dynamique', PAGE.w / 2, y + 14, { align: 'center' })
  doc.text('jours_restants = floor(stock_actuel / WMA_journalier)', PAGE.w / 2, y + 19, { align: 'center' })
  y += 28

  // Table headers
  const tCols = [
    { label: 'Article', x: 14, w: 34 },
    { label: 'Classe', x: 50, w: 12 },
    { label: 'Stock', x: 64, w: 16 },
    { label: 'Prévu 7j', x: 82, w: 18 },
    { label: 'Jours rest.', x: 102, w: 20 },
    { label: 'EOQ', x: 124, w: 16 },
    { label: 'Z-Score', x: 142, w: 18 },
    { label: 'Confiance', x: 162, w: 20 },
  ]

  doc.setFillColor(C.navy)
  doc.rect(14, y, PAGE.w - 28, 7, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6)
  doc.setTextColor(C.cyan)
  tCols.forEach(c => doc.text(c.label.toUpperCase(), c.x + 1, y + 5))
  y += 8

  const statusColor = { URGENT: C.red, THIS_WEEK: C.orange, OK: C.emerald }
  const sorted = [...predictions].sort((a, b) => a.daysRemaining - b.daysRemaining)

  sorted.slice(0, 25).forEach((p, i) => {
    if (y > PAGE.h - 18) return
    if (i % 2 === 0) {
      doc.setFillColor(C.card)
      doc.rect(14, y - 1, PAGE.w - 28, 6.5, 'F')
    }
    const sc = statusColor[p.status]
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(C.white)
    doc.text(p.productName.substring(0, 18), tCols[0].x + 1, y + 4)
    
    // ABC Class
    doc.setTextColor(p.abcClass === 'A' ? C.emerald : p.abcClass === 'B' ? C.orange : C.muted)
    doc.text(p.abcClass, tCols[1].x + 1, y + 4)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(sc)
    doc.text(String(p.stock), tCols[2].x + 1, y + 4)
    
    doc.setTextColor(C.muted)
    doc.setFont('helvetica', 'normal')
    doc.text(String(p.forecast7d), tCols[3].x + 1, y + 4)
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(sc)
    doc.text(p.daysRemaining >= 999 ? '∞' : `${p.daysRemaining}j`, tCols[4].x + 1, y + 4)
    
    // EOQ
    doc.setTextColor(C.cyan)
    doc.text(String(p.eoq || '-'), tCols[5].x + 1, y + 4)

    // Z-Score
    doc.setTextColor(p.anomalyLevel === 'CRITICAL' ? C.red : p.anomalyLevel === 'MODERATE' ? C.orange : C.emerald)
    doc.text(String(p.zScore || '-'), tCols[6].x + 1, y + 4)

    // Confidence
    doc.setTextColor(C.cyan)
    doc.text(`${p.confidence}%`, tCols[7].x + 1, y + 4)
    
    y += 6.5
  })
}

// ─── MAIN EXPORT FUNCTION ──────────────────────────────────────────────────
export async function generatePDFReport(data: ReportData): Promise<void> {
  const JsPDF = await getJsPDF()
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  drawCover(doc, data)
  drawKPIPage(doc, data)
  drawInventoryPage(doc, data.products)
  drawAlertsPage(doc, data.products)
  drawPredictionsPage(doc, data.predictions)

  const filename = `smartlog-rapport-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
