"use client";

import { LucideIcon, ArrowUpRight } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string;
    subtext: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
}

export default function MetricCard({ label, value, subtext, icon: Icon }: MetricCardProps) {
    return (
        <div className="flex flex-col justify-between rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md h-[240px]">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-900 border border-gray-100">
                        <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[16px] font-medium text-gray-700">{label}</span>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-900 shadow-sm">
                    <ArrowUpRight className="h-5 w-5" />
                </button>
            </div>

            {/* Body */}
            <div>
                <p className="text-[48px] font-semibold tracking-tight leading-none text-[#1F2937]">{value}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-400 font-medium">{subtext}</p>
            </div>
        </div>
    );
}
