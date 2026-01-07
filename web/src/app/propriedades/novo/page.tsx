"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { AlertCircle, Save } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Dynamically import Map component to avoid window undefined errors in Next.js
const PropertyMapSelector = dynamic(
    () => import("@/components/properties/PropertyMapSelector").then((mod) => mod.PropertyMapSelector),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                Carregando mapa...
            </div>
        ),
    }
);

// --- Interfaces ---
interface GeoJSONPolygonFeature {
    type: "Feature";
    geometry: {
        type: "Polygon";
        coordinates: number[][][];
    };
    properties: Record<string, unknown>;
}

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
    geoJson: z.custom<GeoJSONPolygonFeature | null>((val) => {
        const v = val as GeoJSONPolygonFeature | null | undefined;
        return v && v.type === "Feature" && v.geometry && v.geometry.coordinates && v.geometry.coordinates.length > 0;
    }, "É necessário delimitar a área da propriedade no mapa."),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function NewPropertyPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            geoJson: null,
        },
    });

    const onSubmit = (values: PropertyFormValues) => {
        setIsSubmitting(true);
        console.log("Form Values:", values);
        // TODO: Connect to Backend API
        setTimeout(() => setIsSubmitting(false), 2000);
    };

    return (
        <Layout
            title="Nova Propriedade"
            description="Cadastre uma nova fazenda para iniciar o monitoramento."
            headerBackLink="/propriedades"
        >
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

                                {/* Total Area */}
                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Área Total (ha) *</FormLabel>
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

                                {/* Harvest Year */}
                                <FormField
                                    control={form.control}
                                    name="harvest"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Safra Vigente</FormLabel>
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

                        {/* Card 3: Location / Map */}
                        <div className="rounded-[10px] bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Delimitação de Área</h2>
                            <p className="text-sm text-gray-500 mb-6">Desenhe o perímetro ou identifique a localização no mapa.</p>

                            <FormField
                                control={form.control}
                                name="geoJson"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <PropertyMapSelector
                                                onBoundaryChange={(geojson) => field.onChange(geojson)}
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-blue-700">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p className="text-xs leading-relaxed">
                                    <strong>Instrução:</strong> Clique nos vértices do terreno para marcar os pontos. O sistema conectará automaticamente para formar a área.
                                </p>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-56"
                            >
                                <NextLink href="/propriedades">Cancelar</NextLink>
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#16A34A] hover:bg-[#15803d] text-white shadow-sm shadow-green-200 w-56"
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
