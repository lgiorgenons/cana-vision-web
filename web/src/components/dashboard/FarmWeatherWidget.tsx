"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";

export default function FarmWeatherWidget() {
    return (
        <div className="relative h-auto md:h-[375px] w-full rounded-[20px] bg-white shadow-[0px_4px_24px_rgba(0,0,0,0.08)] border border-gray-200 font-sans overflow-hidden hover:shadow-[0px_8px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col md:block">

            {/* Header Row: Location (Left) & Date (Right) */}
            {/* Mobile: Relative Stacked / Desktop: Absolute Top */}
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
                {/* Mobile: Standard Block / Desktop: Absolute Left/Bottom */}
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
                        <h3 className="text-[16px] font-bold text-black mb-2">Fazenda Raio de Sol</h3>
                        <div className="flex gap-8">
                            <div className="flex flex-col">
                                <span className="text-[12px] text-gray-400 font-medium">ID</span>
                                <span className="text-[14px] text-black font-medium">PL-02J</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] text-gray-400 font-medium">Area</span>
                                <span className="text-[14px] text-black font-medium">200 m²</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Map Card */}
                {/* Mobile: Full Width Bottom / Desktop: Fixed 370x310 Bottom Right */}
                <div className="w-full h-[250px] relative mt-4 md:mt-0 md:absolute md:bottom-0 md:right-0 md:w-[370px] md:h-[310px] md:rounded-tl-[20px] md:rounded-br-[20px] shadow-[inset_2px_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
                    <Image
                        src="/images/img_campo_hero.jpg"
                        alt="Mapa"
                        fill
                        className="object-cover"
                    />
                    {/* Optional Gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

                    {/* Field Highlight on Map (Visual only) */}
                    <div className="absolute top-[40%] right-[30%] h-24 w-16 -rotate-12 rounded-xl border-2 border-white/80 bg-black/20 backdrop-blur-[2px] flex items-center justify-center shadow-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-white ring-2 ring-white/40" />
                    </div>
                </div>

            </div>
        </div>
    );
}
