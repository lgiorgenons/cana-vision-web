"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

import dynamic from "next/dynamic";
import { Layout } from "@/components/Layout";
// import { PropertyMapSelector } from "@/components/properties/PropertyMapSelector"; // Removed static import
import { getPropriedade, Propriedade } from "@/services/propriedades";

const PropertyMapSelector = dynamic(
    () => import("@/components/properties/PropertyMapSelector").then((mod) => mod.PropertyMapSelector),
    {
        ssr: false,
        loading: () => <div className="h-[400px] w-full bg-slate-100 flex items-center justify-center rounded-xl">Carregando mapa...</div>
    }
);
import { createTalhao, listTalhoes, getTalhao, CreateTalhaoDto, GeoJSONFeature, Talhao } from "@/services/talhoes";

// --- Type Definition ---
type GeoJSONPolygonFeature = {
    type: "Feature";
    geometry: {
        type: "Polygon";
        coordinates: number[][][];
    };
    properties: Record<string, unknown>;
};

const talhaoSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
    code: z.string().min(1, "Código do talhão é obrigatório."),
    area: z.string().min(1, "Área é obrigatória.").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Área deve ser um número positivo."),
    crop: z.string().min(1, "Selecione a cultura."),
    variety: z.string().optional(),
    harvest: z.string().min(1, "Safra é obrigatória."),
    geoJson: z.custom<GeoJSONPolygonFeature | null>((val) => {
        const v = val as GeoJSONPolygonFeature | null | undefined;
        return v && v.type === "Feature" && v.geometry && v.geometry.coordinates && v.geometry.coordinates.length > 0;
    }, "É necessário delimitar o talhão no mapa."),
});

type TalhaoFormValues = z.infer<typeof talhaoSchema>;

