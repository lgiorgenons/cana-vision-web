export interface Georaster {
    width: number;
    height: number;
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
    noDataValue: number | null;
    projection: number;
    pixelHeight: number;
    pixelWidth: number;
    mins: number[];
    maxs: number[];
    ranges: number[];
    values: number[][][] | number[][];
    numberOfRasters?: number;
}

export type RasterStats = {
    mins: number[];
    maxs: number[];
    ranges: number[];
    noDataValue: unknown;
    numberOfRasters: number;
};

export const getRasterStats = (georaster: Georaster): RasterStats => {
    const mins = Array.isArray(georaster?.mins) ? georaster.mins : [];
    const maxs = Array.isArray(georaster?.maxs) ? georaster.maxs : [];
    const ranges = Array.isArray(georaster?.ranges) ? georaster.ranges : [];
    const numberOfRasters = typeof georaster?.numberOfRasters === "number"
        ? georaster.numberOfRasters
        : Array.isArray(georaster?.values)
            ? georaster.values.length
            : 1;

    return {
        mins,
        maxs,
        ranges,
        noDataValue: georaster?.noDataValue ?? null,
        numberOfRasters,
    };
};

export const resolveNoDataValue = (noDataValue: unknown, bandIndex: number): number | null => {
    if (Array.isArray(noDataValue)) {
        const value = noDataValue[bandIndex];
        return Number.isFinite(value) ? value : null;
    }
    return Number.isFinite(noDataValue as number) ? (noDataValue as number) : null;
};

export const resolveBandMinMax = (stats: RasterStats, bandIndex: number) => {
    const fallbackMin = Number.isFinite(stats.mins[0]) ? stats.mins[0] : 0;
    const fallbackMax = Number.isFinite(stats.maxs[0])
        ? stats.maxs[0]
        : Number.isFinite(stats.ranges[0])
            ? fallbackMin + stats.ranges[0]
            : fallbackMin + 1;

    const min = Number.isFinite(stats.mins[bandIndex]) ? stats.mins[bandIndex] : fallbackMin;
    let max = Number.isFinite(stats.maxs[bandIndex]) ? stats.maxs[bandIndex] : fallbackMax;
    if (!Number.isFinite(max)) {
        const rangeCandidate = stats.ranges[bandIndex];
        if (Number.isFinite(rangeCandidate)) {
            max = min + rangeCandidate;
        }
    }
    if (!Number.isFinite(max) || min === max) {
        max = min + 1;
    }

    return { min, max };
};

export const normalizeValue = (value: number, min: number, max: number) => {
    if (!Number.isFinite(value)) return null;
    const range = max - min;
    if (!Number.isFinite(range) || range === 0) return 0;
    const normalized = (value - min) / range;
    return Math.min(1, Math.max(0, normalized));
};
