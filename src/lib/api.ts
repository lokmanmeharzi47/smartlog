import { supabase } from './supabaseClient'
import type { Product, Movement, MovementWithProduct, DashboardStats } from '@/types/database'

// ── PRODUCTS ───────────────────────────────────────────────────────────────

/** Fetch all products ordered by barcode (code) */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('barcode')
  if (error) throw error
  return data ?? []
}

/** Find a product by barcode */
export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('barcode', barcode)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

/** Update a product's stock level */
export async function updateStock(productId: string, newStock: number): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)
  if (error) throw error
}

/** Create a new product */
export async function createProduct(
  product: Omit<Product, 'id' | 'created_at'>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Delete a product */
export async function deleteProduct(id: string): Promise<void> {
  // Check for existing movements
  const { count, error: countError } = await supabase
    .from('movements')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', id)
  
  if (countError) throw countError
  
  if (count && count > 0) {
    throw new Error('Impossible de supprimer : ce produit possède un historique de mouvements. Veuillez le désactiver à la place.')
  }

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// ── MOVEMENTS ─────────────────────────────────────────────────────────────

/** Create a movement and update product stock atomically */
export async function createMovement(
  productId: string,
  type: 'IN' | 'OUT',
  quantity: number,
  note?: string
): Promise<void> {
  // 1. Get current stock
  const { data: product, error: fetchErr } = await supabase
    .from('products')
    .select('stock')
    .eq('id', productId)
    .single()
  if (fetchErr) throw fetchErr

  // 2. Calculate new stock
  const currentStock = product.stock
  const delta = type === 'IN' ? quantity : -quantity
  const newStock = currentStock + delta

  if (newStock < 0) {
    throw new Error(`Stock insuffisant. Stock actuel: ${currentStock}, demande: ${quantity}`)
  }

  // 3. Insert movement
  const { error: movErr } = await supabase
    .from('movements')
    .insert({ product_id: productId, type, quantity, note: note ?? null })
  if (movErr) throw movErr

  // 4. Update stock
  await updateStock(productId, newStock)
}

/** Fetch recent movements (with product name) */
export async function getRecentMovements(limit = 20): Promise<MovementWithProduct[]> {
  const { data, error } = await supabase
    .from('movements')
    .select('*, products(name, barcode, category)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as MovementWithProduct[]) ?? []
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────

/** Compute aggregate dashboard statistics */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [{ data: products }, { data: movements }] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_prices(unit_price)'),
    supabase
      .from('movements')
      .select('*')
      .gte('created_at', new Date().toISOString().split('T')[0] + 'T00:00:00Z'),
  ])

  const prods = (products || []) as any[]
  const moves = movements ?? []

  const totalStock = prods.reduce((s, p) => s + p.stock, 0)
  const totalProducts = prods.length
  const criticalItems = prods.filter((p) => p.stock <= p.min_stock).length
  const lowItems = prods.filter((p) => p.stock > p.min_stock && p.stock <= p.min_stock * 1.5).length
  const okItems = prods.filter((p) => p.stock > p.min_stock * 1.5).length
  const coverageRate = totalProducts > 0 ? Math.round((okItems / totalProducts) * 100) : 0
  
  // Rule A: Use price from product_prices if exists, else product.unit_price, else 500
  const totalValue = prods.reduce((s, p) => {
    const price = p.product_prices?.unit_price ?? (p.unit_price > 0 ? p.unit_price : 500)
    return s + p.stock * price
  }, 0)
  
  const todayMovements = moves.length

  return { totalStock, totalProducts, criticalItems, lowItems, okItems, coverageRate, totalValue, todayMovements }
}

// ── REPORTS ───────────────────────────────────────────────────────────────

export async function getReportKPIs() {
  const { data, error } = await supabase.from('report_kpis').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function getErrorsByType() {
  const { data, error } = await supabase.from('errors_by_type').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function getStrategicRecommendations() {
  const { data, error } = await supabase.from('strategic_recommendations').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function getRecentReports() {
  const { data, error } = await supabase.from('recent_reports').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}
