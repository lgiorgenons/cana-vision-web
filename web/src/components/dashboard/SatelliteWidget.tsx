"use client";

import { Expand } from "lucide-react";

export default function SatelliteWidget() {
    return (
        <div className="group relative flex h-[200px] w-full flex-col overflow-hidden rounded-[20px] bg-gray-900 shadow-sm ring-1 ring-gray-200">
            <img
                src="/images/img_campo_hero.jpg"
                alt="Satellite View"
                className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-white">Sentinel-2 (NDVI)</p>
                        <p className="text-xs text-gray-300">Atualizado: Hoje, 09:30</p>
                    </div>
                    <button className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md hover:bg-white/40">
                        <Expand className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="absolute top-4 right-4">
                <span className="flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-sm animate-pulse">
                    ● Ao Vivo
                </span>
            </div>
        </div>
    );
}
