"use client";

import { AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

const alerts = [
    { id: 1, title: "Risco de Murcha", location: "Talhão B-05", time: "2h atrás", severity: "high" },
    { id: 2, title: "Falha de Irrigação", location: "Pivô Central 3", time: "4h atrás", severity: "medium" },
    { id: 3, title: "Vistoria Concluída", location: "Talhão A-01", time: "Ontem", severity: "low" },
];

export default function AlertsWidget() {
    return (
        <div className="flex h-full flex-col rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Alertas Recentes</h3>
                <button className="group flex items-center gap-0.5 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
                    Ver todos
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>

            <div className="flex flex-col gap-2">
                {alerts.map((alert) => (
                    <div key={alert.id} className="group flex items-center gap-4 rounded-2xl p-3 transition-all hover:bg-gray-50 border border-transparent hover:border-gray-100">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${alert.severity === 'high' ? 'bg-red-50 border-red-100 text-red-600' :
                            alert.severity === 'medium' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                                'bg-emerald-50 border-emerald-100 text-emerald-600'
                            }`}>
                            {alert.severity === 'low' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-gray-900 truncate">{alert.title}</p>
                                <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2">{alert.time}</span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{alert.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
