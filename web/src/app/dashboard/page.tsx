"use client";

import { Layout } from "@/components/Layout";
import { useDashboardData } from "@/hooks/use-dashboard-data";

import DashboardAlertsCard from "@/components/dashboard/DashboardAlertsCard";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import DashboardHeroSection from "@/components/dashboard/DashboardHeroSection";
import DashboardMetricsGrid from "@/components/dashboard/DashboardMetricsGrid";
import DashboardQuickActionsCard from "@/components/dashboard/DashboardQuickActionsCard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import DashboardSystemInfoCard from "@/components/dashboard/DashboardSystemInfoCard";

export default function Dashboard() {
  const { data, isLoading, isEmpty } = useDashboardData();

  return (
    <Layout title={data?.layout?.title} description={data?.layout?.description}>
      {isLoading ? (
        <DashboardSkeleton />
      ) : isEmpty ? (
        <DashboardEmptyState />
      ) : (
        <div className="space-y-8">
          <DashboardHeroSection title={data.hero.title} subtitle={data.hero.subtitle} />
          <DashboardMetricsGrid metrics={data.metrics} />
          <div className="grid gap-6 md:grid-cols-2">
            <DashboardAlertsCard title={data.alerts.title} items={data.alerts.items} cta={data.alerts.cta} />
            <DashboardQuickActionsCard title={data.quickActions.title} actions={data.quickActions.items} />
          </div>
          <DashboardSystemInfoCard title={data.systemOverview.title} columns={data.systemOverview.columns} />
        </div>
      )}
    </Layout>
  );
}
