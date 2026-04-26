export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      movements: {
        Row: Movement
        Insert: Omit<Movement, 'id' | 'created_at'>
        Update: Partial<Omit<Movement, 'id' | 'created_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export interface Product {
  id: string
  name: string
  barcode: string
  stock: number
  min_stock: number
  max_stock: number | null
  category: string | null
  unit_price: number | null
  created_at: string
}

export interface Movement {
  id: string
  product_id: string
  type: 'IN' | 'OUT'
  quantity: number
  note: string | null
  created_at: string
}

export interface MovementWithProduct extends Movement {
  products: Pick<Product, 'name' | 'barcode' | 'category'>
}

export interface DashboardStats {
  totalStock: number
  totalProducts: number
  criticalItems: number
  okItems: number
  coverageRate: number
  totalValue: number
  todayMovements: number
}
