"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

import { Layout } from "@/components/Layout";
import { PropertyMapSelector } from "@/components/properties/PropertyMapSelector";
import { getPropriedade, Propriedade } from "@/services/propriedades";
import { createTalhao, CreateTalhaoDto, GeoJSONFeature } from "@/services/talhoes";

// --- Schema Definition ---
const geoJsonFeatureSchema = z.object({
    type: z.literal("Feature"),
    geometry: z.object({
        type: z.literal("Polygon"),
        coordinates: z.array(z.array(z.array(z.number()))),
    }),
    properties: z.record(z.unknown()),
});

// Using custom type/validation for GeoJSON
type GeoJSONPolygonFeature = z.infer<typeof geoJsonFeatureSchema>;

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
                const data = await getPropriedade(propertyId);
                setProperty(data);
                if (data.culturaPrincipal) {
                    form.setValue("crop", data.culturaPrincipal);
                }
                if (data.safraAtual) {
                    form.setValue("harvest", data.safraAtual);
                }
            } catch (error) {
                console.error("Erro ao carregar propriedade:", error);
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

            await createTalhao(payload);

            toast({
                title: "Talhão criado!",
                description: "O registro foi salvo com sucesso.",
            });

            router.push(`/propriedades/${propertyId}`);

        } catch (error) {
            console.error("Erro ao criar talhão:", error);
            let msg = "Erro desconhecido.";
            if (error instanceof Error) msg = error.message;
            // Handle backend errors specifically if needed

            toast({
                title: "Erro ao salvar",
                description: msg,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
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
            <div className="mx-auto max-w-5xl p-1 pb-20">

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Left Column: Map */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="rounded-[10px] bg-white p-4 shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Desenhar Talhão</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Use o mapa abaixo para delimitar a área do talhão. O contorno da propriedade está visível em cinza para referência.
                            </p>
                            <PropertyMapSelector
                                className="w-full"
                                onBoundaryChange={handleMapChange}
                                contextGeoJson={property.geojson as any} // Cast if types slightly mismatch
                            />
                            {form.formState.errors.geoJson && (
                                <p className="text-sm font-medium text-red-500 mt-2">
                                    {form.formState.errors.geoJson.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="w-full lg:w-1/2">
                        <div className="rounded-[10px] bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Dados do Talhão</h2>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Identificação (Nome)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: Talhão 01 - Norte" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="code"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Código</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: T01" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="area"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Área (ha)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="crop"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cultura</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex gap-2"
                                                    >
                                                        {["Cana-de-Açúcar", "Soja", "Milho"].map(crop => (
                                                            <div key={crop} className="flex items-center space-x-2">
                                                                <RadioGroupItem value={crop} id={`r-${crop}`} />
                                                                <label htmlFor={`r-${crop}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                    {crop}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="variety"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Variedade</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Opcional" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="harvest"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Safra</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="2024/2025" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                                                </>
                                            ) : (
                                                "Cadastrar Talhão"
                                            )}
                                        </Button>
                                    </div>

                                </form>
                            </Form>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
}
