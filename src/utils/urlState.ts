import { civilizationKeys } from '@/i18n/civilizations';
import { AREA_LIMIT, Filters, HEIGHT_LIMIT, Period, SortKey, defaultFilters } from '@/types/pyramid';

const PERIODS: Period[] = ['ancient', 'bce', 'first', 'late'];
const SORTS: SortKey[] = ['name', 'height', 'oldest'];

const clamp = (raw: string | null, fallback: number, max: number) => {
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.min(Math.max(0, n), max) : fallback;
};

export function filtersFromParams(params: URLSearchParams): Filters {
  const period = params.get('period') as Period;
  const sort = params.get('sort') as SortKey;
  return {
    ...defaultFilters,
    searchText: params.get('q') ?? '',
    continente: params.get('continent') ?? '',
    civilization: civilizationKeys.includes(params.get('civ') ?? '') ? params.get('civ')! : '',
    heightMin: clamp(params.get('hmin'), 0, HEIGHT_LIMIT),
    heightMax: clamp(params.get('hmax'), HEIGHT_LIMIT, HEIGHT_LIMIT),
    areaMin: clamp(params.get('amin'), 0, AREA_LIMIT),
    areaMax: clamp(params.get('amax'), AREA_LIMIT, AREA_LIMIT),
    soloControverse: params.get('contested') === '1',
    soloOsmanagich: params.get('osmanagich') === '1',
    soloVerificate: params.get('verified') === '1',
    period: PERIODS.includes(period) ? period : '',
    sort: SORTS.includes(sort) ? sort : 'name',
  };
}

/** Writes filters on top of existing params, so unrelated ones such as compare survive. */
export function filtersToParams(filters: Filters, base?: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams(base);
  const set = (key: string, value: string, isDefault: boolean) => {
    if (isDefault) params.delete(key);
    else params.set(key, value);
  };
  set('q', filters.searchText, !filters.searchText);
  set('continent', filters.continente, !filters.continente);
  set('civ', filters.civilization, !filters.civilization);
  set('hmin', String(filters.heightMin), filters.heightMin === 0);
  set('hmax', String(filters.heightMax), filters.heightMax >= HEIGHT_LIMIT);
  set('amin', String(filters.areaMin), filters.areaMin === 0);
  set('amax', String(filters.areaMax), filters.areaMax >= AREA_LIMIT);
  set('contested', '1', !filters.soloControverse);
  set('osmanagich', '1', !filters.soloOsmanagich);
  set('verified', '1', !filters.soloVerificate);
  set('period', filters.period, !filters.period);
  set('sort', filters.sort, filters.sort === 'name');
  return params;
}

export const parseCompare = (raw: string | null, known: Set<string>): string[] =>
  (raw ?? '').split(',').filter((id) => known.has(id)).slice(0, 6);
