import { Propriedade } from "./propriedades";
import { Talhao } from "./talhoes";

// Simple in-memory cache storage
const cache = {
    properties: null as Propriedade[] | null,
    propertyDetails: {} as Record<string, Propriedade>,
    talhoes: {} as Record<string, Talhao[]>,
    talhaoDetails: {} as Record<string, Talhao>,
};

export const dataCache = {
    // Properties List
    getProperties: () => cache.properties,
    setProperties: (data: Propriedade[]) => { cache.properties = data; },

    // Property Details (GeoJSON)
    getPropertyDetails: (id: string) => cache.propertyDetails[id],
    setPropertyDetails: (id: string, data: Propriedade) => { cache.propertyDetails[id] = data; },

    // Talhoes List (Array)
    getTalhoes: (propertyId: string) => cache.talhoes[propertyId],
    setTalhoes: (propertyId: string, data: Talhao[]) => { cache.talhoes[propertyId] = data; },

    // Clear talhoes cache for a property (useful after adding a new talhao)
    invalidateTalhoes: (propertyId: string) => { delete cache.talhoes[propertyId]; },

    // Talhao Details (Single)
    getTalhaoDetails: (id: string) => cache.talhaoDetails[id],
    setTalhaoDetails: (id: string, data: Talhao) => { cache.talhaoDetails[id] = data; },
};
