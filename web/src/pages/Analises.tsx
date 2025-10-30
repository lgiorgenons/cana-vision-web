import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bug, Droplet, Wind, CheckCircle, Search, Calendar } from "lucide-react";

type CompareMapResponse = { url: string };

const alerts = [
  { id: 1, type: "Praga", icon: Bug, talhao: "Talhão A-03", severity: "ALTA", severityColor: "bg-alert-high", date: "15/07/2024", status: "active" },
  { id: 2, type: "Ferrugem", icon: Wind, talhao: "Talhão B-07", severity: "MÉDIA", severityColor: "bg-alert-medium", date: "14/07/2024", status: "active" },
  { id: 3, type: "Estresse Hídrico", icon: Droplet, talhao: "C-12", severity: "BAIXA", severityColor: "bg-alert-low", date: "12/07/2024", status: "active" },
  { id: 4, type: "Praga", icon: CheckCircle, talhao: "Talhão A-01", severity: "RESOLVIDO", severityColor: "bg-alert-resolved", date: "10/07/2024", status: "resolved" },
];

const Analises = () => {
  const [mapUrl, setMapUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = async () => {
    setError("");
    try {
      const res = await fetch("/api/map/compare");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as CompareMapResponse;
      setMapUrl(data.url);
    } catch (e: any) {
      setError("Não foi possível carregar o mapa de comparação.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const applyFilters = () => {
    // Placeholder: numa próxima etapa, passaremos search/data para a API
    load();
  };

  const totalAtivos = alerts.filter((a) => a.status === "active").length;
  const areaAfetadaHa = 15; // TODO: substituir por valor vindo da API
  const riscoMedioLabel = "Alto"; // TODO: calcular a partir de dados reais

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Análises</h1>
            <p className="text-muted-foreground">Mapa interativo com alternância de índices</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={load}>
              Recarregar
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card-dark border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Alertas Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalAtivos}</div>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Área Afetada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{areaAfetadaHa} ha</div>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nível de Risco Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-alert-high text-white text-2xl px-4 py-2 font-bold">{riscoMedioLabel}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Filtros: busca e data */}
        <Card className="bg-card-dark border-border">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por talhão, ID ou palavra-chave"
                  className="pl-10 bg-background border-border"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Início</div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-10 bg-background border-border" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Fim</div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-10 bg-background border-border" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex gap-2 justify-end">
                <Button variant="secondary" onClick={applyFilters}>Aplicar filtros</Button>
                <Button variant="ghost" onClick={() => { setSearch(""); setStartDate(""); setEndDate(""); load(); }}>Limpar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Mapa (2 colunas) */}
          <div className="lg:col-span-2">
            <Card className="bg-card-dark border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mapa com alternância de índices</CardTitle>
              </CardHeader>
              <CardContent>
                {error && <div className="text-sm text-red-500 mb-3">{error}</div>}
                {mapUrl ? (
                  <iframe
                    title="compare-indices"
                    src={mapUrl}
                    className="w-full h-[75vh] rounded-md border border-border bg-background"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">Carregando…</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Alertas (coluna direita) */}
          <div>
            <Card className="bg-card-dark border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-alert-high" />
                  Alertas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((a) => {
                  const Icon = a.icon as any;
                  return (
                    <div
                      key={a.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        a.status === "active"
                          ? "border-l-alert-high bg-background/50"
                          : "border-l-alert-resolved bg-background/30"
                      } hover:bg-card-dark-hover transition-colors`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-alert-high" />
                          <div>
                            <p className="font-semibold">{a.type} - {a.talhao}</p>
                            <p className="text-xs text-muted-foreground">Detectado em: {a.date}</p>
                          </div>
                        </div>
                        <Badge className={`${a.severityColor} text-white text-xs`}>{a.severity}</Badge>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full mt-2 bg-primary/20 text-primary hover:bg-primary/30">
                        Ver detalhes
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analises;
