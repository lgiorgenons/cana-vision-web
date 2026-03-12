import { apiFetch } from "@/lib/api-client";
import { getAuthSession } from "@/lib/auth-session";

export interface ArtefatoMetadata {
    data_imagem?: string;
    cloud_cover?: number;
    sensor?: string;
    [key: string]: unknown;
}

export interface Artefato {
    id: string;
    nome: string;
    identificador: string;
    tipo: "geotiff" | "shapefile" | "report";
    indice: string;
    tamanhoBytes: number;
    dataReferencia: string;
    geradoEm: string;
    url?: string;
    expiresAt?: string;
    metadata?: ArtefatoMetadata;
}

function getAuthHeaders(): Record<string, string> {
    const session = getAuthSession();
    const token = session?.tokens?.accessToken;
    if (!token) return {};
    return { "Authorization": `Bearer ${token}` };
}

/**
 * Busca a lista de artefatos da propriedade informada.
 * Chama o backend Node.js (GCP Cloud Run) que faz Proxy com o Google Cloud Storage.
 */
export async function listArtefatos(propriedadeId: string, tipo?: string): Promise<Artefato[]> {
    const params = new URLSearchParams();
    if (tipo) params.append("tipo", tipo);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    
    // Rota real do backend
    return await apiFetch(`/artefatos/propriedade/${propriedadeId}${queryString}`, { 
        method: "GET",
        headers: getAuthHeaders()
    });
}

/**
 * Busca a URL temporária (Signed URL) do GeoTIFF para visualização no Leaflet.
 */
export async function getTiffViewUrl(artefatoId: string): Promise<Artefato> {
    // A rota retorna os metadados e a url assinada do artefato
    return await apiFetch(`/artefatos/${artefatoId}`, { 
        method: "GET",
        headers: getAuthHeaders()
    });
}

/**
 * Realiza o download do arquivo GeoTIFF em formato ArrayBuffer
 * necessário para ser parseado pelo georaster.
 */
export async function fetchTiffAsBuffer(signedUrl: string): Promise<ArrayBuffer> {
    // Fazendo requisição direta pra Cloud Storage Signed URL (precisa suportar CORS)
    const response = await fetch(signedUrl);
    if (!response.ok) {
        throw new Error(`Erro no download do TIFF do GCS: ${response.statusText}`);
    }
    return await response.arrayBuffer();
}
