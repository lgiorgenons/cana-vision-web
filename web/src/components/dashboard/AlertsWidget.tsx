"use client";

import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

const alerts = [
    { id: 1, title: "Risco de Murcha", location: "Talhão B-05", time: "2h atrás", severity: "high" },
    { id: 2, title: "Falha de Irrigação", location: "Pivô Central 3", time: "4h atrás", severity: "medium" },
    { id: 3, title: "Vistoria Concluída", location: "Talhão A-01", time: "Ontem", severity: "low" },
];

export default function AlertsWidget() {
    return (
        <div className="flex h-full flex-col rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Alertas Recentes</h3>
                <button className="rounded-full bg-gray-100 p-1 hover:bg-gray-200">
                    <Clock className="h-4 w-4 text-gray-500" />
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                        <div className={`mt-0.5 rounded-full p-1.5 ${alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                                alert.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                                    'bg-emerald-100 text-emerald-600'
                            }`}>
                            {alert.severity === 'low' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{alert.location}</span>
                                <span>{alert.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
