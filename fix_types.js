const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/mehar/.gemini/antigravity-ide/brain/385eb3ef-6f46-4fc3-b8df-2e37897b3008/.system_generated/steps/122/output.txt', 'utf8'));

const aliases = `

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
`;

fs.writeFileSync('c:/Users/mehar/Desktop/PROJET/smartlog/src/types/database.ts', data.types + aliases);
