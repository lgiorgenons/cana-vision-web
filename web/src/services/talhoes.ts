import { apiFetch } from "@/lib/api-client";
import { getAuthSession } from "@/lib/auth-session";

export interface GeoJSONGeometry {
    type: "Polygon" | "Point"; // Add other types if necessary
    coordinates: number[][][]; // For Polygon
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
    id: string; // UUID
    nome: string;
    codigo: string;
    propriedadeId: string;
    geojson: GeoJSONFeature;
    areaHectares: number;
    cultura: string;
    safra: string;
    variedade?: string;
    metadata?: Record<string, unknown>;
    createdAt?: string; // Assuming these exist usually
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

function getAuthHeaders(): Record<string, string> {
    const session = getAuthSession();
    const token = session?.tokens?.accessToken;
    if (!token) return {};
    return { "Authorization": `Bearer ${token}` };
}

export async function createTalhao(data: CreateTalhaoDto): Promise<Talhao> {
    return apiFetch<Talhao>("/talhoes", {
        method: "POST",
        body: JSON.stringify(data),
        // headers: getAuthHeaders(),
    });
}

export async function listTalhoes(propriedadeId?: string): Promise<Talhao[]> {
    const query = propriedadeId ? `?propriedadeId=${propriedadeId}` : "";
    return apiFetch<Talhao[]>(`/talhoes${query}`, {
        method: "GET",
        // headers: getAuthHeaders(),
    });
}

export async function getTalhao(id: string): Promise<Talhao> {
    return apiFetch<Talhao>(`/talhoes/${id}`, {
        method: "GET",
        // headers: getAuthHeaders(),
    });
}

export async function updateTalhao(id: string, data: UpdateTalhaoDto): Promise<Talhao> {
    return apiFetch<Talhao>(`/talhoes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        // headers: getAuthHeaders(),
    });
}

export async function deleteTalhao(id: string): Promise<void> {
    return apiFetch<void>(`/talhoes/${id}`, {
        method: "DELETE",
        // headers: getAuthHeaders(),
    });
}
