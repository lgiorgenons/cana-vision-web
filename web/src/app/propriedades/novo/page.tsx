"use client";

import { Layout } from "@/components/Layout";
import { Upload, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewPropertyPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // TODO: Connect to Backend API
        setTimeout(() => setIsSubmitting(false), 2000); // Mock delay
    };

    return (
        <Layout
            title="Nova Propriedade"
            description="Cadastre uma nova fazenda para iniciar o monitoramento."
        >
            <div className="mx-auto max-w-4xl p-1">


                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Card 1: Basic Info */}
                    <div className="rounded-[10px] bg-white p-6 shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Dados Básicos</h2>
                        <p className="text-sm text-gray-500 mb-6">Informações principais para identificação da sua lavoura.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nome */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Propriedade *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Fazenda Santa Mônica"
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            {/* Área */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Área Total (Hectares) *</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                    <span className="absolute right-4 top-2.5 text-gray-400 text-sm font-medium">ha</span>
                                </div>
                            </div>

                            {/* Safra */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Safra Atual</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 2024/2025"
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            {/* Cultura */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cultura Principal *</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {["Cana-de-Açúcar", "Soja", "Milho", "Outra"].map((crop) => (
                                        <label key={crop} className="relative flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 has-[:checked]:text-emerald-700 transition-all">
                                            <input type="radio" name="crop" className="sr-only" />
                                            <span className="text-sm font-medium">{crop}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Legal IDs */}
                    <div className="rounded-[20px] bg-white p-6 shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Identificação Legal</h2>
                        <p className="text-sm text-gray-500 mb-6">Códigos de registro para relatórios e conformidade.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Código Interno */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Código Interno (ERP)</label>
                                <input
                                    type="text"
                                    placeholder="Opcional"
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            {/* Código SICAR */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Código CAR/SICAR</label>
                                <input
                                    type="text"
                                    placeholder="Opcional"
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 3: GeoJSON Upload */}
                    <div className="rounded-[20px] bg-white p-6 shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Geolocalização</h2>
                        <p className="text-sm text-gray-500 mb-6">Importe o arquivo com o perímetro da propriedade.</p>

                        <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-10 transition-colors hover:bg-gray-100">
                            <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200 mb-3">
                                <Upload className="h-6 w-6 text-emerald-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Clique para selecionar ou arraste o arquivo</p>
                            <p className="text-xs text-gray-500 mt-1">Suporta: .GeoJSON, .JSON, .KML (Máx 5MB)</p>
                            <input type="file" className="absolute inset-0 cursor-pointer opacity-0" accept=".json,.geojson,.kml" />
                        </div>

                        <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-blue-700">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="text-xs leading-relaxed">
                                <strong>Dica:</strong> O arquivo deve conter apenas o polígono externo da propriedade. A divisão de talhões será feita em uma etapa posterior.
                            </p>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link
                            href="/dashboard"
                            className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-lg bg-[#16A34A] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#15803d] disabled:opacity-50 transition-all shadow-sm shadow-green-200"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Salvar Propriedade
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </Layout>
    );
}
