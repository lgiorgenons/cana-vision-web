"use client";

import { type ChangeEvent, type DragEvent, useState } from "react";
import NextLink from "next/link";
import { AlertCircle, Save, Upload } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- Schema Definition ---
const propertySchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
    area: z.coerce
        .number({
            invalid_type_error: "A área deve ser um número válido.",
            required_error: "Informe a área total.",
        })
        .min(0.01, "A área deve ser maior que 0."),
    harvest: z.string().optional(),
    crop: z.enum(["Cana-de-Açúcar", "Soja", "Milho", "Outra"], {
        required_error: "Selecione a cultura principal.",
    }),
    internalCode: z.string().optional(),
    sicarCode: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function NewPropertyPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [geoFileName, setGeoFileName] = useState<string | null>(null);

    // Initialize Form
    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            name: "",
            area: undefined,
            harvest: "",
            crop: "Cana-de-Açúcar",
            internalCode: "",
            sicarCode: "",
        },
    });

    const onSubmit = (values: PropertyFormValues) => {
        setIsSubmitting(true);
        console.log("Form Values:", values);
        // TODO: Connect to Backend API
        setTimeout(() => setIsSubmitting(false), 2000);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setGeoFileName(file ? file.name : null);
    };

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0];
        setGeoFileName(file ? file.name : null);
        setIsDragging(false);
    };

    return (
        <Layout title="Nova Propriedade" description="Cadastre uma nova fazenda para iniciar o monitoramento.">
            <div className="mx-auto max-w-4xl p-1 pb-20">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

                        {/* Card 1: Basic Info */}
                        <div className="rounded-[10px] bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Dados Básicos</h2>
                            <p className="text-sm text-gray-500 mb-6">Informações principais para identificação da sua lavoura.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel className="text-sm font-medium text-gray-700">Nome da Propriedade *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Fazenda Santa Mônica" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Area */}
                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Área Total (Hectares) *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        {...field}
                                                    />
                                                    <span className="absolute right-3 top-2.5 text-sm text-gray-400 font-medium">ha</span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Harvest */}
                                <FormField
                                    control={form.control}
                                    name="harvest"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Safra Atual</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: 2024/2025" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Crop Selection (Radio Group as Cards) */}
                                <FormField
                                    control={form.control}
                                    name="crop"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel className="text-sm font-medium text-gray-700">Cultura Principal *</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                                                >
                                                    {["Cana-de-Açúcar", "Soja", "Milho", "Outra"].map((crop) => (
                                                        <FormItem key={crop} className="space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value={crop} className="sr-only" />
                                                            </FormControl>
                                                            <FormLabel className={`
                                                relative flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-all
                                                ${field.value === crop
                                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500"
                                                                    : "border-gray-200 text-gray-700 hover:bg-gray-50"}
                                            `}>
                                                                {crop}
                                                            </FormLabel>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        </div>

                        {/* Card 2: Legal IDs */}
                        <div className="rounded-[10px] bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Identificação Legal</h2>
                            <p className="text-sm text-gray-500 mb-6">Códigos de registro para relatórios e conformidade.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Internal Code */}
                                <FormField
                                    control={form.control}
                                    name="internalCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Código Interno (ERP)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Opcional" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* SICAR Code */}
                                <FormField
                                    control={form.control}
                                    name="sicarCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Código CAR/SICAR</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Opcional" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        </div>

                        {/* Card 3: GeoJSON Upload */}
                        <div className="rounded-[10px] bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Geolocalização</h2>
                            <p className="text-sm text-gray-500 mb-6">Importe o arquivo com o perímetro da propriedade.</p>

                            <div
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={handleDrop}
                                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 transition-colors
                        ${isDragging ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}
                    `}
                            >
                                <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200 mb-3">
                                    <Upload className="h-6 w-6 text-emerald-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Clique para selecionar ou arraste o arquivo</p>
                                <p className="text-xs text-gray-500 mt-1">Suporta: .GeoJSON, .JSON, .KML (Máx 5MB)</p>

                                {geoFileName && (
                                    <p className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                                        Arquivo selecionado: {geoFileName}
                                    </p>
                                )}

                                <input type="file" onChange={handleFileChange} className="absolute inset-0 cursor-pointer opacity-0" accept=".json,.geojson,.kml" />
                            </div>

                            <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-blue-700">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p className="text-xs leading-relaxed">
                                    <strong>Dica:</strong> O arquivo deve conter apenas o polígono externo da propriedade.
                                </p>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                                className="border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                                <NextLink href="/dashboard">Cancelar</NextLink>
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#16A34A] hover:bg-[#15803d] text-white shadow-sm shadow-green-200 w-fit"
                            >
                                {isSubmitting ? (
                                    <>Salvando...</>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Propriedade
                                    </>
                                )}
                            </Button>
                        </div>

                    </form>
                </Form>
            </div>
        </Layout>
    );
}
