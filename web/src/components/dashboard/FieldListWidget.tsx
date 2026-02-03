"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { listTalhoes, Talhao } from "@/services/talhoes";
import { listPropriedades } from "@/services/propriedades";
import { Skeleton } from "@/components/ui/skeleton";
import { dataCache } from "@/services/dataCache";

export default function FieldListWidget() {
    const [fields, setFields] = useState<Talhao[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadFields() {
            try {
                // First get properties
                let properties = dataCache.getProperties();

                if (!properties) {
                    properties = await listPropriedades();
                    if (properties && properties.length > 0) {
                        dataCache.setProperties(properties);
                    }
                }

                if (properties && properties.length > 0) {
                    const firstPropertyId = properties[0].id;

                    // Check talhoes cache
                    const cachedTalhoes = dataCache.getTalhoes(firstPropertyId);

                    if (cachedTalhoes) {
                        setFields(cachedTalhoes.slice(0, 50));
                        setIsLoading(false);
                        return; // Done
                    }

                    const data = await listTalhoes(firstPropertyId);
                    if (data) {
                        // We might want to cache this merely as list, but InteractiveMap often needs full details.
                        // However, caching the list is better than nothing.
                        // Ideally we should be consistent. listTalhoes returns partial or full?
                        // It returns whatever the API returns. InteractiveMap does extra fetch if needed.
                        // Let's cache it ONLY if we are sure it's useful, or just rely on it being fast.
                        // Actually, if we cache it here, InteractiveMap will see it.
                        // But InteractiveMap expects "hasGeoJson" potentially.
                        // If this list is shallow, InteractiveMap will needlessly fetch details again if it thinks cached data is full.
                        // CAUTION: dataCache.talhoes expects `Talhao[]`.
                        // If we save shallow here, InteractiveMap will load shallow data -> then fetch details.
                        // That is ACCEPTABLE.
                        dataCache.setTalhoes(firstPropertyId, data);
                        setFields(data.slice(0, 50));
                    } else {
                        setFields([]);
                    }
                } else {
                    setFields([]);
                }
            } catch (error) {
                console.error("Failed to load fields", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadFields();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full flex-col rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-900">Talhões</h3>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900">Talhões</h3>
                <button className="group flex items-center gap-0.5 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
                    Ver todos
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide">
                {fields.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 py-4">Nenhum talhão encontrado.</div>
                ) : (
                    fields.map((field) => (
                        <div key={field.id} className="group flex items-center justify-between rounded-2xl bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-md hover:ring-1 hover:ring-gray-100">
                            <div className="flex items-center gap-4">
                                {/* Mock status for now as API doesn't provide health status yet */}
                                <div className={`h-3 w-3 rounded-full shadow-sm bg-emerald-500 shadow-emerald-200`} />
                                <div>
                                    <p className="font-semibold text-gray-900">{field.nome || field.codigo}</p>
                                    <p className="text-xs font-medium text-gray-400">{field.cultura} • {field.areaHectares}ha</p>
                                </div>
                            </div>
                            <button className="rounded-full p-1 text-gray-300 transition-colors group-hover:bg-gray-100 group-hover:text-gray-900">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
