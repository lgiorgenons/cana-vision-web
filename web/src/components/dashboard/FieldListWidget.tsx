"use client";

import { ChevronRight } from "lucide-react";

const fields = [
    { id: "T-A01", crop: "Cana", status: "good", area: "45ha" },
    { id: "T-A02", crop: "Cana", status: "warning", area: "32ha" },
    { id: "T-B01", crop: "Cana", status: "good", area: "50ha" },
    { id: "T-B05", crop: "Cana", status: "critical", area: "28ha" },
    { id: "T-C12", crop: "Soja", status: "good", area: "120ha" },
    { id: "T-C14", crop: "Soja", status: "good", area: "90ha" },
];

export default function FieldListWidget() {
    return (
        <div className="flex h-full flex-col rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900">Talhões</h3>
                <button className="text-sm font-medium text-gray-400 hover:text-gray-900">Ver todos</button>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide">
                {fields.map((field) => (
                    <div key={field.id} className="group flex items-center justify-between rounded-2xl bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-md hover:ring-1 hover:ring-gray-100">
                        <div className="flex items-center gap-4">
                            <div className={`h-3 w-3 rounded-full shadow-sm ${field.status === 'good' ? 'bg-emerald-500 shadow-emerald-200' :
                                    field.status === 'warning' ? 'bg-amber-500 shadow-amber-200' : 'bg-red-500 shadow-red-200'
                                }`} />
                            <div>
                                <p className="font-semibold text-gray-900">{field.id}</p>
                                <p className="text-xs font-medium text-gray-400">{field.crop} • {field.area}</p>
                            </div>
                        </div>
                        <button className="rounded-full p-1 text-gray-300 transition-colors group-hover:bg-gray-100 group-hover:text-gray-900">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