export default function NewTalhaoPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const propertyId = params.id as string;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingProperty, setIsLoadingProperty] = useState(true);
    const [property, setProperty] = useState<Propriedade | null>(null);
    const [existingTalhoes, setExistingTalhoes] = useState<Talhao[]>([]);
    const [shouldCreateAnother, setShouldCreateAnother] = useState(false);

    // Key to force re-mounting/resetting the map component
    const [mapKey, setMapKey] = useState(0);

    // Initialize Form
    const form = useForm<TalhaoFormValues>({
        resolver: zodResolver(talhaoSchema),
        defaultValues: {
            name: "",
            code: "",
            area: "",
            crop: "Cana-de-Açúcar", // Default
            variety: "",
            harvest: "2024/2025",
            geoJson: null,
        },
    });

    // Load Property Context
    useEffect(() => {
        async function loadProperty() {
            if (!propertyId) return;
            try {
                // 1. Fetch Property and List of Talhoes (Shallow)
                const [propData, shallowTalhoes] = await Promise.all([
                    getPropriedade(propertyId),
                    listTalhoes(propertyId)
                ]);

                // 2. Fetch full details for each talhao to get GeoJSON
                const fullTalhoes = await Promise.all(
                    shallowTalhoes.map(async (t) => {
                        try {
                            return await getTalhao(t.id);
                        } catch (e) {
                            console.error(`Failed to fetch details for talhao ${t.id}`, e);
                            return t; // Fallback to shallow if fail
                        }
                    })
                );

                console.log("NewTalhaoPage: Fetched property:", propData);
                console.log("NewTalhaoPage: Fetched talhoes (full):", fullTalhoes);

                setProperty(propData);
                setExistingTalhoes(fullTalhoes);

                if (propData.culturaPrincipal) {
                    form.setValue("crop", propData.culturaPrincipal);
                }
                if (propData.safraAtual) {
                    form.setValue("harvest", propData.safraAtual);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar os dados da propriedade.",
                    variant: "destructive",
                });
            } finally {
                setIsLoadingProperty(false);
            }
        }
        loadProperty();
    }, [propertyId, form, toast]);

    // Calculate Area from GeoJSON (Simple logic for UX, backend usually validates/recalcs)
    const handleMapChange = (geojson: GeoJSONPolygonFeature | null) => {
        form.setValue("geoJson", geojson);
        if (geojson) {
            // Optional: Calculate approximate area in client side or leave to user
            // For now, user inputs manually as per design, but we could auto-fill
            console.log("Plot geometry updated");
        }
    };

    const onSubmit = async (values: TalhaoFormValues) => {
        if (!property) return;
        setIsSubmitting(true);
        try {
            const payload: CreateTalhaoDto = {
                nome: values.name,
                codigo: values.code,
                propriedadeId: propertyId,
                areaHectares: Number(values.area),
                cultura: values.crop,
                safra: values.harvest,
                variedade: values.variety,
                geojson: values.geoJson as unknown as GeoJSONFeature,
                metadata: {}
            };

            const newTalhao = await createTalhao(payload);
            setExistingTalhoes(prev => [...prev, newTalhao]);

            toast({
                title: "Talhão criado!",
                description: `O registro "${values.name}" foi salvo com sucesso.`,
            });

            if (shouldCreateAnother) {
                // Reset form to defaults, keeping some context like crop/harvest
                form.reset({
                    name: "",
                    code: "",
                    area: "",
                    crop: values.crop,     // Keep previous choice
                    harvest: values.harvest, // Keep previous choice
                    variety: values.variety, // Keep previous choice
                    geoJson: null,
                });

                // Force map reset
                setMapKey(prev => prev + 1);

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });

            } else {
                router.push(`/propriedades/${propertyId}`);
            }

        } catch (error) {
            // ... existing error handler
            console.error("Erro ao criar talhão:", error);
            let msg = "Erro desconhecido.";
            if (error instanceof Error) msg = error.message;

            toast({
                title: "Erro ao salvar",
                description: msg,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
            setShouldCreateAnother(false); // Reset trigger
        }
    };


    if (isLoadingProperty) {
        return (
            <Layout title="Carregando..." description="Preparando ambiente de cadastro.">
                <div className="flex h-96 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
            </Layout>
        );
    }

    if (!property) {
        return (
            <Layout title="Erro" description="Propriedade não encontrada.">
                <div className="p-10 text-center">
                    <p>Não foi possível carregar o contexto da propriedade.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            title="Novo Talhão"
            description={`Cadastro de unidade em ${property.nome}`}
            headerBackLink={`/propriedades/${propertyId}`}
        >
            <div className="mx-auto max-w-4xl p-1 pb-20">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

                        {/* Card 1: Dados do Talhão */}
                        <div className="rounded-[10px] bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Dados do Talhão</h2>
                            <p className="text-sm text-gray-500 mb-6">Informações de identificação e características agronômicas.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Nome */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel className="text-sm font-medium text-gray-700">Identificação (Nome) *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Talhão 01 - Norte" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Código */}
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Código *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: T01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Área */}
                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Área (ha) *</FormLabel>
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

                                {/* Cultura */}
                                <FormField
                                    control={form.control}
                                    name="crop"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel className="text-sm font-medium text-gray-700">Cultura *</FormLabel>
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

                                {/* Safra e Variedade */}
                                <FormField
                                    control={form.control}
                                    name="harvest"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Safra</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: 2024/2025" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="variety"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Variedade</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Opcional" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Card 2: Delimitação de Área (Mapa) */}
                        <div className="rounded-[10px] bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Delimitação de Área</h2>
                            <p className="text-sm text-gray-500 mb-6">Desenhe o perímetro do talhão no mapa. O contorno da propriedade está visível para referência.</p>

                            <FormField
                                control={form.control}
                                name="geoJson"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <PropertyMapSelector
                                                key={mapKey}
                                                className="w-full"
                                                onBoundaryChange={(geo) => {
                                                    field.onChange(geo);
                                                    handleMapChange(geo);
                                                }}
                                                contextGeoJson={property.geojson as unknown as GeoJSONPolygonFeature}
                                                otherPolygons={existingTalhoes
                                                    .filter(t => {
                                                        const isValid = t.geojson && t.geojson.geometry && t.geojson.geometry.coordinates && t.geojson.geometry.coordinates.length > 0;
                                                        if (!isValid) console.warn("NewTalhaoPage: Invalid talhao geojson:", t);
                                                        return isValid;
                                                    })
                                                    .map(t => ({
                                                        ...t.geojson,
                                                        properties: {
                                                            ...t.geojson.properties,
                                                            nome: t.nome || t.codigo
                                                        }
                                                    } as unknown as GeoJSONPolygonFeature))}
                                                showSearch={false}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-auto px-6 h-12"
                                onClick={() => router.push(`/propriedades/${propertyId}`)}
                            >
                                Cancelar
                            </Button>

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="border-[#16A34A] text-[#16A34A] hover:bg-green-50 hover:text-[#16A34A] h-12 px-6"
                                    disabled={isSubmitting}
                                    onClick={() => setShouldCreateAnother(true)}
                                >
                                    {isSubmitting && shouldCreateAnother ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                                        </>
                                    ) : (
                                        "Salvar e Criar Outro"
                                    )}
                                </Button>

                                <Button
                                    type="submit"
                                    className="bg-[#16A34A] hover:bg-[#15803d] text-white shadow-sm shadow-green-200 h-12 px-8"
                                    disabled={isSubmitting}
                                    onClick={() => setShouldCreateAnother(false)}
                                >
                                    {isSubmitting && !shouldCreateAnother ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                                        </>
                                    ) : (
                                        "Salvar e Voltar"
                                    )}
                                </Button>
                            </div>
                        </div>

                    </form>
                </Form>
            </div>
        </Layout>
    );
}
