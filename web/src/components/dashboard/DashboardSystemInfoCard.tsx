import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DashboardInfoColumn } from "./types";

type DashboardSystemInfoCardProps = {
  title: string;
  columns: DashboardInfoColumn[];
};

const DashboardSystemInfoCard = ({ title, columns }: DashboardSystemInfoCardProps) => {
  return (
    <Card className="bg-card-dark border-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-2 font-semibold">{column.title}</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSystemInfoCard;
