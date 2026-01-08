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

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((mod) => mod.Polygon), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false });

type Field = {
  id: string;
  name: string;
  crop: string;
  health: number;
  healthLabel: "Good" | "Low" | "Alert";
  layer: string;
  area: string;
  lastImage: string;
  trend: string;
  ndvi: string;
  ndre: string;
  ndmi: string;
  evi: string;
  soilMoisture: string;
  productivity: string;
  alerts: string[];
  coordinates: [number, number][]; // Array of [lat, lng] for Leaflet Polygon
  center: [number, number]; // Center point for camera flyTo
  nextHarvest: string;
  daysToHarvest: number;
  cloudCover: string;
  productId: string;
  lst: string;
  rainfall: string;
  ndwi: string;
  pestRisk: "High" | "Medium" | "Low";
};

const currentScene = {
  productId: "S2B_MSIL2A_20240815",
  captureDate: "15/08/2024",
  cloudCover: "8%",
  resolution: "10 m",
  indices: ["NDVI", "EVI", "NDRE", "NDMI", "True Color"],
};

const fields: Field[] = [
  {
    id: "talhao-1",
    name: "Talhao 1",
    crop: "Cana-de-acucar (RB867515)",
    health: 0.95,
    healthLabel: "Good",
    layer: "NDVI",
    area: "18 ha",
    lastImage: "15/08/2024",
    trend: "+3% vs ultima captura",
    ndvi: "0.81",
    ndre: "0.62",
    ndmi: "0.49",
    evi: "0.68",
    soilMoisture: "71%",
    productivity: "78 t/ha",
    alerts: ["Vigor consistente"],
    coordinates: [[-21.248384, -48.490782], [-21.248384, -48.485975], [-21.252608, -48.485975], [-21.252608, -48.490782]],
    center: [-21.250496, -48.488378],
    nextHarvest: "29/09/2024",
    daysToHarvest: 45,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "28°C",
    rainfall: "45mm",
    ndwi: "0.35",
    pestRisk: "Low",
  },
  {
    id: "talhao-2",
    name: "Talhao 2",
    crop: "Cana-de-acucar (CTC4)",
    health: 0.74,
    healthLabel: "Low",
    layer: "NDRE",
    area: "11 ha",
    lastImage: "15/08/2024",
    trend: "-2% vs ultima captura",
    ndvi: "0.64",
    ndre: "0.41",
    ndmi: "0.34",
    evi: "0.55",
    soilMoisture: "63%",
    productivity: "65 t/ha",
    alerts: ["Queda leve de vigor", "Verificar bordadura leste"],
    coordinates: [[-21.248384, -48.485500], [-21.248384, -48.481000], [-21.252000, -48.481000], [-21.252000, -48.485500]],
    center: [-21.250192, -48.483250],
    nextHarvest: "15/10/2024",
    daysToHarvest: 61,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "29°C",
    rainfall: "42mm",
    ndwi: "0.15",
    pestRisk: "High",
  },
  {
    id: "talhao-3",
    name: "Talhao 3",
    crop: "Cana-de-acucar (RB966928)",
    health: 0.98,
    healthLabel: "Good",
    layer: "NDMI",
    area: "15 ha",
    lastImage: "15/08/2024",
    trend: "+1.2% vs ultima captura",
    ndvi: "0.78",
    ndre: "0.58",
    ndmi: "0.52",
    evi: "0.63",
    soilMoisture: "76%",
    productivity: "74 t/ha",
    alerts: [],
    coordinates: [[-21.253000, -48.490782], [-21.253000, -48.486000], [-21.256000, -48.486000], [-21.256000, -48.490782]],
    center: [-21.254500, -48.488391],
    nextHarvest: "05/09/2024",
    daysToHarvest: 21,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "27°C",
    rainfall: "50mm",
    ndwi: "0.38",
    pestRisk: "Low",
  },
  {
    id: "talhao-4",
    name: "Talhao 4",
    crop: "Cana-de-acucar (CTC9001)",
    health: 0.87,
    healthLabel: "Good",
    layer: "EVI",
    area: "9 ha",
    lastImage: "15/08/2024",
    trend: "-0.5% vs ultima captura",
    ndvi: "0.72",
    ndre: "0.51",
    ndmi: "0.45",
    evi: "0.58",
    soilMoisture: "68%",
    productivity: "70 t/ha",
    alerts: [],
    coordinates: [[-21.252500, -48.485500], [-21.252500, -48.482000], [-21.255500, -48.482000], [-21.255500, -48.485500]],
    center: [-21.254000, -48.483750],
    nextHarvest: "20/11/2024",
    daysToHarvest: 96,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "29°C",
    rainfall: "40mm",
    ndwi: "0.32",
    pestRisk: "Low",
  },
  {
    id: "talhao-5",
    name: "Talhao 5",
    crop: "Cana-de-acucar",
    health: 0.95,
    healthLabel: "Good",
    layer: "NDVI",
    area: "22 ha",
    lastImage: "15/08/2024",
    trend: "Estavel",
    ndvi: "0.79",
    ndre: "0.60",
    ndmi: "0.50",
    evi: "0.66",
    soilMoisture: "74%",
    productivity: "76 t/ha",
    alerts: [],
    coordinates: [[-21.256500, -48.490782], [-21.256500, -48.485000], [-21.260000, -48.485000], [-21.260000, -48.490782]],
    center: [-21.258250, -48.487891],
    nextHarvest: "10/10/2024",
    daysToHarvest: 56,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "28°C",
    rainfall: "48mm",
    ndwi: "0.36",
    pestRisk: "Low",
  },
  {
    id: "talhao-6",
    name: "Talhao 6",
    crop: "Cana-de-acucar",
    health: 0.89,
    healthLabel: "Good",
    layer: "NDVI",
    area: "14 ha",
    lastImage: "15/08/2024",
    trend: "+1%",
    ndvi: "0.75",
    ndre: "0.45",
    ndmi: "0.48",
    evi: "0.60",
    soilMoisture: "70%",
    productivity: "72 t/ha",
    alerts: [],
    coordinates: [[-21.256000, -48.484500], [-21.256000, -48.481000], [-21.259000, -48.481000], [-21.259000, -48.484500]],
    center: [-21.257500, -48.482750],
    nextHarvest: "12/09/2024",
    daysToHarvest: 28,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "28°C",
    rainfall: "44mm",
    ndwi: "0.34",
    pestRisk: "Low",
  },
  // Removed mock items 7 and 8 to simplify
];

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
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0].id);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detailPanelOpen, setDetailPanelOpen] = useState(true);
  const [activeLayer, setActiveLayer] = useState(layerOptions[0]);
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);
  const showPanels = !isFullscreen;
  // const [containerSize, setContainerSize] = useState({ width: 0, height: 0 }); // Unused for now

  // Fix for 'any' type on map ref - using generic Map type or simpler solution
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  useEffect(() => {
    // Invalidate map size when fullscreen toggles to ensure it fills the container
    if (mapRef) {
      setTimeout(() => {
        mapRef.invalidateSize();
      }, 100);
    }
  }, [isFullscreen, mapRef]);

  const getPixelPosition = (percent: string, total: number) => {
    return (parseFloat(percent) / 100) * total;
  };

  const selectedField = useMemo(() => fields.find((f) => f.id === selectedFieldId) ?? fields[0], [selectedFieldId]);
  const overallHealth = useMemo(
    () => Math.round((fields.reduce((acc, f) => acc + f.health, 0) / fields.length) * 100),
    [],
  );

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
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-900">Monitoramento</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">8 Talhões</Badge>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Overall Health */}
                <div>
                  <p className="text-sm font-medium text-slate-500">Saude geral (indices)</p>
                  <div className="mt-1 flex items-end gap-4">
                    <span className="text-6xl font-light text-slate-800">
                      {overallHealth}
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
                <div className="space-y-3">
                  {fields.map((field) => (
                    <button
                      key={field.id}
                      className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all ${field.id === selectedFieldId
                        ? "border-emerald-500 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                        : "border-transparent bg-white hover:bg-slate-50"
                        }`}
                      onClick={() => {
                        setSelectedFieldId(field.id);
                        setDetailPanelOpen(true);
                      }}
                    >
                      {(() => {
                        const risk = getSmcRisk(field);
                        return (
                          <>
                            {field.id === selectedFieldId && (
                              <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
                            )}
                            <div className="flex items-center justify-between">
                              <div className="pl-2">
                                <p className="font-semibold text-slate-900">{field.name}</p>
                                <p className="text-xs text-slate-400">{field.crop}</p>
                                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                                  <span>{field.layer}</span>
                                  <span className="text-slate-300">•</span>
                                  <span>{field.lastImage}</span>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                  <span className={`rounded-full border px-2 py-[2px] text-[10px] font-semibold ${riskBadgeClass(risk)}`}>
                                    Risco SMC: {risk}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {field.healthLabel !== "Good" && (
                                  <Badge
                                    variant="outline"
                                    className="gap-1 border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-normal text-amber-600"
                                  >
                                    <AlertTriangle className="h-3 w-3" />
                                    {field.healthLabel === "Low" ? "Atencao" : "Alerta"}
                                  </Badge>
                                )}
                                <div
                                  className={`flex items-center gap-1.5 text-sm font-medium ${field.healthLabel === "Good"
                                    ? "text-emerald-500"
                                    : field.healthLabel === "Low"
                                      ? "text-amber-500"
                                      : "text-red-500"
                                    }`}
                                >
                                  <Activity className="h-4 w-4" />
                                  {Math.round(field.health * 100)}%
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="relative flex-1 overflow-hidden rounded-[15px] bg-slate-900">
          <MapContainer
            ref={setMapRef}
            center={[-21.250496, -48.488378]}
            zoom={14}
            className="h-full w-full"
            style={{ background: "#0f172a" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            {fields.map((field) => (
              <Polygon
                key={field.id}
                positions={field.coordinates}
                pathOptions={{
                  color: field.id === selectedFieldId ? "#ffffff" :
                    field.healthLabel === "Good" ? "#10b981" :
                      field.healthLabel === "Low" ? "#f59e0b" : "#ef4444",
                  fillColor: field.id === selectedFieldId ? "#ffffff" :
                    field.healthLabel === "Good" ? "#10b981" :
                      field.healthLabel === "Low" ? "#f59e0b" : "#ef4444",
                  fillOpacity: field.id === selectedFieldId ? 0.2 : 0.4,
                  weight: field.id === selectedFieldId ? 3 : 2,
                }}
                eventHandlers={{
                  click: (e) => {
                    const map = e.target._map;
                    map.flyTo(field.center, 16);
                    setSelectedFieldId(field.id);
                    setDetailPanelOpen(true);
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <p className="font-bold text-slate-900">{field.name}</p>
                    <p className="text-xs text-slate-500 mb-2">{field.crop}</p>
                    <div className={`flex items-center gap-1.5 text-sm font-medium ${field.healthLabel === "Good" ? "text-emerald-600" :
                      field.healthLabel === "Low" ? "text-amber-600" : "text-red-600"
                      }`}>
                      <Activity className="h-4 w-4" />
                      Saúde: {Math.round(field.health * 100)}%
                    </div>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>

          {/* Top Controls Group */}
          <div className="absolute left-6 top-6 z-[5000] flex flex-col gap-3 pointer-events-none">
            {/* Scene Info Badge */}
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/70 px-3 py-2 text-xs text-white/80 backdrop-blur pointer-events-auto shadow-lg">
              <Wind className="h-3.5 w-3.5" />
              Cena Sentinel-2 {currentScene.productId} • {currentScene.captureDate} • Nuvem {currentScene.cloudCover}
            </div>

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
          {detailPanelOpen && selectedField && (
            <div className="absolute right-6 top-6 z-[5000] w-[360px] max-h-[calc(100%-48px)] overflow-y-auto rounded-[24px] bg-white/95 shadow-[0_24px_48px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all animate-in fade-in slide-in-from-right-4">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Talhao</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{selectedField.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      {selectedField.crop} <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                  <button onClick={() => setDetailPanelOpen(false)} className="rounded-full p-1 hover:bg-slate-100">
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                    <div>
                      <p className="text-xs text-slate-400">Saude (NDVI)</p>
                      <div className="flex items-center gap-2 text-emerald-500">
                        <span className="text-lg font-semibold">{Math.round(selectedField.health * 100)}%</span>
                        <span className="h-1 w-1 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium">{selectedField.healthLabel}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Area</p>
                      <p className="text-base font-medium text-slate-900">{selectedField.area}</p>
                      <p className="text-[11px] text-slate-500">Camada ativa: {activeLayer}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-slate-200 p-3 space-y-1">
                      <p className="text-xs text-slate-400">Risco SMC</p>
                      {(() => {
                        const risk = getSmcRisk(selectedField);
                        return (
                          <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${riskBadgeClass(risk)}`}>
                            {risk}
                          </span>
                        );
                      })()}
                      <p className="text-[11px] text-slate-500">
                        Baseado em NDWI/NDMI e NDRE (Sentinel-2).
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3 space-y-1">
                      <p className="text-xs text-slate-400">Confianca</p>
                      <p className="text-sm font-semibold text-slate-900">{getDiagnostic(selectedField).probability}</p>
                      <p className="text-[11px] text-slate-500">Cruza indice + clima</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-slate-500">Ultima imagem</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedField.lastImage}</p>
                      <p className="text-slate-500 mt-1">Produto {selectedField.productId}</p>
                      <p className="text-slate-500 mt-1">Nuvem {selectedField.cloudCover}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3 space-y-2">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>NDVI</span>
                        <span className="font-semibold text-slate-900">{selectedField.ndvi}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>NDWI</span>
                        <span className="font-semibold text-slate-900">{selectedField.ndwi}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>NDRE</span>
                        <span className="font-semibold text-slate-900">{selectedField.ndre}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>EVI</span>
                        <span className="font-semibold text-slate-900">{selectedField.evi}</span>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Assistant */}
                  <div className={`rounded-xl border p-3 ${getDiagnostic(selectedField).color}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-4 w-4" />
                      <p className="text-xs font-bold uppercase tracking-wider">Assistente de Diagnóstico</p>
                    </div>
                    <p className="text-sm font-bold">{getDiagnostic(selectedField).diagnosis}</p>
                    <p className="text-xs mt-1 opacity-80">Ação sugerida: {getDiagnostic(selectedField).action}</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3 text-orange-500" />
                        <p className="text-slate-500 text-[10px]">LST</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{selectedField.lst}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-sky-500" />
                        <p className="text-slate-500 text-[10px]">Chuva</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{selectedField.rainfall}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-emerald-500" />
                        <p className="text-slate-500 text-[10px]">Produt.</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{selectedField.productivity}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-blue-500" />
                        <p className="text-slate-500 text-[10px]">Umidade</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{selectedField.soilMoisture}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-slate-500 text-xs">Tendencia</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedField.trend.startsWith("+") ? (
                          <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                        ) : selectedField.trend.startsWith("-") ? (
                          <ArrowDownRight className="h-5 w-5 text-red-500" />
                        ) : (
                          <Minus className="h-5 w-5 text-slate-400" />
                        )}
                        <p className={`text-sm font-semibold ${selectedField.trend.startsWith("+") ? "text-emerald-600" :
                          selectedField.trend.startsWith("-") ? "text-red-600" :
                            "text-slate-600"
                          }`}>
                          {selectedField.trend}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 space-y-1">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Sprout className="h-4 w-4 text-emerald-500" />
                        <span>Proxima colheita</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedField.nextHarvest}{" "}
                        <span className="text-slate-500">• {selectedField.daysToHarvest} dias</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Alertas agronomicos</p>
                    {selectedField.alerts.length === 0 ? (
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                        Nenhum alerta para este talhao.
                      </div>
                    ) : (
                      selectedField.alerts.map((alert) => (
                        <div
                          key={alert}
                          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700"
                        >
                          {alert}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${selectedField.pestRisk === "High"
                          ? "bg-red-500 animate-pulse"
                          : selectedField.pestRisk === "Medium"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                          }`}
                      />
                      <p className="text-xs font-medium text-slate-600">Risco de Vetores (Bicudo/Broca)</p>
                    </div>
                    <span
                      className={`text-xs font-bold ${selectedField.pestRisk === "High"
                        ? "text-red-600"
                        : selectedField.pestRisk === "Medium"
                          ? "text-amber-600"
                          : "text-emerald-600"
                        }`}
                    >
                      {selectedField.pestRisk === "High"
                        ? "ALTO RISCO"
                        : selectedField.pestRisk === "Medium"
                          ? "MEDIO"
                          : "BAIXO"}
                    </span>
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
