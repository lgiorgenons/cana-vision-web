"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MapPin, MoreVertical, Tractor, Sprout, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listPropriedades, Propriedade, deletePropriedade } from "@/services/propriedades";
import { listTalhoes } from "@/services/talhoes";

import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesListPage() {
  const [properties, setProperties] = useState<Propriedade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const data = await listPropriedades();

      // Fetch plot counts for each property in parallel
      const enrichedData = await Promise.all(
        data.map(async (prop) => {
          try {
            const talhoes = await listTalhoes(prop.id);
            return { ...prop, qntTalhoes: talhoes.length };
          } catch (e) {
            console.error(`Failed to load plots for property ${prop.id}`, e);
            return { ...prop, qntTalhoes: 0 };
          }
        })
      );

      setProperties(enrichedData);
    } catch (error) {
      console.error("Erro ao carregar propriedades:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as propriedades.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePropriedade(id);
      toast({
        title: "Sucesso",
        description: "Propriedade removida com sucesso.",
      });
      fetchProperties();
    } catch (error) {
      console.error("Erro ao deletar propriedade:", error);
      toast({
        title: "Erro",
        description: "Erro ao deletar propriedade.",
        variant: "destructive",
      });
    }
  };

  const getCropImage = (crop: string) => {
    const normalized = crop.toLowerCase();
    if (normalized.includes("cana")) return "/images/properties/farm_sugarcane.png";
    if (normalized.includes("soja")) return "/images/properties/farm_soy.png";
    if (normalized.includes("milho")) return "/images/properties/farm_corn.png";
    return undefined;
  };

  return (
    <Layout
      title="Minhas Propriedades"
      description="Gerencie suas fazendas e áreas de monitoramento."
    >
      <div className="mx-auto max-w-[1600px] px-4">

        {/* Filters & Search - Show even if loading or empty? Yes */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nome, cultura ou local..."
              className="pl-9 bg-white"
            />
          </div>

          <Button asChild className="bg-[#16A34A] hover:bg-[#15803d] text-white">
            <Link href="/propriedades/novo">
              <Plus className="mr-2 h-4 w-4" />
              Nova Propriedade
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const imageUrl = getCropImage(property.culturaPrincipal);
              return (
                <div
                  key={property.id}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {/* Card Header / Image Placeholder - Clickable */}
                  <Link href={`/propriedades/${property.id}`} className="relative h-48 w-full bg-slate-100 group-hover:bg-slate-200 transition-colors flex items-center justify-center overflow-hidden cursor-pointer">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={property.nome}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Tractor className="h-12 w-12 text-slate-300" />
                    )}

                    <div className="absolute top-3 right-3 z-10">
                      <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md border border-white/50">
                        <span className={`relative flex h-2 w-2`}>
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-500`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 bg-green-500`}></span>
                        </span>
                        Ativo
                      </div>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <Link href={`/propriedades/${property.id}`} className="block hover:underline decoration-green-600/30 underline-offset-4">
                          <h3 className="font-semibold text-slate-900 group-hover:text-green-700 transition-colors">
                            {property.nome}
                          </h3>
                        </Link>
                        <div className="mt-1 flex items-center text-sm text-slate-500">
                          <MapPin className="mr-1 h-3.5 w-3.5 text-slate-400" />
                          -
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-slate-400 hover:text-slate-600">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/propriedades/${property.id}`} className="flex items-center w-full">
                              <Eye className="mr-2 h-3.5 w-3.5" />
                              Ver Detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/propriedades/${property.id}/editar`} className="flex items-center w-full">
                              <Pencil className="mr-2 h-3.5 w-3.5" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-700 focus:bg-red-50"
                            onClick={() => handleDelete(property.id)}
                          >
                            <div className="flex items-center w-full">
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Excluir
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Área Total</p>
                        <p className="font-medium text-slate-700">{property.areaHectares} ha</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Cultura</p>
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Sprout className="h-3.5 w-3.5 text-green-600" />
                          {property.culturaPrincipal}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Talhões</p>
                        <p className="font-medium text-slate-700">{property.qntTalhoes ?? "-"}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                      <span className="text-slate-500">Safra: {property.safraAtual}</span>
                      <Button variant="ghost" size="sm" asChild className="text-green-700 hover:text-green-800 hover:bg-green-50 px-2 -mr-2">
                        <Link href={`/propriedades/${property.id}`}>Acessar</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95 duration-700">

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            <div className="relative flex max-w-lg flex-col items-center text-center p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">

              {/* Icon Container with Glow */}
              <div className="mb-6 relative group">
                <div className="absolute -inset-4 rounded-full bg-green-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative rounded-full bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-lg shadow-green-500/30 ring-4 ring-green-50 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                  <Image src="/images/ic_propriedades.svg" alt="Propriedades" width={64} height={64} className="h-10 w-10 text-white invert brightness-0" />
                </div>
              </div>

              <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">
                Nenhuma propriedade encontrada
              </h3>

              <p className="mb-8 text-slate-500 leading-relaxed max-w-[360px]">
                Você ainda não cadastrou nenhuma fazenda. Comece agora para ter acesso ao <span className="font-medium text-slate-700">monitoramento inteligente</span> de sua lavoura.
              </p>

              <Button asChild size="lg" className="h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium shadow-lg shadow-green-500/25 transition-all hover:shadow-green-500/40 hover:-translate-y-0.5 rounded-full">
                <Link href="/propriedades/novo">
                  <Plus className="mr-2 h-5 w-5" />
                  Cadastrar Primeira Propriedade
                </Link>
              </Button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
