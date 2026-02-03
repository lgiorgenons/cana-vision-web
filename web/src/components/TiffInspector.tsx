"use client";

import { useEffect, useRef } from "react";
import { useMapEvents } from "react-leaflet";
// @ts-expect-error geoblaze lacks types
import geoblaze from "geoblaze";

interface TiffInspectorProps {
    georaster: any;
    onHover: (val: number | null, pos: { x: number; y: number } | null) => void;
}

const resolveNoDataValue = (georaster: any, bandIndex: number): number | null => {
    const noDataValue = georaster?.noDataValue;
    if (Array.isArray(noDataValue)) {
        const value = noDataValue[bandIndex];
        return Number.isFinite(value) ? value : null;
    }
    return Number.isFinite(noDataValue) ? noDataValue : null;
};

export function TiffInspector({ georaster, onHover }: TiffInspectorProps) {
    const rafRef = useRef<number | null>(null);
    const lastEventRef = useRef<any>(null);
    const georasterRef = useRef<any>(georaster);

    useEffect(() => {
        georasterRef.current = georaster;
    }, [georaster]);

    useEffect(() => {
        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    useMapEvents({
        mousemove: (e) => {
            if (!georasterRef.current) return;
            lastEventRef.current = e;

            if (rafRef.current !== null) return;

            rafRef.current = requestAnimationFrame(async () => {
                rafRef.current = null;

                const currentEvent = lastEventRef.current;
                const currentRaster = georasterRef.current;

                if (!currentEvent || !currentRaster) return;

                const { lat, lng } = currentEvent.latlng;

                try {
                    // geoblaze.identify might be async depending on the source, currently it is sync for local raster
                    // We treat it as potentially async to be safe
                    const result = await geoblaze.identify(currentRaster, [lng, lat]);

                    // console.log("[TiffInspector] Identify:", lng, lat, result);

                    let value = null;
                    if (Array.isArray(result) && result.length > 0) {
                        value = result[0];
                    } else if (typeof result === 'number') {
                        value = result;
                    }

                    const noDataValue = resolveNoDataValue(currentRaster, 0);

                    if (
                        typeof value !== "number" ||
                        !Number.isFinite(value) ||
                        (noDataValue !== null && value === noDataValue) ||
                        value === -9999
                    ) {
                        onHover(null, null);
                        return;
                    }

                    // console.log("[TiffInspector] Value Found:", value);
                    onHover(value, { x: currentEvent.originalEvent.clientX, y: currentEvent.originalEvent.clientY });
                } catch (err) {
                    console.error("[TiffInspector] Geoblaze error:", err);
                    onHover(null, null);
                }
            });
        },
        mouseout: () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            lastEventRef.current = null;
            onHover(null, null);
        },
    });

    return null;
}
