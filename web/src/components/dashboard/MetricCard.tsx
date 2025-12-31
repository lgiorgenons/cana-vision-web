"use client";

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string;
    subtext: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
}

export default function MetricCard({ label, value, subtext, icon: Icon }: MetricCardProps) {
    return (
        <div className="flex flex-col justify-between rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className="rounded-full bg-gray-50 p-2 text-gray-900">
                    <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-gray-400">↗</span>
            </div>

            <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                <p className="mt-1 text-xs text-gray-400">{subtext}</p>
            </div>
        </div>
    );
}
