"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Droplets,
  Layers,
  Maximize2,
  Sprout,
  Scan,
  Thermometer,
  Wind,
  X,
  Minus,
  Plus,
  Search,
} from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";
import * as L from "leaflet";
import { listPropriedades, Propriedade } from "@/services/propriedades";
import { listTalhoes, Talhao, GeoJSONFeature } from "@/services/talhoes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((mod) => mod.Polygon), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false });

// --- Mock Data Removed ---
// We will now use 'Talhao' type from services

const currentScene = {
  productId: "S2B_MSIL2A_20240815",
  captureDate: "15/08/2024",
  cloudCover: "8%",
  resolution: "10 m",
  indices: ["NDVI", "EVI", "NDRE", "NDMI", "True Color"],
};
// Mock Type compatibility
type Field = any;

type RiskLevel = "Baixo" | "Medio" | "Alto";

const parseIndex = (value: string) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

const getSmcRisk = (field: Field): RiskLevel => {
  const ndvi = parseIndex(field.ndvi);
  const ndmi = parseIndex(field.ndmi);
  const ndre = parseIndex(field.ndre);
  const ndwi = parseIndex(field.ndwi);

  const high =
    ndwi < 0.2 &&
    ndmi < 0.38 &&
    ndre < 0.46 &&
    ndvi > 0.55;

  const medium =
    (ndmi < 0.44 && ndre < 0.5) ||
    (ndwi < 0.3 && ndvi > 0.5);

  if (high) return "Alto";
  if (medium) return "Medio";
  return "Baixo";
};

const riskBadgeClass = (risk: RiskLevel) => {
  if (risk === "Alto") return "bg-red-100 text-red-700 border-red-200";
  if (risk === "Medio") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
};

const getDiagnostic = (field: Field) => {
  const ndwi = parseFloat(field.ndwi);
  const lst = parseFloat(field.lst.replace("°C", ""));
  const rainfall = parseFloat(field.rainfall.replace("mm", ""));
  const ndvi = parseFloat(field.ndvi);
  const health = field.health;

  // Vascular Blockage (SMC) Pattern: Low NDWI (Water stress) but High NDVI (Green)
  if (ndwi < 0.2 && ndvi > 0.6) {
    return {
      diagnosis: "Bloqueio Vascular (SMC)",
      probability: "Muito Alta",
      action: "Investigar Sphenophorus e realizar corte de salvamento",
      color: "text-red-700 bg-red-100 border-red-300 ring-1 ring-red-400",
    };
  }

  if (ndwi < 0 && lst > 35 && rainfall < 10) {
    return {
      diagnosis: "Estresse Hídrico (Murcha Fisiológica)",
      probability: "Alta",
      action: "Verificar irrigação e previsão climática",
      color: "text-orange-600 bg-orange-50 border-orange-200",
    };
  }

  if (health < 0.8 && rainfall > 30 && lst < 30) {
    return {
      diagnosis: "Possível Murcha Infecciosa",
      probability: "Média",
      action: "Realizar inspeção fitossanitária em campo",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    };
  }


  // Nutritional Deficiency (NDRE) Pattern: Low NDRE (Chlorophyll) but High NDVI (Biomass)
  const ndre = parseFloat(field.ndre);
  if (ndre < 0.5 && ndvi > 0.6) {
    return {
      diagnosis: "Deficiência Nutricional (N) ou Doença Foliar",
      probability: "Média",
      action: "Realizar análise foliar e verificar adubação",
      color: "text-yellow-700 bg-yellow-100 border-yellow-300",
    };
  }

  return {
    diagnosis: "Condições Normais",
    probability: "Baixa",
    action: "Manter monitoramento padrão",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  };
};

const getPolygonColor = (label: Field["healthLabel"]) => {
  if (label === "Good") return "bg-emerald-500/30 hover:bg-emerald-500/40 border-emerald-400/50";
  if (label === "Low") return "bg-amber-500/30 hover:bg-amber-500/40 border-amber-400/50";
  return "bg-red-500/30 hover:bg-red-500/40 border-red-400/50";
};

const layerOptions = ["NDVI", "EVI", "NDRE", "NDMI", "True Color"];

