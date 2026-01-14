"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, Tooltip } from "react-leaflet";
import { LeafletMouseEvent, Map as LeafletMap } from "leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Loader2, AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
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
    onMapClick,
}: {
    isDrawing: boolean;
    onMapClick: (e: LeafletMouseEvent) => void;
}) => {
    useMapEvents({
        click: (e) => {
            if (isDrawing) {
                onMapClick(e);
            }
        },
    });
    return null;
};

export function PropertyMapSelector({ onBoundaryChange, className, contextGeoJson, initialGeoJson, otherPolygons = [], showSearch = true }: PropertyMapSelectorProps) {
    console.log("PropertyMapSelector: otherPolygons received:", otherPolygons);
    const [points, setPoints] = useState<[number, number][]>([]);
    const [isDrawing, setIsDrawing] = useState(true);
    const [map, setMap] = useState<LeafletMap | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

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

        // Check for coordinates (Lat, Lon)
        // Supports: "lat, lon" or "lat lon"
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

            // Filter duplicates based on display_name
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

    // Use effect to fit bounds to context if available
    useEffect(() => {
        if (map && contextGeoJson && contextGeoJson.geometry && contextGeoJson.geometry.coordinates.length > 0) {
            // Handle MultiPolygon or Polygon? The interface says Polygon but let's be safe or strict
            // contentGeoJson interface is Polygon
            const coords = contextGeoJson.geometry.coordinates[0];
            if (coords && coords.length > 0) {
                // GeoJSON is [lon, lat], Leaflet wants [lat, lon]
                const latLngs = coords.map(c => [c[1], c[0]] as [number, number]);
                const bounds = L.latLngBounds(latLngs);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [map, contextGeoJson]);

    const handleMapClick = (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const newPoints = [...points, [lat, lng] as [number, number]];
        setPoints(newPoints);
        updateParent(newPoints);
    };

    const validateGeometry = (geojson: GeoJSONPolygonFeature): string | null => {
        try {
            // 1. Check if inside context (Property Boundary)
            if (contextGeoJson) {
                // turf expects [lon, lat] which is what our geojson has
                // Ensure polygons are closed
                // booleanContains returns false if edges touch sometimes depending on precision, 
                // but for "new talhao" it should be strictly inside or touching edges is fine?
                // Let's rely on booleanContains for now. 
                // Note: If drawing points individually, the polygon might be invalid until closed. 
                // The updateParent creates a closed polygon.

                // Relax check: Check if verify if checking intersection is better?
                // If Difference(Talhao, Property) is not empty, then it's outside.
                // Actually turf.difference(feature1, feature2).
                // If A is inside B, then A - B should be empty? No. 
                // We want to check if Talhao is covered by Property.
                // booleanWithin(Talhao, Property) is better.
                if (!turf.booleanWithin(geojson as any, contextGeoJson as any)) {
                    return "A área do talhão deve estar dentro da propriedade.";
                }
            }

            // 2. Check overlap with other talhões
            for (const other of otherPolygons) {
                if (!other || !other.geometry) continue;

                // Ignore if it's the same polygon (usually filtered out by parent, but safe check)
                // Using intersect
                // Turf v7: intersect(FeatureCollection)
                const intersection = turf.intersect(turf.featureCollection([geojson as any, other as any]));
                // If intersection exists and area > 0 (to ignore just touching edges)
                if (intersection) {
                    // Check area of intersection to allow shared boundaries
                    const intersectionArea = turf.area(intersection);
                    if (intersectionArea > 10) { // Tolerance of 10 sq meters?
                        return `Sobreposição detectada com outro talhão.`;
                    }
                }
            }

            return null;

        } catch (error) {
            console.error("Validation error:", error);
            return null; // Ignore validation errors if turf fails (e.g. self-intersection during drawing)
        }
    };

    const updateParent = (currentPoints: [number, number][]) => {
        // Convert to simple GeoJSON Polygon format
        // Note: GeoJSON expects [lng, lat], Leaflet uses [lat, lng]
        if (currentPoints.length < 3) {
            onBoundaryChange(null);
            setValidationError(null);
            return;
        }

        const coordinates = [
            [
                ...currentPoints.map((p) => [p[1], p[0]]),
                [currentPoints[0][1], currentPoints[0][0]], // Close the loop
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

        // If error, pass null to parent to prevent form submission
        onBoundaryChange(error ? null : geojson);
    };

    // Transform contextGeoJSON to Leaflet format for display
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
                        {/* ... loader ... */}
                        {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />}
                    </div>
                    {/* ... hints and results ... */}
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
                    <MapController isDrawing={isDrawing} onMapClick={handleMapClick} />

                    {/* Context Polygon (Ghost) */}
                    {contextPolygonPositions && (
                        <Polygon
                            positions={contextPolygonPositions}
                            pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.1, weight: 2, dashArray: '10, 10' }}
                        />
                    )}

                    {/* Other Polygons (Existing Fields) */}
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

                    {/* Active Drawing */}
                    {/* Active Drawing */}
                    {points.map((pos, idx) => (
                        <Marker
                            key={`point-${idx}-${pos[0]}-${pos[1]}`}
                            position={pos}
                            draggable={true}
                            icon={L.divIcon({
                                className: "bg-transparent",
                                html: `<div style="
                                    background-color: white; 
                                    border: 2px solid ${validationError ? "#ef4444" : "#10b981"}; 
                                    width: 12px; 
                                    height: 12px; 
                                    border-radius: 50%;
                                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
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
        </div>
    );
}
