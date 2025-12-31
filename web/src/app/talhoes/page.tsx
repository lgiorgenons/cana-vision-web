"use client";

import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Calendar } from "lucide-react";

const selectedFields = [
  {
    id: "A-05",
    name: "Talhǜo A-05",
    status: "Saudǭvel",
    statusColor: "bg-primary",
    description: "Vigor saudǭvel e desenvolvimento dentro do esperado para o per��odo.",
    chartPlaceholder: "--",
  },
  {
    id: "C-12",
    name: "Talhǜo C-12",
    status: "Aten��ǜo",
    statusColor: "bg-alert-medium",
    description: "Sinais de in��cio de estresse h��drico detectados na bordadura leste.",
    chartPlaceholder: "--",
  },
];

const Talhoes = () => {
  return (
    <Layout
      title="Talhoes"
      description="Selecione 2 ou mais talhoes para visualizar uma analise lado a lado."
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Comparativo de Talh��es
          </h1>
          <p className="text-muted-foreground text-lg">
            Selecione 2 ou mais talh��es para visualizar uma anǭlise lado a lado.
          </p>
        </div>

        <Card className="bg-card-dark border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="flex-1 w-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Talh��es Selecionados
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary text-primary-foreground text-sm px-4 py-2 flex items-center gap-2">
                    Talhǜo A-05
                    <X className="h-3 w-3 cursor-pointer hover:text-primary-foreground/80" />
                  </Badge>
                  <Badge className="bg-primary text-primary-foreground text-sm px-4 py-2 flex items-center gap-2">
                    Talhǜo C-12
                    <X className="h-3 w-3 cursor-pointer hover:text-primary-foreground/80" />
                  </Badge>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-3 w-3" />
                    Adicionar Talhǜo
                  </Button>
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Per��odo
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm">�sltimos 30 dias</Button>
                  <Button variant="secondary" size="sm">�sltimos 90 dias</Button>
                  <Button variant="secondary" size="sm">Safra 23/24</Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Calendar className="h-3 w-3" />
                    Personalizado
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="bg-primary hover:bg-primary/90" size="lg">
                Comparar Anǭlise
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {selectedFields.map((field) => (
            <Card key={field.id} className="bg-card-dark border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{field.name}</h3>
                    <Badge className={`${field.statusColor} text-white mt-2`}>
                      {field.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {field.description}
                </p>

                <div className="bg-background/50 rounded-lg p-4 h-40 flex items-center justify-center border border-border">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{field.chartPlaceholder}</div>
                    <p className="text-xs text-muted-foreground">
                      Grǭfico de evolu��ǜo temporal
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg h-48 flex items-center justify-center border border-border">
                  <div className="text-center space-y-2">
                    <div className="text-4xl">--</div>
                    <p className="text-xs text-muted-foreground">
                      Imagem de satǸlite recente
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-card-dark border-border border-dashed">
            <CardContent className="pt-6 h-full flex flex-col items-center justify-center min-h-[400px] cursor-pointer hover:bg-card-dark-hover transition-colors">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Adicionar outro talhǜo
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Continue a compara��ǜo adicionando mais ǭreas.
                  </p>
                </div>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Talhǜo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Talhoes;
