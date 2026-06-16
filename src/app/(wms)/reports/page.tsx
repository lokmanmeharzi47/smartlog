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
      <div className="min-h-full flex items-center justify-center" style={{ background: '#020617' }}>
        <div className="text-slate-400 font-mono animate-pulse">Chargement des données...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-full" style={{ background: '#020617' }}>
      <TopBar
        title="Rapports & Direction"
        subtitle="Analyses financières et état de santé du stock global"
        period="Mois en cours"
      />

      <div className="px-8 py-6 space-y-6 max-w-[1600px] mx-auto fade-in">
        {/* EXECUTIVE SUMMARY KPIs */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
            <h2 className="text-white font-bold text-lg">Résumé Exécutif</h2>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Total Stock Value */}
            <div className="bg-[#081225] border border-cyan-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">Valeur Totale du Stock</p>
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Wallet className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <p className="text-3xl font-black text-white font-mono">{data.totalStockValue.toLocaleString('fr-FR')} €</p>
              <div className="mt-2 flex items-center text-emerald-400 text-xs font-semibold">
                <span>Investissement immobilisé</span>
              </div>
            </div>

            {/* Coverage Rate */}
            <div className="bg-[#081225] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">Taux de Couverture</p>
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Box className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-black text-white font-mono">{data.coverageRate} %</p>
              <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${data.coverageRate}%` }} />
              </div>
            </div>

            {/* Rotation Rate */}
            <div className="bg-[#081225] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">Taux de Rotation</p>
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <RefreshCw className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-black text-white font-mono">{data.rotationRate}</p>
              <p className="mt-2 text-slate-500 text-xs font-medium">Sur les 30 derniers jours</p>
            </div>

            {/* Health Score */}
            <div className={`bg-[#081225] border rounded-2xl p-5 ${data.stockHealthScore > 80 ? 'border-emerald-500/20' : data.stockHealthScore > 50 ? 'border-orange-500/20' : 'border-red-500/20'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">Santé du Stock</p>
                <div className={`p-2 rounded-lg ${data.stockHealthScore > 80 ? 'bg-emerald-500/10' : data.stockHealthScore > 50 ? 'bg-orange-500/10' : 'bg-red-500/10'}`}>
                  <Activity className={`w-5 h-5 ${data.stockHealthScore > 80 ? 'text-emerald-400' : data.stockHealthScore > 50 ? 'text-orange-400' : 'text-red-400'}`} />
                </div>
              </div>
              <p className={`text-3xl font-black font-mono ${data.stockHealthScore > 80 ? 'text-emerald-400' : data.stockHealthScore > 50 ? 'text-orange-400' : 'text-red-400'}`}>{data.stockHealthScore} / 100</p>
              <p className="mt-2 text-slate-500 text-xs font-medium">Indice global algorithmique</p>
            </div>
          </div>
        </section>

        {/* OPERATIONS SUMMARY */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-slate-400" />
              <span className="text-slate-300 font-semibold">Volume Total (unités)</span>
            </div>
            <span className="text-white font-black font-mono">{data.totalStock.toLocaleString('fr-FR')}</span>
          </div>
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span className="text-slate-300 font-semibold">Articles en Rupture</span>
            </div>
            <span className="text-red-400 font-black font-mono">{data.criticalProducts}</span>
          </div>
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-300 font-semibold">Mouvements (Auj.)</span>
            </div>
            <span className="text-cyan-400 font-black font-mono">{data.todayMovements}</span>
          </div>
        </section>

        {/* CHARTS */}
        <section>
          <ReportCharts data={data} />
        </section>
      </div>
    </div>
  );
}
