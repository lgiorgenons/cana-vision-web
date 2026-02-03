"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_BASE_URL } from "@/lib/api-client";
import { AlertCircle, Bug, Droplet, Wind, CheckCircle, Search, Calendar, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CompareMapResponse = { url: string };
type ProductsResponse = { products: string[] };
type IndicesResponse = { product: string; indices: Record<string, string> };

type JobStatusValue = "pending" | "running" | "succeeded" | "failed";

type JobResponse = {
  job_id: string;
  status: JobStatusValue;
  logs: string[];
  error: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
  return_code: number | null;
  product?: string | null;
};

type JobHistoryItem = {
  job_id: string;
  status: JobStatusValue;
  product?: string | null;
  created_at?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  updated_at?: string | null;
  error?: string | null;
  params?: Record<string, unknown>;
};

type AlertSeverity = "ALTA" | "M�%DIA" | "BAIXA" | "RESOLVIDO";
type AlertStatus = "active" | "resolved";

type AlertItem = {
  id: number;
  type: string;
  icon: LucideIcon;
  talhao: string;
  severity: AlertSeverity;
  severityColor: string;
  date: string;
  status: AlertStatus;
};

const withApiBase = (path: string) => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const alerts: AlertItem[] = [
  { id: 1, type: "Praga", icon: Bug, talhao: "Talhǜo A-03", severity: "ALTA", severityColor: "bg-alert-high", date: "15/07/2024", status: "active" },
  { id: 2, type: "Ferrugem", icon: Wind, talhao: "Talhǜo B-07", severity: "M�%DIA", severityColor: "bg-alert-medium", date: "14/07/2024", status: "active" },
  { id: 3, type: "Estresse H��drico", icon: Droplet, talhao: "C-12", severity: "BAIXA", severityColor: "bg-alert-low", date: "12/07/2024", status: "active" },
  { id: 4, type: "Praga", icon: CheckCircle, talhao: "Talhǜo A-01", severity: "RESOLVIDO", severityColor: "bg-alert-resolved", date: "10/07/2024", status: "resolved" },
];

const JOB_STATUS_LABELS: Record<JobStatusValue, string> = {
  pending: "Na fila",
  running: "Em execu��ǜo",
  succeeded: "Conclu��do",
  failed: "Falhou",
};

const Analises = () => {
  const [mapUrl, setMapUrl] = useState<string>("");
  const [mapError, setMapError] = useState<string>("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [products, setProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");

  const [indices, setIndices] = useState<string[]>([]);
  const [indicesError, setIndicesError] = useState("");
  const [isLoadingIndices, setIsLoadingIndices] = useState(false);

  const [isLoadingMap, setIsLoadingMap] = useState(false);

  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatusValue | null>(null);
  const [jobLogs, setJobLogs] = useState<string[]>([]);
  const [jobError, setJobError] = useState<string>("");
  const [isTriggeringJob, setIsTriggeringJob] = useState(false);
  const [nextProduct, setNextProduct] = useState<string | null>(null);

  const [history, setHistory] = useState<JobHistoryItem[]>([]);
  const [historyError, setHistoryError] = useState<string>("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const hasProducts = products.length > 0;
  const jobStatusLabel = jobStatus ? JOB_STATUS_LABELS[jobStatus] : "Pronto para executar";
  const jobIsActive = jobStatus === "pending" || jobStatus === "running";

  const loadMap = useCallback(async (product: string | null) => {
    setMapError("");
    setMapUrl("");
    if (!hasProducts) {
      return;
    }
    setIsLoadingMap(true);
    const query = product ? `?product=${encodeURIComponent(product)}` : "";
    try {
      const res = await fetch(withApiBase(`/map/compare${query}`));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as CompareMapResponse;
      setMapUrl(data.url);
    } catch {
      setMapError("Nǜo foi poss��vel carregar o mapa de compara��ǜo.");
    } finally {
      setIsLoadingMap(false);
    }
  }, [hasProducts]);

  const loadIndices = useCallback(async (product: string | null) => {
    setIndicesError("");
    setIsLoadingIndices(true);
    const query = product ? `?product=${encodeURIComponent(product)}` : "";
    try {
      const res = await fetch(withApiBase(`/indices${query}`));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as IndicesResponse;
      const names = Object.keys(data.indices || {}).sort();
      setIndices(names);
    } catch {
      setIndices([]);
      setIndicesError("Nǜo foi poss��vel carregar a lista de ��ndices.");
    } finally {
      setIsLoadingIndices(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setProductsError("");
    setIsLoadingProducts(true);
    try {
      const res = await fetch(withApiBase("/products"));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as ProductsResponse;
      const nextProducts = Array.isArray(data.products) ? data.products : [];
      setProducts(nextProducts);
      setSelectedProduct((prev) => {
        if (prev && nextProducts.includes(prev)) {
          return prev;
        }
        return null;
      });
      if (nextProducts.length === 0) {
        setMapUrl("");
        setIndices([]);
        setIndicesError("");
      }
    } catch {
      setProducts([]);
      setSelectedProduct(null);
      setMapUrl("");
      setIndices([]);
      setIndicesError("");
      setProductsError("Nǜo foi poss��vel carregar a lista de produtos.");
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const fetchJobStatus = useCallback(async (id: string) => {
    try {
      const res = await fetch(withApiBase(`/jobs/${id}`));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as JobResponse;
      setJobStatus(data.status);
      setJobLogs(data.logs ?? []);
      setJobError(data.error ?? "");
    } catch {
      setJobError("Nǜo foi poss��vel consultar o status da gera��ǜo.");
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryError("");
    setIsLoadingHistory(true);
    try {
      const res = await fetch(withApiBase("/jobs/history?limit=15"));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { jobs?: JobHistoryItem[] };
      setHistory(data.jobs ?? []);
    } catch {
      setHistory([]);
      setHistoryError("Nǜo foi poss��vel carregar o hist��rico de anǭlises.");
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const triggerJob = useCallback(
    async (product: string | null) => {
      setIsTriggeringJob(true);
      setJobError("");
      setJobStatus(null);
      setJobLogs([]);
      setJobId(null);
      setNextProduct(product);
      try {
        const body: Record<string, string> = {};
        if (product) body.product = product;
        if (startDate) body.start_date = startDate;
        if (endDate) body.end_date = endDate;

        const res = await fetch(withApiBase("/jobs/trigger"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { job_id: string };
        setJobId(data.job_id);
        setJobStatus("pending");
      } catch {
        setJobError("Nǜo foi poss��vel iniciar a gera��ǜo.");
      } finally {
        setIsTriggeringJob(false);
      }
    },
    [endDate, startDate],
  );

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (selectedProduct) {
      void loadIndices(selectedProduct);
      void loadMap(selectedProduct);
    } else {
      setMapUrl("");
      setIndices([]);
    }
  }, [selectedProduct, loadIndices, loadMap]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(() => {
      void fetchJobStatus(jobId);
    }, 2000);
    return () => clearInterval(interval);
  }, [jobId, fetchJobStatus]);

  const filteredAlerts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return alerts;
    return alerts.filter((alert) => alert.talhao.toLowerCase().includes(term) || alert.type.toLowerCase().includes(term));
  }, [search]);

  const jobLogsText = jobLogs.join("\n");

  return (
    <Layout title="Analises" description="Gere mapas comparativos e acompanhe alertas e filas de processamento">
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mapa Comparativo</CardTitle>
                <p className="text-sm text-muted-foreground">Visualize a ��ltima anǭlise comparando produtos.</p>
              </div>
              <Select value={selectedProduct ?? ""} onValueChange={(value) => setSelectedProduct(value || null)} disabled={!hasProducts || isLoadingProducts}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder={isLoadingProducts ? "Carregando..." : "Selecione o produto"} />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-4">
              {productsError && <p className="text-sm text-destructive">{productsError}</p>}
              {indicesError && <p className="text-sm text-destructive">{indicesError}</p>}

              <div className="rounded-xl border bg-muted/40 p-4 min-h-[320px] flex items-center justify-center">
                {mapError ? (
                  <div className="text-center text-sm text-destructive">{mapError}</div>
                ) : isLoadingMap ? (
                  <p className="text-sm text-muted-foreground">Carregando mapa...</p>
                ) : mapUrl ? (
                  <iframe src={mapUrl} title="Mapa comparativo" className="h-[400px] w-full rounded-lg border" />
                ) : (
                  <p className="text-sm text-muted-foreground">Selecione um produto para visualizar o mapa.</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Indices disponiveis: {indices.length}
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Produtos carregados: {products.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Executar An��lise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Produto</label>
                <Select value={selectedProduct ?? ""} onValueChange={(value) => setSelectedProduct(value || null)} disabled={!hasProducts || isLoadingProducts}>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingProducts ? "Carregando..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Início</label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Fim</label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <Button className="w-full" disabled={isTriggeringJob || jobIsActive} onClick={() => void triggerJob(selectedProduct)}>
                {isTriggeringJob ? "Iniciando..." : jobIsActive ? "Processando..." : "Rodar An��lise"}
              </Button>
              <div className="rounded-lg border bg-muted/50 p-3 space-y-1">
                <p className="text-sm font-semibold text-slate-800">{jobStatusLabel}</p>
                {jobError ? <p className="text-xs text-destructive">{jobError}</p> : null}
                {jobLogsText ? <pre className="max-h-40 overflow-auto text-xs text-slate-600">{jobLogsText}</pre> : null}
              </div>
              {nextProduct ? <p className="text-xs text-muted-foreground">Proximo produto: {nextProduct}</p> : null}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Alertas Recentes</CardTitle>
                <p className="text-sm text-muted-foreground">Monitoramento agron��mico em tempo real.</p>
              </div>
              <div className="w-64 relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Filtrar por talhao"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredAlerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <div key={alert.id} className="flex items-center justify-between rounded-xl border bg-muted/40 p-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted ${alert.severityColor}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{alert.type}</p>
                        <p className="text-xs text-muted-foreground">{alert.talhao}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${alert.severityColor} text-white`}>{alert.severity}</Badge>
                      <span className="text-xs text-muted-foreground">{alert.date}</span>
                      {alert.status === "resolved" ? (
                        <Badge variant="outline" className="border-emerald-200 text-emerald-600">
                          Resolvido
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm">
                          Ver detalhes
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hist��rico de Processos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {historyError && <p className="text-sm text-destructive">{historyError}</p>}
              {isLoadingHistory ? (
                <p className="text-sm text-muted-foreground">Carregando hist��rico...</p>
              ) : history.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum processo registrado.</p>
              ) : (
                history.map((job) => (
                  <div key={job.job_id} className="rounded-lg border bg-muted/40 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{job.product ?? "Produto"}</p>
                        <p className="text-xs text-muted-foreground">{job.job_id}</p>
                      </div>
                      <Badge variant="secondary">{JOB_STATUS_LABELS[job.status]}</Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Inicio: {job.started_at ?? "-"}</span>
                      <span>Fim: {job.finished_at ?? "-"}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analises;
