import { useMemo } from "react";

import { dashboardData } from "@/pages/dashboard/data";
import type { DashboardData, DashboardStatus } from "@/pages/dashboard/types";

type UseDashboardDataOptions = {
  mode?: DashboardStatus;
};

const isDashboardEmpty = (data: DashboardData) => {
  return (
    data.metrics.length === 0 &&
    data.alerts.items.length === 0 &&
    data.quickActions.items.length === 0 &&
    data.systemOverview.columns.length === 0
  );
};

export const useDashboardData = (options?: UseDashboardDataOptions) => {
  const mode = options?.mode ?? "ready";

  return useMemo(() => {
    const isLoading = mode === "loading";
    const isEmpty = mode === "empty" || (!isLoading && isDashboardEmpty(dashboardData));
    const status: DashboardStatus = isLoading ? "loading" : isEmpty ? "empty" : "ready";

    return {
      data: dashboardData,
      status,
      isLoading,
      isEmpty,
    };
  }, [mode]);
};