export default function Hotspots() {

  const [viewMode, setViewMode] = useState<"analytic" | "cctv">("analytic");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState(layerOptions[0]);
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);
  const showPanels = !isFullscreen;

  // Real data state
  const [properties, setProperties] = useState<Propriedade[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [selectedTalhaoId, setSelectedTalhaoId] = useState<string | null>(null);

  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  // Load properties on mount
  useEffect(() => {
    async function fetchProperties() {
      try {
        const data = await listPropriedades();
        if (data && data.length > 0) {
          setProperties(data);
          setSelectedPropertyId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load properties", error);
      }
    }
    fetchProperties();
  }, []);

  // Load talhoes when property changes
  useEffect(() => {
    async function fetchTalhoes() {
      if (!selectedPropertyId) return;
      try {
        const data = await listTalhoes(selectedPropertyId);
        setTalhoes(data || []);
        setSelectedTalhaoId(null);
        setDetailPanelOpen(false);
      } catch (error) {
        console.error("Failed to load talhoes", error);
        setTalhoes([]);
      }
    }
    fetchTalhoes();
  }, [selectedPropertyId]);

  // Derived state
  const selectedProperty = useMemo(() => properties.find(p => p.id === selectedPropertyId), [properties, selectedPropertyId]);
  const selectedTalhao = useMemo(() => talhoes.find(t => t.id === selectedTalhaoId), [talhoes, selectedTalhaoId]);

  // Helper to extract polygon positions from GeoJSON
  const getPolygonPositions = (feature: GeoJSONFeature): [number, number][] => {
    const coords = feature?.geometry?.coordinates;
    // Handle nested arrays for Polygon
    // Standard GeoJSON Polygon: [ [ [lon, lat], [lon, lat] ... ] ]
    // Leaflet expects: [ [lat, lon], [lat, lon] ... ]
    if (!coords || coords.length === 0) return [];

    // Assuming single ring polygon for simplicity
    const ring = coords[0];
    return ring.map((point: any) => [point[1], point[0]] as [number, number]);
  };

  // Calculate center of property to fly to
  useEffect(() => {
    if (selectedProperty && mapRef) {
      const positions = getPolygonPositions(selectedProperty.geojson);
      if (positions.length > 0) {
        const bounds = L.latLngBounds(positions);
        mapRef.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedProperty, mapRef]);

  useEffect(() => {
    // Invalidate map size when fullscreen toggles to ensure it fills the container
    if (mapRef) {
      setTimeout(() => {
        mapRef.invalidateSize();
      }, 100);
    }
  }, [isFullscreen, mapRef]);



  const mapShellClasses = isFullscreen
    ? "fixed inset-0 z-50 h-full bg-slate-900/80 backdrop-blur-sm p-2"
    : "min-h-[calc(100vh-100px)] h-[calc(100vh-100px)]";

  return (
    <Layout title="Mapa Interativo - Hotspots" description="Analise a saúde do canavial com índices de satélite e alertas em tempo real.">
      <div className={`flex w-full overflow-hidden p-1 ${mapShellClasses}`}>
        {/* Sidebar */}
        {showPanels && (
          <Card className="flex w-[380px] flex-col overflow-hidden rounded-[15px] border-0 bg-[#F0F0F0] shadow-none mr-4">
            {/* Sidebar Header / Tabs */}
            {/* Sidebar Header */}
            <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Monitoramento</h2>
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                  {talhoes.length} Talhões
                </Badge>
              </div>

              {/* Property Selector */}
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger className="w-full bg-white border-slate-300">
                  <SelectValue placeholder="Selecione a propriedade" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Overall Health */}
                <div>
                  <p className="text-sm font-medium text-slate-500">Saude geral (indices)</p>
                  <div className="mt-1 flex items-end gap-4">
                    <span className="text-6xl font-light text-slate-800">
                      92
                      <span className="text-4xl text-slate-400">%</span>
                    </span>
                    <div className="mb-2">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-3 py-0.5 text-xs font-normal">
                        NDVI alto
                      </Badge>
                      <p className="mt-1 w-40 text-[10px] leading-tight text-slate-400">
                        Dados Sentinel-2 (canasat) com {currentScene.cloudCover} de nuvem.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <Scan className="h-3.5 w-3.5" />
                    Produto {currentScene.productId} • {currentScene.captureDate} • {currentScene.resolution}
                  </div>
                </div>
                {/* Fields List */}
                {/* Fields List */}
                <div className="space-y-3">
                  {talhoes.length === 0 ? (
                    <div className="text-center text-sm text-slate-500 py-4">Nenhum talhão cadastrado.</div>
                  ) : (
                    talhoes.map((talhao) => (
                      <button
                        key={talhao.id}
                        className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all ${talhao.id === selectedTalhaoId
                          ? "border-emerald-500 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                          : "border-transparent bg-white hover:bg-slate-50"
                          }`}
                        onClick={() => {
                          setSelectedTalhaoId(talhao.id);
                          setDetailPanelOpen(true);
                          if (mapRef) {
                            const pos = getPolygonPositions(talhao.geojson);
                            if (pos.length > 0) {
                              const bounds = L.latLngBounds(pos);
                              mapRef.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
                            }
                          }
                        }}
                      >
                        {talhao.id === selectedTalhaoId && (
                          <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
                        )}
                        <div className="flex items-center justify-between">
                          <div className="pl-2">
                            <p className="font-semibold text-slate-900">{talhao.nome || talhao.codigo}</p>
                            <p className="text-xs text-slate-400">{talhao.cultura} • {talhao.variedade || "N/A"}</p>
                            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                              <span>NDVI</span>
                              <span className="text-slate-300">•</span>
                              <span>15/08/2024</span>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <span className={`rounded-full border px-2 py-[2px] text-[10px] font-semibold bg-emerald-100 text-emerald-700 border-emerald-200`}>
                                Risco SMC: Baixo
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex items-center gap-1.5 text-sm font-medium text-emerald-500`}
                            >
                              <Activity className="h-4 w-4" />
                              98%
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="relative flex-1 overflow-hidden rounded-[15px] bg-slate-900">
          {/* Connector Line Removed */}
          <MapContainer
            ref={setMapRef}
            center={[-14.235, -51.925]} // Default Brazil center, will flyTo property
            zoom={4}
            className="h-full w-full"
            style={{ background: "#0f172a" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            {/* 1. Property Boundary (Blue Dashed) */}
            {selectedProperty && (
              <Polygon
                positions={getPolygonPositions(selectedProperty.geojson)}
                pathOptions={{
                  color: "#3b82f6", // Blue
                  dashArray: "10, 10",
                  fillOpacity: 0,
                  weight: 2
                }}
              />
            )}

            {/* 2. Talhoes Polygons (Green/Filled) */}
            {talhoes.map((talhao) => (
              <Polygon
                key={talhao.id}
                positions={getPolygonPositions(talhao.geojson)}
                pathOptions={{
                  color: talhao.id === selectedTalhaoId ? "#ffffff" : "#10b981",
                  fillColor: "#10b981", // Emerald 500
                  fillOpacity: talhao.id === selectedTalhaoId ? 0.3 : 0.5,
                  weight: talhao.id === selectedTalhaoId ? 3 : 1,
                }}
                eventHandlers={{
                  click: (e) => {
                    // Prevent bubbling if needed, though usually fine
                    setSelectedTalhaoId(talhao.id);
                    setDetailPanelOpen(true);
                    L.DomEvent.stopPropagation(e);
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <p className="font-bold text-slate-900">{talhao.nome}</p>
                    <p className="text-xs text-slate-500 mb-2">{talhao.cultura}</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <Sprout className="h-4 w-4" />
                      {talhao.areaHectares} ha
                    </div>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>

          {/* Top Controls Group */}
          <div className="absolute left-6 top-6 z-[5000] flex flex-col gap-3 pointer-events-none">


            {/* Custom Zoom Controls */}
            <div className="flex flex-col gap-1 pointer-events-auto">
              <button
                onClick={() => mapRef?.zoomIn()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/70 text-white hover:bg-slate-900/90 backdrop-blur shadow-lg transition"
                aria-label="Zoom In"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => mapRef?.zoomOut()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/70 text-white hover:bg-slate-900/90 backdrop-blur shadow-lg transition"
                aria-label="Zoom Out"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Bottom Left Controls */}
          <div className="absolute bottom-6 left-6 z-[5000] flex gap-3 pointer-events-none">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/60 text-white backdrop-blur-md ring-1 ring-white/10 transition hover:bg-slate-900/80 pointer-events-auto"
              onClick={() => setIsFullscreen((prev) => !prev)}
              aria-label={isFullscreen ? "Sair do modo tela cheia" : "Ativar modo tela cheia"}
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            <div className="relative pointer-events-auto">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/60 text-white backdrop-blur-md ring-1 ring-white/10 transition hover:bg-slate-900/80"
                onClick={() => setLayerMenuOpen((prev) => !prev)}
                aria-label="Selecionar camada do mapa"
              >
                <Layers className="h-5 w-5" />
              </button>
              {layerMenuOpen && (
                <div className="absolute bottom-14 left-0 w-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_30px_rgba(0,0,0,0.18)]">
                  {layerOptions.map((layer) => (
                    <button
                      key={layer}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${activeLayer === layer ? "bg-slate-900 text-white" : "bg-white text-slate-800 hover:bg-slate-50"
                        }`}
                      onClick={() => {
                        setActiveLayer(layer);
                        setLayerMenuOpen(false);
                      }}
                    >
                      {layer}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel (Floating) */}
          {detailPanelOpen && selectedTalhao && (
            <div className="absolute right-6 top-6 z-[5000] w-[360px] max-h-[calc(100%-48px)] overflow-y-auto rounded-[24px] bg-white/95 shadow-[0_24px_48px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all animate-in fade-in slide-in-from-right-4">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Talhao</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{selectedTalhao.nome || selectedTalhao.codigo}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      {selectedTalhao.cultura} <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                  <button onClick={() => setDetailPanelOpen(false)} className="rounded-full p-1 hover:bg-slate-100">
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Row 1: Saude & Area */}
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                    <div>
                      <p className="text-xs text-slate-400">Saude (NDVI)</p>
                      <div className="flex items-center gap-2 text-emerald-500">
                        <span className="text-lg font-semibold">98%</span>
                        <span className="text-sm font-medium">• Good</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Area</p>
                      <p className="text-base font-medium text-slate-900">{selectedTalhao.areaHectares} ha</p>
                      <p className="text-[10px] text-slate-400">Camada ativa: NDVI</p>
                    </div>
                  </div>

                  {/* Row 2: Risco SMC & Confianca */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-slate-200 p-3 space-y-1">
                      <p className="text-xs text-slate-400">Risco SMC</p>
                      <span className="inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 border-emerald-200">
                        Baixo
                      </span>
                      <p className="text-[11px] text-slate-500">Baseado em NDWI/NDMI e NDRE (Sentinel-2).</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3 space-y-1">
                      <p className="text-xs text-slate-400">Confianca</p>
                      <p className="text-sm font-semibold text-slate-900">Baixa</p>
                      <p className="text-[11px] text-slate-500">Cruza indice + clima</p>
                    </div>
                  </div>

                  {/* Row 3: Ultima Imagem & Indices */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-slate-200 p-3 space-y-1">
                      <p className="text-xs text-slate-400">Ultima imagem</p>
                      <p className="text-sm font-bold text-slate-900">15/08/2024</p>
                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <p>Produto S2B_MSIL2A...</p>
                        <p>Nuvem 8%</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3 space-y-1">
                      <div className="flex justify-between text-xs"><span>NDVI</span><span className="font-semibold text-slate-900">0.78</span></div>
                      <div className="flex justify-between text-xs"><span>NDWI</span><span className="font-semibold text-slate-900">0.38</span></div>
                      <div className="flex justify-between text-xs"><span>NDRE</span><span className="font-semibold text-slate-900">0.58</span></div>
                      <div className="flex justify-between text-xs"><span>EVI</span><span className="font-semibold text-slate-900">0.63</span></div>
                    </div>
                  </div>

                  {/* Row 4: Diagnostic Assistant */}
                  <div className="rounded-xl border p-3 text-emerald-600 bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-4 w-4" />
                      <p className="text-xs font-bold uppercase tracking-wider">Assistente de Diagnóstico</p>
                    </div>
                    <p className="text-sm font-bold">Condições Normais</p>
                    <p className="text-xs mt-1 opacity-80">Ação sugerida: Manter monitoramento padrão</p>
                  </div>

                  {/* Row 5: Weather/Soil Data (Grid of 4) */}
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3 text-orange-500" />
                        <p className="text-slate-500 text-[10px]">LST</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">27°C</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-sky-500" />
                        <p className="text-slate-500 text-[10px]">Chuva</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">50mm</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-emerald-500" />
                        <p className="text-slate-500 text-[10px]">Produt.</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">74 t/ha</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-blue-500" />
                        <p className="text-slate-500 text-[10px]">Umidade</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">76%</p>
                    </div>
                  </div>

                  {/* Row 6: Tendencia & Proxima Colheita */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3 space-y-1">
                      <p className="text-xs text-slate-400">Tendencia</p>
                      <div className="flex items-center gap-1 text-emerald-600">
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="text-sm font-semibold">+1.2% vs ultima captura</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 space-y-1">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Sprout className="h-3 w-3 text-emerald-500" />
                        Proxima colheita
                      </div>
                      <p className="text-sm font-semibold text-slate-900">05/09/2024 <span className="text-slate-500 font-normal">• 21 dias</span></p>
                    </div>
                  </div>

                  {/* Row 7: Alerts */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Alertas agronomicos</p>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                      Nenhum alerta para este talhao.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
