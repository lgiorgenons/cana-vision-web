import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Activity, MapPin, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DashboardIcon, DashboardQuickAction } from "./types";

const actionIcons: Record<DashboardIcon, LucideIcon> = {
  alert: TrendingUp,
  map: MapPin,
  activity: Activity,
  trend: TrendingUp,
};

type DashboardQuickActionsCardProps = {
  title: string;
  actions: DashboardQuickAction[];
};

const DashboardQuickActionsCard = ({ title, actions }: DashboardQuickActionsCardProps) => {
  return (
    <Card className="bg-card-dark border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = actionIcons[action.icon];
          const variant = action.appearance === "primary" ? "default" : "secondary";

          if (action.to) {
            return (
              <Button key={action.id} className="w-full justify-start" variant={variant} size="lg" asChild>
                <Link href={action.to}>
                  <Icon className="mr-2 h-5 w-5" />
                  {action.label}
                </Link>
              </Button>
            );
          }

          return (
            <Button key={action.id} className="w-full justify-start" variant={variant} size="lg">
              <Icon className="mr-2 h-5 w-5" />
              {action.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActionsCard;
