export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      errors_by_type: {
        Row: {
          color: string
          created_at: string | null
          id: string
          label: string
          value: number
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: string
          label: string
          value: number
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          label?: string
          value?: number
        }
        Relationships: []
      }
      movements: {
        Row: {
          created_at: string | null
          id: string
          note: string | null
          product_id: string
          quantity: number
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          note?: string | null
          product_id: string
          quantity: number
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string | null
          product_id?: string
          quantity?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          order_number: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_number: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_number?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_prices: {
        Row: {
          item_storage_cost: number | null
          product_id: string
          stock_max: number | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          item_storage_cost?: number | null
          product_id: string
          stock_max?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          item_storage_cost?: number | null
          product_id?: string
          stock_max?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string
          category: string | null
          created_at: string | null
          holding_cost_pct: number | null
          id: string
          item_storage_cost: number | null
          lead_time_days: number | null
          max_stock: number | null
          min_stock: number
          name: string
          order_cost: number | null
          stock: number
          unit_price: number | null
          zone: string | null
        }
        Insert: {
          barcode: string
          category?: string | null
          created_at?: string | null
          holding_cost_pct?: number | null
          id?: string
          item_storage_cost?: number | null
          lead_time_days?: number | null
          max_stock?: number | null
          min_stock?: number
          name: string
          order_cost?: number | null
          stock?: number
          unit_price?: number | null
          zone?: string | null
        }
        Update: {
          barcode?: string
          category?: string | null
          created_at?: string | null
          holding_cost_pct?: number | null
          id?: string
          item_storage_cost?: number | null
          lead_time_days?: number | null
          max_stock?: number | null
          min_stock?: number
          name?: string
          order_cost?: number | null
          stock?: number
          unit_price?: number | null
          zone?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recent_reports: {
        Row: {
          created_at: string | null
          generated_at: string | null
          id: string
          period: string
          size: string | null
          status: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          generated_at?: string | null
          id?: string
          period: string
          size?: string | null
          status: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          generated_at?: string | null
          id?: string
          period?: string
          size?: string | null
          status?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      report_kpis: {
        Row: {
          accent: string | null
          created_at: string | null
          id: string
          label: string
          sub_label: string | null
          trend: number | null
          trend_label: string | null
          unit: string | null
          value: string
        }
        Insert: {
          accent?: string | null
          created_at?: string | null
          id?: string
          label: string
          sub_label?: string | null
          trend?: number | null
          trend_label?: string | null
          unit?: string | null
          value: string
        }
        Update: {
          accent?: string | null
          created_at?: string | null
          id?: string
          label?: string
          sub_label?: string | null
          trend?: number | null
          trend_label?: string | null
          unit?: string | null
          value?: string
        }
        Relationships: []
      }
      strategic_recommendations: {
        Row: {
          action: string
          created_at: string | null
          description: string
          id: string
          impact: string
          title: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description: string
          id?: string
          impact: string
          title: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string
          id?: string
          impact?: string
          title?: string
        }
        Relationships: []
      }
      warehouse_config: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          value: number
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          value: number
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ----- Custom Aliases & Dashboard Types -----

export type Product = Database['public']['Tables']['products']['Row']
export type Movement = Database['public']['Tables']['movements']['Row']

export interface MovementWithProduct extends Movement {
  products: Pick<Product, 'name' | 'barcode' | 'category'>
}

export interface DashboardStats {
  totalStock: number
  totalProducts: number
  criticalItems: number
  lowItems: number
  okItems: number
  coverageRate: number
  totalValue: number
  todayMovements: number
}
