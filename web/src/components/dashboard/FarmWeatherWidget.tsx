"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { listPropriedades, type Propriedade } from "@/services/propriedades";
import { dataCache } from "@/services/dataCache";
import { Skeleton } from "@/components/ui/skeleton";

export default function FarmWeatherWidget() {
    const [property, setProperty] = useState<Propriedade | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                let properties = dataCache.getProperties();
                if (!properties) {
                    properties = await listPropriedades();
                    if (properties && properties.length > 0) {
                        dataCache.setProperties(properties);
                    }
                }
                setProperty(properties?.[0] ?? null);
            } catch {
                setProperty(null);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className="relative h-auto md:h-[375px] w-full rounded-[20px] bg-white shadow-[0px_4px_24px_rgba(0,0,0,0.08)] border border-gray-200 font-sans overflow-hidden hover:shadow-[0px_8px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col md:block">

            {/* Header Row: Location (Left) & Date (Right) */}
            <div className="relative p-6 pb-2 md:absolute md:top-[25px] md:left-[25px] md:p-0 z-20 flex items-center gap-2 text-black leading-[15.2px]">
                <MapPin className="h-[20px] w-[20px]" />
                <span className="font-semibold text-[16px]">Ribeirão Preto, São Paulo</span>
            </div>

            <div className="relative px-6 pb-4 md:absolute md:top-[25px] md:right-[20px] md:p-0 z-20 md:text-right">
                <div className="flex gap-4 text-[14px] font-semibold text-black leading-[15.2px]">
                    <span>Segunda, 10 Outubro 2025</span>
                    <span>09:57 AM</span>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="relative h-full w-full flex flex-col md:block">

                {/* Left Side: Weather Info */}
                <div className="px-6 pb-6 md:absolute md:bottom-[25px] md:left-[25px] md:p-0 md:w-[calc(100%-370px)] min-w-[200px] z-10">

                    {/* Temp & Conditions */}
                    <div className="mb-6 md:mb-8">
                        <span className="text-[48px] font-semibold text-black leading-none tracking-tight block">24°C</span>

                        <div className="mt-4 flex flex-col gap-1">
                            <Image src="/images/ic_sun.png" alt="Ensolarado" width={48} height={48} className="mb-2" />

                            <span className="text-[16px] font-medium text-black">Ensolarado</span>
                            <div className="text-[14px] font-normal text-black mt-1">
                                Mín:23°C <span className="mx-1"></span> Máx:37°C
                            </div>
                        </div>
                    </div>

                    {/* Farm Info Footer */}
                    <div>
                        {isLoading ? (
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-5 w-40" />
                                <div className="flex gap-8">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            </div>
                        ) : property ? (
                            <>
                                <h3 className="text-[16px] font-bold text-black mb-2">{property.nome}</h3>
                                <div className="flex gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[12px] text-gray-400 font-medium">Código</span>
                                        <span className="text-[14px] text-black font-medium">{property.codigoInterno ?? "—"}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[12px] text-gray-400 font-medium">Área</span>
                                        <span className="text-[14px] text-black font-medium">{property.areaHectares} ha</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-400">Nenhuma propriedade cadastrada.</p>
                        )}
                    </div>
                </div>

                {/* Right Side: Map Card */}
                <div className="w-full h-[250px] relative mt-4 md:mt-0 md:absolute md:bottom-0 md:right-0 md:w-[370px] md:h-[310px] md:rounded-tl-[20px] md:rounded-br-[20px] shadow-[inset_2px_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
                    <Image
                        src="/images/img_campo_hero.jpg"
                        alt="Mapa"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

                    <div className="absolute top-[40%] right-[30%] h-24 w-16 -rotate-12 rounded-xl border-2 border-white/80 bg-black/20 backdrop-blur-[2px] flex items-center justify-center shadow-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-white ring-2 ring-white/40" />
                    </div>
                </div>

            </div>
        </div>
    );
}
