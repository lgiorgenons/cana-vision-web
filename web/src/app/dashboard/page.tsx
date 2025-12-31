"use client";

import { Droplets, Leaf, Sprout } from "lucide-react";
import { Layout } from "@/components/Layout";
import AlertsWidget from "@/components/dashboard/AlertsWidget";
import FarmWeatherWidget from "@/components/dashboard/FarmWeatherWidget";
import FieldListWidget from "@/components/dashboard/FieldListWidget";
import HealthScoreCard from "@/components/dashboard/HealthScoreCard";
import MetricCard from "@/components/dashboard/MetricCard";
import SatelliteWidget from "@/components/dashboard/SatelliteWidget";

export default function DashboardPage() {
  return (
    <Layout
      title="Dashboard de Monitoramento"
      description="Visão geral da saúde das suas lavouras com detecção inteligente de hotspots"
    >
      <div className="flex flex-col gap-6">
        {/* Row 1: Map, Fields, and Visual Feed */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Farm & Weather (Top Left) - 2 Cols */}
          <div className="md:col-span-2">
            <FarmWeatherWidget />
          </div>

          {/* Field List (Center) - 1 Col */}
          <div className="md:col-span-1">
            <FieldListWidget />
          </div>

          {/* Visual Feed Stack (Right) - 1 Col */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="flex-1">
              <SatelliteWidget />
            </div>
            <div className="flex-1">
              <AlertsWidget />
            </div>
          </div>
        </div>

        {/* Row 2: Health & Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Health Score - 1 Col */}
          <div className="md:col-span-1">
            <HealthScoreCard />
          </div>

          {/* Metrics Grid - 3 Cols */}
          <MetricCard
            label="NDVI Médio"
            value="0.75"
            subtext="Vigor da biomassa"
            icon={Leaf}
          />
          <MetricCard
            label="NDRE"
            value="0.68"
            subtext="Clorofila"
            icon={Sprout}
          />
          <MetricCard
            label="Umidade Solo"
            value="45%"
            subtext="Abaixo do ideal"
            icon={Droplets}
          />
        </div>
      </div>
    </Layout>
  );
}
