"use client";

import { Leaf, ArrowUpRight } from "lucide-react";

export default function HealthScoreCard() {
    return (
        <div className="relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-[20px] bg-[#22C55E] p-6 text-white shadow-sm transition-all hover:shadow-md">
            {/* Gradient Overlay */}
            <div className="absolute top-0 right-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 bg-white/20 blur-[80px]" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/10">
                        <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-[16px] font-medium text-white/90">Saúde da Lavoura</span>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors text-white">
                    <ArrowUpRight className="h-5 w-5" />
                </button>
            </div>

            {/* Main Stat */}
            <div className="relative z-10">
                <div className="flex items-center gap-3">
                    <span className="text-[56px] font-semibold leading-none tracking-tight text-white">94%</span>
                    <div className="px-3 py-1 rounded-full bg-white text-[#22C55E] text-xs font-bold shadow-sm">
                        Ótimo
                    </div>
                </div>
                <p className="mt-2 text-[14px] font-medium text-white/80 leading-relaxed max-w-[90%]">
                    Suas lavouras estão prosperando.
                </p>
            </div>
        </div>
    );
}
