"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler, Sprout, Calendar, X, Plus, ArrowRight } from "lucide-react";
import { listPropriedades, type Propriedade } from "@/services/propriedades";
import { listTalhoes, type Talhao } from "@/services/talhoes";
import { dataCache } from "@/services/dataCache";

type TalhaoComPropriedade = Talhao & { propriedadeNome: string };

export default function TalhoesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Propriedade[]>([]);
  const [allTalhoes, setAllTalhoes] = useState<TalhaoComPropriedade[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");

  useEffect(() => {
    async function load() {
      try {
        let props = dataCache.getProperties();
        if (!props) {
          props = await listPropriedades();
          if (props.length > 0) dataCache.setProperties(props);
        }
        setProperties(props);

        const results = await Promise.all(
          props.map(async (prop) => {
            try {
              let talhoes = dataCache.getTalhoes(prop.id);
              if (!talhoes) {
                talhoes = await listTalhoes(prop.id);
                dataCache.setTalhoes(prop.id, talhoes);
              }
              return talhoes.map((t) => ({ ...t, propriedadeNome: prop.nome }));
            } catch {
              return [];
            }
          })
        );

        setAllTalhoes(results.flat());
      } catch (err) {
        console.error("Erro ao carregar talhões:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredTalhoes =
    selectedPropertyId === "all"
      ? allTalhoes
      : allTalhoes.filter((t) => t.propriedadeId === selectedPropertyId);

  const selectedTalhoes = allTalhoes.filter((t) => selectedIds.includes(t.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const removeSelected = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  return (
    <Layout
      title="Talhões"
      description="Selecione 2 ou mais talhões para visualizar uma análise lado a lado."
    >
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* Selection Panel */}
        <div className="rounded-[16px] bg-white border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

            {/* Selected badges */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 mb-3">Talhões Selecionados</p>
              <div className="flex flex-wrap gap-2 min-h-[36px]">
                {selectedTalhoes.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Nenhum selecionado — escolha na lista abaixo.</p>
                ) : (
                  selectedTalhoes.map((t) => (
                    <Badge
                      key={t.id}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-sm"
                    >
                      <span>{t.nome || t.codigo}</span>
                      <button
                        type="button"
                        onClick={() => removeSelected(t.id)}
                        className="ml-1 rounded-full hover:bg-white/20 p-0.5"
                        aria-label={`Remover ${t.nome}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Action */}
            <div className="flex shrink-0 items-center gap-3">
              <Button
                disabled={selectedIds.length < 2}
                className="bg-[#16A34A] hover:bg-[#15803d] text-white disabled:opacity-40"
              >
                Comparar Análise
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filter + List */}
        <div className="rounded-[16px] bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Todos os Talhões
              {!isLoading && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({filteredTalhoes.length})
                </span>
              )}
            </h2>
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger className="w-full sm:w-64 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Filtrar por propriedade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as propriedades</SelectItem>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32 ml-auto" />
                </div>
              ))}
            </div>
          ) : filteredTalhoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-gray-400 mb-4">Nenhum talhão encontrado.</p>
              {properties.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/propriedades/${properties[0].id}/talhoes/novo`)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Talhão
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredTalhoes.map((talhao) => {
                const isSelected = selectedIds.includes(talhao.id);
                return (
                  <div
                    key={talhao.id}
                    onClick={() => toggleSelect(talhao.id)}
                    className={`group flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors ${
                      isSelected
                        ? "bg-emerald-50 hover:bg-emerald-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Checkbox visual */}
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-600"
                          : "border-gray-300 group-hover:border-emerald-400"
                      }`}
                    >
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900 truncate">
                          {talhao.nome || talhao.codigo}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                          {talhao.codigo}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400 truncate">{talhao.propriedadeNome}</p>
                    </div>

                    {/* Meta */}
                    <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500 shrink-0">
                      <span className="flex items-center gap-1">
                        <Sprout className="h-4 w-4 text-emerald-500" />
                        {talhao.cultura}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ruler className="h-4 w-4 text-gray-400" />
                        {talhao.areaHectares} ha
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {talhao.safra}
                      </span>
                    </div>

                    {/* Detail link */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/propriedades/${talhao.propriedadeId}/talhoes/${talhao.id}`);
                      }}
                      className="ml-2 shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      Detalhes
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
