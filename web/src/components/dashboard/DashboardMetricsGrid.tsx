import type { LucideIcon } from "lucide-react";
import { Activity, AlertCircle, MapPin, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { DashboardIcon, DashboardMetric, DashboardSeverity, DashboardTone } from "./types";

const metricIcons: Record<DashboardIcon, LucideIcon> = {
  alert: AlertCircle,
  map: MapPin,
  activity: Activity,
  trend: TrendingUp,
};

const toneClasses: Record<DashboardTone, string> = {
  high: "text-alert-high",
  medium: "text-alert-medium",
  low: "text-alert-low",
  primary: "text-primary",
};

const badgeToneClasses: Record<DashboardSeverity, string> = {
  high: "bg-alert-high",
  medium: "bg-alert-medium",
  low: "bg-alert-low",
};

type DashboardMetricsGridProps = {
  metrics: DashboardMetric[];
};

type DashboardMetricCardProps = {
  metric: DashboardMetric;
};

const DashboardMetricCard = ({ metric }: DashboardMetricCardProps) => {
  const Icon = metricIcons[metric.icon];
  const helperSpacing = metric.badge ? "mt-2" : "mt-1";

  return (
    <Card className="bg-card-dark border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
        <Icon className={cn("h-4 w-4", toneClasses[metric.tone])} />
      </CardHeader>
      <CardContent>
        {metric.badge ? (
          <div className="flex items-center gap-2">
            <Badge className={cn("text-white text-lg px-3 py-1", badgeToneClasses[metric.badge.tone])}>{metric.badge.label}</Badge>
          </div>
        ) : (
          <div className="text-3xl font-bold">{metric.value}</div>
        )}
        {metric.helper ? <p className={cn(helperSpacing, "text-xs text-muted-foreground")}>{metric.helper}</p> : null}
      </CardContent>
    </Card>
  );
};

const DashboardMetricsGrid = ({ metrics }: DashboardMetricsGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <DashboardMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};

export default DashboardMetricsGrid;
