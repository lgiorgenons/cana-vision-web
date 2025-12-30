import { Layout } from "@/components/Layout";
import { useDashboardData } from "@/hooks/use-dashboard-data";

import DashboardAlertsCard from "./dashboard/DashboardAlertsCard";
import DashboardEmptyState from "./dashboard/DashboardEmptyState";
import DashboardHeroSection from "./dashboard/DashboardHeroSection";
import DashboardMetricsGrid from "./dashboard/DashboardMetricsGrid";
import DashboardQuickActionsCard from "./dashboard/DashboardQuickActionsCard";
import DashboardSkeleton from "./dashboard/DashboardSkeleton";
import DashboardSystemInfoCard from "./dashboard/DashboardSystemInfoCard";

const Dashboard = () => {
  const { data, isLoading, isEmpty } = useDashboardData();

  return (
    <Layout title={data.layout.title} description={data.layout.description}>
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
};

export default Dashboard;
