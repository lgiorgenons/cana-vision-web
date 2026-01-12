import { apiFetch } from "@/lib/api-client";
import { getAuthSession } from "@/lib/auth-session";
import type { Talhao, GeoJSONFeature } from "./talhoes";

export interface Propriedade {
    id: string; // UUID
    nome: string;
    codigoInterno?: string; // Optional in DTO? Docs say "codigoInterno": "FBE-01" in example but not explicitly required/optional in desc. Assuming optional loosely or required.
    clienteId: string;
    codigoSicar?: string;
    geojson: GeoJSONFeature;
    areaHectares: number;
    culturaPrincipal: string; // "Cana-de-açúcar"
    safraAtual: string; // "2024/2025"
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
    safraAtual: string; // or optional?
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

function getAuthHeaders(): Record<string, string> {
    const session = getAuthSession();
    const token = session?.tokens?.accessToken;
    if (!token) return {};
    return { "Authorization": `Bearer ${token}` };
}

export async function createPropriedade(data: CreatePropriedadeDto): Promise<Propriedade> {
    return apiFetch<Propriedade>("/propriedades", {
        method: "POST",
        body: JSON.stringify(data),
        headers: getAuthHeaders(),
    });
}

export async function listPropriedades(): Promise<Propriedade[]> {
    return apiFetch<Propriedade[]>("/propriedades", {
        method: "GET",
        headers: getAuthHeaders(),
    });
}

export async function getPropriedade(id: string): Promise<Propriedade> {
    return apiFetch<Propriedade>(`/propriedades/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
}

export async function updatePropriedade(id: string, data: UpdatePropriedadeDto): Promise<Propriedade> {
    return apiFetch<Propriedade>(`/propriedades/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: getAuthHeaders(),
    });
}

export async function deletePropriedade(id: string): Promise<void> {
    return apiFetch<void>(`/propriedades/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
}

export async function listTalhoesDaPropriedade(propriedadeId: string): Promise<Talhao[]> {
    return apiFetch<Talhao[]>(`/propriedades/${propriedadeId}/talhoes`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
}
