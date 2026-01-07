"use client";

import Image from "next/image";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MapPin, MoreVertical, Tractor, Sprout } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const MOCK_PROPERTIES = [
  {
    id: 1,
    name: "Fazenda Santa Mônica",
    area: 1250.5,
    crop: "Cana-de-Açúcar",
    harvest: "2024/2025",
    location: "Ribeirão Preto - SP",
    status: "Ativo",
    imageUrl: "/images/properties/farm_sugarcane.png",
  },
  {
    id: 2,
    name: "Sítio Vista Alegre",
    area: 340.0,
    crop: "Soja",
    harvest: "2023/2024",
    location: "Uberaba - MG",
    status: "Ativo",
    imageUrl: "/images/properties/farm_soy.png",
  },
  {
    id: 3,
    name: "Fazenda Boa Esperança",
    area: 890.2,
    crop: "Milho",
    harvest: "2024",
    location: "Londrina - PR",
    status: "Manutenção",
    imageUrl: "/images/properties/farm_corn.png",
  },
];

export default function PropertiesListPage() {
  return (
    <Layout
      title="Minhas Propriedades"
      description="Gerencie suas fazendas e áreas de monitoramento."
    >
      <div className="mx-auto max-w-[1600px] px-4">
        {/* Filters & Search */}
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

        {/* Properties Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROPERTIES.map((property) => (
            <div
              key={property.id}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Card Header / Image Placeholder */}
              <div className="relative h-48 w-full bg-slate-100 group-hover:bg-slate-200 transition-colors flex items-center justify-center overflow-hidden">
                 {property.imageUrl ? (
                    <Image
                        src={property.imageUrl}
                        alt={property.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                 ) : (
                    <Tractor className="h-12 w-12 text-slate-300" />
                 )}
                 
                 <div className="absolute top-3 right-3 z-10">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-md shadow-sm
                        ${property.status === 'Ativo' ? 'bg-green-100/90 text-green-800' : 'bg-amber-100/90 text-amber-800'}
                    `}>
                        {property.status}
                    </span>
                 </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-green-700 transition-colors">
                      {property.name}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-slate-500">
                      <MapPin className="mr-1 h-3.5 w-3.5 text-slate-400" />
                      {property.location}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-slate-400 hover:text-slate-600">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Área Total</p>
                        <p className="font-medium text-slate-700">{property.area} ha</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Cultura</p>
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                            <Sprout className="h-3.5 w-3.5 text-green-600" />
                            {property.crop}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                   <span className="text-slate-500">Safra: {property.harvest}</span>
                   <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50 px-2 -mr-2">
                     Acessar
                   </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
