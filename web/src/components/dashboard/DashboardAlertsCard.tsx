import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { DashboardAlert, DashboardSeverity } from "./types";

const severityClasses: Record<DashboardSeverity, string> = {
  high: "bg-alert-high",
  medium: "bg-alert-medium",
  low: "bg-alert-low",
};

type DashboardAlertsCardProps = {
  title: string;
  items: DashboardAlert[];
  cta: {
    label: string;
    to: string;
  };
};

const DashboardAlertsCard = ({ title, items, cta }: DashboardAlertsCardProps) => {
  return (
    <Card className="bg-card-dark border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-alert-high" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3 transition-colors hover:bg-card-dark-hover"
            >
              <div>
                <p className="font-medium">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.date}</p>
              </div>
              <Badge className={cn("text-white", severityClasses[alert.severity])}>{alert.badge}</Badge>
            </div>
          ))}
        </div>
        <Button className="w-full" variant="outline" asChild>
          <Link href={cta.to}>
            {cta.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardAlertsCard;
