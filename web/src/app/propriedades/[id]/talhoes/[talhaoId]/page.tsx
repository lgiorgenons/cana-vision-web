"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Pencil, Ruler, Sprout, Calendar, Tag, Hash, Layers } from "lucide-react";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import { getTalhao, type Talhao } from "@/services/talhoes";
import { getPropriedade, type Propriedade } from "@/services/propriedades";
import { dataCache } from "@/services/dataCache";

function DetailItem({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="flex flex-col gap-1 rounded-[12px] border border-gray-100 bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-base font-semibold text-gray-900">{value || "—"}</p>
    </div>
  );
}

export default function TalhaoDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const propertyId = params.id as string;
  const talhaoId = params.talhaoId as string;

  const [talhao, setTalhao] = useState<Talhao | null>(null);
  const [property, setProperty] = useState<Propriedade | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!propertyId || !talhaoId) return;
      try {
        // Try cache first for individual talhão
        let talhaoData = dataCache.getTalhaoDetails(talhaoId);
        if (!talhaoData) {
          talhaoData = await getTalhao(talhaoId);
          dataCache.setTalhaoDetails(talhaoId, talhaoData);
        }

        // Try cache for property
        let propData = dataCache.getPropertyDetails(propertyId);
        if (!propData) {
          propData = await getPropriedade(propertyId);
          dataCache.setPropertyDetails(propertyId, propData);
        }

        setTalhao(talhaoData);
        setProperty(propData);
      } catch (err) {
        console.error("Erro ao carregar talhão:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do talhão.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [propertyId, talhaoId, toast]);

  if (isLoading) {
    return (
      <Layout title="Carregando..." description="Obtendo dados do talhão.">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-36 w-full rounded-[16px]" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-[12px]" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!talhao || !property) {
    return (
      <Layout title="Não encontrado" description="Talhão não localizado.">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500 mb-4">O talhão não existe ou você não tem acesso a ele.</p>
          <Button asChild variant="outline">
            <Link href={`/propriedades/${propertyId}`}>Voltar para a Propriedade</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const coordCount =
    talhao.geojson?.geometry?.coordinates?.[0]?.length ?? 0;

  return (
    <Layout
      title={talhao.nome || talhao.codigo}
      description={`Talhão de ${property.nome}`}
      headerBackLink={`/propriedades/${propertyId}`}
      headerActions={
        <Button asChild className="bg-[#16A34A] hover:bg-[#15803d] text-white">
          <Link href={`/propriedades/${propertyId}/talhoes/${talhaoId}/editar`}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar Talhão
          </Link>
        </Button>
      }
    >
      <div className="mx-auto max-w-3xl space-y-6 pb-20">

        {/* Header card */}
        <div className="rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{talhao.nome}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Propriedade:{" "}
                <Link
                  href={`/propriedades/${propertyId}`}
                  className="font-medium text-emerald-700 hover:underline"
                >
                  {property.nome}
                </Link>
              </p>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {talhao.cultura}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <DetailItem label="Código" value={talhao.codigo} icon={Hash} />
          <DetailItem label="Área" value={`${talhao.areaHectares} ha`} icon={Ruler} />
          <DetailItem label="Cultura" value={talhao.cultura} icon={Sprout} />
          <DetailItem label="Safra" value={talhao.safra} icon={Calendar} />
          <DetailItem label="Variedade" value={talhao.variedade ?? "—"} icon={Tag} />
          <DetailItem label="Vértices no mapa" value={coordCount > 0 ? coordCount : "—"} icon={Layers} />
        </div>

        {/* GeoJSON summary */}
        {talhao.geojson && (
          <div className="rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Geometria</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>
                <span className="font-medium text-gray-800">Tipo: </span>
                {talhao.geojson.geometry?.type ?? "—"}
              </span>
              {coordCount > 0 && (
                <span>
                  <span className="font-medium text-gray-800">Pontos: </span>
                  {coordCount}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        {talhao.metadata && Object.keys(talhao.metadata).length > 0 && (
          <div className="rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Metadados</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(talhao.metadata).map(([key, val]) => (
                <div key={key}>
                  <dt className="text-xs text-gray-400">{key}</dt>
                  <dd className="font-medium text-gray-800">{String(val)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Dates */}
        {(talhao.createdAt || talhao.updatedAt) && (
          <div className="rounded-[16px] border border-gray-100 bg-gray-50 px-6 py-4 text-xs text-gray-400">
            {talhao.createdAt && (
              <span className="mr-6">
                Criado em: {new Date(talhao.createdAt).toLocaleDateString("pt-BR")}
              </span>
            )}
            {talhao.updatedAt && (
              <span>
                Atualizado em: {new Date(talhao.updatedAt).toLocaleDateString("pt-BR")}
              </span>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
