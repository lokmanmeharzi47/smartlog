'use client'

import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts'

interface Props {
  data: {
    stockValueByCategory: { name: string; value: number }[]
    inventoryDistribution: { name: string; value: number }[]
    monthlyMovements: { name: string; in: number; out: number }[]
  }
}

const COLORS = ['#0ea5e9', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6']
const DIST_COLORS = {
  'Critique': '#f87171',
  'Faible': '#fbbf24',
  'OK': '#34d399',
  'Surstock': '#0ea5e9'
}

export default function ReportCharts({ data }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* ── STOCK VALUE BY CATEGORY ────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-slate-900 font-bold text-sm mb-4">Valeur du Stock par Catégorie</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.stockValueByCategory} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#334155', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: '#334155' }}
                formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} DZD`, 'Valeur']}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]}>
                {data.stockValueByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── INVENTORY DISTRIBUTION ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-slate-900 font-bold text-sm mb-4">Répartition de l'Inventaire (État)</h2>
        <div className="flex items-center h-[300px]">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.inventoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.inventoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DIST_COLORS[entry.name as keyof typeof DIST_COLORS] || COLORS[0]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#334155', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: '#334155' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-4 pl-4">
            {data.inventoryDistribution.map(d => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DIST_COLORS[d.name as keyof typeof DIST_COLORS] }} />
                <div>
                  <p className="text-slate-700 text-sm font-bold">{d.name}</p>
                  <p className="text-slate-500 text-xs">{d.value} articles</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MONTHLY MOVEMENTS ──────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2">
        <h2 className="text-slate-900 font-bold text-sm mb-4">Mouvements Mensuels (Entrées vs Sorties)</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyMovements} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#334155', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: '#334155' }}
              />
              <Line type="monotone" dataKey="in" name="Entrées" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="out" name="Sorties" stroke="#f87171" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
