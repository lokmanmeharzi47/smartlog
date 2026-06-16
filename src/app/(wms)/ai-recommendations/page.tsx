'use client'

import React from "react";
import TopBar from "@/components/layout/TopBar";
import RecommendationCards from "@/features/predictive-ai/components/RecommendationCards";
import { usePredictiveAI } from "@/features/predictive-ai/hooks/usePredictiveAI";
import { motion } from "framer-motion";

export default function AIRecommendationsPage() {
  const { predictions, loading } = usePredictiveAI();

  return (
    <div className="min-h-full">
      <TopBar
        title="Recommandations IA"
        subtitle="Centre de décision et actions urgentes générées par l'IA"
        period="Temps réel"
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 md:px-8 py-5 space-y-5 max-w-[1600px] mx-auto"
      >
        <section>
          <RecommendationCards predictions={predictions} loading={loading} />
        </section>
      </motion.div>
    </div>
  );
}
