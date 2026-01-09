"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, MapPin, Ruler, Sprout, Calendar } from "lucide-react";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

import { getPropriedade, Propriedade, listTalhoesDaPropriedade } from "@/services/propriedades";
import { Talhao } from "@/services/talhoes";

export default function PropertyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;

    const [property, setProperty] = useState<Propriedade | null>(null);
    const [talhoes, setTalhoes] = useState<Talhao[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!id) return;
            try {
                const [propData, talhoesData] = await Promise.all([
                    getPropriedade(id),
                    listTalhoesDaPropriedade(id)
                ]);
                setProperty(propData);
                setTalhoes(talhoesData || []);
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar os dados da propriedade.",
                    variant: "destructive",
                });
                // router.push("/propriedades"); // Optional: redirect back on error
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [id, toast, router]);

    if (isLoading) {
        return (
            <Layout title="Carregando..." description="Obtendo detalhes da fazenda.">
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <Skeleton className="h-60 w-full rounded-xl" />
                </div>
            </Layout>
        );
    }

    if (!property) {
        return (
            <Layout title="Não encontrada" description="Propriedade não localizada.">
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-gray-500 mb-4">A propriedade que você procura não existe ou você não tem acesso a ela.</p>
                    <Button asChild variant="outline">
                        <Link href="/propriedades">Voltar para Lista</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            title={property.nome}
            description={`Gestão de Talhões e Monitoramento • ${property.areaHectares} ha`}
            headerBackLink="/propriedades"

        >
            <div className="mx-auto max-w-[1600px] px-4 flex flex-col gap-8 pb-20">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Área Total</CardTitle>
                            <Ruler className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{property.areaHectares} ha</div>
                            <p className="text-xs text-muted-foreground">Registrada no CAR</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Talhões</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{talhoes.length}</div>
                            <p className="text-xs text-muted-foreground">Unidades de manejo</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cultura Principal</CardTitle>
                            <Sprout className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{property.culturaPrincipal}</div>
                            <p className="text-xs text-muted-foreground">Predominante</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Safra</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{property.safraAtual}</div>
                            <p className="text-xs text-muted-foreground">Ciclo vigente</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Talhões List */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg text-gray-800">Talhões Cadastrados</CardTitle>
                            <CardDescription>Gerencie as divisões da sua lavoura.</CardDescription>
                        </div>
                        <Button asChild className="bg-[#16A34A] hover:bg-[#15803d] text-white">
                            <Link href={`/propriedades/${id}/talhoes/novo`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Talhão
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {talhoes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <MapPin className="h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Nenhum talhão cadastrado</h3>
                                <p className="text-gray-500 max-w-sm mb-6">Comece dividindo sua propriedade em talhões para um monitoramento detalhado.</p>
                                <Button asChild variant="outline">
                                    <Link href={`/propriedades/${id}/talhoes/novo`}>Cadastrar Primeiro Talhão</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {talhoes.map((talhao) => (
                                    <div key={talhao.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900">{talhao.nome}</span>
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                                    {talhao.codigo}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Sprout className="h-3 w-3" /> {talhao.cultura}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Ruler className="h-3 w-3" /> {talhao.areaHectares} ha
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Actions like Edit/Delete could go here */}
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/propriedades/${id}/talhoes/${talhao.id}`}>Detalhes</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </Layout>
    );
}
