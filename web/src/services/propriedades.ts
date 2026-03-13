import { apiFetch } from "@/lib/api-client";
import type { Talhao, GeoJSONFeature } from "./talhoes";

export interface Propriedade {
    id: string;
    nome: string;
    codigoInterno?: string;
    clienteId: string;
    codigoSicar?: string;
    geojson: GeoJSONFeature;
    areaHectares: number;
    culturaPrincipal: string;
    safraAtual: string;
    qntTalhoes?: number;
    metadata?: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePropriedadeDto {
    nome: string;
    codigoInterno?: string;
    clienteId: string;
    codigoSicar?: string;
    geojson: GeoJSONFeature;
    areaHectares: number;
    culturaPrincipal: string;
    safraAtual: string;
    metadata?: Record<string, unknown>;
}

export interface UpdatePropriedadeDto {
    nome?: string;
    codigoInterno?: string;
    codigoSicar?: string;
    geojson?: GeoJSONFeature;
    areaHectares?: number;
    culturaPrincipal?: string;
    safraAtual?: string;
    metadata?: Record<string, unknown>;
}

export async function createPropriedade(data: CreatePropriedadeDto): Promise<Propriedade> {
    return apiFetch<Propriedade>("/propriedades", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function listPropriedades(): Promise<Propriedade[]> {
    return apiFetch<Propriedade[]>("/propriedades", {
        method: "GET",
    });
}

export async function getPropriedade(id: string): Promise<Propriedade> {
    return apiFetch<Propriedade>(`/propriedades/${id}`, {
        method: "GET",
    });
}

export async function updatePropriedade(id: string, data: UpdatePropriedadeDto): Promise<Propriedade> {
    return apiFetch<Propriedade>(`/propriedades/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deletePropriedade(id: string): Promise<void> {
    return apiFetch<void>(`/propriedades/${id}`, {
        method: "DELETE",
    });
}

export async function listTalhoesDaPropriedade(propriedadeId: string): Promise<Talhao[]> {
    return apiFetch<Talhao[]>(`/propriedades/${propriedadeId}/talhoes`, {
        method: "GET",
    });
}
