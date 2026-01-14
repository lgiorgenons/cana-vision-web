"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Activity,
    ArrowUpRight,
    Droplets,
    Layers,
    Maximize2,
    Sprout,
    Scan,
    Thermometer,
    X,
    Minus,
    Plus,
    Upload,
    Trash2,
    Loader2
} from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { listPropriedades, getPropriedade, Propriedade } from "@/services/propriedades";
import { Talhao, GeoJSONFeature, listTalhoes, getTalhao } from "@/services/talhoes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
// @ts-ignore
import parseGeoraster from "georaster";
// @ts-ignore
import GeoRasterLayer from "georaster-layer-for-leaflet";

// Dynamic import for Leaflet components to avoid SSR issues with them as well
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((mod) => mod.Polygon), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });

const currentScene = {
    productId: "S2B_MSIL2A_20240815",
    captureDate: "15/08/2024",
    cloudCover: "8%",
    resolution: "10 m",
    indices: ["NDVI", "EVI", "NDRE", "NDMI", "True Color"],
};
// Mock Type compatibility
type Field = any;

const layerOptions = ["NDVI", "EVI", "NDRE", "NDMI", "True Color"];

export default function InteractiveMap() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [detailPanelOpen, setDetailPanelOpen] = useState(false);
    const [activeLayer, setActiveLayer] = useState(layerOptions[0]);
    const [layerMenuOpen, setLayerMenuOpen] = useState(false);
    const showPanels = !isFullscreen;

    // Real data state
    const [properties, setProperties] = useState<Propriedade[]>([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
    const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<Propriedade | null>(null);
    const [talhoes, setTalhoes] = useState<Talhao[]>([]);
    const [selectedTalhaoId, setSelectedTalhaoId] = useState<string | null>(null);
    const [selectedTalhaoDetails, setSelectedTalhaoDetails] = useState<Talhao | null>(null);

    const [mapRef, setMapRef] = useState<L.Map | null>(null);

    // TIFF State
    const [tiffLayer, setTiffLayer] = useState<any>(null);
    const [isTiffLoading, setIsTiffLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // TIFF Handlers
    const handleTiffUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !mapRef) return;

        setIsTiffLoading(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const georaster = await parseGeoraster(arrayBuffer);

            // Remove previous layer if exists
            if (tiffLayer) {
                mapRef.removeLayer(tiffLayer);
            }

            const layer = new GeoRasterLayer({
                georaster: georaster,
                opacity: 0.7,
                resolution: 96, // DPI
                pixelValuesToColorFn: (values: number[]) => {
                    const value = values[0];

                    // Handle NoData or invalid values
                    if (value === -9999 || value === null || isNaN(value)) return null;

                    // Logged values are mostly between 0.0 and 0.6
                    // Adjusted scale for better contrast

                    if (value < 0.2) return "#d7191c"; // Red (Low)
                    if (value < 0.3) return "#fdae61"; // Orange
                    if (value < 0.4) return "#ffffbf"; // Yellow
                    if (value < 0.5) return "#a6d96a"; // Light Green
                    if (value >= 0.5) return "#1a9641"; // Dark Green (High)

                    return "#1a9641";
                }
            });

            layer.addTo(mapRef);
            setTiffLayer(layer);
            mapRef.fitBounds(layer.getBounds());

        } catch (error) {
            console.error("Error loading GeoTIFF:", error);
            alert("Erro ao carregar o arquivo GeoTIFF. Verifique se o formato é válido.");
        } finally {
            setIsTiffLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const clearTiff = () => {
        if (mapRef && tiffLayer) {
            mapRef.removeLayer(tiffLayer);
            setTiffLayer(null);
        }
    };

    // Load properties on mount
    useEffect(() => {
        async function fetchProperties() {
            try {
                const data = await listPropriedades();
                console.log("[InteractiveMap] Fetched Properties List:", JSON.stringify(data, null, 2));
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

    // Load property details and talhoes when property changes
    useEffect(() => {
        async function fetchData() {
            if (!selectedPropertyId) return;

            // 1. Fetch full property details (for GeoJSON)
            try {
                const details = await getPropriedade(selectedPropertyId);
                console.log("[InteractiveMap] Fetched Property Details:", JSON.stringify(details, null, 2));
                setSelectedPropertyDetails(details);
            } catch (error) {
                console.error("Failed to load property details", error);
                return; // Stop if prop details fail
            }

            // 2. Fetch talhoes
            try {
                console.log("[InteractiveMap] Fetching talhoes for property:", selectedPropertyId);
                // First get the list (shallow)
                const shallowList = await listTalhoes(selectedPropertyId);

                // Then fetch details for EACH to get GeoJSON (since list endpoint is shallow)
                // This is an N+1 but acceptable for small numbers of fields per property
                const fullList = await Promise.all(
                    shallowList.map(async (t) => {
                        try {
                            return await getTalhao(t.id);
                        } catch (e) {
                            console.error(`Failed to fetch details for talhao ${t.id}`, e);
                            return t; // Fallback to shallow
                        }
                    })
                );

                console.log("[InteractiveMap] Fetched Full Talhoes:", JSON.stringify(fullList, null, 2));
                setTalhoes(fullList || []);
                setSelectedTalhaoId(null);
                setDetailPanelOpen(false);
            } catch (error) {
                console.error("Failed to load talhoes", error);
                setTalhoes([]);
            }
        }
        fetchData();
    }, [selectedPropertyId]);

    // Load selected talhao details (for GeoJSON)
    useEffect(() => {
        async function fetchTalhaoDetails() {
            if (!selectedTalhaoId) {
                setSelectedTalhaoDetails(null);
                return;
            }
            try {
                const details = await getTalhao(selectedTalhaoId);
                console.log("[InteractiveMap] Fetched Talhao Details:", JSON.stringify(details, null, 2));
                setSelectedTalhaoDetails(details);
            } catch (error) {
                console.error("Failed to load talhao details", error);
            }
        }
        fetchTalhaoDetails();
    }, [selectedTalhaoId]);

    // Derived state
    const selectedProperty = useMemo(() => properties.find(p => p.id === selectedPropertyId), [properties, selectedPropertyId]);
    const selectedTalhao = useMemo(() => talhoes.find(t => t.id === selectedTalhaoId), [talhoes, selectedTalhaoId]);

    // Helper to extract polygon positions from GeoJSON
    const getPolygonPositions = (feature: GeoJSONFeature | undefined): [number, number][] => {
        if (!feature) {
            return [];
        }

        // Handle case where feature IS the geometry (no geometry property)
        const geometry = feature.geometry || feature;

        if (!geometry || !geometry.coordinates) {
            return [];
        }

        const { type, coordinates } = geometry as any;

        try {
            if (type === "MultiPolygon") {
                const multiCoords = coordinates as unknown as number[][][][];
                if (multiCoords.length > 0 && multiCoords[0].length > 0) {
                    const outerRing = multiCoords[0][0];
                    return outerRing.map((p) => [p[1], p[0]] as [number, number]);
                }
            } else {
                const polygonCoords = coordinates as number[][][];
                if (polygonCoords.length > 0) {
                    const outerRing = polygonCoords[0];
                    return outerRing.map((p) => [p[1], p[0]] as [number, number]);
                }
            }
        } catch (e) {
            console.error("Error parsing GeoJSON", e);
            return [];
        }

        return [];
    };

    // Calculate center of property to fly to
    useEffect(() => {
        if (selectedPropertyDetails && mapRef) {
            if (selectedPropertyDetails.geojson) {
                const positions = getPolygonPositions(selectedPropertyDetails.geojson);
                if (positions.length > 0) {
                    const bounds = L.latLngBounds(positions);
                    mapRef.fitBounds(bounds, { padding: [50, 50] });
                }
            }
        }
    }, [selectedPropertyDetails, mapRef]);

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
                    {selectedPropertyDetails && (
                        <Polygon
                            positions={getPolygonPositions(selectedPropertyDetails.geojson)}
                            pathOptions={{
                                color: "#2563eb", // Blue (matching registration)
                                dashArray: "10, 10",
                                fillColor: "#2563eb",
                                fillOpacity: tiffLayer ? 0 : 0.3,
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
                            <Tooltip permanent direction="center" className="bg-transparent border-0 shadow-none font-bold text-white text-shadow-sm">
                                {talhao.nome}
                            </Tooltip>
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
                <div className="absolute left-6 top-6 z-[400] flex flex-col gap-3 pointer-events-none">


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
                <div className="absolute bottom-6 left-6 z-[400] flex gap-3 pointer-events-none">
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

                    {/* TIFF Upload Control */}
                    <div className="relative pointer-events-auto">
                        <input
                            type="file"
                            accept=".tiff,.tif"
                            ref={fileInputRef}
                            onChange={handleTiffUpload}
                            className="hidden"
                        />
                        <button
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-md ring-1 ring-white/10 transition pointer-events-auto ${tiffLayer
                                ? "bg-blue-600/80 text-white hover:bg-blue-700/80"
                                : "bg-slate-900/60 text-white hover:bg-slate-900/80"
                                }`}
                            onClick={() => {
                                if (tiffLayer) {
                                    clearTiff();
                                } else {
                                    fileInputRef.current?.click();
                                }
                            }}
                            disabled={isTiffLoading}
                            aria-label="Carregar GeoTIFF"
                            title={tiffLayer ? "Remover TIFF" : "Carregar GeoTIFF"}
                        >
                            {isTiffLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                tiffLayer ? <Trash2 className="h-5 w-5" /> : <Upload className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Detail Panel (Floating) */}
                {detailPanelOpen && selectedTalhao && (
                    <div className="absolute right-6 top-6 z-[400] w-[360px] max-h-[calc(100%-48px)] overflow-y-auto rounded-[24px] bg-white/95 shadow-[0_24px_48px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all animate-in fade-in slide-in-from-right-4">
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
    );
}
