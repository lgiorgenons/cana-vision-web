"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, Tooltip, Circle } from "react-leaflet";
import { LeafletMouseEvent, Map as LeafletMap } from "leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Loader2, AlertTriangle, ArrowLeft, RotateCcw, Circle as CircleIcon, Hexagon, Info as InfoIcon } from "lucide-react";
import { useOnClickOutside } from "@/hooks/use-click-outside";
import * as turf from "@turf/turf";

interface GeoJSONPolygonFeature {
    type: "Feature";
    geometry: {
        type: "Polygon";
        coordinates: number[][][];
    };
    properties: Record<string, unknown>;
}

interface PropertyMapSelectorProps {
    onBoundaryChange: (geojson: GeoJSONPolygonFeature | null) => void;
    className?: string;
    contextGeoJson?: GeoJSONPolygonFeature | null;
    initialGeoJson?: GeoJSONPolygonFeature | null;
    otherPolygons?: GeoJSONPolygonFeature[];
    showSearch?: boolean;
}

const MapController = ({
    isDrawing,
    drawingMode,
    onPolygonClick,
    onCircleClick,
    onMouseMove
}: {
    isDrawing: boolean;
    drawingMode: 'polygon' | 'circle';
    onPolygonClick: (e: LeafletMouseEvent) => void;
    onCircleClick: (e: LeafletMouseEvent) => void;
    onMouseMove: (e: LeafletMouseEvent) => void;
}) => {
    useMapEvents({
        click: (e) => {
            if (isDrawing) {
                if (drawingMode === 'polygon') {
                    onPolygonClick(e);
                } else {
                    onCircleClick(e);
                }
            }
        },
        mousemove: (e) => {
            if (isDrawing && drawingMode === 'circle') {
                onMouseMove(e);
            }
        }
    });
    return null;
};

