"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { listTalhoes, Talhao } from "@/services/talhoes";
import { listPropriedades } from "@/services/propriedades";
import { Skeleton } from "@/components/ui/skeleton";

export default function FieldListWidget() {
    const [fields, setFields] = useState<Talhao[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadFields() {
            try {
                // First get properties to know which ID to query
                const properties = await listPropriedades();

                if (properties && properties.length > 0) {
                    // For now, load fields from the first property to populate the widget
                    // Ideal: Allow user to select property in this widget
                    const firstPropertyId = properties[0].id;
                    const data = await listTalhoes(firstPropertyId);
                    setFields(data ? data.slice(0, 50) : []);
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
            <div className="flex h-full flex-col rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-gray-100">
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
        <div className="flex h-full flex-col rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900">Talhões</h3>
                <button className="text-sm font-medium text-gray-400 hover:text-gray-900">Ver todos</button>
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
