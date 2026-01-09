"use client";

import { useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Polygon, CircleMarker, useMapEvents } from "react-leaflet";
import { LeafletMouseEvent, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Loader2 } from "lucide-react";
import { useOnClickOutside } from "@/hooks/use-click-outside";

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

export function PropertyMapSelector({ onBoundaryChange, className, contextGeoJson }: PropertyMapSelectorProps) {
    const [points, setPoints] = useState<[number, number][]>([]);
    const [isDrawing, setIsDrawing] = useState(true);
    const [map, setMap] = useState<LeafletMap | null>(null);

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

    // Use effect to fly to context if available
    useMemo(() => {
        if (map && contextGeoJson && contextGeoJson.geometry.coordinates.length > 0) {
            const coords = contextGeoJson.geometry.coordinates[0];
            // GeoJSON is [lon, lat], Leaflet wants [lat, lon]
            if (coords.length > 0) {
                const lat = coords[0][1];
                const lon = coords[0][0];
                map.flyTo([lat, lon], 13);
            }
        }
    }, [map, contextGeoJson]);

    const handleMapClick = (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const newPoints = [...points, [lat, lng] as [number, number]];
        setPoints(newPoints);
        updateParent(newPoints);
    };

    const updateParent = (currentPoints: [number, number][]) => {
        // Convert to simple GeoJSON Polygon format
        // Note: GeoJSON expects [lng, lat], Leaflet uses [lat, lng]
        if (currentPoints.length < 3) {
            onBoundaryChange(null);
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

        onBoundaryChange(geojson);
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
        setQuery("");
        setResults([]);
        setNoResults(false);
    };

    const center = useMemo(() => [-14.2350, -51.9253] as [number, number], []);

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {/* ... Search Bar ... */}
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
                            pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.3, weight: 2, dashArray: '10, 10' }}
                        />
                    )}

                    {/* Active Drawing */}
                    {points.map((pos, idx) => (
                        <CircleMarker
                            key={idx}
                            center={pos}
                            pathOptions={{ color: "white", fillColor: "#10b981", fillOpacity: 1, weight: 2 }}
                            radius={5}
                        />
                    ))}

                    {points.length > 1 && (
                        <Polygon positions={activePolygonPositions} pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.2 }} />
                    )}
                </MapContainer>

                <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                    <Button
                        type="button"
                        onClick={resetMap}
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-red-50 hover:text-red-600 border-slate-200 shadow-sm"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Limpar
                    </Button>
                </div>
            </div>
        </div>
    );
}
