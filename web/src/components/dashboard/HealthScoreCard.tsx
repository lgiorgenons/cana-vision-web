"use client";

import { Leaf, ArrowUpRight } from "lucide-react";

export default function HealthScoreCard() {
    return (
        <div className="relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-[20px] bg-gradient-to-br from-[#22C55E] to-[#16A34A] p-6 text-white shadow-lg shadow-emerald-200/50">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    <span className="font-medium">Saúde da Lavoura</span>
                </div>
                <ArrowUpRight className="h-5 w-5 opacity-80" />
            </div>

            {/* Main Stat */}
            <div className="mt-4">
                <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-light tracking-tight">94%</span>
                    <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-md">
                        Ótimo
                    </div>
                </div>
                <p className="mt-3 text-sm font-medium text-white/90 leading-relaxed">
                    Suas lavouras estão prosperando e mostrando excelente saúde.
                </p>
            </div>

            {/* Decorative */}
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        </div>
    );
}
