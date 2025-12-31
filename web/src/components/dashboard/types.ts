export type DashboardTone = "high" | "medium" | "low" | "primary";
export type DashboardSeverity = "high" | "medium" | "low";
export type DashboardIcon = "alert" | "map" | "activity" | "trend";

export type DashboardMetric = {
  id: string;
  label: string;
  value?: string;
  helper?: string;
  icon: DashboardIcon;
  tone: DashboardTone;
  badge?: {
    label: string;
    tone: DashboardSeverity;
  };
};

export type DashboardAlert = {
  id: string;
  title: string;
  date: string;
  severity: DashboardSeverity;
  badge: string;
};

export type DashboardQuickAction = {
  id: string;
  label: string;
  icon: DashboardIcon;
  to?: string;
  appearance: "secondary" | "primary";
};

export type DashboardInfoColumn = {
  title: string;
  items: string[];
};

export type DashboardData = {
  layout: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  metrics: DashboardMetric[];
  alerts: {
    title: string;
    items: DashboardAlert[];
    cta: {
      label: string;
      to: string;
    };
  };
  quickActions: {
    title: string;
    items: DashboardQuickAction[];
  };
  systemOverview: {
    title: string;
    columns: DashboardInfoColumn[];
  };
};

export type DashboardStatus = "loading" | "ready" | "empty";
