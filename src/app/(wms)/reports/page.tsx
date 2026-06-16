'use client'

import React, { useEffect, useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { fetchReportDashboard, type ReportDashboardData } from "@/features/reports/services/reports.service";
import ReportCharts from "@/features/reports/components/ReportCharts";
import { Activity, Box, RefreshCw, Wallet, LayoutGrid, Package, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const [data, setData] = useState<ReportDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportDashboard()
      .then(setData)
      .catch((err) => {
        console.error(err);
        toast.error("Erreur lors du chargement des rapports");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-slate-400 font-mono animate-pulse">Chargement des données...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-full">
      <TopBar
        title="Rapports & Direction"
        subtitle="Analyses financières et état de santé du stock global"
        period="Mois en cours"
      />

      <div className="px-4 md:px-8 py-5 space-y-5 max-w-[1600px] mx-auto fade-in">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 bg-secondary rounded-full" />
          <h2 className="text-slate-400 font-semibold uppercase tracking-[0.15em] text-[11px]">Résumé Exécutif</h2>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-xs font-medium">Valeur Totale du Stock</p>
              <div className="p-1.5 rounded-lg bg-secondary/10">
                <Wallet className="w-4 h-4 text-secondary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-primary font-mono">{data.totalStockValue.toLocaleString('fr-FR')} DZD</p>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-xs font-medium">Taux de Couverture</p>
              <div className="p-1.5 rounded-lg bg-emerald-50">
                <Box className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-primary font-mono">{data.coverageRate} %</p>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${data.coverageRate}%` }} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-xs font-medium">Taux de Rotation</p>
              <div className="p-1.5 rounded-lg bg-purple-50">
                <RefreshCw className="w-4 h-4 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-primary font-mono">{data.rotationRate}</p>
            <p className="mt-1 text-slate-400 text-[10px] font-medium">Sur les 30 derniers jours</p>
          </div>

          <div className={`bg-white border rounded-2xl shadow-sm p-4 ${data.stockHealthScore > 80 ? 'border-emerald-200' : data.stockHealthScore > 50 ? 'border-orange-200' : 'border-red-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-xs font-medium">Santé du Stock</p>
              <div className={`p-1.5 rounded-lg ${data.stockHealthScore > 80 ? 'bg-emerald-50' : data.stockHealthScore > 50 ? 'bg-orange-50' : 'bg-red-50'}`}>
                <Activity className={`w-4 h-4 ${data.stockHealthScore > 80 ? 'text-emerald-500' : data.stockHealthScore > 50 ? 'text-orange-500' : 'text-red-500'}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold font-mono ${data.stockHealthScore > 80 ? 'text-emerald-500' : data.stockHealthScore > 50 ? 'text-orange-500' : 'text-red-500'}`}>
              {data.stockHealthScore} / 100
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 text-xs font-semibold">Volume Total (unités)</span>
            </div>
            <span className="text-primary font-bold font-mono">{data.totalStock.toLocaleString('fr-FR')}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className="text-slate-500 text-xs font-semibold">Articles en Rupture</span>
            </div>
            <span className="text-red-500 font-bold font-mono">{data.criticalProducts}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4 text-secondary" />
              <span className="text-slate-500 text-xs font-semibold">Mouvements (Auj.)</span>
            </div>
            <span className="text-secondary font-bold font-mono">{data.todayMovements}</span>
          </div>
        </div>

        <section>
          <ReportCharts data={data} />
        </section>
      </div>
    </div>
  );
}