export function PropertyMapSelector({ onBoundaryChange, className, contextGeoJson, initialGeoJson, otherPolygons = [], showSearch = true }: PropertyMapSelectorProps) {
    const [points, setPoints] = useState<[number, number][]>([]);
    const [isDrawing, setIsDrawing] = useState(true);
    const [map, setMap] = useState<LeafletMap | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Circle Mode State
    const [drawingMode, setDrawingMode] = useState<'polygon' | 'circle'>('polygon');
    const [circleCenter, setCircleCenter] = useState<[number, number] | null>(null);
    const [currentRadius, setCurrentRadius] = useState<number>(0);

    // Initialize points if initialGeoJson provided
    useEffect(() => {
        if (initialGeoJson && initialGeoJson.geometry && initialGeoJson.geometry.coordinates && points.length === 0) {
            const coords = initialGeoJson.geometry.coordinates[0];
            if (coords) {
                // GeoJSON [lon, lat] -> Leaflet [lat, lon]
                const latLngs = coords.slice(0, -1).map(c => [c[1], c[0]] as [number, number]);
                setPoints(latLngs);
            }
        }
    }, [initialGeoJson, points.length]);

    // Search State
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{ lat: string; lon: string; display_name: string }[]>([]);
    const [noResults, setNoResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(searchRef, () => {
        setResults([]);
        setNoResults(false);
    });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setNoResults(false);

        const coordRegex = /^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/;
        const match = query.trim().match(coordRegex);

        if (match) {
            const lat = parseFloat(match[1]);
            const lon = parseFloat(match[3]);

            if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                handleSelectLocation(lat.toString(), lon.toString());
                setIsLoading(false);
                return;
            }
        }

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data: { lat: string; lon: string; display_name: string }[] = await response.json();

            const uniqueData = data.filter((item, index, self) =>
                index === self.findIndex((t) => (
                    t.display_name === item.display_name
                ))
            );

            setResults(uniqueData);

            if (uniqueData.length === 0) {
                setNoResults(true);
            } else if (uniqueData.length === 1) {
                const first = uniqueData[0];
                handleSelectLocation(first.lat, first.lon);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(e as unknown as React.FormEvent);
        }
    };

    const handleSelectLocation = (latStr: string, lonStr: string) => {
        if (!map) return;
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);
        map.flyTo([lat, lon], 14, { duration: 2 });
        setResults([]);
    };

    useEffect(() => {
        if (map && contextGeoJson && contextGeoJson.geometry && contextGeoJson.geometry.coordinates.length > 0) {
            const coords = contextGeoJson.geometry.coordinates[0];
            if (coords && coords.length > 0) {
                const latLngs = coords.map(c => [c[1], c[0]] as [number, number]);
                const bounds = L.latLngBounds(latLngs);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [map, contextGeoJson]);

    const handlePolygonClick = (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        // If we were in circle mode but decided to click, ensure we are clean
        if (drawingMode !== 'polygon') return;

        const newPoints = [...points, [lat, lng] as [number, number]];
        setPoints(newPoints);
        updateParent(newPoints);
    };

    const handleCircleClick = (e: LeafletMouseEvent) => {
        if (!circleCenter) {
            // First click: Start circle
            setCircleCenter([e.latlng.lat, e.latlng.lng]);
            setCurrentRadius(0);
        } else {
            // Second click: Finish circle
            const center = circleCenter;
            const radiusInMeters = currentRadius;

            if (radiusInMeters > 0) {
                const centerLonLat = [center[1], center[0]];
                const options = { steps: 64, units: 'meters' as const };
                const circlePoly = turf.circle(centerLonLat, radiusInMeters, options);

                const newPoints = circlePoly.geometry.coordinates[0].slice(0, -1).map(p => [p[1], p[0]] as [number, number]);

                setPoints(newPoints);
                updateParent(newPoints);
            }

            setCircleCenter(null);
            setCurrentRadius(0);
            setDrawingMode('polygon');
        }
    };

    const handleMouseMove = (e: LeafletMouseEvent) => {
        if (circleCenter) {
            const dist = e.latlng.distanceTo(circleCenter);
            setCurrentRadius(dist);
        }
    };

    const validateGeometry = (geojson: GeoJSONPolygonFeature): string | null => {
        try {
            if (contextGeoJson) {
                if (!turf.booleanWithin(geojson as any, contextGeoJson as any)) {
                    return "A área do talhão deve estar dentro da propriedade.";
                }
            }

            for (const other of otherPolygons) {
                if (!other || !other.geometry) continue;

                const intersection = turf.intersect(turf.featureCollection([geojson as any, other as any]));
                if (intersection) {
                    const intersectionArea = turf.area(intersection);
                    if (intersectionArea > 10) {
                        return `Sobreposição detectada com outro talhão.`;
                    }
                }
            }

            return null;

        } catch (error) {
            console.error("Validation error:", error);
            return null;
        }
    };

    const updateParent = (currentPoints: [number, number][]) => {
        if (currentPoints.length < 3) {
            onBoundaryChange(null);
            setValidationError(null);
            return;
        }

        const coordinates = [
            [
                ...currentPoints.map((p) => [p[1], p[0]]),
                [currentPoints[0][1], currentPoints[0][0]],
            ],
        ];

        const geojson: GeoJSONPolygonFeature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: coordinates,
            },
            properties: {},
        };

        const error = validateGeometry(geojson);
        setValidationError(error);
        onBoundaryChange(error ? null : geojson);
    };

    const contextPolygonPositions = useMemo(() => {
        if (!contextGeoJson || !contextGeoJson.geometry.coordinates) return null;
        const coords = contextGeoJson.geometry.coordinates[0];
        return coords.map((p) => [p[1], p[0]] as [number, number]);
    }, [contextGeoJson]);

    const activePolygonPositions = points;

    const resetMap = () => {
        setPoints([]);
        setIsDrawing(true);
        onBoundaryChange(null);
        setValidationError(null);
        setQuery("");
        setResults([]);
        setNoResults(false);
        setCircleCenter(null);
        setCurrentRadius(0);
        setDrawingMode('polygon');
    };

    const undoLastPoint = () => {
        if (points.length === 0) return;
        const newPoints = points.slice(0, -1);
        setPoints(newPoints);
        updateParent(newPoints);
    };

    const resetToInitial = () => {
        if (initialGeoJson && initialGeoJson.geometry && initialGeoJson.geometry.coordinates) {
            const coords = initialGeoJson.geometry.coordinates[0];
            if (coords) {
                const latLngs = coords.slice(0, -1).map(c => [c[1], c[0]] as [number, number]);
                setPoints(latLngs);
                updateParent(latLngs);
            }
        }
    };

    const center = useMemo(() => [-14.2350, -51.9253] as [number, number], []);

    return (
        <div className={`flex flex-col gap-4 ${className}`}>


            {/* Search Bar */}
            {showSearch && (
                <div className="relative z-[3000]" ref={searchRef}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Buscar cidade, endereço ou coordenadas..."
                            className="pl-9 bg-white shadow-sm"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setNoResults(false);
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />}
                    </div>

                    <p className="mt-1 text-xs text-slate-500 ml-1">
                        Dica: Você pode buscar por coordenadas (ex: -23.5, -46.6)
                    </p>
                    {results.length > 0 && (
                        <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border border-slate-100 overflow-hidden max-h-60 overflow-y-auto z-[2000]">
                            {results.map((item, idx) => (
                                <button
                                    key={idx}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50 last:border-0"
                                    onClick={() => handleSelectLocation(item.lat, item.lon)}
                                >
                                    {item.display_name}
                                </button>
                            ))}
                        </div>
                    )}
                    {noResults && (
                        <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border border-slate-100 p-4 text-center text-sm text-slate-500 z-[2000]">
                            Nenhum resultado encontrado
                        </div>
                    )}
                </div>
            )}

            <div className="flex bg-slate-100 p-1 rounded-lg w-max mb-1">
                <button
                    type="button"
                    onClick={() => { setDrawingMode('polygon'); setCircleCenter(null); }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${drawingMode === 'polygon'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                        }`}
                >
                    <Hexagon className="w-4 h-4" />
                    Polígono
                </button>
                <button
                    type="button"
                    onClick={() => { setDrawingMode('circle'); setPoints([]); onBoundaryChange(null); }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${drawingMode === 'circle'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                        }`}
                >
                    <CircleIcon className="w-4 h-4" />
                    Círculo
                </button>
            </div>

            <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-slate-200">
                <MapContainer
                    center={center}
                    zoom={4}
                    className="h-full w-full z-0"
                    ref={setMap}
                >
                    <TileLayer
                        attribution='Tiles &copy; Esri, USGS, USDA'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    <MapController
                        isDrawing={isDrawing}
                        drawingMode={drawingMode}
                        onPolygonClick={handlePolygonClick}
                        onCircleClick={handleCircleClick}
                        onMouseMove={handleMouseMove}
                    />

                    {contextPolygonPositions && (
                        <Polygon
                            positions={contextPolygonPositions}
                            pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.1, weight: 2, dashArray: '10, 10' }}
                        />
                    )}

                    {otherPolygons.map((poly, idx) => {
                        if (!poly || !poly.geometry || !poly.geometry.coordinates || poly.geometry.coordinates.length === 0) return null;
                        const positions = poly.geometry.coordinates[0].map(c => [c[1], c[0]] as [number, number]);
                        return (
                            <Polygon
                                key={`other-${idx}`}
                                positions={positions}
                                pathOptions={{ color: "#64748b", fillColor: "#94a3b8", fillOpacity: 0.4, weight: 1 }}
                            >
                                <Tooltip direction="center" permanent className="bg-transparent border-0 shadow-none font-bold text-white text-shadow-sm">
                                    {poly.properties?.nome as string || ""}
                                </Tooltip>
                            </Polygon>
                        )
                    })}

                    {circleCenter && (
                        <Circle
                            center={circleCenter}
                            radius={currentRadius}
                            pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.2, dashArray: '5, 5' }}
                        />
                    )}

                    {points.map((pos, idx) => (
                        <Marker
                            key={`point-${idx}-${pos[0]}-${pos[1]}`}
                            position={pos}
                            draggable={true}
                            title="Arraste para ajustar"
                            icon={L.divIcon({
                                className: "bg-transparent",
                                html: `<div style="
                                    background-color: white; 
                                    border: 2px solid ${validationError ? "#ef4444" : "#10b981"}; 
                                    width: 12px; 
                                    height: 12px; 
                                    border-radius: 50%;
                                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                                    cursor: move;
                                "></div>`,
                                iconSize: [12, 12],
                                iconAnchor: [6, 6],
                            })}
                            eventHandlers={{
                                dragend: (e: any) => {
                                    const marker = e.target;
                                    const newPos = marker.getLatLng();
                                    const newPoints = [...points];
                                    newPoints[idx] = [newPos.lat, newPos.lng];
                                    setPoints(newPoints);
                                    updateParent(newPoints);
                                }
                            }}
                        />
                    ))}

                    {points.length > 1 && (
                        <Polygon
                            positions={activePolygonPositions}
                            pathOptions={{
                                color: validationError ? "#ef4444" : "#10b981",
                                fillColor: validationError ? "#ef4444" : "#10b981",
                                fillOpacity: 0.4
                            }}
                        />
                    )}
                </MapContainer>

                <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                    <Button
                        type="button"
                        onClick={resetMap}
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-red-50 hover:text-red-600 border-slate-200 shadow-sm justify-start"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Limpar
                    </Button>

                    <Button
                        type="button"
                        onClick={undoLastPoint}
                        disabled={points.length === 0}
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-slate-50 hover:text-slate-900 border-slate-200 shadow-sm justify-start"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Desfazer
                    </Button>

                    {initialGeoJson && (
                        <Button
                            type="button"
                            onClick={resetToInitial}
                            variant="outline"
                            size="sm"
                            className="bg-white hover:bg-emerald-50 hover:text-emerald-700 border-slate-200 shadow-sm justify-start"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reverter Original
                        </Button>
                    )}
                </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
                <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-1">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="font-medium">{validationError}</span>
                </div>
            )}

            {/* Integrated Instruction Box */}
            <div className="mt-1 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-blue-700">
                <div className="flex-shrink-0 mt-0.5">
                    <InfoIcon className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-sm leading-relaxed">
                    <strong>Instrução:</strong> {drawingMode === 'polygon'
                        ? "Clique no mapa para adicionar pontos. Arraste os pontos brancos para ajustar o desenho. O sistema fecha a área automaticamente."
                        : (circleCenter
                            ? "Arraste o mouse para definir o raio e clique novamente para finalizar o desenho do pivô."
                            : "Clique no centro do pivô para começar a desenhar."
                        )
                    }
                </p>
            </div>
        </div>
    );
}
