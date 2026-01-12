"use client";

import { Layout } from "@/components/Layout";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center bg-slate-900 text-white">
      <p>Carregando mapa...</p>
    </div>
  ),
});

export default function Hotspots() {
  return (
    <Layout
      title="Mapa Interativo - Hotspots"
      description="Analise a saúde do canavial com índices de satélite e alertas em tempo real."
    >
      <InteractiveMap />
    </Layout>
  );
}
