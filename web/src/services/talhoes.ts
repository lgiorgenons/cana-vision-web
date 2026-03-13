import { apiFetch } from "@/lib/api-client";

export interface GeoJSONGeometry {
    type: "Polygon" | "Point" | "MultiPolygon";
    coordinates: any;
}

export interface GeoJSONFeature {
    type: "Feature";
    geometry: GeoJSONGeometry;
    properties: {
        area?: number;
        [key: string]: unknown;
    };
}

export interface Talhao {
    id: string;
    nome: string;
    codigo: string;
    propriedadeId: string;
    geojson: GeoJSONFeature;
    areaHectares: number;
    cultura: string;
    safra: string;
    variedade?: string;
    metadata?: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateTalhaoDto {
    nome: string;
    codigo: string;
    propriedadeId: string;
    geojson: GeoJSONFeature;
    areaHectares: number;
    cultura: string;
    safra: string;
    variedade?: string;
    metadata?: Record<string, unknown>;
}

export interface UpdateTalhaoDto {
    nome?: string;
    codigo?: string;
    geojson?: GeoJSONFeature;
    areaHectares?: number;
    cultura?: string;
    safra?: string;
    variedade?: string;
    metadata?: Record<string, unknown>;
}

export async function createTalhao(data: CreateTalhaoDto): Promise<Talhao> {
    return apiFetch<Talhao>("/talhoes", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function listTalhoes(propriedadeId: string): Promise<Talhao[]> {
    return apiFetch<Talhao[]>(`/talhoes?propriedadeId=${propriedadeId}`, {
        method: "GET",
    });
}

export async function getTalhao(id: string): Promise<Talhao> {
    return apiFetch<Talhao>(`/talhoes/${id}`, {
        method: "GET",
    });
}

export async function updateTalhao(id: string, data: UpdateTalhaoDto): Promise<Talhao> {
    return apiFetch<Talhao>(`/talhoes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteTalhao(id: string): Promise<void> {
    return apiFetch<void>(`/talhoes/${id}`, {
        method: "DELETE",
    });
}
